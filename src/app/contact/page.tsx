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
        {/* REPLACE: Russell's business email */}
        <p>placeholder@apexvisualsutah.com</p>
        {/* REPLACE: Russell's personal cell number */}
        <p className="mt-1">(XXX) XXX-XXXX</p>
        <p className="mt-1">24 hour response time</p>
      </div>
    </div>
  );
}
