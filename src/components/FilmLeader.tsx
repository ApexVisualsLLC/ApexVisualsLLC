"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return (
    sessionStorage.getItem("av-leader-seen") === "1" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function getServerSnapshot() {
  return true;
}

export default function FilmLeader() {
  const skip = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [count, setCount] = useState(3);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!skip) sessionStorage.setItem("av-leader-seen", "1");
  }, [skip]);

  useEffect(() => {
    if (skip || done) return;
    if (count <= 1) {
      const t = setTimeout(() => setDone(true), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount((c) => c - 1), 480);
    return () => clearTimeout(t);
  }, [skip, done, count]);

  if (skip || done) return null;

  return (
    <div
      role="status"
      aria-label="Loading"
      onClick={() => setDone(true)}
      className="fixed inset-0 z-[55] flex cursor-pointer flex-col items-center justify-center bg-bg"
    >
      <div className="relative flex h-32 w-32 items-center justify-center sm:h-36 sm:w-36">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(244,243,240,0.15)" strokeWidth="1" />
          <circle
            key={count}
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="#f4f3f0"
            strokeWidth="1.5"
            strokeDasharray="289"
            style={{ animation: "leader-sweep 0.48s linear forwards" }}
          />
        </svg>
        <span className="font-serif text-5xl font-bold sm:text-6xl">{count}</span>
      </div>
      <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-fg-faint">Tap to skip</p>
    </div>
  );
}
