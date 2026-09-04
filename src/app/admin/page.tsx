import type { Metadata } from "next";
import { desc, inArray } from "drizzle-orm";
import { verifyAdminSession } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { bookings, bookingEmailLog, bookingCalendarSyncLog } from "@/lib/db/schema";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import BookingsTable, { type EmailStatusInfo, type CalendarSyncStatusInfo } from "@/components/admin/BookingsTable";
import { adminLogout } from "./actions";

export const metadata: Metadata = {
  title: "Admin — Apex Visuals LLC",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const isAdmin = await verifyAdminSession();

  if (!isAdmin) {
    return <AdminLoginForm />;
  }

  const allBookings = await db.select().from(bookings).orderBy(desc(bookings.createdAt));

  // A deposit_paid booking can still have a failed acceptance email or a
  // failed calendar sync worth retrying, so both statuses are included here.
  const relevantIds = allBookings
    .filter((b) => b.status === "accepted" || b.status === "deposit_paid")
    .map((b) => b.id);
  const emailStatusByBookingId = new Map<number, EmailStatusInfo>();
  const calendarSyncStatusByBookingId = new Map<number, CalendarSyncStatusInfo>();

  if (relevantIds.length > 0) {
    const [emailLogs, calendarLogs] = await Promise.all([
      db
        .select()
        .from(bookingEmailLog)
        .where(inArray(bookingEmailLog.bookingId, relevantIds))
        .orderBy(desc(bookingEmailLog.createdAt)),
      db
        .select()
        .from(bookingCalendarSyncLog)
        .where(inArray(bookingCalendarSyncLog.bookingId, relevantIds))
        .orderBy(desc(bookingCalendarSyncLog.createdAt)),
    ]);

    // Logs are ordered newest-first, so the first entry seen per booking is the latest.
    for (const log of emailLogs) {
      if (!emailStatusByBookingId.has(log.bookingId)) {
        emailStatusByBookingId.set(log.bookingId, {
          status: log.status as "sent" | "failed",
          errorMessage: log.errorMessage,
        });
      }
    }
    for (const log of calendarLogs) {
      if (!calendarSyncStatusByBookingId.has(log.bookingId)) {
        calendarSyncStatusByBookingId.set(log.bookingId, {
          status: log.status as "created" | "failed",
          errorMessage: log.errorMessage,
        });
      }
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:px-10 md:py-24">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-bold sm:text-4xl">Booking Requests</h1>
        <form action={adminLogout}>
          <button
            type="submit"
            className="rounded-full border border-border px-5 py-2 text-sm font-medium text-fg-muted hover:border-fg/40 hover:text-fg"
          >
            Log Out
          </button>
        </form>
      </div>

      <div className="mt-10">
        <BookingsTable
          bookings={allBookings}
          emailStatusByBookingId={emailStatusByBookingId}
          calendarSyncStatusByBookingId={calendarSyncStatusByBookingId}
        />
      </div>
    </div>
  );
}
