import "server-only";
import { getResendClient } from "./resend-client";
import { db } from "@/lib/db/client";
import { bookingEmailLog, type Booking, type BookingPackage } from "@/lib/db/schema";
import { DEPOSIT_POLICY_TEXT } from "@/lib/booking/policy";

const PACKAGE_LABELS: Record<BookingPackage, string> = {
  "20-photos": "20 Edited Aerial Photos",
  "photo-video-bundle": "20 Photos + Video Bundle",
  other: "Custom Project",
};

function formatBookingTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

const SITE_URL = "https://apexvisualsutah.com";

/**
 * Sends the booking-accepted confirmation email and logs the outcome to
 * booking_email_log either way. Never throws — a failed send must not roll
 * back the booking's status update (accepting the booking is the source of
 * truth; the email is a best-effort notification on top of it, with its
 * failure surfaced in the admin UI instead of silently swallowed).
 */
export async function sendAcceptanceEmail(booking: Booking): Promise<void> {
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!fromEmail) {
    await logEmailResult(booking.id, "failed", "RESEND_FROM_EMAIL is not set.");
    return;
  }
  if (!booking.requestedStartAt || !booking.durationMinutes) {
    await logEmailResult(booking.id, "failed", "Booking has no confirmed time/duration.");
    return;
  }

  const bookingUrl = `${SITE_URL}/book/${booking.bookingToken}`;
  const packageLabel = PACKAGE_LABELS[booking.package as BookingPackage] ?? booking.package;
  const whenText = formatBookingTime(booking.requestedStartAt);

  const depositLines =
    booking.totalPriceCents && booking.depositAmountCents
      ? [
          `Total: ${formatCents(booking.totalPriceCents)} — deposit due now to lock it in: ${formatCents(booking.depositAmountCents)}`,
          `The remaining ${formatCents(booking.totalPriceCents - booking.depositAmountCents)} is due once your edited photos/videos are ready for you to preview.`,
          "",
          DEPOSIT_POLICY_TEXT,
          "",
        ]
      : [];

  try {
    const resend = getResendClient();
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: booking.clientEmail,
      subject: "Your Apex Visuals shoot request was accepted — pay your deposit to lock it in",
      text: [
        `Hi ${booking.clientName},`,
        "",
        `Good news — we can do your shoot on ${whenText}.`,
        `Package: ${packageLabel}`,
        "",
        ...depositLines,
        `Pay your deposit and view your booking anytime: ${bookingUrl}`,
        "",
        "If anything about the time needs to change, just reply to this email.",
        "",
        "— Apex Visuals LLC",
      ].join("\n"),
    });

    if (error) {
      await logEmailResult(booking.id, "failed", error.message ?? "Unknown Resend error");
      return;
    }

    await logEmailResult(booking.id, "sent", null);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error sending email";
    await logEmailResult(booking.id, "failed", message);
  }
}

async function logEmailResult(
  bookingId: number,
  status: "sent" | "failed",
  errorMessage: string | null
): Promise<void> {
  await db.insert(bookingEmailLog).values({
    bookingId,
    emailType: "acceptance",
    status,
    errorMessage,
  });
}
