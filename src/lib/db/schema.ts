import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";

/**
 * `status` is plain text (validated by BOOKING_STATUSES below), not a Postgres
 * enum type — new statuses are a one-line code change and no migration,
 * instead of an ALTER TYPE.
 */
export const BOOKING_STATUSES = ["pending", "accepted", "deposit_paid", "declined"] as const;
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
  totalPriceCents: integer("total_price_cents"),
  depositAmountCents: integer("deposit_amount_cents"),
  depositPaidAt: timestamp("deposit_paid_at", { withTimezone: true }),
  stripeCheckoutSessionId: text("stripe_checkout_session_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  calendarEventId: text("calendar_event_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  declinedAt: timestamp("declined_at", { withTimezone: true }),
});

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;

export const EMAIL_TYPES = ["acceptance", "deposit_confirmation", "decline"] as const;
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

export const CALENDAR_SYNC_STATUSES = ["created", "failed"] as const;
export type CalendarSyncStatus = (typeof CALENDAR_SYNC_STATUSES)[number];

/**
 * Sibling to bookingEmailLog, not a repurposing of it — emailType is
 * domain-specific to email and the table is already live in production.
 * Same "latest row per booking" query pattern is used for both.
 */
export const bookingCalendarSyncLog = pgTable("booking_calendar_sync_log", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id")
    .notNull()
    .references(() => bookings.id),
  status: text("status").notNull(),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type BookingCalendarSyncLog = typeof bookingCalendarSyncLog.$inferSelect;
export type NewBookingCalendarSyncLog = typeof bookingCalendarSyncLog.$inferInsert;

/**
 * Dedupe/audit for Stripe webhook redelivery — Stripe delivers at-least-once,
 * so processed event ids are recorded to make redelivery a no-op instead of
 * reprocessing (e.g. re-sending an email) a second time.
 */
export const stripeWebhookEvents = pgTable("stripe_webhook_events", {
  id: serial("id").primaryKey(),
  stripeEventId: text("stripe_event_id").notNull().unique(),
  eventType: text("event_type").notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true }).notNull().defaultNow(),
});

export type StripeWebhookEvent = typeof stripeWebhookEvents.$inferSelect;
export type NewStripeWebhookEvent = typeof stripeWebhookEvents.$inferInsert;
