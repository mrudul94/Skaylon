/**
 * csp-audit — crawls every route of a running server in Chrome, exercises the
 * contact form's Turnstile, and reports any Content-Security-Policy
 * violations (report-only or enforced). Exit 1 if any are found.
 *
 *   node scripts/csp-audit.mjs <baseUrl>
 */
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://127.0.0.1:3100";
const routes = ["/", "/services", "/services/ui-ux-design", "/services/backend-api-development", "/work", "/about", "/process", "/contact", "/contact/thank-you", "/privacy", "/terms", "/cookies", "/missing-page"];

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();
const violations = [];
page.on("console", (m) => {
  const t = m.text();
  if (/Content Security Policy|Refused to/i.test(t)) violations.push(`${page.url()} :: ${t.slice(0, 300)}`);
});

for (const r of routes) {
  await page.goto(base + r, { waitUntil: "networkidle" }).catch(() => undefined);
  await page.waitForTimeout(1500); // Turnstile + beacon
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
