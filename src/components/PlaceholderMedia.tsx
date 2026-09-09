"use client";

import { useState } from "react";
import Image from "next/image";

const LINE_MOTIF =
  "repeating-linear-gradient(115deg, rgba(244,243,240,0.06) 0px, rgba(244,243,240,0.06) 1.5px, transparent 1.5px, transparent 34px)";
const VIGNETTE =
  "radial-gradient(ellipse at center, transparent 35%, rgba(8,5,3,0.55) 100%)";
const FILM_GRADE = "[filter:sepia(0.35)_contrast(1.08)_brightness(0.96)_saturate(1.1)]";

export function PlaceholderPhoto({
  label,
  src,
  alt,
  priority = false,
  className = "",
  labelPosition = "center",
  filterClassName = FILM_GRADE,
  vignette = true,
}: {
  label: string;
  /* Real photo path (e.g. "/hero.jpg"). Omit to show the placeholder gradient + label. */
  src?: string;
  alt?: string;
  priority?: boolean;
  className?: string;
  labelPosition?: "center" | "bottom";
  /* Overrides the default film-grade filter for this instance only. */
  filterClassName?: string;
  /* Set false to skip the default corner-darkening vignette for this instance. */
  vignette?: boolean;
}) {
  return (
    <div
      className={`relative flex overflow-hidden bg-gradient-to-br from-[#231a10] via-[#14100c] to-[#0a0704] ${filterClassName} ${
        labelPosition === "bottom" ? "items-end pb-10" : "items-center"
      } justify-center ${className}`}
      role={src ? undefined : "img"}
      aria-label={src ? undefined : label}
    >
      {src && (
        <Image
          src={src}
          alt={alt || label}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover"
        />
      )}
      {!src && <div className="absolute inset-0" style={{ backgroundImage: LINE_MOTIF }} />}
      {vignette && <div className="absolute inset-0" style={{ backgroundImage: VIGNETTE }} />}
      {!src && (
        <span className="relative max-w-[80%] text-center text-xs uppercase tracking-[0.25em] text-fg-faint/60">
          {label}
        </span>
      )}
    </div>
  );
}

export function VideoThumb({
  title,
  location,
  category,
  featured = false,
  photoSrc,
  previewSrc,
  youtubeId,
  vertical = false,
  onClick,
  className = "",
}: {
  title: string;
  location: string;
  category: string;
  featured?: boolean;
  /* Optional static poster photo (e.g. "/desert-road.jpg") shown in place of the gradient
     placeholder — a real still until a video preview/embed is ready. */
  photoSrc?: string;
  /* Optional short muted clip (e.g. "/videos/jellystone-aerial.mp4") that plays on hover.
     Drop files into public/videos/ and pass the path here once real footage is ready —
     until then this stays undefined and the static placeholder is shown. */
  previewSrc?: string;
  /* YouTube video ID — when set, the card becomes clickable and uses the video's own
     thumbnail as the poster (unless photoSrc is also set). Pair with onClick to open
     a VideoLightbox. */
  youtubeId?: string;
  /* Matches the card's aspect ratio to a 9:16 source video. YouTube's own maxres
     thumbnail for a vertical video is a 16:9 canvas with the real footage centered
     and pillarboxed (full-height, blurred bars left/right) — a 9:16 card + object-cover
     crops exactly to that centered footage, so no pillarbox and no content is lost. */
  vertical?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const [poster, setPoster] = useState(
    photoSrc || (youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg` : undefined)
  );

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      aria-label={onClick ? `Play video: ${title}` : undefined}
      className={`group relative flex ${vertical ? "aspect-[9/16]" : "aspect-video"} w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#231a10] via-[#181209] to-[#0a0704] transition-transform duration-300 hover:-translate-y-1 ${FILM_GRADE} ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {poster && (
        <Image
          src={poster}
          alt={title}
          fill
          quality={90}
          sizes={
            featured
              ? "100vw"
              : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          }
          className="object-cover"
          onLoad={(e) => {
            // maxresdefault.jpg 404s to a 120x90 gray placeholder (HTTP 200, not an
            // error) when YouTube hasn't generated a max-res thumb for a video yet —
            // fall back to hqdefault, which always exists, when that happens.
            const img = e.currentTarget;
            if (!photoSrc && youtubeId && img.naturalWidth <= 120) {
              setPoster(`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`);
            }
          }}
        />
      )}
      {!poster && <div className="absolute inset-0" style={{ backgroundImage: LINE_MOTIF }} />}
      <div className="absolute inset-0" style={{ backgroundImage: VIGNETTE }} />
      {previewSrc && (
        <video
          src={previewSrc}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}

      <span
        className={`absolute left-4 top-4 uppercase tracking-[0.2em] text-fg-faint ${
          featured ? "text-xs" : "text-[10px]"
        }`}
      >
        {category}
      </span>

      <span
        className={`relative flex items-center justify-center rounded-full border border-fg/30 shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-110 group-hover:border-fg/70 ${
          featured ? "h-20 w-20" : "h-14 w-14"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className={`ml-1 fill-fg ${featured ? "h-7 w-7" : "h-5 w-5"}`}
          aria-hidden="true"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0a0704]/90 to-transparent p-4">
        <p className={featured ? "text-lg font-medium text-fg" : "text-sm font-medium text-fg"}>
          {title}
        </p>
        <p className="text-xs text-fg-faint">{location}</p>
      </div>
    </div>
  );
}
