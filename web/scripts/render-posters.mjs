/**
 * render-posters — renders the real hero composition (tier 2) with all page
 * content hidden, and writes the static fallback used for tier 0, WebGL
 * context loss and no-WebGL browsers:
 *   public/posters/world-1600.webp, world-900.webp
 *
 *   node scripts/render-posters.mjs [baseUrl]   (default http://127.0.0.1:3000)
 *
 * Needs a running server and a GPU-capable local Chrome.
 */
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const base = process.argv[2] ?? "http://127.0.0.1:3000";
const outDir = new URL("../public/posters/", import.meta.url);
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  channel: "chrome",
  args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
await page.goto(`${base}/?tier=2`);
await page.waitForSelector("[data-world] canvas", { timeout: 30000 });
await page.waitForTimeout(4000); // fade-in + settle
await page.addStyleTag({
  content: `body > *:not([data-world]) { visibility: hidden !important; } [data-world-scrim], [data-world-labels], nextjs-portal { display: none !important; }`,
});
await page.waitForTimeout(500);
const png = await page.screenshot({ type: "png" });
await browser.close();

// Default Open Graph card (1200×630): the render, cropped to the monolith side,
// with the wordmark and tagline. Plain SVG text in the system sans.
const og = `public/og-default.jpg`;
const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#08090a" stop-opacity=".92"/><stop offset=".62" stop-color="#08090a" stop-opacity="0"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="72" y="118" fill="#d9764a" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="22" letter-spacing="7">SKAYLON</text>
  <text x="72" y="330" fill="#ece8e1" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="74" font-weight="300" letter-spacing="-2">Digital flagships,</text>
  <text x="72" y="418" fill="#ece8e1" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="74" font-weight="300" letter-spacing="-2">engineered.</text>
  <text x="72" y="540" fill="#a9a59e" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="24">Software studio · Kasaragod, Kerala</text>
</svg>`);
const ogInfo = await sharp(png)
  .resize({ width: 1200, height: 630, fit: "cover", position: "right" })
  .composite([{ input: overlay }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(new URL(`../${og}`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
console.log(`wrote ${og} (${(ogInfo.size / 1024).toFixed(1)} KB)`);

for (const width of [1600, 900]) {
  const file = new URL(`world-${width}.webp`, outDir);
  const info = await sharp(png).resize({ width }).webp({ quality: 72, effort: 6 }).toFile(file.pathname.replace(/^\/([A-Za-z]:)/, "$1"));
  console.log(`wrote posters/world-${width}.webp (${(info.size / 1024).toFixed(1)} KB)`);
}
