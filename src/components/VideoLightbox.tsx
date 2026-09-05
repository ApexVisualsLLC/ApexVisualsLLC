"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement,
        opts: {
          events: {
            onReady: (e: { target: YTPlayer }) => void;
            onStateChange: (e: { data: number; target: YTPlayer }) => void;
            onPlaybackQualityChange: (e: { data: string; target: YTPlayer }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: { PLAYING: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YTPlayer = {
  getAvailableQualityLevels: () => string[];
  getPlaybackQuality: () => string;
  setPlaybackQuality: (quality: string) => void;
  destroy: () => void;
};

let apiPromise: Promise<void> | null = null;

// Loads the YouTube IFrame API script once and shares the promise across
// every lightbox instance (the global callback can only be set once).
function loadYouTubeIframeAPI(): Promise<void> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });
  return apiPromise;
}

// Pushes playback to the highest quality YouTube reports as available.
// Note: YouTube's algorithm auto-manages resolution based on player size and
// connection speed and no longer guarantees a forced quality — this is a
// best-effort request. A single call is easily overridden by YouTube's own
// adaptive bitrate logic in the first second or two of playback, so callers
// re-assert this repeatedly (see RETRY_DELAYS_MS and onPlaybackQualityChange
// below) rather than relying on one shot.
function requestHighestQuality(player: YTPlayer) {
  const levels = player.getAvailableQualityLevels();
  if (levels[0]) player.setPlaybackQuality(levels[0]);
}

// How long after playback starts to keep re-requesting the top quality —
// covers the window where YouTube's own bitrate ramp-up tends to override a
// single early request.
const RETRY_DELAYS_MS = [250, 750, 1500, 3000];

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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);

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

  useEffect(() => {
    let cancelled = false;
    const retryTimers: ReturnType<typeof setTimeout>[] = [];

    loadYouTubeIframeAPI().then(() => {
      if (cancelled || !iframeRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: (e) => requestHighestQuality(e.target),
          onStateChange: (e) => {
            if (e.data !== window.YT!.PlayerState.PLAYING) return;
            requestHighestQuality(e.target);
            // A single request is easily overridden by YouTube's own bitrate
            // ramp-up right as playback begins, so keep re-asserting for the
            // first few seconds instead of trusting the first call to stick.
            for (const delay of RETRY_DELAYS_MS) {
              retryTimers.push(setTimeout(() => requestHighestQuality(e.target), delay));
            }
          },
          // Self-correcting: if YouTube drops quality on its own after our
          // request took effect, ask again immediately rather than waiting
          // for the fixed retry schedule above to catch it.
          onPlaybackQualityChange: (e) => {
            const levels = e.target.getAvailableQualityLevels();
            if (levels[0] && e.data !== levels[0]) {
              e.target.setPlaybackQuality(levels[0]);
            }
          },
        },
      });
    });
    return () => {
      cancelled = true;
      for (const timer of retryTimers) clearTimeout(timer);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [youtubeId]);

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
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&enablejsapi=1&vq=hd1080&origin=${encodeURIComponent(window.location.origin)}`}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
