import "server-only";
import { getResendClient } from "./resend-client";
import { db } from "@/lib/db/client";
import { bookingEmailLog, type Booking, type BookingPackage } from "@/lib/db/schema";

const PACKAGE_LABELS: Record<BookingPackage, string> = {
  "20-photos": "20 Edited Aerial Photos",
  "photo-video-bundle": "20 Photos + Video Bundle",
  other: "Custom Project",
};

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

const SITE_URL = "https://apexvisualsutah.com";

/**
 * Sends the deposit-received confirmation email and logs the outcome to
 * booking_email_log either way. Never throws — matches sendAcceptanceEmail's
 * contract exactly: the deposit_paid status update is the source of truth,
 * this is a best-effort notification on top of it.
 */
export async function sendDepositReceivedEmail(booking: Booking): Promise<void> {
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!fromEmail) {
    await logEmailResult(booking.id, "failed", "RESEND_FROM_EMAIL is not set.");
    return;
  }
  if (!booking.totalPriceCents || !booking.depositAmountCents) {
    await logEmailResult(booking.id, "failed", "Booking has no price/deposit amount set.");
    return;
  }

  const bookingUrl = `${SITE_URL}/book/${booking.bookingToken}`;
  const packageLabel = PACKAGE_LABELS[booking.package as BookingPackage] ?? booking.package;
  const remainingCents = booking.totalPriceCents - booking.depositAmountCents;

  try {
    const resend = getResendClient();
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: booking.clientEmail,
      subject: "Your deposit is in — you're locked in",
      text: [
        `Hi ${booking.clientName},`,
        "",
        `We received your ${formatCents(booking.depositAmountCents)} deposit for your ${packageLabel} shoot — you're officially locked in.`,
        `Remaining balance (due after your preview gallery): ${formatCents(remainingCents)}`,
        "",
        `View your booking anytime: ${bookingUrl}`,
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
    emailType: "deposit_confirmation",
    status,
    errorMessage,
  });
}
