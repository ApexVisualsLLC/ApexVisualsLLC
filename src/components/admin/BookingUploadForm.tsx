"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  confirmUploadsComplete,
  generateWatermarkedPreviews,
  requestUploadUrls,
  type ConfirmedUpload,
  type UploadFileRequest,
} from "@/app/admin/bookings/[id]/actions";
import type { UploadSlot } from "@/lib/storage/keys";

function uploadFileWithProgress(
  url: string,
  file: File,
  onProgress: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed with status ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(file);
  });
}

export default function BookingUploadForm({
  bookingId,
  existingPhotoCount,
  hasPreviewVideo,
  masterVideoCount,
  hasGeneratedPreviews,
}: {
  bookingId: number;
  existingPhotoCount: number;
  hasPreviewVideo: boolean;
  masterVideoCount: number;
  hasGeneratedPreviews: boolean;
}) {
  const router = useRouter();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const previewVideoInputRef = useRef<HTMLInputElement>(null);
  const masterVideoInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  async function handleUpload() {
    setError(null);
    setUploadMessage(null);

    const photoFiles = Array.from(photoInputRef.current?.files ?? []);
    const previewVideoFile = previewVideoInputRef.current?.files?.[0] ?? null;
    const masterVideoFiles = Array.from(masterVideoInputRef.current?.files ?? []);

    const selected: { slot: UploadSlot; file: File }[] = [
      ...photoFiles.map((file) => ({ slot: "original-photo" as UploadSlot, file })),
      ...(previewVideoFile ? [{ slot: "preview-video" as UploadSlot, file: previewVideoFile }] : []),
      ...masterVideoFiles.map((file) => ({ slot: "master-video" as UploadSlot, file })),
    ];

    if (selected.length === 0) {
      setError("Choose at least one file to upload.");
      return;
    }

    setIsUploading(true);
    try {
      const fileRequests: UploadFileRequest[] = selected.map(({ slot, file }) => ({
        slot,
        filename: file.name,
        contentType: file.type,
        sizeBytes: file.size,
      }));

      const { uploads, error: requestError } = await requestUploadUrls(bookingId, fileRequests);
      if (requestError || !uploads) {
        setError(requestError ?? "Could not prepare uploads.");
        return;
      }

      await Promise.all(
        uploads.map((upload, i) =>
          uploadFileWithProgress(upload.uploadUrl, selected[i].file, (percent) =>
            setProgress((prev) => ({ ...prev, [selected[i].file.name]: percent }))
          )
        )
      );

      const confirmed: ConfirmedUpload[] = uploads.map((u) => ({ slot: u.slot, key: u.key }));
      const { error: confirmError } = await confirmUploadsComplete(bookingId, confirmed);
      if (confirmError) {
        setError(confirmError);
        return;
      }

      setUploadMessage(`Uploaded ${selected.length} file${selected.length === 1 ? "" : "s"} successfully.`);
      if (photoInputRef.current) photoInputRef.current.value = "";
      if (previewVideoInputRef.current) previewVideoInputRef.current.value = "";
      if (masterVideoInputRef.current) masterVideoInputRef.current.value = "";
      setProgress({});
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleGeneratePreviews() {
    setError(null);
    setUploadMessage(null);
    setIsGenerating(true);
    try {
      const { error: genError } = await generateWatermarkedPreviews(bookingId);
      if (genError) {
        setError(genError);
        return;
      }
      setUploadMessage("Watermarked previews generated — the client's gallery is now live.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Preview generation failed.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border p-6">
        <p className="text-sm text-fg-muted">
          {existingPhotoCount} photo{existingPhotoCount === 1 ? "" : "s"} uploaded so far · preview
          video {hasPreviewVideo ? "✓" : "not uploaded"} · {masterVideoCount} master video
          {masterVideoCount === 1 ? "" : "s"} uploaded
        </p>

        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-fg-muted">Edited full-quality photos</span>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              multiple
              className="mt-2 w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm text-fg outline-none file:mr-4 file:rounded-full file:border-0 file:bg-fg file:px-4 file:py-2 file:text-xs file:font-semibold file:text-bg"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-fg-muted">
              Preview video (optional — your own watermarked/lower-res export)
            </span>
            <input
              ref={previewVideoInputRef}
              type="file"
              accept="video/*"
              className="mt-2 w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm text-fg outline-none file:mr-4 file:rounded-full file:border-0 file:bg-fg file:px-4 file:py-2 file:text-xs file:font-semibold file:text-bg"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-fg-muted">
              Full-quality master video(s) (optional — select multiple if you have several)
            </span>
            <input
              ref={masterVideoInputRef}
              type="file"
              accept="video/*"
              multiple
              className="mt-2 w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm text-fg outline-none file:mr-4 file:rounded-full file:border-0 file:bg-fg file:px-4 file:py-2 file:text-xs file:font-semibold file:text-bg"
            />
          </label>

          {Object.entries(progress).length > 0 && (
            <div className="space-y-2">
              {Object.entries(progress).map(([filename, percent]) => (
                <div key={filename} className="text-xs text-fg-faint">
                  {filename}: {percent}%
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="rounded-full bg-fg px-6 py-3 text-sm font-semibold text-bg transition-opacity hover:opacity-85 disabled:opacity-40"
          >
            {isUploading ? "Uploading…" : "Upload Files"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border p-6">
        <p className="text-sm text-fg-muted">
          {hasGeneratedPreviews
            ? "Previews already generated. Re-run this after uploading a replacement photo to update the client's gallery."
            : "Once photos are uploaded, generate the watermarked preview gallery the client will see."}
        </p>
        <button
          type="button"
          onClick={handleGeneratePreviews}
          disabled={isGenerating || existingPhotoCount === 0}
          className="mt-4 rounded-full border border-border px-6 py-3 text-sm font-semibold text-fg transition-colors hover:border-fg disabled:opacity-40"
        >
          {isGenerating ? "Generating…" : hasGeneratedPreviews ? "Regenerate Previews" : "Generate Previews"}
        </button>
      </div>

      {error && <p className="text-sm text-fg">{error}</p>}
      {uploadMessage && <p className="text-sm text-fg-muted">{uploadMessage}</p>}
    </div>
  );
}
