"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "cover" | "reveal";

export default function RouteShutter() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      setPhase("cover");
      raf2 = requestAnimationFrame(() => setPhase("reveal"));
    });
    const cleanup = setTimeout(() => setPhase("idle"), 750);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(cleanup);
    };
  }, [pathname]);

  const clipPath = phase === "cover" ? "circle(150vmax at 50% 50%)" : "circle(0px at 50% 50%)";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[70] bg-bg ${
        phase === "reveal" ? "transition-[clip-path] duration-500 ease-in-out" : ""
      }`}
      style={{ clipPath }}
    />
  );
}
