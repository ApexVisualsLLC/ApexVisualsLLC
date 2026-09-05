type PhotoUrl = { url: string; filename: string };

export default function CompletedDownloads({
  photos,
  videoUrl,
  videoFilename,
}: {
  photos: PhotoUrl[];
  videoUrl?: string;
  videoFilename?: string;
}) {
  return (
    <div className="space-y-3">
      {videoUrl && (
        <a
          href={videoUrl}
          download
          className="flex items-center justify-between rounded-xl border border-border px-5 py-3.5 text-sm font-medium text-fg transition-colors hover:border-fg/40"
        >
          <span>{videoFilename ?? "Full-quality video"}</span>
          <span className="text-fg-faint">Download</span>
        </a>
      )}
      {photos.map((photo) => (
        <a
          key={photo.filename}
          href={photo.url}
          download
          className="flex items-center justify-between rounded-xl border border-border px-5 py-3.5 text-sm font-medium text-fg transition-colors hover:border-fg/40"
        >
          <span>{photo.filename}</span>
          <span className="text-fg-faint">Download</span>
        </a>
      ))}
    </div>
  );
}
