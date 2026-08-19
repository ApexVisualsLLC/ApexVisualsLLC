const NOISE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export default function GrainOverlay() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -inset-12 z-[60] opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: `url("${NOISE_SVG}")`,
          animation: "grain-shift 0.5s steps(10) infinite",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[59]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(6,4,2,0.55) 100%)",
        }}
      />
    </>
  );
}
