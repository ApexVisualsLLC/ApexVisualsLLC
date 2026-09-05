import "server-only";
import { GetObjectCommand, HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getR2Client, getR2BucketName } from "./r2-client";

const UPLOAD_URL_EXPIRY_SECONDS = 45 * 60;
const DOWNLOAD_URL_EXPIRY_SECONDS = 60 * 60;

/** A presigned PUT URL the browser uploads directly to, bypassing our server entirely. */
export async function createPresignedUploadUrl(key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: getR2BucketName(),
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(getR2Client(), command, { expiresIn: UPLOAD_URL_EXPIRY_SECONDS });
}

/**
 * A presigned GET URL forcing a download (not an inline open) with the
 * original filename. Generated fresh on every page load — never stored.
 */
export async function createPresignedDownloadUrl(key: string, filename: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: getR2BucketName(),
    Key: key,
    ResponseContentDisposition: `attachment; filename="${filename.replace(/"/g, "")}"`,
  });
  return getSignedUrl(getR2Client(), command, { expiresIn: DOWNLOAD_URL_EXPIRY_SECONDS });
}

/** Confirms an object actually landed in R2 after a client-side upload. */
export async function objectExists(key: string): Promise<boolean> {
  try {
    await getR2Client().send(new HeadObjectCommand({ Bucket: getR2BucketName(), Key: key }));
    return true;
  } catch {
    return false;
  }
}
