"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Magnetic from "@/components/Magnetic";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <Image src="/logo-mark-white.png" alt="Apex Visuals LLC" width={48} height={48} />
      <h1 className="mt-8 font-serif text-3xl font-bold sm:text-4xl">
        Something Went Wrong.
      </h1>
      <p className="mt-4 max-w-md text-fg-muted">
        We hit an unexpected error loading this page. Try again, or head back home.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Magnetic>
          <button
            onClick={reset}
            className="inline-block rounded-full bg-fg px-6 py-3 text-sm font-semibold tracking-wide text-bg transition-opacity hover:opacity-85"
          >
            Try Again
          </button>
        </Magnetic>
        <Magnetic>
          <Link
            href="/"
            className="inline-block rounded-full border border-fg/30 px-6 py-3 text-sm font-semibold tracking-wide transition-colors hover:border-fg hover:bg-fg hover:text-bg"
          >
            Back Home
          </Link>
        </Magnetic>
      </div>
    </div>
  );
}
