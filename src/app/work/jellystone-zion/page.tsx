import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import Magnetic from "@/components/Magnetic";
import JellystoneVideos from "@/components/JellystoneVideos";

const siteUrl = "https://apexvisualsutah.com";
const path = "/work/jellystone-zion";

const title = "Jellystone Zion Resort Photography & Video | Apex Visuals";
const description =
  "Explore Apex Visuals’ aerial photos, guest-experience imagery and promotional video work for Jellystone Zion. Plan photo and video coverage for your resort.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path },
};

const PHOTO_GRADE = "[filter:sepia(0.2)_contrast(1.05)_saturate(1.05)]";

const facts = [
  { label: "Client", value: "Jellystone Zion" },
  { label: "Location", value: "St. George, Utah" },
  { label: "When", value: "Summer 2026" },
  { label: "Scope", value: "Aerial and ground photography, promotional video" },
];

const coverage = [
  "Aerial photography of the property and its amenities, flown by an FAA Part 107 certified pilot.",
  "Ground-level photos of guests and activities, including events on the pool deck.",
  "Promotional videos, filmed and edited for the park’s on-property TVs and website.",
  "Running the park’s YouTube, TikTok, Instagram and Facebook channels while on-site.",
];

// Only properties that can be read straight from the actual video asset (Russell's YouTube upload):
// title, his own description, the upload timestamp and the embed URL. Duration is left out on
// purpose — YouTube reports 14 s in one place and 15 s in another, so it isn't stated.
const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "Jellystone Zion Camp-Resort — Park Highlight Video",
  description:
    "A look at the guest experience at Jellystone Zion Camp-Resort in St. George, Utah — pool deck activities at golden hour.",
  thumbnailUrl: [`${siteUrl}/jellystone/park-highlight-poster.jpg`],
  uploadDate: "2026-08-31T15:27:22-07:00",
  embedUrl: "https://www.youtube.com/embed/OIJLkrlNbNk",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Work", item: `${siteUrl}/work` },
    { "@type": "ListItem", position: 3, name: "Jellystone Zion", item: `${siteUrl}${path}` },
  ],
};

function Photo({
  src,
  alt,
  caption,
  sizes,
  className = "",
}: {
  src: string;
  alt: string;
  caption: string;
  sizes: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div className={`relative aspect-video overflow-hidden rounded-2xl ${PHOTO_GRADE}`}>
        <Image src={src} alt={alt} fill sizes={sizes} quality={90} className="object-cover" />
      </div>
      <figcaption className="mt-3 text-sm text-fg-faint">{caption}</figcaption>
    </figure>
  );
}

export default function JellystoneZionPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Reveal>
        <Link href="/work" className="text-sm font-medium text-fg-muted transition-colors hover:text-fg">
          <span aria-hidden="true">&larr;</span> All work
        </Link>
        <Eyebrow className="mt-8">Featured Project</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold sm:text-5xl">
          Resort Photography &amp; Video at Jellystone Zion
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-fg-muted">
          Apex Visuals created aerial photography, ground-level imagery and promotional videos for
          Jellystone Zion during a paid summer project. The work captures both the property&rsquo;s
          amenities and the experience of spending time there.
        </p>

        <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-border pt-8 sm:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-fg-faint">
                {fact.label}
              </dt>
              <dd className="mt-2 text-sm text-fg">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <div className="mt-20 grid gap-14 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">The property</h2>
          <p className="mt-4 leading-relaxed text-fg-muted">
            Jellystone Zion is a kids camp-resort and water park in St. George, Utah. Guests stay
            on the property and spend their days at a water park with a lazy river, pools and a
            tall slide tower, and the resort hosts guest events, including evening activities on
            the pool deck.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">The coverage</h2>
          <p className="mt-4 leading-relaxed text-fg-muted">
            Russell Bowden was on-site for all of July and part of August 2026. The work covered:
          </p>
          <ul className="mt-4 space-y-3 text-fg-muted">
            {coverage.map((item) => (
              <li key={item} className="flex gap-3 leading-relaxed">
                <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-fg-faint" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 leading-relaxed text-fg-muted">
            Heat, wind, sandstorms and harsh midday sun came with the job. The finished work still
            had to be clean, on schedule and ready for the park&rsquo;s screens.
          </p>
        </Reveal>
      </div>

      <Reveal>
        <figure className="mt-16 max-w-3xl border-t border-border pt-8">
          <blockquote className="font-serif text-xl leading-snug text-fg sm:text-2xl">
            &ldquo;Russell&rsquo;s aerial footage of our water park and campgrounds is some of the
            best marketing content we&rsquo;ve ever had &mdash; guests see it and want to book a
            stay before they&rsquo;ve even finished watching.&rdquo;
          </blockquote>
          <figcaption className="mt-4 text-sm">
            <span className="font-medium text-fg">Scott Nelson</span>
            <span className="text-fg-faint"> &mdash; Owner, Jellystone Zion Park</span>
          </figcaption>
        </figure>
      </Reveal>

      <section className="mt-20" aria-labelledby="selected-work">
        <Reveal>
          <h2 id="selected-work" className="font-serif text-2xl font-bold sm:text-3xl">
            Selected work
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-fg-muted">
            A wide aerial view, the overhead layout of the park, and a ground-level moment from a
            pool deck activity.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Photo
              className="md:col-span-2"
              src="/jellystone/aerial-lazy-river.jpg"
              alt="Wide aerial view of the Jellystone Zion water park: lazy river, shade structures and the slide tower under a summer sky"
              caption="Wide aerial view of the lazy river and slide tower"
              sizes="(min-width: 1152px) 1100px, 100vw"
            />
            <Photo
              src="/jellystone/aerial-waterpark-topdown.jpg"
              alt="Top-down aerial of the Jellystone Zion water park, with the lazy river, pools and slide complex laid out like a site plan"
              caption="Overhead view of the park layout"
              sizes="(min-width: 768px) 540px, 100vw"
            />
            <Photo
              src="/jellystone/ground-crowd-golden-hour.jpg"
              alt="Guests joining an activity on the pool deck at golden hour, with the slide tower and palm trees behind them"
              caption="A pool deck activity at golden hour"
              sizes="(min-width: 768px) 540px, 100vw"
            />
          </div>
        </Reveal>
      </section>

      <section className="mt-20" aria-labelledby="featured-video">
        <Reveal>
          <h2 id="featured-video" className="font-serif text-2xl font-bold sm:text-3xl">
            Featured video
          </h2>
        </Reveal>
        <div className="mt-8">
          <JellystoneVideos />
        </div>
      </section>

      <section className="mt-24 border-t border-border pt-16" aria-labelledby="similar-project">
        <Reveal>
          <h2 id="similar-project" className="font-serif text-2xl font-bold sm:text-3xl">
            Planning something similar?
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-fg-muted">
            Resorts, campgrounds and water parks can book a single shoot &mdash; aerial photos, a
            promotional video, or both &mdash; or talk through recurring content. Tell Russell what
            you have in mind and he will confirm the scope before anything is scheduled.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link
                href="/book"
                className="inline-block rounded-full bg-fg px-6 py-3 text-sm font-semibold tracking-wide text-bg transition-opacity hover:opacity-85"
              >
                Start a Project
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/services#social-media"
                className="inline-block rounded-full border border-fg/30 px-6 py-3 text-sm font-semibold tracking-wide transition-colors hover:border-fg hover:bg-fg hover:text-bg"
              >
                See recurring content options
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
