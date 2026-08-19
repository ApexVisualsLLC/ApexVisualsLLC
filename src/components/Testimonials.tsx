/* REPLACE: swap in real client testimonials before launch — these are placeholder templates */
const testimonials = [
  {
    quote: "Add a real client quote here about the quality of the footage and how easy the process was.",
    name: "Client Name",
    role: "Business Type, City",
  },
  {
    quote: "Add a real client quote here about turnaround time or the impact the content had on their brand.",
    name: "Client Name",
    role: "Business Type, City",
  },
  {
    quote: "Add a real client quote here — ideally from a monthly retainer client speaking to consistency.",
    name: "Client Name",
    role: "Business Type, City",
  },
];

export default function Testimonials() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {testimonials.map((t, i) => (
        <figure key={i} className="flex flex-col rounded-2xl border border-border p-8">
          <span className="font-serif text-4xl leading-none text-fg-faint">&ldquo;</span>
          <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">
            {t.quote}
          </blockquote>
          <figcaption className="mt-6 border-t border-border pt-4 text-sm">
            <span className="block font-medium text-fg">{t.name}</span>
            <span className="text-fg-faint">{t.role}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
