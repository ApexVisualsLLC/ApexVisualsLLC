"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 2500;

/**
 * Stripe webhook delivery is normally near-instant, so a plain page reload
 * after returning from checkout usually already shows the deposit_paid
 * state. This covers the rare slow case: a bounded few retries, then it
 * gives up quietly rather than polling forever. Renders nothing — it
 * naturally stops being rendered at all once the parent page re-renders
 * with the paid state (a router.refresh() that changes what the server
 * returns unmounts this component, since the "still pending" branch that
 * renders it stops matching).
 *
 * A self-rescheduling timeout, not a useEffect dependency-driven retry:
 * router.refresh() alone doesn't guarantee this component re-renders (if the
 * server still returns the same "pending" tree, React reconciles it as the
 * same instance), so the retry loop has to drive itself from within one
 * effect invocation rather than relying on being re-triggered.
 */
export default function DepositPendingRefresh() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    function scheduleNext() {
      if (cancelled || attempts >= MAX_ATTEMPTS) return;
      attempts += 1;
      setTimeout(() => {
        if (cancelled) return;
        router.refresh();
        scheduleNext();
      }, RETRY_DELAY_MS);
    }

    scheduleNext();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return null;
}
