import Script from "next/script";
import { env } from "@/lib/env";

/**
 * Cloudflare Web Analytics: page views + Core Web Vitals, cookieless, no
 * consent banner needed. Rendered only when a beacon token is configured.
 */
export function Analytics() {
  const token = env.NEXT_PUBLIC_CF_BEACON_TOKEN;
  if (!token) return null;
  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token, spa: true })}
      strategy="afterInteractive"
    />
  );
}
