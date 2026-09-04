"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { bookings } from "@/lib/db/schema";
import { chooseStartTimeSchema } from "@/lib/booking/validation";

export type ChooseStartTimeState = {
  error?: string;
};

export async function chooseStartTime(
  _prevState: ChooseStartTimeState,
  formData: FormData
): Promise<ChooseStartTimeState> {
  const parsed = chooseStartTimeSchema.safeParse({
    bookingToken: formData.get("bookingToken"),
    startAt: formData.get("startAt"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please pick a valid time." };
  }

  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.bookingToken, parsed.data.bookingToken))
    .limit(1);

  if (!booking) {
    return { error: "Booking not found." };
  }
  if (booking.status !== "pending" || booking.requestedStartAt) {
    return { error: "This booking has already been scheduled." };
  }

  await db
    .update(bookings)
    .set({ requestedStartAt: parsed.data.startAt, updatedAt: new Date() })
    .where(eq(bookings.id, booking.id));

  revalidatePath(`/book/${parsed.data.bookingToken}`);
  return {};
}
