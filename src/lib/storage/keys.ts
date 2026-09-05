import "server-only";

export const UPLOAD_SLOTS = ["original-photo", "preview-video", "master-video"] as const;
export type UploadSlot = (typeof UPLOAD_SLOTS)[number];

/** Strips anything that isn't safe in an R2 object key or a Content-Disposition filename. */
function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-200);
}

/**
 * Deterministic, not random — re-uploading the same filename overwrites the
 * same object, which is what makes "let Russell redo a mistake" simple with
 * no extra data-model work. Keyed by numeric booking id (never itself
 * secret, but also never exposed anywhere) rather than the booking token, to
 * keep the unguessable token out of storage-layer paths/logs entirely.
 */
export function buildObjectKey(bookingId: number, slot: UploadSlot, filename: string): string {
  const safeName = sanitizeFilename(filename);
  const folder =
    slot === "original-photo" ? "original" : slot === "preview-video" ? "video-preview" : "video-master";
  return `bookings/${bookingId}/${folder}/${safeName}`;
}

export function buildPreviewPhotoKey(bookingId: number, originalKey: string): string {
  const filename = originalKey.split("/").pop() ?? originalKey;
  const baseName = filename.replace(/\.[^.]+$/, "");
  return `bookings/${bookingId}/preview/${baseName}.jpg`;
}

export function filenameFromKey(key: string): string {
  return key.split("/").pop() ?? key;
}
