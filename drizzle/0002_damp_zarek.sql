ALTER TABLE "bookings" ADD COLUMN "original_photo_keys" text[];--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "preview_photo_keys" text[];--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "preview_video_key" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "master_video_key" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "preview_ready_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "final_checkout_session_id" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "final_payment_intent_id" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "delivered_at" timestamp with time zone;