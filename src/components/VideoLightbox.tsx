"use client";

import { useEffect } from "react";

export default function VideoLightbox({
  youtubeId,
  title,
  vertical = false,
  onClose,
}: {
  youtubeId: string;
  title: string;
  vertical?: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close video"
        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-fg/30 text-fg transition-colors hover:border-fg hover:bg-fg hover:text-bg"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <div
        className={`relative overflow-hidden rounded-lg bg-black shadow-[0_30px_80px_rgba(0,0,0,0.6)] ${
          vertical
            ? "aspect-[9/16] h-[85vh] max-h-[85vh] w-auto"
            : "aspect-video w-full max-w-3xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
