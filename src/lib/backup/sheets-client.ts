import "server-only";
import { google, sheets_v4 } from "googleapis";

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

export function getSheetsClient(): sheets_v4.Sheets {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error("GOOGLE_SHEETS_CLIENT_EMAIL or GOOGLE_SHEETS_PRIVATE_KEY is not set.");
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: normalizePrivateKey(privateKey),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}
