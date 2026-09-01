import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import BookingStatus from "@/components/BookingStatus";
import ProcessSteps from "@/components/ProcessSteps";

const quoteSteps = [
  {
    number: "01",
    title: "Tell Us About Your Project",
    description:
      "Share as much detail as you can below — project type, timeline, location, and vision. The more we know, the faster we can quote.",
  },
  {
    number: "02",
    title: "We Review & Follow Up",
    description:
      "We'll look over your details and get back to you within 24 hours — sometimes with a few quick questions to pin down exact scope.",
  },
  {
    number: "03",
    title: "You Get a Custom Quote",
    description:
      "Pricing on our Services page reflects typical starting costs. Once we understand your project, we'll send a clear, no-obligation quote — so you know exactly what to expect before committing to anything.",
  },
];

export const metadata: Metadata = {
  title: "Contact — Apex Visuals LLC | Get a Quote for Drone Photography Utah",
  description:
    "Ready to elevate your brand? Contact Apex Visuals LLC for drone photography, cinematic video, and social media content in Utah. We respond within 24 hours.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — Apex Visuals LLC | Get a Quote for Drone Photography Utah",
    description:
      "Ready to elevate your brand? Contact Apex Visuals LLC for drone photography, cinematic video, and social media content in Utah. We respond within 24 hours.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 md:px-10 md:py-28">
      <Reveal>
        <Eyebrow>Get in Touch</Eyebrow>
        <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Let&apos;s Work Together</h1>
        <p className="mt-4 text-fg-muted">We respond within 24 hours.</p>
        <BookingStatus className="mt-4" />
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-16 border-t border-border pt-12">
          <Eyebrow>How It Works</Eyebrow>
          <h2 className="mt-4 font-serif text-2xl font-bold sm:text-3xl">
            From Message to Quote
          </h2>
          <div className="mt-8">
            <ProcessSteps steps={quoteSteps} />
          </div>
        </div>
      </Reveal>

      <Reveal delay={150}>
        <div className="mt-16 border-t border-border pt-12">
          <ContactForm />
        </div>
      </Reveal>

      <div className="mt-14 border-t border-border pt-8 text-sm text-fg-muted">
        <p>
          <a href="mailto:russfilmz808@gmail.com" className="hover:text-fg">
            russfilmz808@gmail.com
          </a>
        </p>
        <p className="mt-1">
          <a href="tel:+18088664664" className="hover:text-fg">
            (808) 866-4664
          </a>
        </p>
        <p className="mt-1">
          <a
            href="https://www.instagram.com/russ_filmz/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-fg"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
            </svg>
            @russ_filmz
          </a>
        </p>
        <p className="mt-1">24 hour response time</p>
      </div>
    </div>
  );
}
