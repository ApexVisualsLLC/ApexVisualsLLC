import "server-only";
import { google, sheets_v4 } from "googleapis";
import { getGoogleServiceAccountCredentials } from "@/lib/google/credentials";

export function getSheetsClient(): sheets_v4.Sheets {
  const { clientEmail, privateKey } = getGoogleServiceAccountCredentials();

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}
