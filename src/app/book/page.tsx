import type { Metadata } from "next";
import IntakeForm from "@/components/booking/IntakeForm";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Book a Project — Apex Visuals LLC",
  robots: { index: false, follow: false },
};

export default function BookPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 md:px-10 md:py-28">
      <Reveal>
        <Eyebrow>Book a Project</Eyebrow>
        <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Let&apos;s Get You Scheduled</h1>
        <p className="mt-4 text-fg-muted">
          Tell us about your project, then pick a time that works for you. We&apos;ll confirm
          within 24 hours.
        </p>
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-14 border-t border-border pt-12">
          <IntakeForm />
        </div>
      </Reveal>
    </div>
  );
}
