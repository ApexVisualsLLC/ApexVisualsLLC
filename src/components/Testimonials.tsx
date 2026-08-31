/* REPLACE: add more testimonials as Russell collects them — currently 2 of a planned 3+ */
const testimonials = [
  {
    quote:
      "Russell's aerial footage of our water park and campgrounds is some of the best marketing content we've ever had — guests see it and want to book a stay before they've even finished watching.",
    name: "Jellystone Zion Park",
    role: "Family Resort & Water Park, St. George, UT",
  },
  {
    quote:
      "From the campsites to the sunset views, Russell's drone work captures exactly what makes staying with us special. It's become a go-to for our marketing.",
    name: "Glampers RV",
    role: "RV & Glamping Resort, St. George, UT",
  },
];

export default function Testimonials() {
  return (
    <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
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
