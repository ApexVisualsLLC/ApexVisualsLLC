import { NextResponse } from "next/server";
import { backupBookingsToSheet } from "@/lib/backup/backup-bookings";

/**
 * Called once daily by Vercel Cron (see vercel.json). Vercel automatically
 * sends `Authorization: Bearer $CRON_SECRET` on requests it makes to cron
 * endpoints when CRON_SECRET is set — this rejects anyone else who finds
 * the URL and tries to trigger it manually.
 */
export async function GET(request: Request) {
  // Fail closed: without this, an unset CRON_SECRET would make "Bearer undefined" a valid token.
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await backupBookingsToSheet();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Booking backup failed:", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
