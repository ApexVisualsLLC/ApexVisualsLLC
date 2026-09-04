"use client";

import { useActionState, useEffect, useState } from "react";
import { chooseStartTime, type ChooseStartTimeState } from "@/app/book/[token]/actions";

type Slot = { startAt: string };

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

export default function AvailabilityPicker({ bookingToken }: { bookingToken: string }) {
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(chooseStartTime, initialState);

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
        directly.
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
        works.
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
      <input type="hidden" name="startAt" value={selected ?? ""} />

      <div className="space-y-6">
        {Array.from(byDay.entries()).map(([day, daySlots]) => (
          <div key={day}>
            <p className="text-xs font-semibold uppercase tracking-wider text-fg-faint">{day}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {daySlots.map((slot) => (
                <button
                  key={slot.startAt}
                  type="button"
                  onClick={() => setSelected(slot.startAt)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    selected === slot.startAt
                      ? "border-fg bg-fg text-bg"
                      : "border-border text-fg-muted hover:border-fg/40 hover:text-fg"
                  }`}
                >
                  {formatTime(new Date(slot.startAt))}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {state.error && <p className="text-sm text-fg">{state.error}</p>}

      <button
        type="submit"
        disabled={!selected || isPending}
        className="w-full rounded-full bg-fg px-8 py-3.5 text-sm font-semibold tracking-wide text-bg transition-opacity hover:opacity-85 disabled:opacity-40 sm:w-auto"
      >
        {isPending ? "Requesting…" : "Request This Time"}
      </button>
    </form>
  );
}
