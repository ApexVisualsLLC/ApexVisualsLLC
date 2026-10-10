"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

const GA_MEASUREMENT_ID = "G-XN5ZMLNKNJ";

/*
 * Single Google tag (gtag.js) for the GA4 property. It is deliberately the plain tag — NOT
 * @next/third-parties' <GoogleAnalytics>, and with no manual page_view calls on route change.
 * The GA4 web stream has Enhanced Measurement's "Page changes based on browser history events"
 * switched on, so GA already records a page_view for every client-side navigation (Next's
 * pushState). Sending our own on top would double-count every page after the first.
 *
 * Private routes are never reported. Booking links (/book/<token>) are bearer secrets and
 * /admin shows client details, but GA records the full page URL — and, on the next client-side
 * navigation, the previous URL as the page referrer. So GA is switched off for the rest of the
 * document as soon as a private route is seen (not just while on it), and the tag isn't even
 * loaded when a document starts on one. GA checks the documented `ga-disable-<ID>` flag at send
 * time; defining it as a getter reads the live path, so there is no ordering race with GA's own
 * history listener. The effect below re-reads it after each navigation so the latch can't be
 * missed if GA doesn't happen to read it while the visitor is on a private page.
 *
 * Production only, so `next dev` sessions and local builds don't land in the real property.
 */
const initScript = `
(function () {
  var id = '${GA_MEASUREMENT_ID}';
  function onPrivateRoute() {
    var p = window.location.pathname;
    return p === '/admin' || p.indexOf('/admin/') === 0 || /^\\/book\\/[^/]+/.test(p);
  }
  var sawPrivate = onPrivateRoute();
  Object.defineProperty(window, 'ga-disable-' + id, {
    configurable: true,
    get: function () {
      if (onPrivateRoute()) sawPrivate = true;
      return sawPrivate;
    }
  });
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', id);
  if (!sawPrivate) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(s);
  }
})();
`;

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Reading the flag runs its getter, which latches it once a private route has been visited.
    void (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`];
  }, [pathname]);

  if (process.env.NODE_ENV !== "production") return null;

  return (
    <Script id="ga-init" strategy="afterInteractive">
      {initScript}
    </Script>
  );
}
