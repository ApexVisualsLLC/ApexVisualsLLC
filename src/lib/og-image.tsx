import { readFileSync } from "fs";
import { join } from "path";
import { ImageResponse } from "next/og";

export const ogImageSize = { width: 1200, height: 630 };

export function buildOgImage() {
  const logoPath = join(process.cwd(), "public", "logo-mark-white.png");
  const logoSrc = `data:image/png;base64,${readFileSync(logoPath).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#111111",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={130} height={130} alt="" />
        <div
          style={{
            marginTop: 36,
            fontSize: 58,
            fontWeight: 800,
            letterSpacing: 6,
            color: "#f5f5f5",
          }}
        >
          APEX VISUALS LLC
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 26,
            letterSpacing: 1,
            color: "rgba(245,245,245,0.62)",
          }}
        >
          Aerial Drone Photography &amp; Cinematic Video — Utah
        </div>
      </div>
    ),
    { ...ogImageSize }
  );
}
