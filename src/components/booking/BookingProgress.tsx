import Link from "next/link";
import type { Booking, BookingPackage } from "@/lib/db/schema";
import { DEPOSIT_POLICY_TEXT, RESCHEDULE_REMINDER_TEXT } from "@/lib/booking/policy";
import PayDepositButton from "./PayDepositButton";
import PayFinalBalanceButton from "./PayFinalBalanceButton";
import DepositPendingRefresh from "./DepositPendingRefresh";
import PreviewGallery from "./PreviewGallery";
import CompletedDownloads from "./CompletedDownloads";

type PhotoUrl = { url: string; filename: string };

const PACKAGE_LABELS: Record<BookingPackage, string> = {
  "20-photos": "20 Edited Aerial Photos",
  "photo-video-bundle": "20 Photos + Video Bundle",
  other: "Custom Project",
};

function formatWhen(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function BookingProgress({
  booking,
  depositReturnStatus,
  finalReturnStatus,
  previewPhotoUrls = [],
  previewVideoUrl,
  downloadPhotoUrls = [],
  downloadVideoUrls = [],
}: {
  booking: Booking;
  depositReturnStatus?: string;
  finalReturnStatus?: string;
  previewPhotoUrls?: PhotoUrl[];
  previewVideoUrl?: string;
  downloadPhotoUrls?: PhotoUrl[];
  downloadVideoUrls?: PhotoUrl[];
}) {
  const packageLabel = PACKAGE_LABELS[booking.package as BookingPackage] ?? booking.package;

  if (booking.status === "completed") {
    return (
      <div className="space-y-8">
        <div className="rounded-2xl border border-fg/30 bg-panel p-8 text-center">
          <p className="font-serif text-2xl font-bold">Your files are ready.</p>
          <p className="mt-3 text-fg-muted">{packageLabel}</p>
          <p className="mt-1 text-xs text-fg-faint">
            Full-quality, unwatermarked downloads below — available anytime, no expiration.
          </p>
        </div>
        <CompletedDownloads photos={downloadPhotoUrls} videos={downloadVideoUrls} />
      </div>
    );
  }

  if (booking.status === "preview_ready" && booking.totalPriceCents && booking.depositAmountCents) {
    const remainingCents = booking.totalPriceCents - booking.depositAmountCents;
    return (
      <div className="space-y-8">
        <div className="rounded-2xl border border-fg/30 bg-panel p-8 text-center">
          {finalReturnStatus === "success" && <DepositPendingRefresh />}
          <p className="font-serif text-2xl font-bold">Your preview gallery is ready.</p>
          <p className="mt-3 text-fg-muted">{packageLabel}</p>
          <p className="mt-1 text-fg-muted">
            Remaining balance to unlock full-quality downloads: {formatCents(remainingCents)}
          </p>
          {finalReturnStatus === "success" ? (
            <p className="mt-6 text-sm text-fg-muted">
              Payment received — unlocking your downloads. This page will update automatically in a
              moment.
            </p>
          ) : (
            <>
              {finalReturnStatus === "cancelled" && (
                <p className="mt-3 text-sm text-fg-muted">Checkout was cancelled — no charge was made.</p>
              )}
              <PayFinalBalanceButton bookingToken={booking.bookingToken} />
            </>
          )}
        </div>
        <PreviewGallery photos={previewPhotoUrls} videoUrl={previewVideoUrl} />
      </div>
    );
  }

  if (booking.status === "deposit_paid" && booking.requestedStartAt && booking.durationMinutes) {
    return (
      <div className="rounded-2xl border border-fg/30 bg-panel p-8 text-center">
        <p className="font-serif text-2xl font-bold">You&apos;re confirmed.</p>
        <p className="mt-3 text-fg-muted">{packageLabel}</p>
        <p className="mt-1 text-fg-muted">{formatWhen(booking.requestedStartAt)}</p>
        <p className="mt-3 text-xs text-fg-faint">
          Estimated on-site time: about {booking.durationMinutes / 60} hour
          {booking.durationMinutes === 60 ? "" : "s"}
        </p>
        {booking.totalPriceCents && booking.depositAmountCents && (
          <p className="mt-3 text-xs text-fg-faint">
            Deposit paid: {formatCents(booking.depositAmountCents)} — remaining balance{" "}
            {formatCents(booking.totalPriceCents - booking.depositAmountCents)} due after your preview
            gallery.
          </p>
        )}
        <p className="mt-4 text-xs text-fg-faint">{RESCHEDULE_REMINDER_TEXT}</p>
      </div>
    );
  }

  if (booking.status === "accepted" && booking.requestedStartAt && booking.durationMinutes) {
    return (
      <div className="rounded-2xl border border-fg/30 bg-panel p-8 text-center">
        {depositReturnStatus === "success" && <DepositPendingRefresh />}
        <p className="font-serif text-2xl font-bold">You&apos;re accepted — pay your deposit to lock it in.</p>
        <p className="mt-3 text-fg-muted">{packageLabel}</p>
        <p className="mt-1 text-fg-muted">{formatWhen(booking.requestedStartAt)}</p>
        {booking.totalPriceCents && booking.depositAmountCents && (
          <>
            <p className="mt-3 text-fg-muted">
              Total: {formatCents(booking.totalPriceCents)} — deposit due now:{" "}
              {formatCents(booking.depositAmountCents)}
            </p>
            <p className="mt-1 text-xs text-fg-faint">
              Paying the deposit locks in your shoot date. The remaining{" "}
              {formatCents(booking.totalPriceCents - booking.depositAmountCents)} is due once your
              edited photos{booking.package === "photo-video-bundle" ? "/video" : ""} are ready for
              you to preview — you&apos;ll get the final files right after that&apos;s settled.
            </p>
            <p className="mt-1 text-xs text-fg-faint">
              {DEPOSIT_POLICY_TEXT}{" "}
              <Link href="/policies" className="underline hover:text-fg">
                Full terms &amp; policies
              </Link>
              .
            </p>
          </>
        )}
        {depositReturnStatus === "success" ? (
          <p className="mt-6 text-sm text-fg-muted">
            Payment received — finalizing your booking. This page will update automatically in a
            moment.
          </p>
        ) : (
          <>
            {depositReturnStatus === "cancelled" && (
              <p className="mt-3 text-sm text-fg-muted">Checkout was cancelled — no charge was made.</p>
            )}
            <PayDepositButton bookingToken={booking.bookingToken} />
          </>
        )}
      </div>
    );
  }

  if (booking.status === "declined") {
    return (
      <div className="rounded-2xl border border-border bg-panel p-8 text-center">
        <p className="font-serif text-2xl font-bold">We can&apos;t make this one work.</p>
        <p className="mt-3 text-fg-muted">
          {booking.declineReason ??
            "We're unable to take on this project. Feel free to reach out directly if you'd like to discuss another time."}
        </p>
      </div>
    );
  }

  // status === "pending" with a requestedStartAt already set — awaiting Russell's review.
  return (
    <div className="rounded-2xl border border-border bg-panel p-8 text-center">
      <p className="font-serif text-2xl font-bold">Request received.</p>
      <p className="mt-3 text-fg-muted">{packageLabel}</p>
      {booking.requestedStartAt && (
        <p className="mt-1 text-fg-muted">Requested: {formatWhen(booking.requestedStartAt)}</p>
      )}
      <p className="mt-3 text-xs text-fg-faint">
        We&apos;ll review and confirm within 24 hours — check back on this page anytime.
      </p>
    </div>
  );
}
