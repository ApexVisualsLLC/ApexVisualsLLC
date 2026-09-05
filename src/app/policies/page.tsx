import type { Metadata } from "next";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import { DEPOSIT_POLICY_TEXT } from "@/lib/booking/policy";

export const metadata: Metadata = {
  title: "Terms & Policies — Apex Visuals LLC",
  description:
    "Booking, payment, rescheduling, delivery, and file-usage policies for Apex Visuals LLC drone photography and video projects.",
  alternates: { canonical: "/policies" },
};

const LAST_UPDATED = "September 2026";

type Section = {
  heading: string;
  paragraphs: string[];
};

const sections: Section[] = [
  {
    heading: "Booking & Payment",
    paragraphs: [
      "A project is requested through our online booking form and confirmed once we accept it and set a final price. Locking in your shoot date requires a 50% deposit, paid securely online through Stripe.",
      "The remaining 50% is due once your edited preview gallery is ready — you'll review watermarked previews first, and full-quality, unwatermarked files unlock immediately after that final payment clears.",
    ],
  },
  {
    heading: "Rescheduling & Cancellations",
    paragraphs: [
      DEPOSIT_POLICY_TEXT,
      "If we need to reschedule your shoot — most commonly due to weather or FAA flight restrictions that make it unsafe or unlawful to fly — that's entirely no-fault to you. We'll work with you to find a new time at no extra charge and no penalty to your deposit.",
    ],
  },
  {
    heading: "Delivery Timeline",
    paragraphs: [
      "Edited deliverables are completed within 5 business days of your shoot date. If a project needs longer for any reason, we'll reach out directly rather than leave you waiting.",
    ],
  },
  {
    heading: "File Usage & Portfolio Rights",
    paragraphs: [
      "Once delivered and fully paid for, your photos and video are yours to use for your own personal or business purposes.",
      "Apex Visuals LLC retains the right to use delivered work in our own portfolio, website, and marketing (including social media) unless you tell us in writing that you'd prefer we don't. Just reach out and we'll leave your project out of anything public.",
    ],
  },
  {
    heading: "Liability",
    paragraphs: [
      "All flights are conducted by an FAA Part 107 certified pilot in accordance with applicable aviation regulations. Apex Visuals LLC carries out each project with reasonable care, but our liability for any claim related to a project is limited to the amount actually paid for that project.",
    ],
  },
  {
    heading: "Privacy",
    paragraphs: [
      "Information you provide when booking is used only to plan, schedule, and deliver your project, and to process payment. We don't sell or share your information with third parties beyond what's needed to run the booking and payment systems themselves (for example, Stripe for payment processing).",
    ],
  },
  {
    heading: "Governing Law",
    paragraphs: ["These terms are governed by the laws of the State of Utah."],
  },
];

export default function PoliciesPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 md:px-10 md:py-28">
      <Reveal>
        <Eyebrow>Terms & Policies</Eyebrow>
        <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Booking Terms & Policies</h1>
        <p className="mt-4 text-fg-muted">
          The terms that apply to every Apex Visuals LLC project, in plain language. Last updated{" "}
          {LAST_UPDATED}.
        </p>
      </Reveal>

      <div className="mt-14 space-y-12 border-t border-border pt-12">
        {sections.map((section, i) => (
          <Reveal key={section.heading} delay={i * 60}>
            <h2 className="font-serif text-2xl font-bold">{section.heading}</h2>
            <div className="mt-3 space-y-3">
              {section.paragraphs.map((paragraph, j) => (
                <p key={j} className="leading-relaxed text-fg-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        ))}

        <Reveal delay={sections.length * 60}>
          <h2 className="font-serif text-2xl font-bold">Questions</h2>
          <p className="mt-3 leading-relaxed text-fg-muted">
            Reach out anytime at{" "}
            <a href="mailto:russfilmz808@gmail.com" className="text-fg hover:underline">
              russfilmz808@gmail.com
            </a>{" "}
            or{" "}
            <a href="tel:+18088664664" className="text-fg hover:underline">
              (808) 866-4664
            </a>
            .
          </p>
        </Reveal>
      </div>
    </div>
  );
}
