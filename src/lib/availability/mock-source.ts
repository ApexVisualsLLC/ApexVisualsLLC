import type { BusyRange } from "./types";
import { BUSINESS_TIME_ZONE, zonedDayOfWeek, zonedToday, zonedWallTimeToUtc } from "./timezone";

/**
 * Local-dev fallback, used only when GOOGLE_CALENDAR_ID isn't set (see
 * availability/index.ts) — keeps local testing possible without live Google
 * credentials. In production this is fully replaced by
 * google-calendar-source.ts, which has this same function signature.
 *
 * Returns deterministic fake "Russell is busy" blocks (class schedule, etc.),
 * shaped exactly like what Google's free/busy API returns.
 */
export async function getBusyRanges(rangeStart: Date, rangeEnd: Date): Promise<BusyRange[]> {
  const busy: BusyRange[] = [];
  const today = zonedToday(BUSINESS_TIME_ZONE);
  const cursor = zonedWallTimeToUtc(BUSINESS_TIME_ZONE, today.year, today.month, today.day, 0, 0);

  // Walk day-by-day in Denver-local calendar days, not server-local ones.
  while (cursor < rangeEnd) {
    const dayOfWeek = zonedDayOfWeek(BUSINESS_TIME_ZONE, cursor);
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

    // Fake "class" block Mon/Wed/Fri mornings, and Tue/Thu afternoons.
    if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
      busy.push({
        start: zonedWallTimeToUtc(BUSINESS_TIME_ZONE, y, m, d, 9, 0),
        end: zonedWallTimeToUtc(BUSINESS_TIME_ZONE, y, m, d, 12, 0),
      });
    } else if (dayOfWeek === 2 || dayOfWeek === 4) {
      busy.push({
        start: zonedWallTimeToUtc(BUSINESS_TIME_ZONE, y, m, d, 13, 0),
        end: zonedWallTimeToUtc(BUSINESS_TIME_ZONE, y, m, d, 16, 0),
      });
    }

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return busy.filter((range) => range.end > rangeStart && range.start < rangeEnd);
}
