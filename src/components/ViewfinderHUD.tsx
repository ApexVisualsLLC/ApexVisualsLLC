"use client";

import { useEffect, useState } from "react";

function formatTimecode(ms: number) {
  const fps = 24;
  const totalFrames = Math.floor((ms / 1000) * fps);
  const frames = totalFrames % fps;
  const totalSeconds = Math.floor(totalFrames / fps);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
}

export default function ViewfinderHUD() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    const id = setInterval(() => setElapsed(performance.now() - start), 42);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <div className="pointer-events-none absolute left-6 top-24 hidden font-mono text-[11px] tracking-wider text-fg-faint/70 sm:block md:left-10">
        40.2338° N · 111.6585° W
      </div>
      <div className="pointer-events-none absolute bottom-10 right-6 hidden font-mono text-[11px] tracking-wider text-fg-faint/70 sm:block md:right-10">
        {formatTimecode(elapsed)}
      </div>
    </>
  );
}
