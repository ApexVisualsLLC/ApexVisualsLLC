import "server-only";
import { google } from "googleapis";
import { getGoogleServiceAccountCredentials } from "@/lib/google/credentials";
import type { BusyRange } from "./types";

/**
 * Real replacement for mock-source.ts. Reads free/busy data from the
 * "Apex Visuals Bookings" Google Calendar via the service account it's
 * shared with (read-only — "See only free/busy" sharing is all this needs).
 */
export async function getBusyRanges(rangeStart: Date, rangeEnd: Date): Promise<BusyRange[]> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    throw new Error("GOOGLE_CALENDAR_ID is not set.");
  }

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
      items: [{ id: calendarId }],
    },
  });

  const calendarResult = res.data.calendars?.[calendarId];
  if (calendarResult?.errors?.length) {
    throw new Error(
      `Google Calendar free/busy lookup failed: ${JSON.stringify(calendarResult.errors)}`
    );
  }

  return (calendarResult?.busy ?? [])
    .filter((range) => range.start && range.end)
    .map((range) => ({ start: new Date(range.start as string), end: new Date(range.end as string) }));
}
