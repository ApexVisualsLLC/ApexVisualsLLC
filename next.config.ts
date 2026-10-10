import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Baseline hardening for every route. SAMEORIGIN keeps the booking and admin pages from being
  // framed by other sites (clickjacking); nosniff stops browsers guessing content types.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
};

export default nextConfig;
