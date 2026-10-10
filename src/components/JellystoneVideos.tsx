"use client";

import { useState } from "react";
import { VideoThumb } from "@/components/PlaceholderMedia";
import VideoLightbox from "@/components/VideoLightbox";
import Reveal from "@/components/Reveal";

type Clip = { title: string; youtubeId: string; category: string; vertical: boolean };

/* Park Highlight is 4:3 footage. Its YouTube thumbnail has black bars baked in, so the card uses a
   bar-free poster cropped from that thumbnail (public/jellystone/park-highlight-poster.jpg). */
const FEATURED: Clip = {
  title: "Park Highlight",
  youtubeId: "OIJLkrlNbNk",
  category: "Commercial",
  vertical: false,
};

const MORE: Clip[] = [
  { title: "Friday Night Party", youtubeId: "jWHG1yUGaK4", category: "Commercial", vertical: true },
  { title: "Golden Hour", youtubeId: "3S_L09IBwYM", category: "Commercial", vertical: true },
  { title: "Racing Water Slides — 360 Aerial", youtubeId: "IWPkTmCEmZE", category: "Aerial", vertical: true },
  { title: "360° Tiny Planet", youtubeId: "-TgBc5kIQK8", category: "Aerial", vertical: true },
  { title: "Park Overview", youtubeId: "DDhS_1Op-RI", category: "Commercial", vertical: true },
];

export default function JellystoneVideos() {
  const [open, setOpen] = useState<Clip | null>(null);

  return (
    <div>
      <Reveal>
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14">
          <VideoThumb
            title={FEATURED.title}
            location="Jellystone Zion"
            category={FEATURED.category}
            featured
            photoSrc="/jellystone/park-highlight-poster.jpg"
            aspectClassName="aspect-[4/3]"
            youtubeId={FEATURED.youtubeId}
            onClick={() => setOpen(FEATURED)}
            className="rounded-2xl"
          />
          <div>
            <h3 className="font-serif text-2xl font-bold sm:text-3xl">Park Highlight Video</h3>
            <p className="mt-4 leading-relaxed text-fg-muted">
              A short look at the guest experience at Jellystone Zion in St. George, Utah &mdash;
              pool deck activities at golden hour. Filmed and edited by Apex Visuals.
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <h3 className="mt-16 font-serif text-xl font-bold">More from this project</h3>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {MORE.map((clip) => (
            <VideoThumb
              key={clip.youtubeId}
              title={clip.title}
              location="Jellystone Zion"
              category={clip.category}
              youtubeId={clip.youtubeId}
              vertical={clip.vertical}
              onClick={() => setOpen(clip)}
              className="rounded-2xl"
            />
          ))}
        </div>
      </Reveal>

      {open && (
        <VideoLightbox
          youtubeId={open.youtubeId}
          title={`Jellystone Zion — ${open.title}`}
          vertical={open.vertical}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}
