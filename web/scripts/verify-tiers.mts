/** verify-tiers — quality-tier decisions (src/world/quality/tiers.ts). */
import { TIER_SETTINGS, declineTier, initialTier, type Signals } from "../src/world/quality/tiers.ts";

let failures = 0;
function check(name: string, ok: boolean) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

const desktop: Signals = { webgl2: true, saveData: false, deviceMemory: 8, hardwareConcurrency: 8, coarsePointer: false, screenMin: 1080, renderer: "angle (nvidia, nvidia geforce rtx 3060 direct3d11)" };
const phone: Signals = { webgl2: true, saveData: false, deviceMemory: 4, hardwareConcurrency: 8, coarsePointer: true, screenMin: 390, renderer: "adreno (tm) 642l" };

const cases: [string, Signals, number][] = [
  ["discrete-GPU desktop → 2", desktop, 2],
  ["Apple silicon desktop (no deviceMemory) → 2", { ...desktop, deviceMemory: undefined, renderer: "apple gpu" }, 2],
  ["modern phone → 1", phone, 1],
  ["tablet (coarse pointer, large screen) → 1", { ...phone, screenMin: 820 }, 1],
  ["small laptop window < 700px → 1", { ...desktop, screenMin: 650 }, 1],
  ["desktop with 2GB-3GB memory → 1", { ...desktop, deviceMemory: 3 }, 1],
  ["old Mali GPU → 1", { ...desktop, renderer: "mali-t860" }, 1],
  ["no WebGL2 → 0", { ...desktop, webgl2: false }, 0],
  ["Save-Data → 0", { ...desktop, saveData: true }, 0],
  ["software renderer (SwiftShader) → 0", { ...desktop, renderer: "google swiftshader" }, 0],
  ["1GB device → 0", { ...phone, deviceMemory: 1 }, 0],
  ["2 cores → 0", { ...phone, hardwareConcurrency: 2 }, 0],
];
for (const [name, s, want] of cases) check(name, initialTier(s) === want);

check("decline 2 → 1 → 0", declineTier(2) === 1 && declineTier(1) === 0 && declineTier(0) === 0);
check("tier 1 is strictly lighter than tier 2",
  TIER_SETTINGS[1].particles < TIER_SETTINGS[2].particles && TIER_SETTINGS[1].chips < TIER_SETTINGS[2].chips && TIER_SETTINGS[1].dpr[1] < TIER_SETTINGS[2].dpr[1] && TIER_SETTINGS[1].idleFps < TIER_SETTINGS[2].idleFps);

console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}`);
process.exit(failures === 0 ? 0 : 1);
