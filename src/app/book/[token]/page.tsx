import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db/client";
import { bookings } from "@/lib/db/schema";
import AvailabilityPicker from "@/components/booking/AvailabilityPicker";
import BookingProgress from "@/components/booking/BookingProgress";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Your Booking — Apex Visuals LLC",
  robots: { index: false, follow: false },
};

export default async function BookingLinkPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ deposit?: string }>;
}) {
  const { token } = await params;
  const { deposit } = await searchParams;

  const [booking] = await db.select().from(bookings).where(eq(bookings.bookingToken, token)).limit(1);

  if (!booking) {
    notFound();
  }

  const needsTimeSelection = booking.status === "pending" && !booking.requestedStartAt;

  return (
    <div className="mx-auto max-w-3xl px-6 py-20 md:px-10 md:py-28">
      <Reveal>
        <Eyebrow>Your Booking</Eyebrow>
        <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">
          {needsTimeSelection ? "Pick a Time" : "Booking Status"}
        </h1>
        <p className="mt-4 text-fg-muted">
          {needsTimeSelection
            ? "Choose a start time that works for you — we'll confirm the exact duration once we review your project."
            : "This link stays the same through the whole process — bookmark it to check back anytime."}
        </p>
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-14 border-t border-border pt-12">
          {needsTimeSelection ? (
            <AvailabilityPicker bookingToken={booking.bookingToken} />
          ) : (
            <BookingProgress booking={booking} depositReturnStatus={deposit} />
          )}
        </div>
      </Reveal>
    </div>
  );
}
