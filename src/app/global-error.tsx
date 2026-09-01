"use client";

import { useEffect } from "react";
import { Playfair_Display, Inter } from "next/font/google";
import Image from "next/image";
import Magnetic from "@/components/Magnetic";
import "./globals.css";

const editorial = Playfair_Display({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export default function GlobalError({
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
    <html lang="en" className={`${editorial.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col items-center justify-center bg-bg px-6 text-center text-fg">
        <Image src="/logo-mark-white.png" alt="Apex Visuals LLC" width={48} height={48} />
        <h1 className="mt-8 font-serif text-3xl font-bold sm:text-4xl">Something Went Wrong.</h1>
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
            <a
              href="/"
              className="inline-block rounded-full border border-fg/30 px-6 py-3 text-sm font-semibold tracking-wide transition-colors hover:border-fg hover:bg-fg hover:text-bg"
            >
              Back Home
            </a>
          </Magnetic>
        </div>
      </body>
    </html>
  );
}
