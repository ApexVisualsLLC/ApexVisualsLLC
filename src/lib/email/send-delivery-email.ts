import "server-only";
import { getResendClient } from "./resend-client";
import { db } from "@/lib/db/client";
import { bookingEmailLog, type Booking } from "@/lib/db/schema";

const SITE_URL = "https://apexvisualsutah.com";

/**
 * Sends the final "your files are ready to download" email and logs the
 * outcome to booking_email_log either way. Never throws — matches
 * sendAcceptanceEmail's contract exactly: the completed status update is the
 * source of truth, this is a best-effort notification on top of it.
 */
export async function sendDeliveryEmail(booking: Booking): Promise<void> {
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!fromEmail) {
    await logEmailResult(booking.id, "failed", "RESEND_FROM_EMAIL is not set.");
    return;
  }

  const bookingUrl = `${SITE_URL}/book/${booking.bookingToken}`;

  try {
    const resend = getResendClient();
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: booking.clientEmail,
      subject: "Your full-quality files are ready to download",
      text: [
        `Hi ${booking.clientName},`,
        "",
        "Thanks for your final payment — your full-quality, unwatermarked files are ready.",
        "",
        `Download your files: ${bookingUrl}`,
        "",
        "It was a pleasure working with you!",
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
    emailType: "delivery",
    status,
    errorMessage,
  });
}
