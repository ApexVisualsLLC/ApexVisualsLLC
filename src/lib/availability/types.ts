/** A blocked-off time range, shaped exactly like Google Calendar's free/busy API response. */
export type BusyRange = {
  start: Date;
  end: Date;
};

/** One offered start time on the booking page. */
export type AvailabilitySlot = {
  startAt: Date;
};
