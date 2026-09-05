import "server-only";
import { getResendClient } from "./resend-client";
import { db } from "@/lib/db/client";
import { bookingEmailLog, type Booking, type BookingPackage } from "@/lib/db/schema";

const PACKAGE_LABELS: Record<BookingPackage, string> = {
  "20-photos": "20 Edited Aerial Photos",
  "photo-video-bundle": "20 Photos + Video Bundle",
  other: "Custom Project",
};

// Where Russell actually reads his email — same address used everywhere
// else on the site (footer, contact page, policies).
const ADMIN_EMAIL = "russfilmz808@gmail.com";
const SITE_URL = "https://apexvisualsutah.com";

function formatBookingTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

/**
 * Notifies Russell that a client picked a time and the booking is ready for
 * review in the admin dashboard. Never throws — a failed send must not block
 * the client's own flow; the failure is logged for the admin retry banner
 * instead, same as every other transactional email here.
 */
export async function sendNewRequestEmail(booking: Booking): Promise<void> {
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!fromEmail) {
    await logEmailResult(booking.id, "failed", "RESEND_FROM_EMAIL is not set.");
    return;
  }
  if (!booking.requestedStartAt) {
    await logEmailResult(booking.id, "failed", "Booking has no requested time yet.");
    return;
  }

  const packageLabel = PACKAGE_LABELS[booking.package as BookingPackage] ?? booking.package;
  const timeLines = booking.requestedStartAtAlt
    ? [
        `Option 1: ${formatBookingTime(booking.requestedStartAt)}`,
        `Option 2: ${formatBookingTime(booking.requestedStartAtAlt)}`,
      ]
    : [`Requested time: ${formatBookingTime(booking.requestedStartAt)}`];

  try {
    const resend = getResendClient();
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: ADMIN_EMAIL,
      subject: `New booking request — ${booking.clientName}`,
      text: [
        `${booking.clientName} requested a shoot.`,
        "",
        `Package: ${packageLabel}`,
        ...timeLines,
        "",
        `Email: ${booking.clientEmail}`,
        ...(booking.clientPhone ? [`Phone: ${booking.clientPhone}`] : []),
        "",
        "Project details:",
        booking.projectDetails,
        "",
        `Review and accept/decline: ${SITE_URL}/admin`,
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
    emailType: "new_request",
    status,
    errorMessage,
  });
}
