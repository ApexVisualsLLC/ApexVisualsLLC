const LINE_MOTIF =
  "repeating-linear-gradient(115deg, rgba(245,245,245,0.055) 0px, rgba(245,245,245,0.055) 1.5px, transparent 1.5px, transparent 34px)";
const VIGNETTE =
  "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.5) 100%)";

export function PlaceholderPhoto({
  label,
  className = "",
  labelPosition = "center",
}: {
  label: string;
  className?: string;
  labelPosition?: "center" | "bottom";
}) {
  return (
    <div
      className={`relative flex overflow-hidden bg-gradient-to-br from-[#1c1c1c] via-[#111111] to-[#0a0a0a] ${
        labelPosition === "bottom" ? "items-end pb-10" : "items-center"
      } justify-center ${className}`}
      role="img"
      aria-label={label}
    >
      <div className="absolute inset-0" style={{ backgroundImage: LINE_MOTIF }} />
      <div className="absolute inset-0" style={{ backgroundImage: VIGNETTE }} />
      <span className="relative max-w-[80%] text-center text-xs uppercase tracking-[0.25em] text-fg-faint/60">
        {label}
      </span>
    </div>
  );
}

export function VideoThumb({
  title,
  location,
  category,
  featured = false,
  className = "",
}: {
  title: string;
  location: string;
  category: string;
  featured?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`group relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-[#1c1c1c] via-[#131313] to-[#0a0a0a] transition-transform duration-300 hover:-translate-y-1 ${className}`}
    >
      {/* REPLACE: YouTube embed URL — [Commercial/Aerial/Cinematic] */}
      <div className="absolute inset-0" style={{ backgroundImage: LINE_MOTIF }} />
      <div className="absolute inset-0" style={{ backgroundImage: VIGNETTE }} />

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

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4">
        <p className={featured ? "text-lg font-medium text-fg" : "text-sm font-medium text-fg"}>
          {title}
        </p>
        <p className="text-xs text-fg-faint">{location}</p>
      </div>
    </div>
  );
}
