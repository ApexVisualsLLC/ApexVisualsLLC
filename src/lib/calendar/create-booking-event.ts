import "server-only";
import { google } from "googleapis";
import { getGoogleServiceAccountCredentials } from "@/lib/google/credentials";
import type { Booking, BookingPackage } from "@/lib/db/schema";

const PACKAGE_LABELS: Record<BookingPackage, string> = {
  "20-photos": "20 Edited Aerial Photos",
  "photo-video-bundle": "20 Photos + Video Bundle",
  other: "Custom Project",
};

/**
 * Creates the real Calendar event blocking this shoot's time on the
 * "Apex Visuals Bookings" calendar. Our own DB already prevents double-
 * booking (see availability/index.ts) — this is purely for Russell's own
 * visibility when looking at his calendar. Requires the service account to
 * be shared on that calendar with "Make changes to events" (not just the
 * read-only free/busy sharing used elsewhere).
 */
export async function createBookingCalendarEvent(booking: Booking): Promise<string> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    throw new Error("GOOGLE_CALENDAR_ID is not set.");
  }
  if (!booking.requestedStartAt || !booking.durationMinutes) {
    throw new Error("Booking has no confirmed time/duration.");
  }

  const { clientEmail, privateKey } = getGoogleServiceAccountCredentials();
  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar.events"],
  });
  const calendar = google.calendar({ version: "v3", auth });

  const startAt = booking.requestedStartAt;
  const endAt = new Date(startAt.getTime() + booking.durationMinutes * 60000);
  const packageLabel = PACKAGE_LABELS[booking.package as BookingPackage] ?? booking.package;

  const res = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: `Apex Visuals: ${booking.clientName} (${packageLabel})`,
      description: booking.projectDetails,
      start: { dateTime: startAt.toISOString() },
      end: { dateTime: endAt.toISOString() },
    },
  });

  if (!res.data.id) {
    throw new Error("Google Calendar did not return an event id.");
  }
  return res.data.id;
}

/**
 * Removes a shoot's calendar event, e.g. when the booking itself is deleted
 * from the admin dashboard — otherwise a stale block would sit on Russell's
 * calendar forever with nothing in the app pointing back to it. A 404/410
 * (already gone) counts as success, since the end state we want is already
 * true.
 */
export async function deleteBookingCalendarEvent(eventId: string): Promise<void> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    throw new Error("GOOGLE_CALENDAR_ID is not set.");
  }

  const { clientEmail, privateKey } = getGoogleServiceAccountCredentials();
  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar.events"],
  });
  const calendar = google.calendar({ version: "v3", auth });

  try {
    await calendar.events.delete({ calendarId, eventId });
  } catch (err) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    if (status === 404 || status === 410) return;
    throw err;
  }
}
