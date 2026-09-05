ALTER TABLE "bookings" ADD COLUMN "master_video_keys" text[];--> statement-breakpoint
UPDATE "bookings" SET "master_video_keys" = ARRAY["master_video_key"] WHERE "master_video_key" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN "master_video_key";