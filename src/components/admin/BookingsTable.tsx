import Link from "next/link";
import { acceptBooking, declineBooking, retryCalendarSync, retryEmail } from "@/app/admin/actions";
import type { Booking, BookingPackage, EmailType } from "@/lib/db/schema";
import { CATALOG_PRICE_CENTS, DURATION_OPTIONS_MINUTES } from "@/lib/booking/validation";

const PACKAGE_LABELS: Record<BookingPackage, string> = {
  "20-photos": "20 Edited Aerial Photos",
  "photo-video-bundle": "20 Photos + Video Bundle",
  other: "Custom Project",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  deposit_paid: "Deposit Paid",
  preview_ready: "Preview Ready",
  completed: "Completed",
  declined: "Declined",
};

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatWhen(date: Date | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export type EmailStatusInfo = {
  emailType: EmailType;
  status: "sent" | "failed";
  errorMessage: string | null;
};

export type CalendarSyncStatusInfo = {
  status: "created" | "failed";
  errorMessage: string | null;
};

export default function BookingsTable({
  bookings,
  emailStatusByBookingId,
  calendarSyncStatusByBookingId,
}: {
  bookings: Booking[];
  emailStatusByBookingId: Map<number, EmailStatusInfo>;
  calendarSyncStatusByBookingId: Map<number, CalendarSyncStatusInfo>;
}) {
  if (bookings.length === 0) {
    return <p className="text-sm text-fg-muted">No booking requests yet.</p>;
  }

  return (
    <div className="space-y-6">
      {bookings.map((booking) => {
        const readyForReview = booking.status === "pending" && booking.requestedStartAt;
        const emailStatus = emailStatusByBookingId.get(booking.id);
        const calendarSyncStatus = calendarSyncStatusByBookingId.get(booking.id);
        const defaultPriceCents = CATALOG_PRICE_CENTS[booking.package as keyof typeof CATALOG_PRICE_CENTS];

        return (
          <div key={booking.id} className="rounded-2xl border border-border p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-serif text-lg font-bold">{booking.clientName}</p>
                <p className="text-sm text-fg-muted">{booking.clientEmail}</p>
                {booking.clientPhone && <p className="text-sm text-fg-muted">{booking.clientPhone}</p>}
              </div>
              <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-wider text-fg-faint">
                {STATUS_LABELS[booking.status] ?? booking.status}
              </span>
            </div>

            <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-fg-faint">Package</dt>
                <dd>{PACKAGE_LABELS[booking.package as BookingPackage] ?? booking.package}</dd>
              </div>
              <div>
                <dt className="text-fg-faint">Requested Time</dt>
                <dd>{formatWhen(booking.requestedStartAt)}</dd>
              </div>
              {["accepted", "deposit_paid", "preview_ready", "completed"].includes(booking.status) && (
                <div>
                  <dt className="text-fg-faint">Duration</dt>
                  <dd>{(booking.durationMinutes ?? 0) / 60} hour(s)</dd>
                </div>
              )}
              {booking.totalPriceCents && booking.depositAmountCents && (
                <div>
                  <dt className="text-fg-faint">Price / Deposit</dt>
                  <dd>
                    {formatCents(booking.totalPriceCents)} total — {formatCents(booking.depositAmountCents)}{" "}
                    deposit {booking.status === "accepted" ? "(awaiting payment)" : "(paid)"}
                    {booking.status === "completed" && " — final balance paid"}
                  </dd>
                </div>
              )}
              {booking.status === "declined" && booking.declineReason && (
                <div className="sm:col-span-2">
                  <dt className="text-fg-faint">Decline Reason</dt>
                  <dd>{booking.declineReason}</dd>
                </div>
              )}
            </dl>

            <p className="mt-4 whitespace-pre-wrap text-sm text-fg-muted">{booking.projectDetails}</p>

            {emailStatus?.status === "failed" && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-fg/30 bg-bg p-4 text-sm">
                <span>
                  Confirmation email failed to send
                  {emailStatus.errorMessage ? `: ${emailStatus.errorMessage}` : "."}
                </span>
                <form action={retryEmail}>
                  <input type="hidden" name="bookingId" value={booking.id} />
                  <input type="hidden" name="emailType" value={emailStatus.emailType} />
                  <button
                    type="submit"
                    className="rounded-full border border-fg/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider hover:border-fg hover:bg-fg hover:text-bg"
                  >
                    Retry
                  </button>
                </form>
              </div>
            )}

            {calendarSyncStatus?.status === "failed" && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-fg/30 bg-bg p-4 text-sm">
                <span>
                  Calendar sync failed
                  {calendarSyncStatus.errorMessage ? `: ${calendarSyncStatus.errorMessage}` : "."}
                </span>
                <form action={retryCalendarSync}>
                  <input type="hidden" name="bookingId" value={booking.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-fg/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider hover:border-fg hover:bg-fg hover:text-bg"
                  >
                    Retry
                  </button>
                </form>
              </div>
            )}

            {readyForReview && (
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-6">
                <form action={acceptBooking} className="flex flex-wrap items-center gap-2">
                  <input type="hidden" name="bookingId" value={booking.id} />
                  <select
                    name="durationMinutes"
                    defaultValue={60}
                    className="rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-fg/50"
                  >
                    {DURATION_OPTIONS_MINUTES.map((minutes) => (
                      <option key={minutes} value={minutes}>
                        {minutes / 60} hour{minutes === 60 ? "" : "s"}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-fg-faint">$</span>
                    <input
                      name="totalPriceDollars"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      defaultValue={defaultPriceCents ? (defaultPriceCents / 100).toFixed(2) : undefined}
                      placeholder="Total price"
                      className="w-28 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-fg/50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-full bg-fg px-5 py-2 text-sm font-semibold text-bg transition-opacity hover:opacity-85"
                  >
                    Accept
                  </button>
                </form>

                <form action={declineBooking} className="flex items-center gap-2">
                  <input type="hidden" name="bookingId" value={booking.id} />
                  <input
                    name="declineReason"
                    type="text"
                    placeholder="Reason (optional)"
                    className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-fg outline-none placeholder:text-fg-faint/60 focus:border-fg/50"
                  />
                  <button
                    type="submit"
                    className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-fg-muted hover:border-fg/40 hover:text-fg"
                  >
                    Decline
                  </button>
                </form>
              </div>
            )}

            {!readyForReview && booking.status === "accepted" && (
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-6">
                <p className="text-sm text-fg-faint">Awaiting deposit payment from the client.</p>
                <form action={declineBooking} className="flex items-center gap-2">
                  <input type="hidden" name="bookingId" value={booking.id} />
                  <input
                    name="declineReason"
                    type="text"
                    placeholder="Reason (optional)"
                    className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-fg outline-none placeholder:text-fg-faint/60 focus:border-fg/50"
                  />
                  <button
                    type="submit"
                    className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-fg-muted hover:border-fg/40 hover:text-fg"
                  >
                    Decline
                  </button>
                </form>
              </div>
            )}

            {(booking.status === "deposit_paid" || booking.status === "preview_ready") && (
              <div className="mt-6 border-t border-border pt-6">
                <Link
                  href={`/admin/bookings/${booking.id}`}
                  className="inline-block rounded-full border border-border px-5 py-2 text-sm font-semibold text-fg transition-colors hover:border-fg/40"
                >
                  {booking.status === "preview_ready" ? "Manage Files" : "Upload Files"}
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
