"use client";

import { useState } from "react";
import Image from "next/image";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import { VideoThumb } from "@/components/PlaceholderMedia";
import VideoLightbox from "@/components/VideoLightbox";

const PHOTO_GRADE = "[filter:sepia(0.2)_contrast(1.05)_saturate(1.05)]";

type Video = {
  title: string;
  category: string;
  youtubeId: string;
  vertical: boolean;
  aspectClassName?: string;
};

// Park Highlight is 4:3 footage, so its card matches that to avoid baked-in black bars.
const videos: Video[] = [
  {
    title: "Park Highlight",
    category: "Commercial",
    youtubeId: "OIJLkrlNbNk",
    vertical: false,
    aspectClassName: "aspect-[4/3]",
  },
  { title: "360° Tiny Planet", category: "Aerial", youtubeId: "-TgBc5kIQK8", vertical: true },
  { title: "Park Overview", category: "Commercial", youtubeId: "DDhS_1Op-RI", vertical: true },
];

const takeaways = [
  {
    title: "Big properties, covered end to end.",
    body: "A resort with lodging, a water park, and event nights is the same coverage problem as a development or job site: lots of ground and lots of moving parts.",
  },
  {
    title: "Reliable on location.",
    body: "I was there for every event and delivered finished edits, not raw footage.",
  },
  {
    title: "Built for rough conditions.",
    body: "The footage came out clean in heat, wind, dust, and glare.",
  },
  {
    title: "One person, flight to final cut.",
    body: "You deal with the same person from the first message to delivery.",
  },
];

function Still({
  src,
  alt,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  className: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${PHOTO_GRADE} ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} quality={85} className="object-cover" />
    </div>
  );
}

export default function FeaturedProject() {
  const [openVideo, setOpenVideo] = useState<Video | null>(null);

  return (
    <div>
      <Reveal>
        <Eyebrow>Featured Project</Eyebrow>
        <h2 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">
          A Full Summer On-Site at Jellystone Zion
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-[5fr_6fr] lg:items-center lg:gap-14">
        <Reveal>
          <div className="space-y-5 leading-relaxed text-fg-muted">
            <p>
              For all of July and part of August, I worked on-site at Jellystone Zion, a kids
              camp-resort and water park in southern Utah. I shot every event, filmed and edited
              their promotional videos, captured aerial and ground photos, and ran their YouTube,
              TikTok, Instagram, and Facebook channels.
            </p>
            <p>
              Heat, wind, sandstorms, and harsh midday sun came with the job. The work still had to
              be clean, on schedule, and ready for their on-property TVs and website.
            </p>
          </div>

          <figure className="mt-8 border-t border-border pt-6">
            <blockquote className="font-serif text-xl leading-snug text-fg">
              &ldquo;Russell&rsquo;s aerial footage of our water park and campgrounds is some of
              the best marketing content we&rsquo;ve ever had &mdash; guests see it and want to
              book a stay before they&rsquo;ve even finished watching.&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-sm">
              <span className="font-medium text-fg">Scott Nelson</span>
              <span className="text-fg-faint"> &mdash; Owner, Jellystone Zion Park</span>
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={100}>
          <div className="grid grid-cols-2 gap-3">
            <Still
              src="/jellystone/aerial-waterpark-topdown.jpg"
              alt="Top-down aerial of the Jellystone Zion water park: lazy river, pools, and slide complex laid out like a site plan"
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="col-span-2 aspect-video"
            />
            <Still
              src="/jellystone/ground-crowd-golden-hour.jpg"
              alt="Guests gathered at the water park at golden hour, with the slide tower and palm trees behind them"
              sizes="(min-width: 1024px) 27vw, 50vw"
              className="aspect-[4/3]"
            />
            <Still
              src="/jellystone/aerial-lazy-river.jpg"
              alt="Aerial view of the lazy river and slide tower under a summer sky, with swimmers and shade structures"
              sizes="(min-width: 1024px) 27vw, 50vw"
              className="aspect-[4/3]"
            />
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-[2.37fr_1fr_1fr]">
          {videos.map((video, i) => (
            <div key={video.youtubeId} className={i === 0 ? "col-span-2 sm:col-span-1" : ""}>
              <VideoThumb
                title={video.title}
                location="Jellystone Zion"
                category={video.category}
                youtubeId={video.youtubeId}
                vertical={video.vertical}
                aspectClassName={video.aspectClassName}
                onClick={() => setOpenVideo(video)}
                className="rounded-2xl"
              />
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-16 border-t border-border pt-10">
          <h3 className="font-serif text-2xl font-bold">What that means for your site</h3>
          <ul className="mt-8 grid gap-8 sm:grid-cols-2">
            {takeaways.map((item) => (
              <li key={item.title}>
                <p className="font-medium text-fg">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {openVideo && (
        <VideoLightbox
          youtubeId={openVideo.youtubeId}
          title={`Jellystone Zion — ${openVideo.title}`}
          vertical={openVideo.vertical}
          onClose={() => setOpenVideo(null)}
        />
      )}
    </div>
  );
}
