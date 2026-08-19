export default function BookingStatus({ className = "" }: { className?: string }) {
  return (
    <p
      className={`inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-fg-faint ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fg opacity-40" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-fg" />
      </span>
      Now Booking New Projects
    </p>
  );
}
