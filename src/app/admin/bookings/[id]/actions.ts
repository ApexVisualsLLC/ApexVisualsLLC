"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq, inArray } from "drizzle-orm";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { db } from "@/lib/db/client";
import { bookingEmailLog, bookings } from "@/lib/db/schema";
import { verifyAdminSession } from "@/lib/auth/dal";
import { createPresignedUploadUrl, objectExists } from "@/lib/storage/presign";
import { buildObjectKey, buildPreviewPhotoKey, UPLOAD_SLOTS, type UploadSlot } from "@/lib/storage/keys";
import { getR2Client, getR2BucketName } from "@/lib/storage/r2-client";
import { watermarkPhoto } from "@/lib/photos/watermark";
import { sendPreviewReadyEmail } from "@/lib/email/send-preview-ready-email";

async function requireAdmin(): Promise<void> {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    redirect("/admin");
  }
}

const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "video/x-m4v",
]);
// Generous ceiling — a full-quality drone video master is the largest file
// this ever needs to accept.
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 * 1024;

const UPLOAD_ELIGIBLE_STATUSES = ["deposit_paid", "preview_ready"] as const;

export type UploadFileRequest = {
  slot: UploadSlot;
  filename: string;
  contentType: string;
  sizeBytes: number;
};

export type PresignedUpload = {
  slot: UploadSlot;
  key: string;
  uploadUrl: string;
};

export async function requestUploadUrls(
  bookingId: number,
  files: UploadFileRequest[]
): Promise<{ uploads?: PresignedUpload[]; error?: string }> {
  await requireAdmin();

  const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1);
  if (!booking) return { error: "Booking not found." };
  if (!UPLOAD_ELIGIBLE_STATUSES.includes(booking.status as (typeof UPLOAD_ELIGIBLE_STATUSES)[number])) {
    return { error: "This booking isn't ready for file uploads." };
  }

  const uploads: PresignedUpload[] = [];
  for (const file of files) {
    if (!(UPLOAD_SLOTS as readonly string[]).includes(file.slot)) {
      return { error: `Invalid upload slot: ${file.slot}` };
    }
    if (!ALLOWED_CONTENT_TYPES.has(file.contentType)) {
      return { error: `Unsupported file type: ${file.contentType}` };
    }
    if (file.sizeBytes <= 0 || file.sizeBytes > MAX_FILE_SIZE_BYTES) {
      return { error: `File too large: ${file.filename}` };
    }

    const key = buildObjectKey(bookingId, file.slot, file.filename);
    const uploadUrl = await createPresignedUploadUrl(key, file.contentType);
    uploads.push({ slot: file.slot, key, uploadUrl });
  }

  return { uploads };
}

export type ConfirmedUpload = { slot: UploadSlot; key: string };

export async function confirmUploadsComplete(
  bookingId: number,
  uploaded: ConfirmedUpload[]
): Promise<{ ok?: boolean; error?: string }> {
  await requireAdmin();

  const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1);
  if (!booking) return { error: "Booking not found." };
  if (!UPLOAD_ELIGIBLE_STATUSES.includes(booking.status as (typeof UPLOAD_ELIGIBLE_STATUSES)[number])) {
    return { error: "This booking isn't ready for file uploads." };
  }

  for (const item of uploaded) {
    if (!(await objectExists(item.key))) {
      return { error: `Upload didn't complete for ${item.key.split("/").pop()}.` };
    }
  }

  const newOriginalPhotoKeys = uploaded.filter((u) => u.slot === "original-photo").map((u) => u.key);
  const newPreviewVideoKey = uploaded.find((u) => u.slot === "preview-video")?.key;
  const newMasterVideoKeys = uploaded.filter((u) => u.slot === "master-video").map((u) => u.key);

  const mergedOriginalPhotoKeys = Array.from(
    new Set([...(booking.originalPhotoKeys ?? []), ...newOriginalPhotoKeys])
  );
  const mergedMasterVideoKeys = Array.from(
    new Set([...(booking.masterVideoKeys ?? []), ...newMasterVideoKeys])
  );

  await db
    .update(bookings)
    .set({
      originalPhotoKeys: mergedOriginalPhotoKeys,
      previewVideoKey: newPreviewVideoKey ?? booking.previewVideoKey,
      masterVideoKeys: mergedMasterVideoKeys,
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, bookingId));

  revalidatePath(`/admin/bookings/${bookingId}`);
  return { ok: true };
}

