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
  "I started filming because I couldn't stop noticing things other people walked right past. A canyon nobody had mapped. A waterfall tucked inside a jungle most tourists never find. A desert road that looked completely different from 400 feet in the air. I bought a drone, then a cinema camera, then another drone — and somewhere along the way it became a business.",
  "I'm currently studying Information Systems at BYU in Provo, which means I understand both the creative and the technical side of what I do. I hold an FAA Part 107 commercial drone license and shoot with professional cinema gear — the DJI Mavic 4 Pro, DJI Avata 360, and Sony A7 IV.",
  "I work with a select number of businesses on a monthly basis to keep their content fresh and their brand visible. My work has taken me from the jungles of Maui to the red rock canyons of Southern Utah — and I bring that same obsessive attention to detail to every client project.",
  "If you're looking for someone who actually cares about the shot — not just the deliverable — let's work together.",
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

        <Reveal>
          <div className="mt-12 max-w-3xl rounded-2xl border border-fg/30 bg-panel p-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-fg">
              FAA Part 107 Certified Commercial Drone Pilot
            </p>
          </div>

          <Magnetic className="mt-12 inline-block">
            <Link
              href="/contact"
              className="inline-block rounded-full bg-fg px-8 py-3.5 text-sm font-semibold tracking-wide text-bg transition-opacity hover:opacity-85"
            >
              Start a Project
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </div>
  );
}
