/**
 * Small dependency-free helpers for working in a fixed IANA timezone
 * regardless of the server's own local timezone (Vercel runs in UTC; local
 * dev on Russell's Mac happens to run in America/Denver already, which would
 * otherwise mask this in local testing). No date library needed — Intl's
 * built-in ICU timezone database handles DST transitions correctly.
 */
export const BUSINESS_TIME_ZONE = "America/Denver";

/** The UTC offset (in minutes) of `timeZone` at the instant `date` represents. */
function getTimeZoneOffsetMinutes(timeZone: string, date: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(date);
  const map: Record<string, string> = {};
  for (const part of parts) map[part.type] = part.value;
  const asUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second)
  );
  return (asUtc - date.getTime()) / 60000;
}

/** Converts a wall-clock date/time as understood in `timeZone` to the correct UTC instant. */
export function zonedWallTimeToUtc(
  timeZone: string,
  year: number,
  month: number, // 0-indexed, matches Date's convention
  day: number,
  hour: number,
  minute = 0
): Date {
  const utcGuess = new Date(Date.UTC(year, month, day, hour, minute));
  const offsetMinutes = getTimeZoneOffsetMinutes(timeZone, utcGuess);
  return new Date(utcGuess.getTime() - offsetMinutes * 60000);
}

/** The current calendar date (year/month/day) as seen in `timeZone`, independent of server local time. */
export function zonedToday(timeZone: string): { year: number; month: number; day: number } {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = dtf.formatToParts(new Date());
  const map: Record<string, string> = {};
  for (const part of parts) map[part.type] = part.value;
  return { year: Number(map.year), month: Number(map.month) - 1, day: Number(map.day) };
}

/** The day of week (0 = Sun ... 6 = Sat) of a UTC instant, as seen in `timeZone`. */
export function zonedDayOfWeek(timeZone: string, date: Date): number {
  const weekday = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(date);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday);
}
