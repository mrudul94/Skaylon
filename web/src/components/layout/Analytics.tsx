"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_EVENT, analyticsAllowed } from "@/lib/consent";

/**
 * Cloudflare Web Analytics (page views + Core Web Vitals, cookieless).
 * Loaded only when a beacon token is configured AND the visitor has accepted
 * analytics in the cookie banner. If consent is withdrawn later, the beacon
 * is not loaded again on the next page load.
 *
 * The token is passed in from the (server) layout: importing @/lib/env here
 * would ship zod to every page.
 */
export function Analytics({ token }: { token?: string }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(analyticsAllowed());
    const update = () => setAllowed(analyticsAllowed());
    window.addEventListener(CONSENT_EVENT, update);
    return () => window.removeEventListener(CONSENT_EVENT, update);
  }, []);

  if (!token || !allowed) return null;
  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token, spa: true })}
      strategy="afterInteractive"
    />
  );
}
