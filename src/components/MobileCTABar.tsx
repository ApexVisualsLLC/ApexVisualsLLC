"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function MobileCTABar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/contact" || pathname.startsWith("/book")) return null;

  return (
    // Positioning/transform lives on this outer element and nothing else —
    // iOS Safari has a well-known bug where `position: fixed` combined with
    // `backdrop-filter` on the very same element can detach it from the
    // viewport mid-scroll (it renders floating at an arbitrary spot instead
    // of staying pinned to the bottom). Keeping backdrop-blur on a separate
    // inner element avoids that.
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div
        className="border-t border-border bg-bg/95 backdrop-blur-md"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-between gap-4 px-5 py-3">
          <p className="text-sm font-medium text-fg-muted">Ready to elevate your brand?</p>
          <Link
            href="/book"
            className="shrink-0 rounded-full bg-fg px-5 py-2.5 text-sm font-semibold tracking-wide text-bg transition-opacity hover:opacity-85"
          >
            START A PROJECT
          </Link>
        </div>
      </div>
    </div>
  );
}
