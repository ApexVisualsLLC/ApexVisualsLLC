"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;

    function onMove(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const hovering = !!target.closest('[data-cursor="view"]');
      el!.style.opacity = hovering ? "1" : "0";
      el!.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%) scale(${
        hovering ? 1 : 0.4
      })`;
    }

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[80] flex h-16 w-16 items-center justify-center rounded-full border border-fg bg-bg/85 text-[10px] font-semibold uppercase tracking-widest text-fg opacity-0 backdrop-blur-sm transition-[opacity,transform] duration-200 ease-out"
    >
      View
    </div>
  );
}
