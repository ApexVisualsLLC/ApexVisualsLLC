"use client";

import { useEffect, useRef } from "react";

const FILM_GRADE = "[filter:sepia(0.2)_contrast(1.05)_saturate(1.05)]";
const FADE_WINDOW = 0.18;

type Clip = { src: string; label: string };

const clips: Clip[] = [
  { src: "/videos/jellystone-social-01.mp4", label: "Water slide" },
  { src: "/videos/jellystone-social-02.mp4", label: "Racing slides" },
  { src: "/videos/jellystone-social-04.mp4", label: "Toilet bowl slide" },
  { src: "/videos/jellystone-social-05.mp4", label: "Lazy river" },
  { src: "/videos/jellystone-social-06.mp4", label: "Racing slides" },
  { src: "/videos/jellystone-social-07.mp4", label: "Lazy river tubes" },
  { src: "/videos/jellystone-social-08.mp4", label: "Toilet bowl slide" },
  { src: "/videos/jellystone-social-09.mp4", label: "Splash boat" },
];

function LoopingClip({ src, className = "" }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.style.opacity = "1";
      return;
    }

    const tick = () => {
      const { currentTime: t, duration: d } = video;
      if (d) {
        let opacity = 1;
        if (t < FADE_WINDOW) {
          opacity = 0.3 + 0.7 * (t / FADE_WINDOW);
        } else if (t > d - FADE_WINDOW) {
          opacity = 0.3 + 0.7 * ((d - t) / FADE_WINDOW);
        }
        video.style.opacity = String(opacity);
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(video);

    return () => {
      cancelAnimationFrame(frameRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      preload="auto"
      className={`transition-opacity duration-75 ease-linear ${className}`}
    />
  );
}

export default function VideoWall() {
  return (
    <div>
      <div className="grid grid-cols-4 auto-rows-[90px] gap-1.5 overflow-hidden rounded-2xl sm:auto-rows-[110px] md:auto-rows-[130px]">
        <div className="relative col-span-2 row-span-2 overflow-hidden">
          <LoopingClip
            src="/videos/jellystone-social-featured.mp4"
            className={`h-full w-full object-cover ${FILM_GRADE}`}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at center, transparent 45%, rgba(8,5,3,0.55) 100%)",
            }}
          />
        </div>

        {clips.map((clip) => (
          <div key={clip.src} className="relative overflow-hidden">
            <LoopingClip src={clip.src} className={`h-full w-full object-cover ${FILM_GRADE}`} />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse at center, transparent 45%, rgba(8,5,3,0.55) 100%)",
              }}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-baseline gap-3 border-t border-border pt-6">
        <span className="font-serif text-3xl font-bold">250+</span>
        <span className="text-xs uppercase tracking-[0.15em] text-fg-faint">
          Short-form videos created for Jellystone Zion
        </span>
      </div>
    </div>
  );
}
