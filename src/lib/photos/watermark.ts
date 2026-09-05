import "server-only";
import { readFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import {
  PREVIEW_JPEG_QUALITY,
  PREVIEW_MAX_DIMENSION,
  WATERMARK_LOGO_FILENAME,
  WATERMARK_OPACITY,
  WATERMARK_TILE_SPACING_X,
  WATERMARK_TILE_SPACING_Y,
  WATERMARK_TILE_WIDTH,
} from "./watermark-config";

let tileBufferPromise: Promise<Buffer> | null = null;

/**
 * Loads Russell's logo once per invocation and reduces its opacity — the
 * standard sharp recipe for adjusting a PNG's alpha channel without
 * touching its RGB: linear([1,1,1,opacity], [0,0,0,0]) multiplies alpha by
 * `opacity` and leaves color untouched.
 */
function getWatermarkTile(): Promise<Buffer> {
  if (!tileBufferPromise) {
    tileBufferPromise = (async () => {
      // The "public" segment is a literal (not passed through a variable) so
      // Next's build-time file tracer can scope its inclusion to that
      // subfolder instead of conservatively bundling the entire project.
      const logoPath = path.join(process.cwd(), "public", WATERMARK_LOGO_FILENAME);
      const logoBuffer = await readFile(logoPath);
      return sharp(logoBuffer)
        .resize({ width: WATERMARK_TILE_WIDTH })
        .ensureAlpha()
        .linear([1, 1, 1, WATERMARK_OPACITY], [0, 0, 0, 0])
        .png()
        .toBuffer();
    })();
  }
  return tileBufferPromise;
}

/**
 * Downsizes and tiles a semi-transparent watermark across a full-quality
 * photo. Both the downsize and the tiling matter as a deterrent against
 * using the unpaid preview, not just the logo overlay.
 */
export async function watermarkPhoto(originalBuffer: Buffer): Promise<Buffer> {
  const tile = await getWatermarkTile();

  const resizedBuffer = await sharp(originalBuffer)
    .rotate() // respects EXIF orientation before any resize/composite math
    .resize({
      width: PREVIEW_MAX_DIMENSION,
      height: PREVIEW_MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .toBuffer();

  const { width, height } = await sharp(resizedBuffer).metadata();
  if (!width || !height) {
    throw new Error("Could not read resized image dimensions.");
  }

  const composites: { input: Buffer; top: number; left: number }[] = [];
  for (let top = 0; top < height; top += WATERMARK_TILE_SPACING_Y) {
    for (let left = 0; left < width; left += WATERMARK_TILE_SPACING_X) {
      composites.push({ input: tile, top, left });
    }
  }

  return sharp(resizedBuffer).composite(composites).jpeg({ quality: PREVIEW_JPEG_QUALITY }).toBuffer();
}
