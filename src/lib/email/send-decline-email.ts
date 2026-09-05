import "server-only";
import { getResendClient } from "./resend-client";
import { db } from "@/lib/db/client";
import { bookingEmailLog, type Booking } from "@/lib/db/schema";

const SITE_URL = "https://apexvisualsutah.com";

/**
 * Sends the booking-declined notice and logs the outcome to booking_email_log
 * either way. Never throws — matches sendAcceptanceEmail's contract exactly.
 * Without this, a declined client would only find out by revisiting their
 * booking link on their own.
 */
export async function sendDeclineEmail(booking: Booking): Promise<void> {
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
      subject: "About your Apex Visuals booking request",
      text: [
        `Hi ${booking.clientName},`,
        "",
        "We're not able to take on this project" +
          (booking.declineReason ? `: ${booking.declineReason}` : "."),
        "",
        "Feel free to reach out directly if you'd like to discuss another time or project.",
        "",
        `${bookingUrl}`,
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
    emailType: "decline",
    status,
    errorMessage,
  });
}
