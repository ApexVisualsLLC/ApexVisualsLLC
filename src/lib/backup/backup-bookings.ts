import "server-only";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { bookings } from "@/lib/db/schema";
import { getSheetsClient } from "./sheets-client";

const SHEET_NAME = "Bookings";

const HEADER = [
  "ID",
  "Status",
  "Package",
  "Client Name",
  "Client Email",
  "Client Phone",
  "Project Details",
  "Requested Start (UTC)",
  "Duration (min)",
  "Decline Reason",
  "Created At (UTC)",
  "Accepted At (UTC)",
  "Declined At (UTC)",
];

/**
 * Rewrites the entire sheet with the current state of the bookings table,
 * rather than appending an ever-growing log. This keeps it a clean, current
 * mirror of the database — the point isn't a change history (Neon's PITR
 * covers recent changes), it's having a full independent copy of the data
 * that survives even if the database itself becomes unavailable.
 */
export async function backupBookingsToSheet(): Promise<{ rowCount: number }> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID is not set.");
  }

  const rows = await db.select().from(bookings).orderBy(desc(bookings.createdAt));

  const values = [
    HEADER,
    ...rows.map((b) => [
      b.id,
      b.status,
      b.package,
      b.clientName,
      b.clientEmail,
      b.clientPhone ?? "",
      b.projectDetails,
      b.requestedStartAt?.toISOString() ?? "",
      b.durationMinutes ?? "",
      b.declineReason ?? "",
      b.createdAt.toISOString(),
      b.acceptedAt?.toISOString() ?? "",
      b.declinedAt?.toISOString() ?? "",
    ]),
  ];

  const sheets = getSheetsClient();

  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `${SHEET_NAME}!A:Z`,
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${SHEET_NAME}!A1`,
    valueInputOption: "RAW",
    requestBody: { values },
  });

  return { rowCount: rows.length };
}
