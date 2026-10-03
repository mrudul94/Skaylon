/**
 * verify-contrast — WCAG 2.x contrast of the design tokens actually shipped.
 * Parses src/app/globals.css (never re-declares colours) and checks every
 * text/background pairing the UI uses.
 */
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
// Body of the first rule whose selector starts with `selector`.
const block = (selector: string): string => {
  const at = css.indexOf(selector);
  if (at < 0) throw new Error(`rule ${selector} not found in globals.css`);
  return css.slice(at, css.indexOf("}", at));
};
const themes = {
  light: block("@theme {"),
  dark: block(':root[data-theme="dark"] {'),
  // Navy bands and illustrations keep the light palette in the dark theme.
  "dark (light scopes)": block(':root[data-theme="dark"] :is('),
};
const tokenIn = (src: string, name: string): string | undefined =>
  new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`).exec(src)?.[1];
let theme: keyof typeof themes = "light";
const token = (name: string): string => {
  // A theme only overrides some tokens; the rest fall through to @theme.
  const hex = tokenIn(themes[theme], name) ?? tokenIn(themes.light, name);
  if (!hex) throw new Error(`token --color-${name} not found in globals.css`);
  return hex;
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
  ["ink", "paper", 7, "body text"],
  ["ink-2", "paper", 7, "long-form text"],
  ["ink-muted", "paper", 4.5, "secondary text"],
  ["ink-muted", "paper-2", 4.5, "secondary text on tinted sections and the footer"],
  ["ink-muted", "surface", 4.5, "secondary text on cards"],
  ["accent-ink", "paper", 4.5, "eyebrows, links, numerals"],
  ["accent-ink", "surface", 4.5, "links on cards"],
  ["accent-ink", "accent-wash", 4.5, "service icons, current menu item"],
  ["paper", "ink", 7, "primary button label, dark CTA band"],
  ["surface", "accent-ink", 4.5, "accent button label"],
  ["danger", "surface", 4.5, "form error text"],
  ["success", "paper", 4.5, "success status text"],
  ["accent-ink", "paper", 3, "focus ring (non-text, 1.4.11)"],
  ["accent-light", "ink", 4.5, "eyebrows, step numbers, figures and focus ring on dark bands"],
  ["field", "surface", 3, "form field borders (non-text, 1.4.11)"],
  ["field", "paper", 3, "form field borders on the page background"],
];
let failures = 0;
for (const name of Object.keys(themes) as (keyof typeof themes)[]) {
  theme = name;
  console.log(`\n— ${name} theme`);
  for (const [fg, bg, min, use] of pairs) {
    // Band-only pairs never render on the dark page palette (bands keep light tokens).
    if (name === "dark" && use.includes("on dark bands")) continue;
    const r = ratio(token(fg), token(bg));
    const ok = r >= min;
    if (!ok) failures++;
    console.log(`${ok ? "PASS" : "FAIL"}  ${fg} on ${bg}: ${r.toFixed(2)}:1 (min ${min}) — ${use}`);
  }
}

// The light scopes must restore exactly the @theme palette, or they drift.
for (const m of themes["dark (light scopes)"].matchAll(/--color-([\w-]+):\s*(#[0-9a-fA-F]{6})/g)) {
  const [, name, hex] = m as unknown as [string, string, string];
  const ok = hex.toLowerCase() === tokenIn(themes.light, name)?.toLowerCase();
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  light scope --color-${name} matches @theme`);
}
console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}`);
process.exit(failures === 0 ? 0 : 1);
