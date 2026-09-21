/**
 * Security headers applied to every response (see next.config.ts).
 *
 * Kept pure (no Next imports) so scripts/verify-headers.mts can assert on the
 * exact values that ship.
 *
 * CSP notes:
 * - Static, not nonce-based: nonces force dynamic rendering, which would give
 *   up SSG/ISR for every page. 'unsafe-inline' for scripts is the cost of that
 *   (Next's inline bootstrap scripts need it).
 * - Re-run scripts/csp-audit.mjs whenever a third-party origin is added.
 */

// Enforced after scripts/csp-audit.mjs found zero violations across every
// route (3D tiers 1–2, workers, post chain, Turnstile, deferred motion).
const CSP_ENFORCE = true;

// `next dev` evaluates code with eval(); production never does (verify-headers
// asserts the shipped policy has no 'unsafe-eval').
const DEV = process.env.NODE_ENV === "development";

const csp: Record<string, string[]> = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    ...(DEV ? ["'unsafe-eval'"] : []),
    "https://challenges.cloudflare.com", // Turnstile
    "https://static.cloudflareinsights.com", // CF Web Analytics beacon
  ],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:", "blob:", "https://cdn.sanity.io"],
  "font-src": ["'self'"],
  "connect-src": [
    "'self'",
    "https://*.api.sanity.io",
    "https://cdn.sanity.io",
    "https://cloudflareinsights.com",
  ],
  "frame-src": ["https://challenges.cloudflare.com"],
  // three.js / drei decoders (KTX2, Draco) spin up blob: workers.
  "worker-src": ["'self'", "blob:"],
  "media-src": ["'self'"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],
  // Only meaningful when enforced; browsers warn about it in report-only mode.
  ...(CSP_ENFORCE ? { "upgrade-insecure-requests": [] } : {}),
};

export const contentSecurityPolicy = Object.entries(csp)
  .map(([directive, sources]) => [directive, ...sources].join(" "))
  .join("; ");

export const cspHeaderName = CSP_ENFORCE
  ? "Content-Security-Policy"
  : "Content-Security-Policy-Report-Only";

export const securityHeaders: { key: string; value: string }[] = [
  { key: cspHeaderName, value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: [
      "accelerometer=()",
      "camera=()",
      "geolocation=()",
      "gyroscope=()",
      "magnetometer=()",
      "microphone=()",
      "payment=()",
      "usb=()",
      "interest-cohort=()",
    ].join(", "),
  },
];

/** 301s from the previous Vite site's routes. */
export const legacyRedirects = [
  { source: "/proof/:slug", destination: "/work/:slug", permanent: true },
  { source: "/privacy-policy", destination: "/privacy", permanent: true },
  { source: "/terms-and-conditions", destination: "/terms", permanent: true },
];
