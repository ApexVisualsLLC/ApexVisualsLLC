const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "5", label: "Professional Cameras & Drones" },
  { value: "100%", label: "FAA Part 107 Compliant" },
];

export default function StatsBar() {
  return (
    <div className="grid grid-cols-3 gap-8">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="font-serif text-4xl font-bold sm:text-5xl">{stat.value}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.15em] text-fg-faint">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
