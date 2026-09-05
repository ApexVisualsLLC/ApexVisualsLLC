import "server-only";
import { google } from "googleapis";
import { getGoogleServiceAccountCredentials } from "@/lib/google/credentials";
import type { BusyRange } from "./types";

/**
 * Which calendars count as "Russell is busy" for booking purposes. Always
 * includes the dedicated "Apex Visuals Bookings" calendar (where confirmed
 * shoots get written), plus any personal/school/other calendars listed in
 * GOOGLE_AVAILABILITY_CALENDAR_IDS — each must be shared with the service
 * account (read-only "See only free/busy" is enough). Without the extra
 * calendars, availability only reflects Apex bookings and ignores
 * everything else on Russell's real schedule.
 */
function getCalendarIdsToCheck(): string[] {
  const bookingCalendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!bookingCalendarId) {
    throw new Error("GOOGLE_CALENDAR_ID is not set.");
  }
  const extraIds = (process.env.GOOGLE_AVAILABILITY_CALENDAR_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  return Array.from(new Set([bookingCalendarId, ...extraIds]));
}

/**
 * Real replacement for mock-source.ts. Reads free/busy data from every
 * calendar in getCalendarIdsToCheck() via the service account they're each
 * shared with.
 */
export async function getBusyRanges(rangeStart: Date, rangeEnd: Date): Promise<BusyRange[]> {
  const calendarIds = getCalendarIdsToCheck();

  const { clientEmail, privateKey } = getGoogleServiceAccountCredentials();
  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
  });
  const calendar = google.calendar({ version: "v3", auth });

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: rangeStart.toISOString(),
      timeMax: rangeEnd.toISOString(),
      items: calendarIds.map((id) => ({ id })),
    },
  });

  const busy: BusyRange[] = [];
  for (const calendarId of calendarIds) {
    const calendarResult = res.data.calendars?.[calendarId];
    if (calendarResult?.errors?.length) {
      throw new Error(
        `Google Calendar free/busy lookup failed for ${calendarId}: ${JSON.stringify(calendarResult.errors)}`
      );
    }
    for (const range of calendarResult?.busy ?? []) {
      if (range.start && range.end) {
        busy.push({ start: new Date(range.start), end: new Date(range.end) });
      }
    }
  }

  return busy;
}
