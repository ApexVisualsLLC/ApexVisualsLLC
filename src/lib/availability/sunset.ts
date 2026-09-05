import { getTimes } from "suncalc";

// Provo, UT — close enough to Orem/Lehi/the rest of Utah County that
// sunset time never meaningfully differs (well under a minute).
const SHOOT_LATITUDE = 40.2338;
const SHOOT_LONGITUDE = -111.6585;

/** How long before actual sunset Russell wants to arrive and start setting up. */
export const SUNSET_ARRIVAL_LEAD_MINUTES = 25;

/** The real sunset instant for the given calendar date, at the shoot location. */
export function getSunsetAt(date: Date): Date {
  const { sunset } = getTimes(date, SHOOT_LATITUDE, SHOOT_LONGITUDE);
  // Only null near the poles (permanent day/night) — never at this latitude.
  if (!sunset) {
    throw new Error("No sunset time available for this date/location.");
  }
  return sunset;
}
