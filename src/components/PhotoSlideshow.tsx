"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const FILM_GRADE = "[filter:sepia(0.22)_contrast(1.08)_saturate(1.05)_brightness(0.96)]";
const INTERVAL_MS = 5500;

type Photo = { src: string; alt: string; caption: string };

const photos: Photo[] = [
  {
    src: "/gallery/aerial-01.jpg",
    alt: "Aerial drone photo of a water park pool complex in Utah, captured by Apex Visuals LLC",
    caption: "Water park pool complex",
  },
  {
    src: "/gallery/aerial-02.jpg",
    alt: "Aerial drone photo of a lazy river and pool deck at a Utah water park",
    caption: "Lazy river and pool deck",
  },
  {
    src: "/gallery/aerial-03.jpg",
    alt: "Aerial drone photo of water slides at a Utah water park resort",
    caption: "Water slides at the resort",
  },
];

export default function PhotoSlideshow() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timerRef.current = window.setInterval(() => {
      setActive((i) => (i + 1) % photos.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timerRef.current);
  }, []);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
      {photos.map((photo, i) => (
        <Image
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          fill
          quality={90}
          sizes="(min-width: 1024px) 900px, 100vw"
          className={`object-cover ${FILM_GRADE}`}
          style={{
            opacity: i === active ? 1 : 0,
            transform: i === active ? "scale(1.05)" : "scale(1)",
            transition: "opacity 1.2s ease-in-out, transform 7s ease-out",
          }}
        />
      ))}

      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/5 bg-gradient-to-b from-black/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-black/50 to-transparent" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at center, transparent 45%, rgba(8,5,3,0.5) 100%)",
        }}
      />

      <p className="absolute right-4 top-4 font-mono text-[11px] tracking-wider text-fg-faint">
        {String(active + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
      </p>
      <p className="absolute bottom-4 left-4 font-serif text-base font-medium text-fg">
        {photos[active].caption}
      </p>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-1.5">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            aria-label={`Show ${photo.caption}`}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-5 bg-fg" : "w-1.5 bg-fg/30 hover:bg-fg/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
