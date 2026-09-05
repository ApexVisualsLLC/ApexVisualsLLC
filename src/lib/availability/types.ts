/** A blocked-off time range, shaped exactly like Google Calendar's free/busy API response. */
export type BusyRange = {
  start: Date;
  end: Date;
};

/** One offered start time on the booking page. */
export type AvailabilitySlot = {
  startAt: Date;
  /** Set when this is the special golden-hour arrival time, not a regular hourly slot. */
  sunsetAt?: Date;
};
