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
      className={`flex ${
        labelPosition === "bottom" ? "items-end pb-10" : "items-center"
      } justify-center bg-gradient-to-br from-[#1c1c1c] via-[#111111] to-[#0a0a0a] ${className}`}
      role="img"
      aria-label={label}
    >
      <span className="max-w-[80%] text-center text-xs uppercase tracking-[0.25em] text-fg-faint/60">
        {label}
      </span>
    </div>
  );
}

export function VideoThumb({
  title,
  location,
  category,
  className = "",
}: {
  title: string;
  location: string;
  category: string;
  className?: string;
}) {
  return (
    <div
      className={`group relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-[#1c1c1c] via-[#131313] to-[#0a0a0a] ${className}`}
    >
      {/* REPLACE: YouTube embed URL — [Commercial/Aerial/Cinematic] */}
      <span className="absolute left-4 top-4 text-[10px] uppercase tracking-[0.2em] text-fg-faint">
        {category}
      </span>

      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-fg/30 transition-transform duration-300 group-hover:scale-110 group-hover:border-fg/70">
        <svg
          viewBox="0 0 24 24"
          className="ml-1 h-5 w-5 fill-fg"
          aria-hidden="true"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <p className="text-sm font-medium text-fg">{title}</p>
        <p className="text-xs text-fg-faint">{location}</p>
      </div>
    </div>
  );
}
