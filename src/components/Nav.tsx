"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Magnetic from "@/components/Magnetic";

const links = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || menuOpen
          ? "bg-bg/90 backdrop-blur-md border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="flex items-center gap-2" aria-label="Apex Visuals LLC home">
          <Image
            src="/logo-mark-white.png"
            alt="Apex Visuals LLC"
            width={34}
            height={34}
            priority
          />
        </Link>

        <nav className="hidden md:flex md:absolute md:left-1/2 md:-translate-x-1/2 md:items-center md:gap-10">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm tracking-wide transition-colors ${
                  active
                    ? "font-semibold text-fg [text-shadow:0_0_16px_rgba(244,243,240,0.65)]"
                    : "font-medium text-fg/70 hover:text-fg"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Magnetic className="hidden md:inline-block">
          <Link
            href="/contact"
            className="inline-block rounded-full bg-fg px-5 py-2.5 text-sm font-semibold tracking-wide text-bg transition-opacity hover:opacity-85"
          >
            START A PROJECT
          </Link>
        </Magnetic>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
          className="flex h-10 w-10 items-center justify-center md:hidden"
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 top-0 block h-[1.5px] w-6 bg-fg transition-transform duration-300 ${
                menuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 bottom-0 block h-[1.5px] w-6 bg-fg transition-transform duration-300 ${
                menuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-border bg-bg px-6 pb-6 pt-2 md:hidden">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                aria-current={active ? "page" : undefined}
                className={`py-3 text-base ${
                  active
                    ? "font-semibold text-fg [text-shadow:0_0_16px_rgba(244,243,240,0.65)]"
                    : "font-medium text-fg/70"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            onClick={closeMenu}
            className="mt-3 rounded-full bg-fg px-5 py-3 text-center text-sm font-semibold tracking-wide text-bg"
          >
            START A PROJECT
          </Link>
        </nav>
      )}
    </header>
  );
}
