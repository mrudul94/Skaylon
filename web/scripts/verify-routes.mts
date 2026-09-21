/**
 * verify-routes — every public route answers 200 (and an unknown one 404) on a
 * running deployment. Catches host-specific failures `next start` can't, e.g.
 * OpenNext not serving generateStaticParams pages.
 *
 *   node --experimental-strip-types scripts/verify-routes.mts <baseUrl>
 *
 * Route list comes from the same content seed the site renders.
 */
import { services } from "../src/content/seed/services.ts";
import { projects } from "../src/content/seed/pages.ts";

const base = process.argv[2];
const SITE_URL = process.argv[3] ?? "https://skaylon.com";
if (!base) {
  console.error("usage: verify-routes.mts <baseUrl>");
  process.exit(2);
}

const expected: [string, number][] = [
  ...[
    "/",
    "/services",
    ...services.map((s) => `/services/${s.slug}`),
    "/work",
    ...projects.map((p) => `/work/${p.slug}`),
    "/about",
    "/process",
    "/contact",
    "/privacy",
    "/terms",
    "/sitemap-does-not-exist-yet-404-check",
  ].map((r): [string, number] => [r, r.includes("404-check") ? 404 : 200]),
];

let failures = 0;
for (const [route, status] of expected) {
  const res = await fetch(new URL(route, base), { redirect: "manual" });
  const html = status === 200 ? await res.text() : "";
  const ok = res.status === status && (status !== 200 || /<h1[\s>]/.test(html));
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${route} → ${res.status} (want ${status})`);
  if (status === 200) {
    // Canonicals must point at the production origin, never a dev/local one.
    const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1] ?? "";
    const good = canonical.startsWith(`${SITE_URL}/`) || canonical === SITE_URL;
    if (!good) failures++;
    console.log(`${good ? "PASS" : "FAIL"}  ${route} canonical ${canonical || "(missing)"}`);
  }
}
console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}`);
process.exit(failures === 0 ? 0 : 1);