/**
 * Separate, explicit, re-clickable action — deliberately not folded into
 * confirmUploadsComplete, so a watermarking failure never means re-uploading
 * anything. Matches the existing retryEmail/retryCalendarSync recovery
 * pattern already used throughout this admin panel.
 */
export async function generateWatermarkedPreviews(
  bookingId: number
): Promise<{ ok?: boolean; error?: string }> {
  await requireAdmin();

  const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1);
  if (!booking) return { error: "Booking not found." };
  if (!UPLOAD_ELIGIBLE_STATUSES.includes(booking.status as (typeof UPLOAD_ELIGIBLE_STATUSES)[number])) {
    return { error: "This booking isn't ready for preview generation." };
  }
  const originalKeys = booking.originalPhotoKeys ?? [];
  if (originalKeys.length === 0) {
    return { error: "Upload at least one photo before generating previews." };
  }

  const r2 = getR2Client();
  const bucket = getR2BucketName();
  const CONCURRENCY = 5;
  const previewKeys: string[] = [];

  try {
    for (let i = 0; i < originalKeys.length; i += CONCURRENCY) {
      const batch = originalKeys.slice(i, i + CONCURRENCY);
      const batchResults = await Promise.all(
        batch.map(async (originalKey) => {
          const getResult = await r2.send(new GetObjectCommand({ Bucket: bucket, Key: originalKey }));
          if (!getResult.Body) {
            throw new Error(`No data returned for ${originalKey}`);
          }
          const originalBuffer = Buffer.from(await getResult.Body.transformToByteArray());
          const watermarkedBuffer = await watermarkPhoto(originalBuffer);
          const previewKey = buildPreviewPhotoKey(bookingId, originalKey);
          await r2.send(
            new PutObjectCommand({
              Bucket: bucket,
              Key: previewKey,
              Body: watermarkedBuffer,
              ContentType: "image/jpeg",
            })
          );
          return previewKey;
        })
      );
      previewKeys.push(...batchResults);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown watermarking error";
    console.error("Watermark generation failed:", message);
    return { error: `Watermarking failed: ${message}. Nothing you already uploaded is lost — just try again.` };
  }

  const now = new Date();
  // Two separate guarded updates: the first always refreshes the preview
  // keys (safe to re-run after the first success too), the second only
  // flips status the first time — a single combined WHERE status=
  // 'deposit_paid' guard would silently skip refreshing previewPhotoKeys on
  // every re-run after the first.
  await db
    .update(bookings)
    .set({ previewPhotoKeys: previewKeys, previewReadyAt: now, updatedAt: now })
    .where(and(eq(bookings.id, bookingId), inArray(bookings.status, [...UPLOAD_ELIGIBLE_STATUSES])));

  await db
    .update(bookings)
    .set({ status: "preview_ready", updatedAt: now })
    .where(and(eq(bookings.id, bookingId), eq(bookings.status, "deposit_paid")));

  const [current] = await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1);
  if (current && current.status === "preview_ready") {
    const [sentEmail] = await db
      .select({ id: bookingEmailLog.id })
      .from(bookingEmailLog)
      .where(
        and(
          eq(bookingEmailLog.bookingId, current.id),
          eq(bookingEmailLog.emailType, "preview_ready"),
          eq(bookingEmailLog.status, "sent")
        )
      )
      .limit(1);
    if (!sentEmail) {
      await sendPreviewReadyEmail(current);
    }
  }

  revalidatePath(`/admin/bookings/${bookingId}`);
  revalidatePath("/admin");
  return { ok: true };
}
