"use client";

import { useState } from "react";
import { VideoThumb } from "@/components/PlaceholderMedia";

type Category = "Commercial" | "Aerial" | "Cinematic";
const tabs: ("All" | Category)[] = ["All", "Commercial", "Aerial", "Cinematic"];

const items: { title: string; location: string; category: Category }[] = [
  { title: "Jellystone Zion — Aerial Grounds Overview", location: "Zion, Utah", category: "Commercial" },
  { title: "Jellystone Zion — Ground Photography", location: "Zion, Utah", category: "Commercial" },
  { title: "Jellystone Zion — Water Park in Slow Motion", location: "Zion, Utah", category: "Commercial" },
  { title: "Jellystone Zion — Cinematic Brand Video", location: "Zion, Utah", category: "Commercial" },
  { title: "Utah Red Rock Aerial", location: "Southern Utah", category: "Aerial" },
  { title: "Canyon Flyover", location: "Southern Utah", category: "Aerial" },
  { title: "Desert Landscape Drone Reel", location: "Southern Utah", category: "Aerial" },
  { title: "Maui Waterfall Edit", location: "Maui, Hawaii", category: "Cinematic" },
  { title: "Desert Road Edit", location: "Southern Utah", category: "Cinematic" },
  { title: "There's This Place I Go", location: "Maui, Hawaii", category: "Cinematic" },
  { title: "Utah Arch Sunset", location: "Southern Utah", category: "Cinematic" },
];

export default function WorkGallery() {
  const [active, setActive] = useState<(typeof tabs)[number]>("All");
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
        {visible.map((item) => (
          <VideoThumb key={item.title} {...item} className="rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
