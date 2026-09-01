"use client";

import { useState } from "react";
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
  },
  { title: "Red Rock Canyon Flyover", location: "Southern Utah", category: "Aerial" },
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
        <Reveal key={item.title} delay={i * 100}>
          <VideoThumb
            title={item.title}
            location={item.location}
            category={item.category}
            previewSrc={item.previewSrc}
            youtubeId={item.youtubeId}
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
