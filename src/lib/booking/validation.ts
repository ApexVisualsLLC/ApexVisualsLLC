import { z } from "zod";
import { BOOKING_PACKAGES } from "@/lib/db/schema";

/** Fixed catalog pricing. "other" has no fixed price — Russell sets it at accept time. */
export const CATALOG_PRICE_CENTS: Partial<Record<(typeof BOOKING_PACKAGES)[number], number>> = {
  "20-photos": 17500,
  "photo-video-bundle": 30000,
};

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

/** Treats an empty/missing form field as "not provided" rather than an invalid date. */
const optionalDate = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? undefined : v),
  z.coerce.date().optional()
);

export const chooseStartTimeSchema = z
  .object({
    bookingToken: z.string().min(1),
    startAt: z.coerce.date().refine((d) => d.getTime() > Date.now(), {
      message: "That time has already passed",
    }),
    // Optional second choice — the client can offer one or two times.
    startAtAlt: optionalDate.refine((d) => !d || d.getTime() > Date.now(), {
      message: "That time has already passed",
    }),
  })
  .refine((data) => !data.startAtAlt || data.startAtAlt.getTime() !== data.startAt.getTime(), {
    message: "Pick two different times",
    path: ["startAtAlt"],
  });

export const DURATION_OPTIONS_MINUTES = [60, 120, 180] as const;

export const acceptBookingSchema = z
  .object({
    bookingId: z.coerce.number().int().positive(),
    durationMinutes: z.coerce.number().refine(
      (n) => (DURATION_OPTIONS_MINUTES as readonly number[]).includes(n),
      { message: "Duration must be 1, 2, or 3 hours" }
    ),
    totalPriceDollars: z.coerce.number().positive("Enter a total price"),
    // Which of the client's one or two candidate times Russell is accepting.
    chosenStartAt: optionalDate,
  })
  .transform((data) => ({
    ...data,
    totalPriceCents: Math.round(data.totalPriceDollars * 100),
  }));

export const declineBookingSchema = z.object({
  bookingId: z.coerce.number().int().positive(),
  declineReason: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => (v ? v : undefined)),
});
