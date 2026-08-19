const items = ["PROVO", "OREM", "LEHI", "ZION", "MAUI", "UTAH COUNTY", "SOUTHERN UTAH"];

export default function Marquee() {
  return (
    <div className="overflow-hidden border-y border-border py-4">
      <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-8">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-8 text-sm uppercase tracking-[0.3em] text-fg-faint"
          >
            {item}
            <span className="text-fg-faint/40">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
