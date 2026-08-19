import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found — Apex Visuals LLC",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <Image src="/logo-mark-white.png" alt="Apex Visuals LLC" width={48} height={48} />
      <p className="mt-8 font-serif text-7xl font-bold text-fg-faint sm:text-8xl">404</p>
      <h1 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">
        Looks Like This Page Flew Off the Map.
      </h1>
      <p className="mt-4 max-w-md text-fg-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="rounded-full bg-fg px-6 py-3 text-sm font-semibold tracking-wide text-bg transition-opacity hover:opacity-85"
        >
          Back Home
        </Link>
        <Link
          href="/work"
          className="rounded-full border border-fg/30 px-6 py-3 text-sm font-semibold tracking-wide transition-colors hover:border-fg hover:bg-fg hover:text-bg"
        >
          View Our Work
        </Link>
      </div>
    </div>
  );
}
