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
 * Sends the "your preview gallery is ready" email and logs the outcome to
 * booking_email_log either way. Never throws — matches sendAcceptanceEmail's
 * contract exactly: the preview_ready status update is the source of truth,
 * this is a best-effort notification on top of it.
 */
export async function sendPreviewReadyEmail(booking: Booking): Promise<void> {
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
      subject: "Your preview gallery is ready",
      text: [
        `Hi ${booking.clientName},`,
        "",
        `Your ${packageLabel} preview gallery is ready to view.`,
        `Remaining balance to unlock your full-quality downloads: ${formatCents(remainingCents)}`,
        "",
        `View your gallery and pay the remaining balance: ${bookingUrl}`,
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
    emailType: "preview_ready",
    status,
    errorMessage,
  });
}
