"use client";

import { useState } from "react";
import { VideoThumb } from "@/components/PlaceholderMedia";
import VideoLightbox from "@/components/VideoLightbox";
import Reveal from "@/components/Reveal";

type Category = "Commercial" | "Aerial" | "Cinematic";
const tabs: ("All" | Category)[] = ["All", "Commercial", "Aerial", "Cinematic"];

type WorkItem = {
  title: string;
  location: string;
  category: Category;
  photoSrc?: string;
  previewSrc?: string;
  youtubeId?: string;
  vertical?: boolean;
};

/* REPLACE: add `previewSrc: "/videos/<file>.mp4"` to any item below once Russell drops a
   short muted preview clip into public/videos/ — it'll autoplay on hover. Until then these
   fall back to the static placeholder thumbnail (or photoSrc still, if set). */
const items: WorkItem[] = [
  {
    title: "Jellystone Zion Camp-Resort — Park Highlight Video",
    location: "Zion, Utah",
    category: "Commercial",
    youtubeId: "OIJLkrlNbNk",
  },
  {
    title: "Jellystone Zion — Friday Night Party Video",
    location: "Zion, Utah",
    category: "Commercial",
    youtubeId: "jWHG1yUGaK4",
    vertical: true,
  },
  {
    title: "Jellystone Zion Water Park — Golden Hour Video",
    location: "Zion, Utah",
    category: "Commercial",
    youtubeId: "3S_L09IBwYM",
    vertical: true,
  },
  {
    title: "Jellystone Zion Racing Water Slides — 360 Aerial Video",
    location: "Zion, Utah",
    category: "Commercial",
    youtubeId: "IWPkTmCEmZE",
    vertical: true,
  },
  {
    title: "Jellystone Zion Water Slide — 360° Tiny Planet Video",
    location: "Zion, Utah",
    category: "Commercial",
    youtubeId: "-TgBc5kIQK8",
    vertical: true,
  },
  { title: "Utah Red Rock Aerial", location: "Southern Utah", category: "Aerial" },
  { title: "Canyon Flyover", location: "Southern Utah", category: "Aerial" },
  { title: "Desert Landscape Drone Reel", location: "Southern Utah", category: "Aerial" },
  { title: "Maui Waterfall Edit", location: "Maui, Hawaii", category: "Cinematic" },
  {
    title: "Desert Road Edit",
    location: "Southern Utah",
    category: "Cinematic",
    photoSrc: "/desert-road.jpg",
  },
  { title: "There's This Place I Go", location: "Maui, Hawaii", category: "Cinematic" },
  { title: "Utah Arch Sunset", location: "Southern Utah", category: "Cinematic" },
];

export default function WorkGallery() {
  const [active, setActive] = useState<(typeof tabs)[number]>("All");
  const [openVideo, setOpenVideo] = useState<{ id: string; title: string; vertical: boolean } | null>(
    null
  );
  const visible = active === "All" ? items : items.filter((item) => item.category === active);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter portfolio by category"
        className="flex flex-wrap gap-2"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={active === tab}
            onClick={() => setActive(tab)}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
              active === tab
                ? "border-fg bg-fg text-bg"
                : "border-border text-fg-muted hover:border-fg/40 hover:text-fg"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item, i) => (
          <Reveal
            key={item.title}
            delay={Math.min(i, 5) * 80}
            className={i === 0 ? "sm:col-span-2" : ""}
          >
            <VideoThumb
              title={item.title}
              location={item.location}
              category={item.category}
              photoSrc={item.photoSrc}
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
              featured={i === 0}
              className="rounded-2xl"
            />
          </Reveal>
        ))}
      </div>

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
