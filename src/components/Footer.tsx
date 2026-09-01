import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border pb-24 md:pb-0">
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Image
              src="/logo-mark-white.png"
              alt="Apex Visuals LLC"
              width={40}
              height={40}
            />
            <p className="mt-4 text-sm leading-relaxed text-fg-muted">
              Aerial drone photography, cinematic video, and social media content for
              businesses across Provo, Orem, Lehi, and Utah County.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-fg-muted hover:text-fg">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="text-sm text-fg-muted">
            <p className="text-fg-faint">Apex Visuals LLC</p>
            <p>Provo, Utah</p>
            <p>
              <a href="mailto:russfilmz808@gmail.com" className="hover:text-fg">
                russfilmz808@gmail.com
              </a>
            </p>
            <p>
              <a href="tel:+18088664664" className="hover:text-fg">
                (808) 866-4664
              </a>
            </p>
            <p>
              <a
                href="https://www.instagram.com/russ_filmz/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-fg"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
                @russ_filmz
              </a>
            </p>
            <p className="mt-2">FAA Part 107 Certified</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-fg-faint md:flex-row md:items-center md:justify-between">
          <p>&copy; {year} Apex Visuals LLC. All rights reserved.</p>
          <p>Serving Provo, Orem, Lehi, and Utah County.</p>
        </div>
      </div>
    </footer>
  );
}
