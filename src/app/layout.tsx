import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GrainOverlay from "@/components/GrainOverlay";
import MobileCTABar from "@/components/MobileCTABar";
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

const siteUrl = "https://apexvisualsutah.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Apex Visuals LLC — Aerial Drone Photography & Cinematic Video | Utah",
  description:
    "FAA Part 107 licensed drone photography and cinematic video production serving Provo and Utah County. Professional aerial photography, brand videos, and social media content.",
  keywords: [
    "drone photography Utah",
    "aerial photography Provo Utah",
    "cinematic video production Utah",
    "real estate drone photography Utah County",
    "social media content creation Provo",
    "FAA Part 107 drone pilot Utah",
    "commercial drone photography Utah",
    "video production Provo Utah",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Apex Visuals LLC",
    url: siteUrl,
    title: "Apex Visuals LLC — Aerial Drone Photography & Cinematic Video | Utah",
    description:
      "FAA Part 107 licensed drone photography and cinematic video production serving Provo and Utah County.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apex Visuals LLC — Aerial Drone Photography & Cinematic Video | Utah",
    description:
      "FAA Part 107 licensed drone photography and cinematic video production serving Provo and Utah County.",
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#14100c",
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Apex Visuals LLC",
  image: `${siteUrl}/logo-full-white.png`,
  url: siteUrl,
  /* REPLACE: telephone — Russell's business phone number */
  telephone: "",
  /* REPLACE: email — Russell's business email */
  email: "",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Provo",
    addressRegion: "UT",
    addressCountry: "US",
  },
  areaServed: [
    { "@type": "City", name: "Provo" },
    { "@type": "City", name: "Orem" },
    { "@type": "City", name: "Lehi" },
    { "@type": "AdministrativeArea", name: "Utah County" },
    { "@type": "State", name: "Utah" },
  ],
  priceRange: "$175-$650",
  founder: {
    "@type": "Person",
    name: "Russell Bowden",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${editorial.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-fg">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <GrainOverlay />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileCTABar />
        <Analytics />
      </body>
    </html>
  );
}
