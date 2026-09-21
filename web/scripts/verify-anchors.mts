/**
 * verify-anchors — the scroll → journey mapping (src/world/journey.ts) and
 * that it lines up with the home page's chapter sections.
 */
import { readFileSync } from "node:fs";
import { JOURNEY_KEYS, JOURNEY_LENGTH, anchorFor, progressFromScroll } from "../src/world/journey.ts";

let failures = 0;
function check(name: string, ok: boolean, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : ` — ${detail}`}`);
  if (!ok) failures++;
}

// A realistic page: 6 sections of varying height, 900px viewport.
const vh = 900;
const heights = [900, 1300, 2100, 1400, 1500, 900];
const tops = heights.map((_, i) => heights.slice(0, i).reduce((a, b) => a + b, 0));
const maxScroll = heights.reduce((a, b) => a + b, 0) + 600 /* footer */ - vh;
const anchors = tops.map((top, i) => anchorFor(i, top, vh, maxScroll));

check("anchor 0 is the top of the page", anchors[0] === 0);
check("anchors strictly increase", anchors.every((a, i) => i === 0 || a > anchors[i - 1]!));
check("anchors reachable (≤ max scroll)", anchors.every((a) => a <= maxScroll));
check("t = 0 at top", progressFromScroll(0, anchors) === 0);
check("t = chapter index at each anchor", anchors.every((a, i) => Math.abs(progressFromScroll(a, anchors) - i) < 1e-9));
check("t = last chapter at max scroll", progressFromScroll(maxScroll, anchors) === JOURNEY_LENGTH);
check("t clamps before/after", progressFromScroll(-100, anchors) === 0 && progressFromScroll(maxScroll + 5000, anchors) === JOURNEY_LENGTH);

let monotonic = true;
let maxJump = 0;
let prev = 0;
for (let y = 0; y <= maxScroll; y += 1) {
  const t = progressFromScroll(y, anchors);
  if (t < prev - 1e-12) monotonic = false;
  maxJump = Math.max(maxJump, t - prev);
  prev = t;
}
check("t is monotonic in scrollY", monotonic);
check(`t is continuous (max jump per px ${maxJump.toExponential(2)})`, maxJump < 0.01);

// Degenerate layouts (short page on a tall screen): anchors collapse to max scroll.
const squashed = [0, 300, 300, 300, 300, 300];
let squashOk = true;
let p2 = 0;
for (let y = 0; y <= 400; y++) {
  const t = progressFromScroll(y, squashed);
  if (t < p2 || !Number.isFinite(t)) squashOk = false;
  p2 = t;
}
check("degenerate (equal) anchors: finite and never backwards", squashOk && progressFromScroll(400, squashed) === 5);

// The home page must declare exactly the journey's chapters, in order.
const page = readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const cta = readFileSync(new URL("../src/components/sections/CtaSection.tsx", import.meta.url), "utf8");
const declared = [...page.matchAll(/(?:data-chapter|chapter)="([a-z]+)"/g)].map((m) => m[1]);
check(
  `home chapters match journey keys (${declared.join(", ")})`,
  JSON.stringify(declared) === JSON.stringify(JOURNEY_KEYS),
  `journey: ${JOURNEY_KEYS.join(", ")}`,
);
check("CtaSection forwards chapter to data-chapter", /data-chapter=\{chapter\}/.test(cta));

console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}`);
process.exit(failures === 0 ? 0 : 1);
