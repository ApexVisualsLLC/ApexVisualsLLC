import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { bookings } from "@/lib/db/schema";
import { getAvailableSlots } from "@/lib/availability";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const [booking] = await db.select().from(bookings).where(eq(bookings.bookingToken, token)).limit(1);

  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Only offer new slots while the booking is still awaiting a chosen time.
  if (booking.status !== "pending" || booking.requestedStartAt) {
    return NextResponse.json({ slots: [] });
  }

  try {
    const slots = await getAvailableSlots();
    return NextResponse.json({
      slots: slots.map((slot) => ({
        startAt: slot.startAt.toISOString(),
        sunsetAt: slot.sunsetAt?.toISOString(),
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Failed to load availability:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
