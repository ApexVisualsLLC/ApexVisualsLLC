"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { bookings, type Booking, type BookingPackage } from "@/lib/db/schema";
import { chooseStartTimeSchema } from "@/lib/booking/validation";
import { getStripeClient } from "@/lib/stripe/client";

const SITE_URL = "https://apexvisualsutah.com";

const PACKAGE_LABELS: Record<BookingPackage, string> = {
  "20-photos": "20 Edited Aerial Photos",
  "photo-video-bundle": "20 Photos + Video Bundle",
  other: "Custom Project",
};

export type ChooseStartTimeState = {
  error?: string;
};

export async function chooseStartTime(
  _prevState: ChooseStartTimeState,
  formData: FormData
): Promise<ChooseStartTimeState> {
  const parsed = chooseStartTimeSchema.safeParse({
    bookingToken: formData.get("bookingToken"),
    startAt: formData.get("startAt"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please pick a valid time." };
  }

  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.bookingToken, parsed.data.bookingToken))
    .limit(1);

  if (!booking) {
    return { error: "Booking not found." };
  }
  if (booking.status !== "pending" || booking.requestedStartAt) {
    return { error: "This booking has already been scheduled." };
  }

  await db
    .update(bookings)
    .set({ requestedStartAt: parsed.data.startAt, updatedAt: new Date() })
    .where(eq(bookings.id, booking.id));

  revalidatePath(`/book/${parsed.data.bookingToken}`);
  return {};
}

export type StartDepositCheckoutState = {
  error?: string;
};

export async function startDepositCheckout(
  _prevState: StartDepositCheckoutState,
  formData: FormData
): Promise<StartDepositCheckoutState> {
  const bookingToken = String(formData.get("bookingToken") ?? "");

  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.bookingToken, bookingToken))
    .limit(1);

  if (!booking) {
    return { error: "Booking not found." };
  }
  if (booking.status !== "accepted") {
    return { error: "This booking isn't awaiting a deposit right now." };
  }
  if (!booking.depositAmountCents) {
    return { error: "Deposit amount hasn't been set yet — check back soon." };
  }

  let redirectTarget: string;
  try {
    redirectTarget = await getOrCreateCheckoutUrl(booking, bookingToken, "deposit");
  } catch (err) {
    console.error("Stripe checkout session error:", err instanceof Error ? err.message : err);
    return { error: "Could not start checkout — please try again in a moment." };
  }

  // redirect() throws internally to work, so it must never be inside a
  // try/catch that could swallow it.
  redirect(redirectTarget);
}

export type StartFinalPaymentCheckoutState = {
  error?: string;
};

export async function startFinalPaymentCheckout(
  _prevState: StartFinalPaymentCheckoutState,
  formData: FormData
): Promise<StartFinalPaymentCheckoutState> {
  const bookingToken = String(formData.get("bookingToken") ?? "");

  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.bookingToken, bookingToken))
    .limit(1);

  if (!booking) {
    return { error: "Booking not found." };
  }
  if (booking.status !== "preview_ready") {
    return { error: "This booking isn't awaiting final payment right now." };
  }
  if (!booking.totalPriceCents || !booking.depositAmountCents) {
    return { error: "Pricing hasn't been finalized yet — check back soon." };
  }

  let redirectTarget: string;
  try {
    redirectTarget = await getOrCreateCheckoutUrl(booking, bookingToken, "final");
  } catch (err) {
    console.error("Stripe checkout session error:", err instanceof Error ? err.message : err);
    return { error: "Could not start checkout — please try again in a moment." };
  }

  redirect(redirectTarget);
}

type PaymentType = "deposit" | "final";

async function getOrCreateCheckoutUrl(
  booking: Booking,
  bookingToken: string,
  paymentType: PaymentType
): Promise<string> {
  const stripe = getStripeClient();
  const existingSessionId =
    paymentType === "deposit" ? booking.stripeCheckoutSessionId : booking.finalCheckoutSessionId;

  if (existingSessionId) {
    const existing = await stripe.checkout.sessions.retrieve(existingSessionId);
    if (existing.status === "open" && existing.url) {
      return existing.url;
    }
    if (existing.status === "complete") {
      // The webhook likely just hasn't landed yet — send them back to the
      // booking page rather than starting a second, redundant checkout.
      return `/book/${bookingToken}?${paymentType}=success`;
    }
    // "expired" falls through to creating a fresh session below.
  }

  const packageLabel = PACKAGE_LABELS[booking.package as BookingPackage] ?? booking.package;
  const amountCents =
    paymentType === "deposit"
      ? booking.depositAmountCents!
      : booking.totalPriceCents! - booking.depositAmountCents!;
  const lineItemLabel = paymentType === "deposit" ? "Deposit" : "Remaining Balance";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: booking.clientEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: amountCents,
          product_data: { name: `${lineItemLabel} — ${packageLabel}` },
        },
      },
    ],
    metadata: { bookingId: String(booking.id), paymentType },
    success_url: `${SITE_URL}/book/${bookingToken}?${paymentType}=success`,
    cancel_url: `${SITE_URL}/book/${bookingToken}?${paymentType}=cancelled`,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  const sessionIdColumn =
    paymentType === "deposit" ? { stripeCheckoutSessionId: session.id } : { finalCheckoutSessionId: session.id };
  await db
    .update(bookings)
    .set({ ...sessionIdColumn, updatedAt: new Date() })
    .where(eq(bookings.id, booking.id));

  return session.url;
}
