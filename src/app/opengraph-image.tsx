import { buildOgImage, ogImageSize } from "@/lib/og-image";

export const size = ogImageSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return buildOgImage();
}
