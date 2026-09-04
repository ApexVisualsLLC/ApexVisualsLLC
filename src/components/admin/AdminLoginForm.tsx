"use client";

import { useActionState } from "react";
import { adminLogin, type AdminLoginState } from "@/app/admin/actions";

const initialState: AdminLoginState = {};

export default function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(adminLogin, initialState);

  return (
    <div className="mx-auto max-w-sm px-6 py-32 md:px-10">
      <h1 className="font-serif text-3xl font-bold">Admin</h1>
      <form action={formAction} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-fg-muted">Password</span>
          <input
            required
            name="password"
            type="password"
            autoComplete="current-password"
            className="mt-2 w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm text-fg outline-none focus:border-fg/50"
          />
        </label>

        {state.error && <p className="text-sm text-fg">{state.error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full bg-fg px-8 py-3.5 text-sm font-semibold tracking-wide text-bg transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {isPending ? "Checking…" : "Log In"}
        </button>
      </form>
    </div>
  );
}
