import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db/client";
import { bookings } from "@/lib/db/schema";
import { createPresignedDownloadUrl } from "@/lib/storage/presign";
import { filenameFromKey } from "@/lib/storage/keys";
import AvailabilityPicker from "@/components/booking/AvailabilityPicker";
import BookingProgress from "@/components/booking/BookingProgress";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Your Booking — Apex Visuals LLC",
  robots: { index: false, follow: false },
};

async function urlsForKeys(keys: string[]): Promise<{ url: string; filename: string }[]> {
  return Promise.all(
    keys.map(async (key) => ({
      url: await createPresignedDownloadUrl(key, filenameFromKey(key)),
      filename: filenameFromKey(key),
    }))
  );
}

export default async function BookingLinkPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ deposit?: string; final?: string }>;
}) {
  const { token } = await params;
  const { deposit, final: finalReturn } = await searchParams;

  const [booking] = await db.select().from(bookings).where(eq(bookings.bookingToken, token)).limit(1);

  if (!booking) {
    notFound();
  }

  const needsTimeSelection = booking.status === "pending" && !booking.requestedStartAt;

  // Presigned URLs are generated fresh on every load and never stored —
  // gated purely by the booking's current status, checked here before any
  // URL is ever signed.
  const previewPhotoUrls =
    booking.status === "preview_ready" ? await urlsForKeys(booking.previewPhotoKeys ?? []) : [];
  const previewVideoUrl =
    booking.status === "preview_ready" && booking.previewVideoKey
      ? await createPresignedDownloadUrl(booking.previewVideoKey, filenameFromKey(booking.previewVideoKey))
      : undefined;
  const downloadPhotoUrls =
    booking.status === "completed" ? await urlsForKeys(booking.originalPhotoKeys ?? []) : [];
  const downloadVideoUrls =
    booking.status === "completed" ? await urlsForKeys(booking.masterVideoKeys ?? []) : [];

  // The photo/video gallery needs real room — widen the container for those
  // two states rather than cramming a masonry grid into the narrow column
  // used by every other status.
  const isGalleryState = booking.status === "preview_ready" || booking.status === "completed";

  return (
    <div className={`mx-auto px-6 py-20 md:px-10 md:py-28 ${isGalleryState ? "max-w-6xl" : "max-w-3xl"}`}>
      <Reveal>
        <Eyebrow>Your Booking</Eyebrow>
        <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">
          {needsTimeSelection ? "Pick a Time" : "Booking Status"}
        </h1>
        <p className="mt-4 text-fg-muted">
          {needsTimeSelection
            ? "Choose one or two times that could work for you — we'll confirm whichever fits best, along with the exact duration, once we review your project."
            : "This link stays the same through the whole process — bookmark it to check back anytime."}
        </p>
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-14 border-t border-border pt-12">
          {needsTimeSelection ? (
            <AvailabilityPicker bookingToken={booking.bookingToken} />
          ) : (
            <BookingProgress
              booking={booking}
              depositReturnStatus={deposit}
              finalReturnStatus={finalReturn}
              previewPhotoUrls={previewPhotoUrls}
              previewVideoUrl={previewVideoUrl}
              downloadPhotoUrls={downloadPhotoUrls}
              downloadVideoUrls={downloadVideoUrls}
            />
          )}
        </div>
      </Reveal>
    </div>
  );
}
