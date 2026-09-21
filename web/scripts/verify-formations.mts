/**
 * verify-formations — the chip formations (src/world/formations.ts), checked
 * numerically: exact chip counts at every tier size, finite data, nothing
 * below the floor, groups and labels where the page expects them, a
 * deterministic build, and the morph maths the shader shares with the CPU.
 */
import { readFileSync } from "node:fs";
import {
  ALL_FORMATIONS,
  FLOOR_Y,
  PROCESS_CENTERS,
  SERVICE_CENTERS,
  anchorsFor,
  buildFormation,
  morphAmount,
  split,
} from "../src/world/formations.ts";
import { TIER_SETTINGS } from "../src/world/quality/tiers.ts";

let failures = 0;
function check(name: string, ok: boolean, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : ` — ${detail}`}`);
  if (!ok) failures++;
}

check("split sums exactly", [7, 100, 1401, 2999].every((n) => split(n, [1, 2.5, 0.3, 4]).reduce((a, b) => a + b, 0) === n));

const sizes = [TIER_SETTINGS[1].chips, TIER_SETTINGS[2].chips, 777];
for (const n of sizes) {
  for (const key of ALL_FORMATIONS) {
    let f;
    try {
      f = buildFormation(key, n);
    } catch (e) {
      check(`${key} @${n}: builds`, false, String(e));
      continue;
    }
    const finite = [...f.position, ...f.scale, ...f.glow, ...f.loose].every(Number.isFinite);
    const positive = f.scale.every((s) => s > 0);
    let lowest = Infinity;
    for (let i = 0; i < n; i++) lowest = Math.min(lowest, f.position[i * 3 + 1]! - f.scale[i * 3 + 1]! / 2);
    const ranges = f.glow.every((g) => g >= 0 && g <= 1) && f.loose.every((l) => l >= 0 && l <= 1);
    check(
      `${key} @${n}: ${n} chips, finite, positive sizes, 0..1 glow/loose, above floor (${lowest.toFixed(3)})`,
      f.position.length === n * 3 && finite && positive && ranges && lowest >= FLOOR_Y - 1e-6,
    );
  }
}

// Groups line up with what the page highlights and labels.
const n = TIER_SETTINGS[2].chips;
const services = buildFormation("services", n);
for (let g = 0; g < 5; g++) {
  let count = 0;
  const c = [0, 0, 0];
  for (let i = 0; i < n; i++) {
    if (services.group[i] !== g) continue;
    count++;
    for (let a = 0; a < 3; a++) c[a]! += services.position[i * 3 + a]!;
  }
  const centroid = c.map((x) => x / count);
  const off = Math.hypot(...centroid.map((x, a) => x - SERVICE_CENTERS[g]![a]!));
  check(`services group ${g}: ~${Math.round(n / 5)} chips (${count}), centred on its icon (off ${off.toFixed(2)})`, Math.abs(count - n / 5) <= 1 && off < 0.25);
}
const processF = buildFormation("process", n);
check("process: 4 stage groups", new Set(processF.group).size === 4 && !processF.group.includes(-1));
check("product: no groups (nothing to highlight)", buildFormation("product", n).group.every((g) => g === -1));
for (let i = 0; i < 5; i++) {
  const f = buildFormation(`focus${i as 0 | 1 | 2 | 3 | 4}`, n);
  check(`focus${i}: main icon is group ${i}`, f.group.some((g) => g === i));
}

// Labels.
const serviceAnchors = anchorsFor("services");
check("services: 5 labels, service:0..4", serviceAnchors.map((a) => a.text).join() === "service:0,service:1,service:2,service:3,service:4");
check(
  "services: each label sits above its icon",
  serviceAnchors.every((a, i) => Math.abs(a.point[0] - SERVICE_CENTERS[i]![0]) < 1e-9 && a.point[1] > SERVICE_CENTERS[i]![1]),
);
const processAnchors = anchorsFor("process");
check("process: 4 labels, phase:0..3", processAnchors.map((a) => a.text).join() === "phase:0,phase:1,phase:2,phase:3");
check("process: labels above their stages", processAnchors.every((a, i) => a.point[1] > PROCESS_CENTERS[i]![1]));
check("every formation's anchors are finite", ALL_FORMATIONS.every((k) => anchorsFor(k).every((a) => a.point.every(Number.isFinite))));
check("buildFormation carries the same anchors as anchorsFor", ALL_FORMATIONS.every((k) => JSON.stringify(buildFormation(k, 300).anchors) === JSON.stringify(anchorsFor(k))));

// Determinism: same input, same bytes (the snapshot/restore logic relies on it).
const a1 = buildFormation("code", 1234);
const a2 = buildFormation("code", 1234);
check("formations are deterministic", a1.position.every((v, i) => v === a2.position[i]) && a1.scale.every((v, i) => v === a2.scale[i]));

// Morph maths: ends exact, monotonic, and identical to the shader's.
let endsOk = true;
let monotonic = true;
for (let s = 0; s < 1; s += 0.01) {
  if (morphAmount(0, s) !== 0 || Math.abs(morphAmount(1, s) - 1) > 1e-12) endsOk = false;
  let prev = 0;
  for (let m = 0; m <= 1; m += 0.01) {
    const v = morphAmount(m, s);
    if (v < prev - 1e-12) monotonic = false;
    prev = v;
  }
}
check("morph starts at 0 and ends at 1 for every chip", endsOk);
check("morph is monotonic", monotonic);
const shader = readFileSync(new URL("../src/world/Chips.tsx", import.meta.url), "utf8");
check("shader uses the same morph curve as morphAmount()", shader.includes("clamp(uMix * 1.5 - aSeed * 0.5, 0.0, 1.0)") && shader.includes("mx * mx * (3.0 - 2.0 * mx)"));

console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}`);
process.exit(failures === 0 ? 0 : 1);
