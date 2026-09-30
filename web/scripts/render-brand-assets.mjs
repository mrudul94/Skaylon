/**
 * render-brand-assets — regenerates the raster brand assets from SVG with
 * sharp: PNG app icons (manifest + Apple touch icon) from src/app/icon.svg,
 * and the default Open Graph image (1200×630 JPEG).
 *
 *   npm run brand-assets
 *
 * Run it after changing the logo, the palette or the OG wording; commit the
 * output. Text is rendered with the machine's system sans-serif font.
 */
import { readFileSync } from "node:fs";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const out = (p) => new URL(p, root).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const iconSvg = readFileSync(new URL("src/app/icon.svg", root));

const icons = [
  ["public/icon-192.png", 192],
  ["public/icon-512.png", 512],
  ["src/app/apple-icon.png", 180],
];
for (const [path, size] of icons) {
  await sharp(iconSvg, { density: 1200 }).resize(size, size).png({ compressionLevel: 9 }).toFile(out(path));
  console.log(`wrote ${path} (${size}×${size})`);
}

// Maskable: the glyph inside the 80% safe zone on a full-bleed background.
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#14161a"/>
  <g transform="translate(96 96) scale(10)">
    <path d="M10 4h12v11.5L10 18.5z" fill="#ece8e1"/>
    <path d="M10 20.6l12-3V28H10z" fill="#d9764a"/>
  </g>
</svg>`;
await sharp(Buffer.from(maskable)).png({ compressionLevel: 9 }).toFile(out("public/icon-512-maskable.png"));
console.log("wrote public/icon-512-maskable.png (512×512, maskable)");

const font = "Segoe UI, Helvetica Neue, Arial, sans-serif";
const services = ["Websites", "Web Applications", "Mobile Apps", "Custom Software", "UI/UX Design", "Backend &amp; APIs"];
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="1" cy="0" r="0.9">
      <stop offset="0" stop-color="#d9764a" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#d9764a" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#14161a" stroke-opacity="0.06"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#faf8f4"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(80 72) scale(2)">
    <rect width="32" height="32" rx="6" fill="#14161a"/>
    <path d="M10 4h12v11.5L10 18.5z" fill="#ece8e1"/>
    <path d="M10 20.6l12-3V28H10z" fill="#d9764a"/>
  </g>
  <text x="160" y="118" font-family="${font}" font-size="40" font-weight="700" fill="#14161a" letter-spacing="-1">Skaylon</text>
  <text x="80" y="270" font-family="${font}" font-size="68" font-weight="700" fill="#14161a" letter-spacing="-2">Websites, apps and custom</text>
  <text x="80" y="350" font-family="${font}" font-size="68" font-weight="700" fill="#14161a" letter-spacing="-2">software for growing businesses</text>
  <text x="80" y="420" font-family="${font}" font-size="28" fill="#525866">Founder-led software studio · Kerala, India · skaylon.com</text>
  <g font-family="${font}" font-size="22" fill="#2b2f36">
    ${services
      .map((s, i) => {
        const x = 80 + (i % 3) * 330;
        const y = 490 + Math.floor(i / 3) * 56;
        return `<g transform="translate(${x} ${y})"><rect width="310" height="42" rx="8" fill="#ffffff" stroke="#e3ddd3"/><circle cx="22" cy="21" r="5" fill="#a4441c"/><text x="40" y="28">${s}</text></g>`;
      })
      .join("\n    ")}
  </g>
</svg>`;
await sharp(Buffer.from(og)).jpeg({ quality: 86, mozjpeg: true }).toFile(out("public/og-default.jpg"));
console.log("wrote public/og-default.jpg (1200×630)");
