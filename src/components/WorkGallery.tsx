"use client";

import { useState } from "react";
import Link from "next/link";
import { VideoThumb } from "@/components/PlaceholderMedia";
import VideoLightbox from "@/components/VideoLightbox";
import Reveal from "@/components/Reveal";

type Category = "Commercial" | "Aerial" | "Cinematic";
const tabs: ("All" | Category)[] = ["All", "Commercial", "Aerial", "Cinematic"];

type WorkItem = {
  title: string;
  location: string;
  /* First category is the badge label shown on the card. Additional categories just add
     the card to that tab too — e.g. a Commercial video that's also drone footage can list
     ["Commercial", "Aerial"] to appear under both without leaving Commercial. */
  categories: Category[];
  photoSrc?: string;
  previewSrc?: string;
  youtubeId?: string;
  vertical?: boolean;
  /* 4:3 footage whose YouTube thumbnail has black side bars baked in — see VideoThumb. */
  pillarboxed?: boolean;
  /* Optional project page this video belongs to; adds a crawlable link under the card. */
  projectHref?: string;
};

const JELLYSTONE_PROJECT = "/work/jellystone-zion";

/* REPLACE: add `previewSrc: "/videos/<file>.mp4"` to any item below once Russell drops a
   short muted preview clip into public/videos/ — it'll autoplay on hover. Until then these
   fall back to the static placeholder thumbnail (or photoSrc still, if set). */
const items: WorkItem[] = [
  {
    title: "Jellystone Zion Camp-Resort — Park Highlight Video",
    location: "Zion, Utah",
    categories: ["Commercial"],
    youtubeId: "OIJLkrlNbNk",
    projectHref: JELLYSTONE_PROJECT,
    pillarboxed: true,
  },
  {
    title: "Jellystone Zion — Friday Night Party Video",
    location: "Zion, Utah",
    categories: ["Commercial"],
    youtubeId: "jWHG1yUGaK4",
    projectHref: JELLYSTONE_PROJECT,
    vertical: true,
  },
  {
    title: "Jellystone Zion Water Park — Golden Hour Video",
    location: "Zion, Utah",
    categories: ["Commercial"],
    youtubeId: "3S_L09IBwYM",
    projectHref: JELLYSTONE_PROJECT,
    vertical: true,
  },
  {
    title: "Jellystone Zion Racing Water Slides — 360 Aerial Video",
    location: "Zion, Utah",
    categories: ["Commercial", "Aerial"],
    youtubeId: "IWPkTmCEmZE",
    projectHref: JELLYSTONE_PROJECT,
    vertical: true,
  },
  {
    title: "Jellystone Zion Water Slide — 360° Tiny Planet Video",
    location: "Zion, Utah",
    categories: ["Commercial", "Aerial"],
    youtubeId: "-TgBc5kIQK8",
    projectHref: JELLYSTONE_PROJECT,
    vertical: true,
  },
  {
    title: "Jellystone Zion Park Overview",
    location: "Zion, Utah",
    categories: ["Commercial"],
    youtubeId: "DDhS_1Op-RI",
    projectHref: JELLYSTONE_PROJECT,
    vertical: true,
  },
  {
    title: "Desert Run",
    location: "Southern Utah",
    categories: ["Aerial"],
    youtubeId: "zgsXgRL6i6w",
  },
  {
    title: "Peace",
    location: "Utah",
    categories: ["Cinematic"],
    youtubeId: "zar_fTE1TUs",
  },
  {
    title: "Nothing With You",
    location: "Utah",
    categories: ["Cinematic", "Aerial"],
    youtubeId: "xKVCmB_V0qY",
  },
  {
    title: "Maui Landscape",
    location: "Maui, Hawaii",
    categories: ["Cinematic"],
    youtubeId: "qeaulLbKas4",
  },
];

export default function WorkGallery() {
  const [active, setActive] = useState<(typeof tabs)[number]>("All");
  const [openVideo, setOpenVideo] = useState<{ id: string; title: string; vertical: boolean } | null>(
    null
  );
  const visible =
    active === "All" ? items : items.filter((item) => item.categories.includes(active));

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

      <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3">
        {visible.map((item, i) => (
          <Reveal
            key={item.title}
            delay={Math.min(i, 5) * 80}
            className={`mb-6 break-inside-avoid ${i === 0 ? "[column-span:all]" : ""}`}
          >
            <VideoThumb
              title={item.title}
              location={item.location}
              category={item.categories[0]}
              photoSrc={item.photoSrc}
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
              featured={i === 0}
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
