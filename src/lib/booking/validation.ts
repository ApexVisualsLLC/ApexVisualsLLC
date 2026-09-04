import { z } from "zod";
import { BOOKING_PACKAGES } from "@/lib/db/schema";

export const intakeSchema = z.object({
  package: z.enum(BOOKING_PACKAGES),
  clientName: z.string().trim().min(1, "Name is required").max(200),
  clientEmail: z.string().trim().email("Enter a valid email").max(320),
  clientPhone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((v) => (v ? v : undefined)),
  projectDetails: z.string().trim().min(1, "Tell us about your project").max(4000),
});

export type IntakeInput = z.infer<typeof intakeSchema>;

export const chooseStartTimeSchema = z.object({
  bookingToken: z.string().min(1),
  startAt: z.coerce.date().refine((d) => d.getTime() > Date.now(), {
    message: "That time has already passed",
  }),
});

export const DURATION_OPTIONS_MINUTES = [60, 120, 180] as const;

export const acceptBookingSchema = z.object({
  bookingId: z.coerce.number().int().positive(),
  durationMinutes: z.coerce.number().refine(
    (n) => (DURATION_OPTIONS_MINUTES as readonly number[]).includes(n),
    { message: "Duration must be 1, 2, or 3 hours" }
  ),
});

export const declineBookingSchema = z.object({
  bookingId: z.coerce.number().int().positive(),
  declineReason: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => (v ? v : undefined)),
});
