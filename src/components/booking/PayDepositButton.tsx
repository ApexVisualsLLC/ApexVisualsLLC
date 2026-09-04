"use client";

import { useActionState } from "react";
import { startDepositCheckout, type StartDepositCheckoutState } from "@/app/book/[token]/actions";

const initialState: StartDepositCheckoutState = {};

export default function PayDepositButton({ bookingToken }: { bookingToken: string }) {
  const [state, formAction, isPending] = useActionState(startDepositCheckout, initialState);

  return (
    <form action={formAction} className="mt-6">
      <input type="hidden" name="bookingToken" value={bookingToken} />
      {state.error && <p className="mb-3 text-sm text-fg">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-fg px-8 py-3.5 text-sm font-semibold tracking-wide text-bg transition-opacity hover:opacity-85 disabled:opacity-40 sm:w-auto"
      >
        {isPending ? "Redirecting to checkout…" : "Pay Deposit"}
      </button>
    </form>
  );
}
