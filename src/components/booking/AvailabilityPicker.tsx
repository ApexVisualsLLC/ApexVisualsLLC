"use client";

import { useActionState, useEffect, useState } from "react";
import { chooseStartTime, type ChooseStartTimeState } from "@/app/book/[token]/actions";

type Slot = { startAt: string; sunsetAt?: string };

const initialState: ChooseStartTimeState = {};

function formatDay(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function ContactLinks() {
  return (
    <>
      <a href="mailto:russfilmz808@gmail.com" className="underline hover:text-fg">
        Email
      </a>{" "}
      or{" "}
      <a href="tel:+18088664664" className="underline hover:text-fg">
        call
      </a>
    </>
  );
}

const MAX_SELECTED_TIMES = 2;

export default function AvailabilityPicker({ bookingToken }: { bookingToken: string }) {
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [state, formAction, isPending] = useActionState(chooseStartTime, initialState);

  function toggleSelected(startAt: string) {
    setSelected((prev) => {
      if (prev.includes(startAt)) return prev.filter((s) => s !== startAt);
      if (prev.length >= MAX_SELECTED_TIMES) return prev;
      return [...prev, startAt];
    });
  }

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/bookings/${bookingToken}/availability`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load availability");
        return res.json();
      })
      .then((data: { slots: Slot[] }) => {
        if (!cancelled) setSlots(data.slots);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [bookingToken]);

  if (loadError) {
    return (
      <p className="text-sm text-fg-muted">
        Couldn&apos;t load available times right now. Please refresh the page, or reach out
        directly. <ContactLinks />
      </p>
    );
  }

  if (!slots) {
    return <p className="text-sm text-fg-faint">Loading available times…</p>;
  }

  if (slots.length === 0) {
    return (
      <p className="text-sm text-fg-muted">
        No open times found right now — reach out directly and we&apos;ll find something that
        works. <ContactLinks />
      </p>
    );
  }

  const byDay = new Map<string, Slot[]>();
  for (const slot of slots) {
    const day = formatDay(new Date(slot.startAt));
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day)!.push(slot);
  }

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="bookingToken" value={bookingToken} />
      <input type="hidden" name="startAt" value={selected[0] ?? ""} />
      <input type="hidden" name="startAtAlt" value={selected[1] ?? ""} />

      <div className="space-y-6">
        {Array.from(byDay.entries()).map(([day, daySlots]) => (
          <div key={day}>
            <p className="text-xs font-semibold uppercase tracking-wider text-fg-faint">{day}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {daySlots.map((slot) => {
                const isSelected = selected.includes(slot.startAt);
                return (
                  <button
                    key={slot.startAt}
                    type="button"
                    onClick={() => toggleSelected(slot.startAt)}
                    title={
                      slot.sunsetAt
                        ? `Arrive at ${formatTime(new Date(slot.startAt))} to shoot golden-hour light — sunset is at ${formatTime(new Date(slot.sunsetAt))}`
                        : undefined
                    }
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      isSelected
                        ? "border-fg bg-fg text-bg"
                        : slot.sunsetAt
                          ? "border-amber-500/40 text-amber-400 hover:border-amber-400"
                          : "border-border text-fg-muted hover:border-fg/40 hover:text-fg"
                    }`}
                  >
                    {formatTime(new Date(slot.startAt))}
                    {slot.sunsetAt && ` — Sunset (${formatTime(new Date(slot.sunsetAt))})`}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-fg-faint">
        Don&apos;t see a time that works, or need a date further out than what&apos;s shown here?{" "}
        <ContactLinks /> and we&apos;ll find something.
      </p>

      {state.error && <p className="text-sm text-fg">{state.error}</p>}

      <button
        type="submit"
        disabled={selected.length === 0 || isPending}
        className="w-full rounded-full bg-fg px-8 py-3.5 text-sm font-semibold tracking-wide text-bg transition-opacity hover:opacity-85 disabled:opacity-40 sm:w-auto"
      >
        {isPending ? "Requesting…" : selected.length === 2 ? "Request These Times" : "Request This Time"}
      </button>
    </form>
  );
}
