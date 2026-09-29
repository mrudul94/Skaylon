/**
 * verify-shapes — the morphing core (src/world/shapes.ts), tested on the real
 * data: every formation has a sane shape, the journey actually morphs, blends
 * hit their endpoints, and no pose (worst-case noise, scroll stretch, pointer
 * bulge, tilt and float) pushes the surface through the floor.
 */
import { ALL_FORMATIONS, FLOOR_Y, type Vec3 } from "../src/world/formations.ts";
import { JOURNEY_KEYS, JOURNEY_POSES } from "../src/world/journey.ts";
import {
  CORE_Y,
  FBM_MAX,
  FLOAT_AMPLITUDE,
  MAX_STRETCH,
  MAX_TILT,
  NOISE_SCALE,
  POINTER_BULGE,
  SHAPES,
  VELOCITY_NOISE,
  blendShape,
  offsetScale,
  surfacePoint,
  type Shape,
} from "../src/world/shapes.ts";

let failures = 0;
const check = (ok: boolean, label: string) => {
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);
};

// ---------------------------------------------------------------- data sanity
for (const key of ALL_FORMATIONS) {
  const s = SHAPES[key];
  const nums = [s.round, s.size, s.noise, s.twist, s.rings, s.satellites, ...s.scale, ...s.offset];
  check(
    s !== undefined &&
      nums.every(Number.isFinite) &&
      s.round >= 1 &&
      s.round <= 10 &&
      s.size > 0 &&
      s.scale.every((v) => v > 0.05) &&
      s.rings >= 0 &&
      s.rings <= 1 &&
      s.satellites >= 0 &&
      s.satellites <= 1,
    `${key}: shape defined and in range`,
  );
}

// ---------------------------------------------------------------- the journey morphs
const differs = (a: Shape, b: Shape) =>
  Math.abs(a.round - b.round) > 0.3 ||
  Math.abs(a.noise - b.noise) > 0.1 ||
  a.scale.some((v, i) => Math.abs(v - b.scale[i]!) > 0.1) ||
  Math.abs(a.size - b.size) > 0.1;
for (let i = 0; i < JOURNEY_KEYS.length - 1; i++) {
  const a = JOURNEY_POSES[JOURNEY_KEYS[i]!].formation;
  const b = JOURNEY_POSES[JOURNEY_KEYS[i + 1]!].formation;
  check(differs(SHAPES[a], SHAPES[b]), `journey ${JOURNEY_KEYS[i]} → ${JOURNEY_KEYS[i + 1]}: the core visibly changes shape`);
}

// ---------------------------------------------------------------- blending
{
  const a = SHAPES.product;
  const b = SHAPES.gallery;
  const close = (x: Shape, y: Shape) =>
    Math.abs(x.round - y.round) < 1e-9 && x.scale.every((v, i) => Math.abs(v - y.scale[i]!) < 1e-9) && Math.abs(x.size - y.size) < 1e-9;
  check(close(blendShape(a, b, 0), a) && close(blendShape(a, b, 1), b), "blendShape hits both endpoints");
  const mid = blendShape(SHAPES.process, SHAPES.gallery, 0.5); // exponents 1.2 and 7
  check(mid.round > 2 && mid.round < 3.5, `exponent blends in log space (1.2 ↔ 7 midpoint ${mid.round.toFixed(2)} ≈ 2.9)`);
}

// ---------------------------------------------------------------- surface math
{
  const s = { ...SHAPES.product, noise: 0 };
  const p = surfacePoint([0, 1, 0], s);
  check(Math.abs(p[1] - s.size) < 1e-9, "unit direction on an axis lands at `size` (any exponent)");
  const cube = { ...SHAPES.services };
  const d = 1 / Math.sqrt(3);
  const corner = surfacePoint([d, d, d], cube);
  check(corner[0] > d * cube.size * 1.2, "high exponent pushes corners out (rounded cube, not a sphere)");
}

// ---------------------------------------------------------------- floor clearance
function directions(n: number): Vec3[] {
  const out: Vec3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    out.push([Math.cos(golden * i) * r, y, Math.sin(golden * i) * r]);
  }
  return out;
}
const DIRS = directions(3000);
const worstDisp = (s: Shape) => (s.noise + VELOCITY_NOISE) * NOISE_SCALE * FBM_MAX + POINTER_BULGE;

/** Lowest world-space y of the core surface for shape s, over all tilts. */
function lowestY(s: Shape): number {
  let min = Infinity;
  const disp = worstDisp(s);
  const tiltX = MAX_TILT * 0.7;
  for (const d of DIRS) {
    const p = surfacePoint(d, s);
    const y = (p[1] * (1 + MAX_STRETCH) + d[1] * disp);
    // Radial reach in the horizontal plane (spin and twist rotate about y, so only the length matters).
    const h = Math.hypot(p[0] + d[0] * disp, p[2] + d[2] * disp);
    // Tilt about x by ±tiltX mixes y with the horizontal reach.
    for (const a of [-tiltX, tiltX]) min = Math.min(min, y * Math.cos(a) - h * Math.abs(Math.sin(a)));
  }
  return CORE_Y + s.offset[1] - FLOAT_AMPLITUDE + min;
}

const MARGIN = 0.05;
for (const key of ALL_FORMATIONS) {
  const low = lowestY(SHAPES[key]);
  check(low > FLOOR_Y + MARGIN, `${key}: clears the floor (lowest ${low.toFixed(2)} > ${(FLOOR_Y + MARGIN).toFixed(2)})`);
}
let worstBlend = Infinity;
for (let i = 0; i < JOURNEY_KEYS.length - 1; i++) {
  const a = SHAPES[JOURNEY_POSES[JOURNEY_KEYS[i]!].formation];
  const b = SHAPES[JOURNEY_POSES[JOURNEY_KEYS[i + 1]!].formation];
  for (let u = 0; u <= 1; u += 0.1) worstBlend = Math.min(worstBlend, lowestY(blendShape(a, b, u)));
}
check(worstBlend > FLOOR_Y + MARGIN, `mid-morph journey blends clear the floor (lowest ${worstBlend.toFixed(2)})`);

// ---------------------------------------------------------------- viewport framing
{
  const samples = [0.4, 0.46, 0.6, 0.75, 1, 1.33, 1.6, 2.4];
  const vals = samples.map(offsetScale);
  check(vals.every((v) => v >= 0.12 && v <= 1), "offsetScale stays within [0.12, 1]");
  check(vals.every((v, i) => i === 0 || v >= vals[i - 1]!), "offsetScale never decreases as screens widen");
  check(offsetScale(1.6) === 1 && offsetScale(0.46) < 0.2, "full offset on 16:10 desktops, almost none on phones");
}

console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}`);
process.exit(failures === 0 ? 0 : 1);
