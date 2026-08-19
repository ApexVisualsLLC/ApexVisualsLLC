const faqs = [
  {
    question: "What areas do you serve?",
    answer:
      "Primarily Provo, Orem, Lehi, and the rest of Utah County. We're happy to travel for larger projects elsewhere in Utah — just mention your location when you reach out.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Aerial photography is typically delivered within 5 business days, cinematic video within 7. Need it sooner? Rush delivery within 48 hours is available for an additional 50% fee.",
  },
  {
    question: "What happens if weather delays my shoot?",
    answer:
      "Safety comes first. If wind, rain, or visibility make flying unsafe, we'll reschedule at no additional charge.",
  },
  {
    /* REPLACE: confirm exact usage-rights / licensing terms before launch */
    question: "Who owns the final footage?",
    answer:
      "You receive full usage rights to your delivered content for marketing and promotional use.",
  },
  {
    question: "Is the \"starting at\" price what I'll actually pay?",
    answer:
      "The prices listed are starting points for typical project scope. Once you tell us about your project through our contact form, we'll review the details and send a clear, no-obligation quote before you commit to anything.",
  },
  {
    question: "Is there a minimum project fee?",
    answer:
      "Yes — every project has a $175 minimum. Even a small shoot involves travel, flight time, licensed piloting, and editing, so this covers the baseline cost of doing it right.",
  },
  {
    question: "Do you offer monthly retainers?",
    answer:
      "Yes — ongoing monthly content partnerships are a core part of what we do. See the Social Media Content packages above for details.",
  },
];

export default function Faq() {
  return (
    <div className="divide-y divide-border rounded-2xl border border-border">
      {faqs.map((faq) => (
        <details key={faq.question} className="group px-6 py-5 open:pb-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-fg marker:content-none">
            {faq.question}
            <span className="shrink-0 text-xl text-fg-faint transition-transform duration-300 group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
