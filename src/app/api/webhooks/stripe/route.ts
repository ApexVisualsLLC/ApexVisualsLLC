import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import type Stripe from "stripe";
import { db } from "@/lib/db/client";
import { bookingCalendarSyncLog, bookingEmailLog, bookings, stripeWebhookEvents } from "@/lib/db/schema";
import { getStripeClient } from "@/lib/stripe/client";
import { createBookingCalendarEvent } from "@/lib/calendar/create-booking-event";
import { sendDepositReceivedEmail } from "@/lib/email/send-deposit-received-email";
import { sendDeliveryEmail } from "@/lib/email/send-delivery-email";

export const runtime = "nodejs";

const HANDLED_EVENT_TYPES = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
]);

/**
 * Neon's HTTP driver has no transaction support (see availability/index.ts
 * comment for the related double-booking fix), so this can't be one atomic
 * unit. Instead: a status-guarded UPDATE makes the status transition itself
 * safe against concurrent/duplicate delivery, and the calendar/email side
 * effects are each keyed off the booking's own current state rather than off
 * whether this particular call made the transition — so a later redelivery
 * (or the async_payment_succeeded companion event) naturally finishes any
 * side effect a prior delivery didn't complete, without redoing ones that
 * already succeeded.
 */
export async function POST(request: Request): Promise<Response> {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  // Must read the raw text body before any .json()/.formData() call, or
  // signature verification fails.
  const rawBody = await request.text();
  const stripe = getStripeClient();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  if (!HANDLED_EVENT_TYPES.has(event.type)) {
    return NextResponse.json({ received: true });
  }

  const [alreadySeen] = await db
    .select({ id: stripeWebhookEvents.id })
    .from(stripeWebhookEvents)
    .where(eq(stripeWebhookEvents.stripeEventId, event.id))
    .limit(1);
  if (alreadySeen) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const bookingId = Number(session.metadata?.bookingId);

  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    // Not retryable — a 500 here would just make Stripe retry forever on
    // something that can never succeed. Logged loudly since it should never
    // happen (every session we create sets this metadata ourselves).
    console.error("Stripe webhook missing/invalid metadata.bookingId", event.id);
    await recordEvent(event.id, event.type);
    return NextResponse.json({ received: true });
  }

  const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1);
  if (!booking) {
    console.error("Stripe webhook: booking not found", bookingId, event.id);
    await recordEvent(event.id, event.type);
    return NextResponse.json({ received: true });
  }

  if (event.type === "checkout.session.completed" && session.payment_status !== "paid") {
    // An async payment method is still clearing — a later
    // checkout.session.async_payment_succeeded will complete this. In
    // practice unreachable today since Checkout Sessions are created with
    // payment_method_types: ["card"] only, kept as a safety branch.
    await recordEvent(event.id, event.type);
    return NextResponse.json({ received: true, pending: true });
  }

  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent?.id ?? null);
  // Default to "deposit" for backward compatibility with any Checkout
  // Session created before this metadata field existed — harmless since
  // sessions are short-lived and none should still be in flight.
  const paymentType = session.metadata?.paymentType === "final" ? "final" : "deposit";

  if (paymentType === "deposit") {
    await db
      .update(bookings)
      .set({
        status: "deposit_paid",
        depositPaidAt: new Date(),
        stripePaymentIntentId: paymentIntentId,
        updatedAt: new Date(),
      })
      .where(and(eq(bookings.id, bookingId), eq(bookings.status, "accepted")));

    const [current] = await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1);

    if (current && current.status === "deposit_paid") {
      if (!current.calendarEventId) {
        try {
          const calendarEventId = await createBookingCalendarEvent(current);
          await db.update(bookings).set({ calendarEventId }).where(eq(bookings.id, current.id));
          await db
            .insert(bookingCalendarSyncLog)
            .values({ bookingId: current.id, status: "created", errorMessage: null });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown calendar error";
          console.error("Calendar event creation failed:", message);
          await db
            .insert(bookingCalendarSyncLog)
            .values({ bookingId: current.id, status: "failed", errorMessage: message });
        }
      }

      const [sentEmail] = await db
        .select({ id: bookingEmailLog.id })
        .from(bookingEmailLog)
        .where(
          and(
            eq(bookingEmailLog.bookingId, current.id),
            eq(bookingEmailLog.emailType, "deposit_confirmation"),
            eq(bookingEmailLog.status, "sent")
          )
        )
        .limit(1);
      if (!sentEmail) {
        await sendDepositReceivedEmail(current);
      }
    }
  } else {
    await db
      .update(bookings)
      .set({
        status: "completed",
        deliveredAt: new Date(),
        finalPaymentIntentId: paymentIntentId,
        updatedAt: new Date(),
      })
      .where(and(eq(bookings.id, bookingId), eq(bookings.status, "preview_ready")));

    const [current] = await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1);

    if (current && current.status === "completed") {
      const [sentEmail] = await db
        .select({ id: bookingEmailLog.id })
        .from(bookingEmailLog)
        .where(
          and(
            eq(bookingEmailLog.bookingId, current.id),
            eq(bookingEmailLog.emailType, "delivery"),
            eq(bookingEmailLog.status, "sent")
          )
        )
        .limit(1);
      if (!sentEmail) {
        await sendDeliveryEmail(current);
      }
    }
  }

  await recordEvent(event.id, event.type);
  return NextResponse.json({ received: true });
}

async function recordEvent(stripeEventId: string, eventType: string): Promise<void> {
  await db.insert(stripeWebhookEvents).values({ stripeEventId, eventType }).onConflictDoNothing();
}
