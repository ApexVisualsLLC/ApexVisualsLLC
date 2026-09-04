import { randomBytes } from "crypto";

/**
 * The private, unguessable link token for a booking. This is the sole access
 * control for the booking's entire lifecycle (booking -> deposit -> preview ->
 * final payment -> download in later phases) — it must never be derived from
 * the client's name, email, or the row's id/timestamp.
 */
export function generateBookingToken(): string {
  return randomBytes(32).toString("base64url");
}
