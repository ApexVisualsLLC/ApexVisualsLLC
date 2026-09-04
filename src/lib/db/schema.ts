import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";

/**
 * `status` is plain text (validated by BOOKING_STATUSES below), not a Postgres
 * enum type — later phases add statuses like "deposit_paid" with a one-line
 * code change and no migration, instead of an ALTER TYPE.
 */
export const BOOKING_STATUSES = ["pending", "accepted", "declined"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const BOOKING_PACKAGES = ["20-photos", "photo-video-bundle", "other"] as const;
export type BookingPackage = (typeof BOOKING_PACKAGES)[number];

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  bookingToken: text("booking_token").notNull().unique(),
  status: text("status").notNull().default("pending"),
  package: text("package").notNull(),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  clientPhone: text("client_phone"),
  projectDetails: text("project_details").notNull(),
  requestedStartAt: timestamp("requested_start_at", { withTimezone: true }),
  durationMinutes: integer("duration_minutes"),
  declineReason: text("decline_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  declinedAt: timestamp("declined_at", { withTimezone: true }),
});

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;

export const EMAIL_TYPES = ["acceptance"] as const;
export type EmailType = (typeof EMAIL_TYPES)[number];

export const EMAIL_LOG_STATUSES = ["sent", "failed"] as const;
export type EmailLogStatus = (typeof EMAIL_LOG_STATUSES)[number];

export const bookingEmailLog = pgTable("booking_email_log", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id")
    .notNull()
    .references(() => bookings.id),
  emailType: text("email_type").notNull(),
  status: text("status").notNull(),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type BookingEmailLog = typeof bookingEmailLog.$inferSelect;
export type NewBookingEmailLog = typeof bookingEmailLog.$inferInsert;
