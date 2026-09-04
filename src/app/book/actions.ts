"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { bookings } from "@/lib/db/schema";
import { generateBookingToken } from "@/lib/booking/token";
import { intakeSchema } from "@/lib/booking/validation";

export type IntakeFormState = {
  error?: string;
};

export async function createBooking(
  _prevState: IntakeFormState,
  formData: FormData
): Promise<IntakeFormState> {
  const parsed = intakeSchema.safeParse({
    package: formData.get("package"),
    clientName: formData.get("clientName"),
    clientEmail: formData.get("clientEmail"),
    clientPhone: formData.get("clientPhone"),
    projectDetails: formData.get("projectDetails"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your info and try again." };
  }

  const bookingToken = generateBookingToken();

  await db.insert(bookings).values({
    bookingToken,
    status: "pending",
    package: parsed.data.package,
    clientName: parsed.data.clientName,
    clientEmail: parsed.data.clientEmail,
    clientPhone: parsed.data.clientPhone,
    projectDetails: parsed.data.projectDetails,
  });

  redirect(`/book/${bookingToken}`);
}
