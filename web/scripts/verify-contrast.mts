/**
 * verify-contrast — WCAG 2.x contrast of the design tokens actually shipped.
 * Parses src/app/globals.css (never re-declares colours) and checks every
 * text/background pairing the UI uses.
 */
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const token = (name: string): string => {
  const m = new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`).exec(css);
  if (!m?.[1]) throw new Error(`token --color-${name} not found in globals.css`);
  return m[1];
};

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

// [foreground, background, minimum, where it's used]
const pairs: [string, string, number, string][] = [
  ["chalk", "ink-950", 7, "body text"],
  ["chalk-muted", "ink-950", 4.5, "secondary text"],
  ["accent", "ink-950", 4.5, "accent text, active links"],
  ["cyan", "ink-950", 4.5, "numerals, status"],
  ["accent-soft", "ink-950", 4.5, "form error text"],
  ["chalk", "ink-800", 4.5, "text on raised surfaces"],
  ["chalk-muted", "ink-800", 4.5, "secondary text on raised surfaces"],
  ["chalk-muted", "ink-700", 4.5, "secondary text on glass cards (worst case)"],
  ["ink-950", "chalk", 4.5, "primary button label"],
  ["ink-950", "accent", 4.5, "button hover fill (iris end) / selection"],
  ["ink-950", "cyan", 4.5, "button hover fill (cyan end)"],
  ["accent", "ink-950", 3, "focus ring (non-text, 1.4.11)"],
];

let failures = 0;
for (const [fg, bg, min, use] of pairs) {
  const r = ratio(token(fg), token(bg));
  const ok = r >= min;
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${fg} on ${bg}: ${r.toFixed(2)}:1 (min ${min}) — ${use}`);
}
console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}`);
process.exit(failures === 0 ? 0 : 1);
