"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { target: 50, suffix: "+", label: "Projects Delivered" },
  { target: 4, suffix: "+", label: "Years of Experience" },
  { target: 5, suffix: "-Day", label: "Delivery" },
  { target: 100, suffix: "%", label: "FAA Part 107 Compliant" },
];

const DURATION_MS = 1400;

function useCountUp(target: number, start: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }

    const startTime = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target]);

  return value;
}

function Stat({ stat, start }: { stat: (typeof stats)[number]; start: boolean }) {
  const count = useCountUp(stat.target, start);
  return (
    <div className="text-center">
      <p className="font-serif text-4xl font-bold sm:text-5xl">
        {count}
        {stat.suffix}
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.15em] text-fg-faint">{stat.label}</p>
    </div>
  );
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 gap-8 sm:grid-cols-4">
      {stats.map((stat) => (
        <Stat key={stat.label} stat={stat} start={start} />
      ))}
    </div>
  );
}
