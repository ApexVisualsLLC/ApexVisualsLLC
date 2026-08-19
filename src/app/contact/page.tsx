import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";

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
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-12">
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
