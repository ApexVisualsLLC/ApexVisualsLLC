export type Step = { number: string; title: string; description: string };

const defaultSteps: Step[] = [
  {
    number: "01",
    title: "Tell Us Your Vision",
    description: "Reach out with your project — real estate listing, brand film, or a monthly retainer.",
  },
  {
    number: "02",
    title: "We Fly & Film",
    description: "Licensed drone and cinema gear on location, capturing exactly what your brand needs.",
  },
  {
    number: "03",
    title: "We Edit & Color Grade",
    description: "Every shot is cut, graded, and polished to a cinematic standard before it reaches you.",
  },
  {
    number: "04",
    title: "You Receive & Post",
    description: "Delivered ready to publish — usually within 5-7 business days.",
  },
];

export default function ProcessSteps({ steps = defaultSteps }: { steps?: Step[] }) {
  return (
    <div
      className={`grid gap-10 lg:gap-6 sm:grid-cols-2 ${
        steps.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
      }`}
    >
      {steps.map((step) => (
        <div key={step.number} className="border-t border-fg/20 pt-6">
          <span className="font-serif text-3xl font-bold text-fg-faint">{step.number}</span>
          <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">{step.description}</p>
        </div>
      ))}
    </div>
  );
}
