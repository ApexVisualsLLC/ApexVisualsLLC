type PhotoUrl = { url: string; filename: string };

export default function PreviewGallery({
  photos,
  videoUrl,
}: {
  photos: PhotoUrl[];
  videoUrl?: string;
}) {
  return (
    <div className="space-y-8">
      {videoUrl && (
        <div className="overflow-hidden rounded-2xl bg-black">
          <video controls src={videoUrl} className="aspect-video w-full" />
        </div>
      )}

      {photos.length > 0 && (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {photos.map((photo) => (
            <div key={photo.filename} className="mb-4 break-inside-avoid overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element -- presigned URL, unique per page load, next/image caching buys nothing */}
              <img src={photo.url} alt={photo.filename} className="w-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
