/**
 * lighthouse — mobile Lighthouse runs against a local production server,
 * asserting the budgets from plan §6. Uses the installed Chrome.
 *
 *   node scripts/lighthouse.mjs [baseUrl] [--tier=1]
 *
 * Headless Chrome renders WebGL in software, which tier detection correctly
 * routes to the poster: the default run measures what crawlers and low-end
 * devices get. --tier=1 forces the mobile 3D path for information: software
 * GL on a CPU inflates its main-thread cost well beyond a real phone GPU.
 */
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";

const args = process.argv.slice(2);
const base = args.find((a) => !a.startsWith("--")) ?? "http://127.0.0.1:3100";
const tier = args.find((a) => a.startsWith("--tier="))?.split("=")[1];
const routes = ["/", "/services/website-development", "/contact"];
const BUDGET = { performance: 90, accessibility: 100, "best-practices": 100, seo: 100, lcp: 2000, cls: 0.05, tbt: 200 };

const chrome = await chromeLauncher.launch({
  chromePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  chromeFlags: ["--headless=new", "--no-first-run"],
});
let failures = 0;
const enforce = !tier;
for (const route of routes) {
  const url = `${base}${route}${tier ? `?tier=${tier}` : ""}`;
  // Lighthouse's default simulated throttling (same methodology as PageSpeed
  // Insights). Caveat measured on localhost: scripts arrive in <100 ms and run
  // before first paint, so the simulator charges hydration JS to LCP
  // (LCP ≈ TTI) although real Chrome records LCP at ~0.5 s. The authoritative
  // numbers come from PageSpeed Insights against the deployed URL.
  const { lhr } = await lighthouse(url, { port: chrome.port, output: "json", logLevel: "error" });
  const score = (k) => Math.round((lhr.categories[k]?.score ?? 0) * 100);
  const metric = (id) => lhr.audits[id]?.numericValue ?? NaN;
  const r = {
    performance: score("performance"),
    accessibility: score("accessibility"),
    "best-practices": score("best-practices"),
    seo: score("seo"),
    lcp: Math.round(metric("largest-contentful-paint")),
    cls: Number(metric("cumulative-layout-shift").toFixed(3)),
    tbt: Math.round(metric("total-blocking-time")),
  };
  const fails = [
    ...["performance", "accessibility", "best-practices", "seo"].filter((k) => r[k] < BUDGET[k]).map((k) => `${k} ${r[k]} < ${BUDGET[k]}`),
    ...(r.lcp > BUDGET.lcp ? [`LCP ${r.lcp}ms > ${BUDGET.lcp}`] : []),
    ...(r.cls > BUDGET.cls ? [`CLS ${r.cls} > ${BUDGET.cls}`] : []),
    ...(r.tbt > BUDGET.tbt ? [`TBT ${r.tbt}ms > ${BUDGET.tbt}`] : []),
  ];
  if (enforce && fails.length) failures++;
  console.log(
    `${fails.length ? (enforce ? "FAIL" : "INFO") : "PASS"}  ${route}${tier ? ` (tier ${tier})` : ""}  perf ${r.performance} · a11y ${r.accessibility} · bp ${r["best-practices"]} · seo ${r.seo} · LCP ${r.lcp}ms · CLS ${r.cls} · TBT ${r.tbt}ms`,
  );
  for (const f of fails) console.log(`        ${f}`);
  if (r["best-practices"] < 100 || r.accessibility < 100 || r.seo < 100) {
    for (const [id, a] of Object.entries(lhr.audits)) {
      if (a.score !== null && a.score < 1 && a.scoreDisplayMode === "binary") console.log(`        audit: ${id} — ${a.title}`);
    }
  }
}
chrome.kill();
process.exit(failures ? 1 : 0);
