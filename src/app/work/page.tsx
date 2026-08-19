import type { Metadata } from "next";
import Link from "next/link";
import WorkGallery from "@/components/WorkGallery";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Our Work — Apex Visuals LLC | Drone & Cinematic Video Portfolio Utah",
  description:
    "View our portfolio of aerial drone photography, cinematic video production, and social media content. Serving businesses across Utah.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Our Work — Apex Visuals LLC | Drone & Cinematic Video Portfolio Utah",
    description:
      "View our portfolio of aerial drone photography, cinematic video production, and social media content. Serving businesses across Utah.",
    url: "/work",
  },
};

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
      <Reveal>
        <Eyebrow>Portfolio</Eyebrow>
        <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Our Work</h1>
        <p className="mt-4 max-w-xl text-fg-muted">
          A selection of aerial photography, cinematic video, and commercial projects
          from across Utah and beyond.
        </p>
      </Reveal>

      <div className="mt-12">
        <WorkGallery />
      </div>

      <div className="mt-20 flex flex-wrap items-center gap-4 border-t border-border pt-10">
        <p className="text-fg-muted">Like what you see?</p>
        <Link
          href="/services"
          className="rounded-full border border-fg/30 px-5 py-2.5 text-sm font-semibold tracking-wide transition-colors hover:border-fg hover:bg-fg hover:text-bg"
        >
          View Services & Pricing
        </Link>
        <Link
          href="/contact"
          className="rounded-full bg-fg px-5 py-2.5 text-sm font-semibold tracking-wide text-bg transition-opacity hover:opacity-85"
        >
          Start a Project
        </Link>
      </div>
    </div>
  );
}
