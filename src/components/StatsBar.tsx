/* REPLACE: confirm real figures with Russell before launch — these are placeholder estimates */
const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "20+", label: "Utah Businesses Served" },
  { value: "5", label: "Day Avg. Turnaround" },
  { value: "100%", label: "FAA Part 107 Compliant" },
];

export default function StatsBar() {
  return (
    <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="font-serif text-4xl font-bold sm:text-5xl">{stat.value}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.15em] text-fg-faint">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
