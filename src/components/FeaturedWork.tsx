"use client";

import { useState } from "react";
import Link from "next/link";
import { VideoThumb } from "@/components/PlaceholderMedia";
import VideoLightbox from "@/components/VideoLightbox";
import Reveal from "@/components/Reveal";

type FeaturedItem = {
  title: string;
  location: string;
  category: string;
  previewSrc?: string;
  youtubeId?: string;
  vertical?: boolean;
  /* 4:3 footage whose YouTube thumbnail has black side bars baked in — see VideoThumb. */
  pillarboxed?: boolean;
  /* Optional project page this video belongs to; adds a crawlable link under the card. */
  projectHref?: string;
};

/* REPLACE: add `previewSrc: "/videos/<file>.mp4"` to any item below once Russell drops a
   short muted preview clip into public/videos/ — it'll autoplay on hover. Until then these
   fall back to the static placeholder thumbnail. */
const featured: FeaturedItem[] = [
  {
    title: "Jellystone Zion Camp-Resort — Park Highlight Video",
    location: "Zion, Utah",
    category: "Commercial",
    youtubeId: "OIJLkrlNbNk",
    pillarboxed: true,
    projectHref: "/work/jellystone-zion",
  },
  {
    title: "Desert Run",
    location: "Southern Utah",
    category: "Aerial",
    youtubeId: "zgsXgRL6i6w",
  },
  {
    title: "Maui Landscape",
    location: "Maui, Hawaii",
    category: "Cinematic",
    youtubeId: "qeaulLbKas4",
  },
];

export default function FeaturedWork() {
  const [openVideo, setOpenVideo] = useState<{ id: string; title: string; vertical: boolean } | null>(
    null
  );

  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-3">
      {featured.map((item, i) => (
        <Reveal key={item.title} delay={i * 100} className="self-start">
          <VideoThumb
            title={item.title}
            location={item.location}
            category={item.category}
            previewSrc={item.previewSrc}
            youtubeId={item.youtubeId}
            vertical={item.vertical}
            pillarboxed={item.pillarboxed}
            onClick={
              item.youtubeId
                ? () =>
                    setOpenVideo({
                      id: item.youtubeId!,
                      title: item.title,
                      vertical: !!item.vertical,
                    })
                : undefined
            }
            className="rounded-2xl"
          />
          {item.projectHref && (
            <Link
              href={item.projectHref}
              className="mt-3 inline-block text-sm font-medium text-fg-muted transition-colors hover:text-fg"
            >
              View the Jellystone Zion project <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </Reveal>
      ))}

      {openVideo && (
        <VideoLightbox
          youtubeId={openVideo.id}
          title={openVideo.title}
          vertical={openVideo.vertical}
          onClose={() => setOpenVideo(null)}
        />
      )}
    </div>
  );
}
