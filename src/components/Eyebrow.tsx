export default function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-fg-faint ${className}`}
    >
      <span className="h-px w-6 bg-fg-faint" />
      {children}
    </p>
  );
}
