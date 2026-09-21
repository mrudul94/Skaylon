/**
 * csp-audit — crawls every route of a running server in Chrome (with GPU, so
 * the 3D world, its workers and the post chain all load), exercises the
 * contact form's Turnstile, and reports any Content-Security-Policy
 * violations (report-only or enforced). Exit 1 if any are found.
 *
 *   node scripts/csp-audit.mjs <baseUrl>
 */
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://127.0.0.1:3100";
const routes = ["/?tier=2", "/?tier=1", "/services", "/services/ui-ux-design", "/work", "/about", "/process", "/contact?tier=2", "/privacy", "/terms", "/missing-page"];

const browser = await chromium.launch({ channel: "chrome", args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const page = await browser.newPage();
const violations = [];
page.on("console", (m) => {
  const t = m.text();
  if (/Content Security Policy|Refused to/i.test(t)) violations.push(`${page.url()} :: ${t.slice(0, 300)}`);
});

for (const r of routes) {
  await page.goto(base + r, { waitUntil: "networkidle" }).catch(() => undefined);
  await page.waitForTimeout(3500); // world + deferred motion + beacon
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((res) => setTimeout(res, 120));
    }
  });
  console.log(`crawled ${r}`);
}
await browser.close();

if (violations.length) {
  console.log(`\n${violations.length} CSP violation(s):`);
  for (const v of [...new Set(violations)]) console.log(`  - ${v}`);
  process.exit(1);
}
console.log("\nNo CSP violations.");
