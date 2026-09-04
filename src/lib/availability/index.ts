import { and, gte, inArray, isNotNull, lt } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { bookings } from "@/lib/db/schema";
import { getBusyRanges as getGoogleCalendarBusyRanges } from "./google-calendar-source";
import { getBusyRanges as getMockBusyRanges } from "./mock-source";
import { BUSINESS_TIME_ZONE, zonedToday, zonedWallTimeToUtc } from "./timezone";
import type { AvailabilitySlot, BusyRange } from "./types";

const BUSINESS_HOURS_START = 8; // 8am Denver
const BUSINESS_HOURS_END = 19; // 7pm Denver
const SLOT_GRANULARITY_MINUTES = 60;
const DEFAULT_LOOKAHEAD_DAYS = 14;

function overlaps(slotStart: Date, slotEnd: Date, busy: BusyRange): boolean {
  return slotStart < busy.end && slotEnd > busy.start;
}

/**
 * Busy ranges from Apex's own confirmed bookings — always real, never
 * placeholder. Includes "deposit_paid" as well as "accepted": a booking that
 * hasn't been paid for yet already holds the slot once Russell accepts it,
 * and must keep holding it after the deposit clears too, or the slot would
 * briefly become bookable again by someone else right after money changes
 * hands.
 */
async function getAcceptedBookingRanges(rangeStart: Date, rangeEnd: Date): Promise<BusyRange[]> {
  const rows = await db
    .select({
      requestedStartAt: bookings.requestedStartAt,
      durationMinutes: bookings.durationMinutes,
    })
    .from(bookings)
    .where(
      and(
        inArray(bookings.status, ["accepted", "deposit_paid"]),
        isNotNull(bookings.requestedStartAt),
        isNotNull(bookings.durationMinutes),
        gte(bookings.requestedStartAt, rangeStart),
        lt(bookings.requestedStartAt, rangeEnd)
      )
    );

  return rows
    .filter((r) => r.requestedStartAt && r.durationMinutes)
    .map((r) => {
      const start = r.requestedStartAt as Date;
      const end = new Date(start.getTime() + (r.durationMinutes as number) * 60000);
      return { start, end };
    });
}

export async function getAvailableSlots(
  rangeStart: Date = new Date(),
  rangeEnd: Date = new Date(Date.now() + DEFAULT_LOOKAHEAD_DAYS * 24 * 60 * 60 * 1000)
): Promise<AvailabilitySlot[]> {
  // GOOGLE_CALENDAR_ID unset means the real calendar isn't wired up yet (e.g.
  // local dev) — falls back to the placeholder schedule. Once it's set, a
  // real Calendar API failure is allowed to throw and surface as a visible
  // error rather than silently falling back to fake availability data.
  const getExternalBusyRanges = process.env.GOOGLE_CALENDAR_ID
    ? getGoogleCalendarBusyRanges
    : getMockBusyRanges;

  const [externalBusy, bookedBusy] = await Promise.all([
    getExternalBusyRanges(rangeStart, rangeEnd),
    getAcceptedBookingRanges(rangeStart, rangeEnd),
  ]);
  const busyRanges = [...externalBusy, ...bookedBusy];

  const slots: AvailabilitySlot[] = [];
  const today = zonedToday(BUSINESS_TIME_ZONE);
  const cursor = zonedWallTimeToUtc(BUSINESS_TIME_ZONE, today.year, today.month, today.day, 0, 0);

  while (cursor < rangeEnd) {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: BUSINESS_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const parts = dtf.formatToParts(cursor);
    const map: Record<string, string> = {};
    for (const part of parts) map[part.type] = part.value;
    const y = Number(map.year);
    const m = Number(map.month) - 1;
    const d = Number(map.day);

    for (let hour = BUSINESS_HOURS_START; hour < BUSINESS_HOURS_END; hour++) {
      const slotStart = zonedWallTimeToUtc(BUSINESS_TIME_ZONE, y, m, d, hour, 0);
      const slotEnd = new Date(slotStart.getTime() + SLOT_GRANULARITY_MINUTES * 60000);

      if (slotStart < rangeStart || slotStart < new Date()) continue;
      if (slotStart >= rangeEnd) continue;
      if (busyRanges.some((busy) => overlaps(slotStart, slotEnd, busy))) continue;

      slots.push({ startAt: slotStart });
    }

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return slots.sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
}
