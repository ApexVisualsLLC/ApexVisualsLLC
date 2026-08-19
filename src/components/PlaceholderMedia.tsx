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
}: {
  label: string;
  /* Real photo path (e.g. "/hero.jpg"). Omit to show the placeholder gradient + label. */
  src?: string;
  alt?: string;
  priority?: boolean;
  className?: string;
  labelPosition?: "center" | "bottom";
}) {
  return (
    <div
      className={`relative flex overflow-hidden bg-gradient-to-br from-[#231a10] via-[#14100c] to-[#0a0704] ${FILM_GRADE} ${
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
      <div className="absolute inset-0" style={{ backgroundImage: VIGNETTE }} />
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
  previewSrc,
  className = "",
}: {
  title: string;
  location: string;
  category: string;
  featured?: boolean;
  /* Optional short muted clip (e.g. "/videos/jellystone-aerial.mp4") that plays on hover.
     Drop files into public/videos/ and pass the path here once real footage is ready —
     until then this stays undefined and the static placeholder is shown. */
  previewSrc?: string;
  className?: string;
}) {
  return (
    <div
      className={`group relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-[#231a10] via-[#181209] to-[#0a0704] transition-transform duration-300 hover:-translate-y-1 ${FILM_GRADE} ${className}`}
    >
      {/* REPLACE: YouTube embed URL — [Commercial/Aerial/Cinematic] */}
      <div className="absolute inset-0" style={{ backgroundImage: LINE_MOTIF }} />
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
