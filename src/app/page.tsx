import type { Metadata } from "next";
import Link from "next/link";
import Parallax from "@/components/Parallax";
import CursorGlow from "@/components/CursorGlow";
import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";
import ProcessSteps from "@/components/ProcessSteps";
import WhyApexVisuals from "@/components/WhyApexVisuals";
import StatsBar from "@/components/StatsBar";
import Testimonials from "@/components/Testimonials";
import ViewfinderHUD from "@/components/ViewfinderHUD";
import BookingStatus from "@/components/BookingStatus";
import Magnetic from "@/components/Magnetic";
import { PlaceholderPhoto } from "@/components/PlaceholderMedia";
import FeaturedWork from "@/components/FeaturedWork";

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

export default function HomePage() {
  return (
    <>
      <CursorGlow className="flex min-h-[92vh] items-center justify-center overflow-hidden">
        <Parallax className="absolute inset-0 -top-24 h-[calc(100%+12rem)]" speed={0.25}>
          <PlaceholderPhoto
            label="Hero background — Russell's landscape shot"
            src="/hero-timp-sunset.jpg"
            alt="Mount Timpanogos lit by sunset light under dramatic pink clouds, captured by Apex Visuals LLC"
            priority
            labelPosition="bottom"
            className="h-full w-full [&_img]:object-[center_38%]"
          />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-bg" />
        <ViewfinderHUD />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <Eyebrow className="mx-auto w-fit justify-center">Licensed Drone Pilot — Utah County</Eyebrow>
          <h1 className="mt-5 font-serif text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            We See What Others Miss.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-fg-muted sm:text-lg">
            Licensed drone pilot and cinematographer serving businesses across Utah.
            FAA Part 107 Certified.
          </p>
          <Magnetic className="mt-10 inline-block">
            <Link
              href="/book"
              className="inline-block rounded-full bg-fg px-8 py-3.5 text-sm font-semibold tracking-wide text-bg transition-opacity hover:opacity-85"
            >
              START A PROJECT
            </Link>
          </Magnetic>
          <div className="mt-6 flex justify-center">
            <BookingStatus />
          </div>
        </div>
      </CursorGlow>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <Reveal>
          <Eyebrow>Our Services</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">What We Offer</h2>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 100}>
              <Link
                href={service.href}
                className={`group relative flex h-full flex-col justify-between rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)] ${
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
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
          <Reveal>
            <Eyebrow>Why Apex Visuals</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">
              What You Actually Get
            </h2>
          </Reveal>

          <div className="mt-12">
            <WhyApexVisuals />
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-panel">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
          <Reveal>
            <Eyebrow>How It Works</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">
              From Booking to Delivery
            </h2>
          </Reveal>

          <div className="mt-12">
            <ProcessSteps />
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <Eyebrow>Selected Projects</Eyebrow>
                <h2 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">Featured Work</h2>
              </div>
              <Link href="/work" className="text-sm font-medium text-fg-muted hover:text-fg">
                View full portfolio →
              </Link>
            </div>
          </Reveal>

          <FeaturedWork />
        </div>
      </section>

      <section className="border-t border-border bg-panel">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <Reveal>
            <StatsBar />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
          <Reveal>
            <Eyebrow>What Clients Say</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">
              Trusted by Utah Businesses
            </h2>
          </Reveal>

          <div className="mt-10">
            <Testimonials />
          </div>
        </div>
      </section>

      <p className="border-t border-border py-8 text-center text-sm text-fg-muted">
        Serving Utah businesses with monthly content partnerships.
      </p>

      <section className="border-t border-border bg-panel">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
          <Reveal>
            <h2 className="font-serif text-4xl font-bold sm:text-5xl">
              Ready to elevate your brand?
            </h2>
            <Magnetic className="mt-10 inline-block">
              <Link
                href="/book"
                className="inline-block rounded-full bg-fg px-8 py-3.5 text-sm font-semibold tracking-wide text-bg transition-opacity hover:opacity-85"
              >
                START A PROJECT
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </>
  );
}
