import Reveal from "@/components/Reveal";

type Point = { title: string; description: string; icon: React.ReactNode };

const points: Point[] = [
  {
    title: "You Own Your Footage",
    description:
      "Every delivered project comes with full usage rights for marketing and promotional use — no restrictive licensing to navigate.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3l7 3.2v5.3c0 4.6-3 8.8-7 10-4-1.2-7-5.4-7-10V6.2L12 3z"
      />
    ),
  },
  {
    title: "One Point of Contact",
    description:
      "You work directly with the person flying, filming, and editing your project — from the first message to final delivery.",
    icon: (
      <>
        <circle cx="12" cy="8" r="3.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 20c1-3.5 4-5.5 6.5-5.5s5.5 2 6.5 5.5" />
      </>
    ),
  },
  {
    title: "Clear Quotes, No Surprises",
    description:
      "Tell us about your project and get a straightforward quote before you commit to anything — every time.",
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 3.5h10v17l-2.5-1.6-2.5 1.6-2.5-1.6L7 20.5v-17z" />
        <path strokeLinecap="round" d="M9.25 8.5h5.5M9.25 12h5.5" />
      </>
    ),
  },
  {
    title: "Real Utah Terrain",
    description:
      "Zion, Southern Utah red rock, and Utah County water parks — shot on location, not stock footage.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 18l5.5-8 4 5 2-3L21 18H3z"
      />
    ),
  },
];

export default function WhyApexVisuals() {
  return (
    <div className="grid gap-10 sm:grid-cols-2">
      {points.map((point, i) => (
        <Reveal key={point.title} delay={i * 100}>
          <div className="flex gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="h-6 w-6 text-fg"
              >
                {point.icon}
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{point.description}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
