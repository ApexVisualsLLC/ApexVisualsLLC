"use server";

import { timingSafeEqual } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { bookingCalendarSyncLog, bookings, type EmailType } from "@/lib/db/schema";
import { createAdminSession, deleteAdminSession } from "@/lib/auth/session";
import { verifyAdminSession } from "@/lib/auth/dal";
import { acceptBookingSchema, declineBookingSchema } from "@/lib/booking/validation";
import { sendAcceptanceEmail } from "@/lib/email/send-acceptance-email";
import { sendDepositReceivedEmail } from "@/lib/email/send-deposit-received-email";
import { sendDeclineEmail } from "@/lib/email/send-decline-email";
import { createBookingCalendarEvent } from "@/lib/calendar/create-booking-event";

export type AdminLoginState = {
  error?: string;
};

function safeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  // timingSafeEqual throws if lengths differ, so compare lengths separately
  // (not in a way that itself leaks timing on the length, since password
  // length isn't the secret we're protecting here).
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function adminLogin(
  _prevState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return { error: "Admin login is not configured yet." };
  }
  if (!password || !safeEquals(password, expected)) {
    return { error: "Incorrect password." };
  }

  await createAdminSession();
  redirect("/admin");
}

export async function adminLogout(): Promise<void> {
  await deleteAdminSession();
  redirect("/admin");
}

async function requireAdmin(): Promise<void> {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    redirect("/admin");
  }
}

export async function acceptBooking(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = acceptBookingSchema.safeParse({
    bookingId: formData.get("bookingId"),
    durationMinutes: formData.get("durationMinutes"),
    totalPriceDollars: formData.get("totalPriceDollars"),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid accept request.");
  }

  const now = new Date();
  const depositAmountCents = Math.round(parsed.data.totalPriceCents / 2);
  const [updated] = await db
    .update(bookings)
    .set({
      status: "accepted",
      durationMinutes: parsed.data.durationMinutes,
      totalPriceCents: parsed.data.totalPriceCents,
      depositAmountCents,
      acceptedAt: now,
      updatedAt: now,
    })
    // Guards against a double form-submit re-triggering the email below.
    .where(and(eq(bookings.id, parsed.data.bookingId), eq(bookings.status, "pending")))
    .returning();

  if (updated) {
    await sendAcceptanceEmail(updated);
  }

  revalidatePath("/admin");
}

export async function declineBooking(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = declineBookingSchema.safeParse({
    bookingId: formData.get("bookingId"),
    declineReason: formData.get("declineReason"),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid decline request.");
  }

  const now = new Date();
  const [updated] = await db
    .update(bookings)
    .set({
      status: "declined",
      declineReason: parsed.data.declineReason,
      declinedAt: now,
      updatedAt: now,
    })
    // "accepted" (not yet deposit_paid) can still be declined — e.g. a client
    // who never pays. Once deposit_paid, a decline/refund is a manual Stripe
    // dashboard action instead, not this button.
    .where(
      and(eq(bookings.id, parsed.data.bookingId), inArray(bookings.status, ["pending", "accepted"]))
    )
    .returning();

  if (updated) {
    await sendDeclineEmail(updated);
  }

  revalidatePath("/admin");
}

/**
 * Single retry entry point for every email type, dispatching on the
 * booking's current status — a failed deposit-confirmation or decline email
 * needs a different resend call than a failed acceptance email, and routing
 * them all through one status-blind action (as an earlier version of this
 * did) meant a retry for anything but the acceptance email silently did
 * nothing.
 */
export async function retryEmail(formData: FormData): Promise<void> {
  await requireAdmin();

  const bookingId = Number(formData.get("bookingId"));
  const emailType = String(formData.get("emailType") ?? "") as EmailType;
  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    throw new Error("Invalid booking id.");
  }

  const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1);
  if (booking) {
    if (emailType === "acceptance" && booking.status === "accepted") {
      await sendAcceptanceEmail(booking);
    } else if (emailType === "deposit_confirmation" && booking.status === "deposit_paid") {
      await sendDepositReceivedEmail(booking);
    } else if (emailType === "decline" && booking.status === "declined") {
      await sendDeclineEmail(booking);
    }
  }

  revalidatePath("/admin");
}

export async function retryCalendarSync(formData: FormData): Promise<void> {
  await requireAdmin();

  const bookingId = Number(formData.get("bookingId"));
  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    throw new Error("Invalid booking id.");
  }

  const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1);
  if (booking && booking.status === "deposit_paid" && !booking.calendarEventId) {
    try {
      const calendarEventId = await createBookingCalendarEvent(booking);
      await db.update(bookings).set({ calendarEventId }).where(eq(bookings.id, booking.id));
      await db
        .insert(bookingCalendarSyncLog)
        .values({ bookingId: booking.id, status: "created", errorMessage: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown calendar error";
      await db
        .insert(bookingCalendarSyncLog)
        .values({ bookingId: booking.id, status: "failed", errorMessage: message });
    }
  }

  revalidatePath("/admin");
}
