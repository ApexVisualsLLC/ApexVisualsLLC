type EventParams = Record<string, string | number | boolean>;
type Gtag = (command: "event", name: string, params?: EventParams) => void;

/**
 * Sends a GA4 event through the tag installed by <GoogleAnalytics>. It does nothing when that tag
 * isn't present — in `next dev`, or in a document that began on a private route — so callers
 * never need to guard it.
 *
 * Only pass non-identifying values. No names, email addresses, phone numbers or booking URLs.
 */
export function trackEvent(name: string, params?: EventParams) {
  if (typeof window === "undefined") return;
  (window as Window & { gtag?: Gtag }).gtag?.("event", name, params);
}
