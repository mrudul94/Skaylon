/**
 * longtasks — records every main-thread long task (>50ms) during page load +
 * world start-up, in real Chrome on this machine's GPU, optionally with CPU
 * throttling. Complements Lighthouse (whose Windows numbers include ANGLE's
 * slow HLSL translation multiplied by its CPU throttle).
 *
 *   node scripts/longtasks.mjs <url> [cpuSlowdown=1]
 */
import { chromium } from "@playwright/test";

const [url, slowdown = "1"] = process.argv.slice(2);
const browser = await chromium.launch({ channel: "chrome", args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: Number(slowdown) });
await page.addInitScript(() => {
  window.__long = [];
  new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__long.push([Math.round(e.startTime), Math.round(e.duration)]))).observe({ type: "longtask", buffered: true });
});
await page.goto(url);
await page.waitForFunction(() => document.querySelector("[data-world] canvas") || document.querySelector("[data-world] img"), null, { timeout: 30000 }).catch(() => {});
await page.waitForTimeout(9000);
const tasks = await page.evaluate(() => window.__long);
const marks = await page.evaluate(() =>
  performance.getEntriesByType("mark").filter((m) => m.name.startsWith("world:")).map((m) => `${m.name}@${Math.round(m.startTime)}`),
);
console.log(`marks: ${marks.join("  ")}`);
const parallel = await page.evaluate(() => {
  const gl = document.createElement("canvas").getContext("webgl2");
  return Boolean(gl?.getExtension("KHR_parallel_shader_compile"));
});
console.log(`KHR_parallel_shader_compile: ${parallel}`);
const tbtLike = tasks.reduce((s, [, d]) => s + Math.max(0, d - 50), 0);
console.log(`${url} @ ${slowdown}x CPU: ${tasks.length} long tasks, blocking ${tbtLike}ms, longest ${Math.max(0, ...tasks.map((t) => t[1]))}ms`);
for (const [t, d] of tasks) console.log(`  ${d}ms at ${t}ms`);
await browser.close();
