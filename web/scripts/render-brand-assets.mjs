/**
 * render-brand-assets — regenerates every raster brand asset with sharp from
 * the sources in brand/:
 *
 *   brand/skaylon-logo.png       logo (swoosh mark + wordmark, transparent)
 *   brand/founder-studio.png     founder portrait (studio)
 *   brand/founder-corridor.png   founder photo for the About banner
 *
 * Outputs: header/footer logo, favicon.ico + app icons (from the swoosh mark),
 * manifest icons, founder photos and the default Open Graph image.
 *
 *   npm run brand-assets
 *
 * Run after changing a source image, the palette or the OG wording; commit
 * the output. OG text uses the machine's system sans-serif font.
 */
import { writeFileSync } from "node:fs";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const out = (p) => new URL(p, root).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const src = (p) => out(`brand/${p}`);

// Palette (keep in sync with the @theme tokens in src/app/globals.css).
const NAVY = "#0a1435";
const BLUE = "#0068fd";
const BLUE_INK = "#0052cc";
const PAPER = "#f7f8fb";
const LINE = "#e0e5ee";
const MUTED = "#4f5875";
const DARK_INK = "#eef2fb"; // --color-ink in the dark theme

const logo = src("skaylon-logo.png");
const trimmed = await sharp(logo).trim({ threshold: 10 }).png().toBuffer();
const { width: lw, height: lh } = await sharp(trimmed).metadata();

// Logo for the header/footer: 33 px tall (1x) and 66 px (2x).
for (const [file, h] of [["public/logo.webp", 33], ["public/logo@2x.webp", 66]]) {
  await sharp(trimmed).resize({ height: h }).webp({ quality: 92, alphaQuality: 100 }).toFile(out(file));
  console.log(`wrote ${file} (h ${h})`);
}

// The swoosh mark: the left part of the logo, up to the gap before the "S".
const markWidth = Math.round(lw * 0.235);
const mark = await sharp(trimmed).extract({ left: 0, top: 0, width: markWidth, height: lh }).trim({ threshold: 10 }).png().toBuffer();

// Dark-theme logo: same swoosh, wordmark recoloured to the dark theme's ink
// (keeps the original alpha, so the anti-aliased edges stay smooth).
{
  const wordWidth = lw - markWidth;
  const wordAlpha = await sharp(trimmed).extract({ left: markWidth, top: 0, width: wordWidth, height: lh }).extractChannel("alpha").toBuffer();
  const lightWord = await sharp({ create: { width: wordWidth, height: lh, channels: 3, background: DARK_INK } })
    .joinChannel(wordAlpha, { raw: undefined })
    .png()
    .toBuffer();
  const markOnly = await sharp(trimmed).extract({ left: 0, top: 0, width: markWidth, height: lh }).png().toBuffer();
  const darkLogo = await sharp({ create: { width: lw, height: lh, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: markOnly, left: 0, top: 0 },
      { input: lightWord, left: markWidth, top: 0 },
    ])
    .png()
    .toBuffer();
  for (const [file, h] of [["public/logo-dark.webp", 33], ["public/logo-dark@2x.webp", 66]]) {
    await sharp(darkLogo).resize({ height: h }).webp({ quality: 92, alphaQuality: 100 }).toFile(out(file));
    console.log(`wrote ${file} (h ${h})`);
  }
}

/** The mark centred on a white rounded tile (visible on light and dark tabs). */
async function tile(size, { padding = 0.14, radius = 0.22, bleed = false } = {}) {
  const inner = Math.round(size * (1 - padding * 2));
  const markPng = await sharp(mark).resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const r = bleed ? 0 : Math.round(size * radius);
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" fill="#ffffff"/></svg>`);
  return sharp(bg).composite([{ input: markPng, gravity: "center" }]).png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 }).toBuffer();
}

for (const [file, size, opts] of [
  ["src/app/icon.png", 512, {}],
  ["src/app/apple-icon.png", 180, { radius: 0 }],
  ["public/icon-192.png", 192, {}],
  ["public/icon-512.png", 512, {}],
  ["public/icon-512-maskable.png", 512, { padding: 0.22, bleed: true }],
]) {
  writeFileSync(out(file), await tile(size, opts));
  console.log(`wrote ${file} (${size}×${size})`);
}

// favicon.ico with 16, 32 and 48 px PNG entries (the ICO container is tiny).
{
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(sizes.map((s) => tile(s, { padding: 0.06, radius: 0.18 })));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = 6 + 16 * sizes.length;
  const entries = sizes.map((s, i) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(s, 0);
    e.writeUInt8(s, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(pngs[i].length, 8);
    e.writeUInt32LE(offset, 12);
    offset += pngs[i].length;
    return e;
  });
  writeFileSync(out("src/app/favicon.ico"), Buffer.concat([header, ...entries, ...pngs]));
  console.log("wrote src/app/favicon.ico (16, 32, 48)");
}

// Founder photos.
await sharp(src("founder-studio.png")).extract({ left: 122, top: 30, width: 900, height: 900 }).resize(480, 480).webp({ quality: 80 }).toFile(out("public/founder-480.webp"));
for (const w of [1600, 960]) {
  await sharp(src("founder-corridor.png")).resize(w).grayscale().linear(1.08, -6).webp({ quality: 82 }).toFile(out(`public/founder-wide-${w}.webp`));
}
await sharp(src("founder-corridor.png")).extract({ left: 560, top: 0, width: 820, height: 823 }).resize(720).grayscale().linear(1.08, -6).webp({ quality: 82 }).toFile(out("public/founder-portrait-720.webp"));
console.log("wrote founder photos");

// Default Open Graph image.
const font = "Segoe UI, Helvetica Neue, Arial, sans-serif";
const services = ["Websites", "Web Applications", "Mobile Apps", "Custom Software", "UI/UX Design", "Backend &amp; APIs"];
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="1" cy="0" r="0.9">
      <stop offset="0" stop-color="${BLUE}" stop-opacity="0.16"/>
      <stop offset="1" stop-color="${BLUE}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="${NAVY}" stroke-opacity="0.06"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="${PAPER}"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <text x="80" y="270" font-family="${font}" font-size="68" font-weight="700" fill="${NAVY}" letter-spacing="-2">Websites, apps and custom</text>
  <text x="80" y="350" font-family="${font}" font-size="68" font-weight="700" fill="${NAVY}" letter-spacing="-2">software for growing businesses</text>
  <text x="80" y="420" font-family="${font}" font-size="28" fill="${MUTED}">Founder-led software studio · Kerala, India · skaylon.com</text>
  <g font-family="${font}" font-size="22" fill="${NAVY}">
    ${services
      .map((s, i) => {
        const x = 80 + (i % 3) * 330;
        const y = 490 + Math.floor(i / 3) * 56;
        return `<g transform="translate(${x} ${y})"><rect width="310" height="42" rx="8" fill="#ffffff" stroke="${LINE}"/><circle cx="22" cy="21" r="5" fill="${BLUE_INK}"/><text x="40" y="28">${s}</text></g>`;
      })
      .join("\n    ")}
  </g>
</svg>`;
const ogLogo = await sharp(trimmed).resize({ height: 64 }).png().toBuffer();
await sharp(Buffer.from(ogSvg))
  .composite([{ input: ogLogo, left: 80, top: 72 }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(out("public/og-default.jpg"));
console.log("wrote public/og-default.jpg (1200×630)");
