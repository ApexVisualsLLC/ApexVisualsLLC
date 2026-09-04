"use client";

import { useActionState } from "react";
import { createBooking, type IntakeFormState } from "@/app/book/actions";

const packages = [
  { value: "20-photos", label: "20 Edited Aerial Photos — $175" },
  { value: "photo-video-bundle", label: "Photos + Video Bundle — $300" },
  { value: "other", label: "Something Else / Custom" },
];

const initialState: IntakeFormState = {};

export default function IntakeForm() {
  const [state, formAction, isPending] = useActionState(createBooking, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <label className="block">
        <span className="text-sm font-medium text-fg-muted">Package *</span>
        <select
          required
          name="package"
          defaultValue={packages[0].value}
          className="mt-2 w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-fg outline-none focus:border-fg/50"
        >
          {packages.map((pkg) => (
            <option key={pkg.value} value={pkg.value}>
              {pkg.label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-fg-muted">Name *</span>
          <input
            required
            name="clientName"
            type="text"
            autoComplete="name"
            className="mt-2 w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm text-fg outline-none focus:border-fg/50"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-fg-muted">Email *</span>
          <input
            required
            name="clientEmail"
            type="email"
            autoComplete="email"
            className="mt-2 w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm text-fg outline-none focus:border-fg/50"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-fg-muted">Phone (optional)</span>
        <input
          name="clientPhone"
          type="tel"
          autoComplete="tel"
          className="mt-2 w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm text-fg outline-none focus:border-fg/50"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-fg-muted">Project Details *</span>
        <textarea
          required
          name="projectDetails"
          rows={5}
          placeholder="Location, what you need captured, and anything else that helps us plan the shoot."
          className="mt-2 w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm text-fg outline-none placeholder:text-fg-faint/60 focus:border-fg/50"
        />
      </label>

      {state.error && <p className="text-sm text-fg">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-fg px-8 py-3.5 text-sm font-semibold tracking-wide text-bg transition-opacity hover:opacity-85 disabled:opacity-50 sm:w-auto"
      >
        {isPending ? "Submitting…" : "Continue to Scheduling"}
      </button>
    </form>
  );
}
