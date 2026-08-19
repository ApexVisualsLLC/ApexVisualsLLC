import type { Metadata } from "next";
import Link from "next/link";
import Parallax from "@/components/Parallax";
import { PlaceholderPhoto, VideoThumb } from "@/components/PlaceholderMedia";

export const metadata: Metadata = {
  title: "Apex Visuals LLC — Aerial Drone Photography & Cinematic Video | Utah",
  description:
    "FAA Part 107 licensed drone photography and cinematic video production serving Provo and Utah County. Professional aerial photography, brand videos, and social media content.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Apex Visuals LLC — Aerial Drone Photography & Cinematic Video | Utah",
    description:
      "FAA Part 107 licensed drone photography and cinematic video production serving Provo and Utah County.",
    url: "/",
  },
};

const services = [
  {
    title: "Aerial Photography",
    description: "Drone stills for real estate and properties, captured from angles no one else gets.",
    href: "/services",
  },
  {
    title: "Cinematic Video",
    description: "Drone and ground footage combined into a produced, story-driven brand film.",
    href: "/services",
  },
  {
    title: "Social Media Content",
    description: "Short-form Reels, TikToks, and monthly retainers — ready to post, every month.",
    href: "/services",
    badge: "Most Popular",
  },
];

const featured = [
  { title: "Jellystone Zion — Aerial & Ground", location: "Zion, Utah", category: "Commercial" },
  { title: "Red Rock Canyon Flyover", location: "Southern Utah", category: "Aerial" },
  { title: "There's This Place I Go", location: "Maui, Hawaii", category: "Cinematic" },
];

const trustItems = [
  "FAA Part 107 Certified",
  "Professional Cinema Gear",
  "5-Day Delivery",
  "Utah Based",
];

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
        <Parallax className="absolute inset-0 -top-24 h-[calc(100%+12rem)]" speed={0.25}>
          {/* REPLACE: Hero background image — Russell's best cinematic landscape shot */}
          <PlaceholderPhoto
            label="Hero background — Russell's landscape shot"
            labelPosition="bottom"
            className="h-full w-full"
          />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-bg" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <h1 className="font-serif text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            We See What Others Miss.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-fg-muted sm:text-lg">
            Licensed drone pilot and cinematographer serving businesses across Utah.
            FAA Part 107 Certified.
          </p>
          <Link
            href="/contact"
            className="mt-10 inline-block rounded-full bg-fg px-8 py-3.5 text-sm font-semibold tracking-wide text-bg transition-opacity hover:opacity-85"
          >
            START A PROJECT
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div className="grid gap-6 sm:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className={`group relative flex flex-col justify-between rounded-2xl border p-8 transition-colors ${
                service.badge
                  ? "border-fg/40 bg-panel"
                  : "border-border hover:border-fg/30"
              }`}
            >
              {service.badge && (
                <span className="absolute -top-3 left-8 rounded-full bg-fg px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-bg">
                  {service.badge}
                </span>
              )}
              <div>
                <h3 className="font-serif text-2xl font-bold">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                  {service.description}
                </p>
              </div>
              <span className="mt-8 inline-flex items-center text-sm font-medium text-fg transition-transform group-hover:translate-x-1">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="font-serif text-3xl font-bold sm:text-4xl">Featured Work</h2>
            <Link href="/work" className="text-sm font-medium text-fg-muted hover:text-fg">
              View full portfolio →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {featured.map((item) => (
              <VideoThumb key={item.title} {...item} className="rounded-2xl" />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6 py-10 text-center text-xs uppercase tracking-[0.2em] text-fg-faint md:px-10">
          {trustItems.map((item, i) => (
            <span key={item} className="flex items-center gap-x-10">
              {item}
              {i < trustItems.length - 1 && (
                <span className="hidden text-fg-faint/50 md:inline">·</span>
              )}
            </span>
          ))}
        </div>
      </section>

      <p className="border-t border-border py-8 text-center text-sm text-fg-muted">
        Serving Utah businesses with monthly content partnerships.
      </p>

      <section className="border-t border-border bg-panel">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
          <h2 className="font-serif text-4xl font-bold sm:text-5xl">
            Ready to elevate your brand?
          </h2>
          <Link
            href="/contact"
            className="mt-10 inline-block rounded-full bg-fg px-8 py-3.5 text-sm font-semibold tracking-wide text-bg transition-opacity hover:opacity-85"
          >
            START A PROJECT
          </Link>
        </div>
      </section>
    </>
  );
}
