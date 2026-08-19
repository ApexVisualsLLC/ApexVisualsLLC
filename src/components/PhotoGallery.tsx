import Image from "next/image";

const FILM_GRADE = "[filter:sepia(0.2)_contrast(1.05)_saturate(1.05)]";

export type GalleryPhoto = { src: string; alt: string; caption?: string };

export default function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  return (
    <div className="relative">
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {photos.map((photo, i) => (
          <div
            key={photo.src}
            className="group relative h-64 w-[70%] shrink-0 snap-start overflow-hidden rounded-2xl border border-border sm:h-80 sm:w-[42%] lg:w-[30%]"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 42vw, 70vw"
              className={`object-cover transition-transform duration-500 group-hover:scale-105 ${FILM_GRADE}`}
            />
            {photo.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-sm font-medium text-fg">{photo.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-fg-faint sm:hidden">
        Swipe to see more →
      </p>
    </div>
  );
}
