import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { bookings, type BookingPackage } from "@/lib/db/schema";
import BookingUploadForm from "@/components/admin/BookingUploadForm";

// Server Actions on this page (file uploads + watermarking) need more
// headroom than Next's default timeout.
export const maxDuration = 60;

export const metadata: Metadata = {
  title: "Manage Files — Apex Visuals LLC",
  robots: { index: false, follow: false },
};

const PACKAGE_LABELS: Record<BookingPackage, string> = {
  "20-photos": "20 Edited Aerial Photos",
  "photo-video-bundle": "20 Photos + Video Bundle",
  other: "Custom Project",
};

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    redirect("/admin");
  }

  const { id } = await params;
  const bookingId = Number(id);
  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    notFound();
  }

  const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1);
  if (!booking) {
    notFound();
  }

  if (booking.status !== "deposit_paid" && booking.status !== "preview_ready") {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-24">
        <h1 className="font-serif text-3xl font-bold">Manage Files</h1>
        <p className="mt-4 text-fg-muted">
          {booking.clientName}&apos;s booking isn&apos;t ready for file uploads yet — it must have a
          paid deposit first (currently: {booking.status}).
        </p>
      </div>
    );
  }

  const packageLabel = PACKAGE_LABELS[booking.package as BookingPackage] ?? booking.package;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-24">
      <h1 className="font-serif text-3xl font-bold">Manage Files</h1>
      <p className="mt-2 text-fg-muted">
        {booking.clientName} — {packageLabel}
      </p>

      <div className="mt-10">
        <BookingUploadForm
          bookingId={booking.id}
          existingPhotoCount={booking.originalPhotoKeys?.length ?? 0}
          hasPreviewVideo={!!booking.previewVideoKey}
          masterVideoCount={booking.masterVideoKeys?.length ?? 0}
          hasGeneratedPreviews={booking.status === "preview_ready"}
        />
      </div>
    </div>
  );
}
