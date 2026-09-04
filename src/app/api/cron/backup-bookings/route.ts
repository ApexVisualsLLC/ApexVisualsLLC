import { NextResponse } from "next/server";
import { backupBookingsToSheet } from "@/lib/backup/backup-bookings";

/**
 * Called once daily by Vercel Cron (see vercel.json). Vercel automatically
 * sends `Authorization: Bearer $CRON_SECRET` on requests it makes to cron
 * endpoints when CRON_SECRET is set — this rejects anyone else who finds
 * the URL and tries to trigger it manually.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
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
