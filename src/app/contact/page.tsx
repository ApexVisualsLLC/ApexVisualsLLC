import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

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
      <h1 className="font-serif text-4xl font-bold sm:text-5xl">Let&apos;s Work Together</h1>
      <p className="mt-4 text-fg-muted">We respond within 24 hours.</p>

      <div className="mt-12">
        <ContactForm />
      </div>

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
