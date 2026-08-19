"use client";

import { useRef } from "react";

export default function CursorGlow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const glowRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    glowRef.current?.style.setProperty("--mx", `${x}%`);
    glowRef.current?.style.setProperty("--my", `${y}%`);
  }

  return (
    <div onMouseMove={handleMouseMove} className={`group relative ${className}`}>
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), rgba(240,232,216,0.12), transparent 65%)",
        }}
      />
      {children}
    </div>
  );
}
