/**
 * verify-headers — asserts the security-header contract.
 *
 *   node --experimental-strip-types scripts/verify-headers.mts           # static checks
 *   node --experimental-strip-types scripts/verify-headers.mts <baseUrl> # + live server checks
 *
 * Imports the real config (never re-declares values) so this cannot drift.
 */
import {
  contentSecurityPolicy,
  cspHeaderName,
  legacyRedirects,
  securityHeaders,
} from "../src/lib/security-headers.ts";

let failures = 0;
function check(name: string, ok: boolean, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : ` — ${detail}`}`);
  if (!ok) failures++;
}

// ---------- static contract ----------
const byName = new Map(securityHeaders.map((h) => [h.key.toLowerCase(), h.value]));
const required = [
  cspHeaderName,
  "Strict-Transport-Security",
  "X-Content-Type-Options",
  "X-Frame-Options",
  "Referrer-Policy",
  "Cross-Origin-Opener-Policy",
  "Permissions-Policy",
];
for (const h of required) check(`header defined: ${h}`, byName.has(h.toLowerCase()));

const directives = new Map(
  contentSecurityPolicy.split(";").map((d) => {
    const [name = "", ...src] = d.trim().split(/\s+/);
    return [name, src] as const;
  }),
);
const has = (d: string, s: string) => directives.get(d)?.includes(s) ?? false;

check("CSP frame-ancestors 'none'", has("frame-ancestors", "'none'"));
check("CSP object-src 'none'", has("object-src", "'none'"));
check("CSP has no 'unsafe-eval'", !contentSecurityPolicy.includes("'unsafe-eval'"));
check("CSP allows Turnstile script + frame",
  has("script-src", "https://challenges.cloudflare.com") && has("frame-src", "https://challenges.cloudflare.com"));
check("CSP allows Sanity images", has("img-src", "https://cdn.sanity.io"));
check("CSP allows CF analytics beacon",
  has("script-src", "https://static.cloudflareinsights.com") && has("connect-src", "https://cloudflareinsights.com"));
check("CSP allows blob: workers (KTX2/Draco decoders)", has("worker-src", "blob:"));
check("HSTS ≥ 1 year", /max-age=(\d+)/.test(byName.get("strict-transport-security") ?? "") &&
  Number(/max-age=(\d+)/.exec(byName.get("strict-transport-security")!)![1]) >= 31536000);

const redirectSources = legacyRedirects.map((r) => r.source);
for (const s of ["/proof/:slug", "/privacy-policy", "/terms-and-conditions"]) {
  check(`legacy redirect: ${s}`, redirectSources.includes(s));
}
check("legacy redirects are permanent", legacyRedirects.every((r) => r.permanent));

// ---------- live server (optional) ----------
const base = process.argv[2];
if (base) {
  const res = await fetch(base, { redirect: "manual" });
  check(`live: ${base} → 200`, res.status === 200, `got ${res.status}`);
  for (const { key, value } of securityHeaders) {
    const served = res.headers.get(key);
    check(`live: ${key} served verbatim`, served === value, served === null ? "missing" : "value differs");
  }
  check("live: no X-Powered-By", !res.headers.has("x-powered-by"));

  for (const [from, to] of [
    ["/proof/some-project", "/work/some-project"],
    ["/privacy-policy", "/privacy"],
    ["/terms-and-conditions", "/terms"],
  ] as const) {
    const r = await fetch(new URL(from, base), { redirect: "manual" });
    const loc = r.headers.get("location") ?? "";
    check(`live: ${from} → 308/301 ${to}`, (r.status === 308 || r.status === 301) && loc.endsWith(to),
      `got ${r.status} ${loc}`);
  }
}

console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}`);
process.exit(failures === 0 ? 0 : 1);
