import type { Metadata } from "next";
import Link from "next/link";
import { PlaceholderPhoto } from "@/components/PlaceholderMedia";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import Magnetic from "@/components/Magnetic";

export const metadata: Metadata = {
  title: "About — Apex Visuals LLC | FAA Part 107 Drone Pilot Provo Utah",
  description:
    "Meet Russell Bowden, FAA Part 107 licensed drone pilot and cinematographer based in Provo, Utah. BYU student and founder of Apex Visuals LLC.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Apex Visuals LLC | FAA Part 107 Drone Pilot Provo Utah",
    description:
      "Meet Russell Bowden, FAA Part 107 licensed drone pilot and cinematographer based in Provo, Utah. BYU student and founder of Apex Visuals LLC.",
    url: "/about",
  },
};

const lede = "I'm Russell — the founder of Apex Visuals and the person behind every shot you see here.";

const bio = [
  "I grew up in Maui, Hawaii, and started filming because I couldn't stop noticing things other people walked right past. A canyon nobody had mapped. A waterfall tucked inside a jungle most tourists never find. A desert road that looked completely different from 400 feet in the air. I bought a drone, then a cinema camera, then another drone — and somewhere along the way it became a passion and a business.",
  "I'm currently studying at BYU in Provo, which means I get out and film whenever I can. I hold an FAA Part 107 commercial drone license and shoot with only the gear each project actually calls for.",
  "I work with a select number of businesses on a monthly basis to keep their content fresh and their brand visible. My work has taken me from the jungles of Maui to the red rock canyons of Southern Utah — and I bring that same obsessive attention to detail to every client project.",
  "If you're looking for someone who actually cares about the shot — not just the deliverable — let's work together and create something incredible.",
];

export default function AboutPage() {
  return (
    <div>
      {/* REPLACE: Photo of Russell with gear, on location */}
      <PlaceholderPhoto
        label="Russell with gear, on location"
        className="h-[55vh] min-h-[360px] w-full"
      />

      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <Reveal>
            <Eyebrow>The Person Behind the Lens</Eyebrow>
            <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">About Russell</h1>

            <p className="mt-8 font-serif text-2xl font-medium leading-snug text-fg sm:text-3xl">
              {lede}
            </p>
          </Reveal>

          <Reveal delay={100}>
            {/* REPLACE: Portrait photo of Russell */}
            <PlaceholderPhoto
              label="Portrait of Russell"
              className="aspect-[4/5] w-full rounded-2xl"
            />
          </Reveal>
        </div>

        <div className="mt-12 max-w-3xl space-y-5 text-fg-muted">
          {bio.map((paragraph, i) => (
            <Reveal key={i} delay={i * 60}>
              <p className="leading-relaxed">{paragraph}</p>
            </Reveal>
          ))}
        </div>

      </div>

      <section className="border-t border-border bg-panel">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-fg-faint">
              — Action —
            </p>
            <h2 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">
              Let&apos;s make something worth watching.
            </h2>

            <Magnetic className="mt-10 inline-block">
              <Link
                href="/contact"
                className="group relative inline-block border border-fg/50 px-9 py-4 text-sm font-semibold tracking-wide text-fg transition-colors duration-300 hover:bg-fg hover:text-bg"
              >
                <span className="pointer-events-none absolute -left-2.5 -top-2.5 h-4 w-4 border-l border-t border-fg/50 transition-colors duration-300 group-hover:border-fg" />
                <span className="pointer-events-none absolute -right-2.5 -top-2.5 h-4 w-4 border-r border-t border-fg/50 transition-colors duration-300 group-hover:border-fg" />
                <span className="pointer-events-none absolute -bottom-2.5 -left-2.5 h-4 w-4 border-b border-l border-fg/50 transition-colors duration-300 group-hover:border-fg" />
                <span className="pointer-events-none absolute -bottom-2.5 -right-2.5 h-4 w-4 border-b border-r border-fg/50 transition-colors duration-300 group-hover:border-fg" />
                Start a Project
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
