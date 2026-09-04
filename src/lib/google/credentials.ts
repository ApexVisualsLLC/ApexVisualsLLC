import "server-only";

/**
 * Private keys stored in Vercel's dashboard keep real embedded newlines
 * (fine, used as-is). The same key stored in a flat .env.local file has to
 * be JSON-escaped onto one line — this undoes that encoding either way.
 */
function normalizePrivateKey(raw: string): string {
  let key = raw.trim();
  if (key.startsWith('"') && key.endsWith('"')) {
    key = JSON.parse(key);
  }
  return key.replace(/\\n/g, "\n");
}

/**
 * One service account (originally set up for the Sheets backup) is shared
 * across both the Sheets backup and the Calendar availability lookup — env
 * vars keep the GOOGLE_SHEETS_* names since that's what's already configured
 * in Vercel, but the credentials themselves aren't Sheets-specific.
 */
export function getGoogleServiceAccountCredentials(): {
  clientEmail: string;
  privateKey: string;
} {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error("GOOGLE_SHEETS_CLIENT_EMAIL or GOOGLE_SHEETS_PRIVATE_KEY is not set.");
  }

  return { clientEmail, privateKey: normalizePrivateKey(privateKey) };
}
