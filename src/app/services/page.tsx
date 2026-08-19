import type { Metadata } from "next";
import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import Faq from "@/components/Faq";
import Magnetic from "@/components/Magnetic";

export const metadata: Metadata = {
  title: "Services & Pricing — Apex Visuals LLC | Drone Photography Utah",
  description:
    "Professional drone photography starting at $175, cinematic video from $400, and monthly social media retainers from $350. Serving Provo and Utah County.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services & Pricing — Apex Visuals LLC | Drone Photography Utah",
    description:
      "Professional drone photography starting at $175, cinematic video from $400, and monthly social media retainers from $350. Serving Provo and Utah County.",
    url: "/services",
  },
};

type Tier = { name: string; price: string; description: string };

const aerialTiers: Tier[] = [
  {
    name: "Starter",
    price: "Starting at $175",
    description: "Up to 15 edited aerial stills. Ideal for real estate listings. Delivered within 5 business days.",
  },
  {
    name: "Standard",
    price: "Starting at $275",
    description: "Up to 25 edited aerial stills plus a 60-second aerial highlight clip. Delivered within 5 business days.",
  },
  {
    name: "Custom",
    price: "Let's Talk",
    description: "Full property or event coverage, large commercial projects. Contact for quote.",
  },
];

const cinematicTiers: Tier[] = [
  {
    name: "Essential",
    price: "Starting at $400",
    description: "Up to 2 hours shooting, drone and ground footage, professionally edited 60-90 second video with music. Delivered within 7 business days.",
  },
  {
    name: "Premium",
    price: "Starting at $650",
    description: "Up to 4 hours shooting, full cinematic production with drone and Sony A7 IV, 2-3 minute produced video, color graded with music. Delivered within 7 business days.",
  },
  {
    name: "Custom",
    price: "Let's Talk",
    description: "Brand films, event coverage, commercial productions. Contact for quote.",
  },
];

const retainerTiers: Tier[] = [
  {
    name: "Starter Retainer",
    price: "Starting at $350/month",
    description: "One shoot per month, 4-6 edited short form videos, delivered ready to post.",
  },
  {
    name: "Growth Retainer",
    price: "Starting at $550/month",
    description: "Two shoots per month, 8-12 edited short form videos plus photo stills, caption and hashtag strategy included.",
  },
  {
    name: "Custom",
    price: "Let's Talk",
    description: "Higher volume, multiple platforms, specific campaigns. Contact for quote.",
  },
];

function TierCard({ tier, highlighted = false }: { tier: Tier; highlighted?: boolean }) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)] ${
        highlighted ? "border-fg/40 bg-panel" : "border-border hover:border-fg/30"
      }`}
    >
      <h3 className="font-serif text-xl font-bold">{tier.name}</h3>
      <p className="mt-2 text-lg font-semibold text-fg">{tier.price}</p>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-fg-muted">{tier.description}</p>
      <Magnetic className="mt-8 inline-block">
        <Link
          href="/contact"
          className="inline-block rounded-full border border-fg/30 px-5 py-2.5 text-center text-sm font-semibold tracking-wide transition-colors hover:border-fg hover:bg-fg hover:text-bg"
        >
          Start a Project
        </Link>
      </Magnetic>
    </div>
  );
}

function PackageSection({
  id,
  number,
  title,
  tiers,
  highlighted = false,
  badge,
  crossLink = true,
}: {
  id: string;
  number: string;
  title: string;
  tiers: Tier[];
  highlighted?: boolean;
  badge?: string;
  crossLink?: boolean;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-14 first:pt-0">
      <Reveal>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-serif text-lg text-fg-faint">{number}</span>
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">{title}</h2>
          {badge && (
            <span className="rounded-full bg-fg px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-bg">
              {badge}
            </span>
          )}
        </div>
      </Reveal>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {tiers.map((tier, i) => (
          <Reveal key={tier.name} delay={i * 100}>
            <TierCard tier={tier} highlighted={highlighted} />
          </Reveal>
        ))}
      </div>

      {crossLink && (
        <Link
          href="#social-media"
          className="mt-6 inline-block text-sm font-medium text-fg-muted hover:text-fg"
        >
          Or explore our monthly retainer packages →
        </Link>
      )}
    </section>
  );
}

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
      <Reveal>
        <Eyebrow>Pricing</Eyebrow>
        <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Services &amp; Pricing</h1>
        <p className="mt-4 max-w-2xl text-fg-muted">
          Every project starts with a conversation. Pricing below reflects typical project
          scope — final quotes depend on your specific needs.
        </p>
      </Reveal>

      <div className="divide-y divide-border">
        <PackageSection id="aerial" number="01" title="Aerial Photography" tiers={aerialTiers} />
        <PackageSection id="cinematic" number="02" title="Cinematic Video" tiers={cinematicTiers} />
        <PackageSection
          id="social-media"
          number="03"
          title="Social Media Content"
          tiers={retainerTiers}
          highlighted
          badge="Most Popular"
          crossLink={false}
        />
      </div>

      <Reveal>
        <div className="mt-6 rounded-2xl border border-border bg-panel p-6 text-sm text-fg-muted">
          <p>
            <span className="font-semibold text-fg">Rush delivery</span> is available within 48
            hours for an additional 50% fee.
          </p>
          <p className="mt-2">
            <span className="font-semibold text-fg">Minimum project fee: $175.</span> No exceptions.
          </p>
        </div>
      </Reveal>

      <div className="mt-24">
        <Reveal>
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">Common Questions</h2>
        </Reveal>

        <div className="mt-8">
          <Reveal>
            <Faq />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
