/**
 * verify-camera — every pose and the home-page camera spline, from the real
 * src/world/journey.ts: sane parameters, the camera never inside a formation,
 * and every chip group and label actually ON SCREEN (lens shift included) at
 * common screen shapes.
 */
import { ALL_FORMATIONS, anchorsFor, bounds, buildFormation, type FormationKey, type Vec3 } from "../src/world/formations.ts";
import {
  JOURNEY_KEYS,
  JOURNEY_LENGTH,
  JOURNEY_POSES,
  STATIC_POSES,
  distanceScale,
  focusPose,
  journeyFrame,
  len3,
  lensShift,
  sub3,
  type Pose,
} from "../src/world/journey.ts";

let failures = 0;
function check(name: string, ok: boolean, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : ` — ${detail}`}`);
  if (!ok) failures++;
}

const N = 3000;
// Focus formations: frame the featured icon (group i); the rest is distant backdrop.
const boxes = new Map(
  ALL_FORMATIONS.map((k) => {
    const f = buildFormation(k, N);
    if (!k.startsWith("focus")) return [k, bounds(f)];
    const g = Number(k.slice(5));
    const keep = [...f.group].flatMap((gr, i) => (gr === g ? [i] : []));
    const pos = new Float32Array(keep.flatMap((i) => [f.position[i * 3]!, f.position[i * 3 + 1]!, f.position[i * 3 + 2]!]));
    return [k, bounds({ ...f, position: pos })];
  }),
);
const CLEARANCE = 2;

/** Distance from a point to an axis-aligned box (0 inside). */
function distToBox(p: Vec3, key: FormationKey) {
  const { min, max } = boxes.get(key)!;
  const d = p.map((v, a) => Math.max(min[a]! - v, 0, v - max[a]!));
  return Math.hypot(...d);
}

const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: Vec3): Vec3 => a.map((x) => x / len3(a)) as Vec3;
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** Where a world point lands in NDC, reproducing CameraRig (distance scale + lens shift). */
function project(p: Vec3, pose: Pose, aspect: number): { x: number; y: number; behind: boolean } {
  const t = pose.camera.target;
  const eye = t.map((v, a) => v + (pose.camera.position[a]! - v) * distanceScale(aspect)) as Vec3;
  const f = norm(sub3(t, eye));
  const r = norm(cross(f, [0, 1, 0]));
  const u = cross(r, f);
  const v = sub3(p, eye);
  const z = dot(v, f);
  const tan = Math.tan(((pose.camera.fov / 2) * Math.PI) / 180);
  const shift = lensShift(aspect);
  return {
    x: dot(v, r) / (z * tan * aspect) - 2 * shift.x * pose.shift,
    y: dot(v, u) / (z * tan) + 2 * shift.y,
    behind: z <= 0,
  };
}

function validate(name: string, pose: Pose) {
  const nums = [...pose.camera.position, ...pose.camera.target, pose.camera.fov, pose.glow, pose.warmth, pose.fog, pose.dim, pose.orbit, pose.shadow, pose.shift];
  check(`${name}: finite, fov 20–50°`, nums.every(Number.isFinite) && pose.camera.fov >= 20 && pose.camera.fov <= 50);
  check(`${name}: glow/warmth/dim/shadow/shift in 0..1`, [pose.glow, pose.warmth, pose.dim, pose.shadow, pose.shift].every((x) => x >= 0 && x <= 1));
  check(`${name}: formation "${pose.formation}" exists`, boxes.has(pose.formation));
  const clr = distToBox(pose.camera.position, pose.formation);
  check(`${name}: camera ≥ ${CLEARANCE} from the formation (${clr.toFixed(2)})`, clr >= CLEARANCE);

  // Everything that matters must be on screen: each group's extremes and
  // every label anchor (labels also need room beside the anchor).
  const { min, max } = boxes.get(pose.formation)!;
  const mid: Vec3 = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2];
  for (const aspect of [16 / 9, 4 / 3]) {
    if (pose.formation !== "scatter") {
      const extremes: Vec3[] = [[min[0], mid[1], mid[2]], [max[0], mid[1], mid[2]], [mid[0], max[1], mid[2]], [mid[0], Math.max(min[1], -1.5), mid[2]]];
      const worst = Math.max(...extremes.map((p) => project(p, pose, aspect)).map((q) => Math.max(Math.abs(q.x), Math.abs(q.y))));
      check(`${name} @${aspect.toFixed(2)}: whole formation in frame (worst |ndc| ${worst.toFixed(2)})`, worst <= 1.02);
    }
    for (const a of anchorsFor(pose.formation)) {
      const q = project(a.point, pose, aspect);
      const room = a.side === "right" ? q.x <= 0.72 : a.side === "left" ? q.x >= -0.72 : Math.abs(q.x) <= 0.86 && q.y <= 0.78;
      check(`${name} @${aspect.toFixed(2)}: label "${a.text}" on screen with room (${q.x.toFixed(2)}, ${q.y.toFixed(2)})`, !q.behind && Math.abs(q.x) <= 0.95 && q.y <= 0.9 && q.y >= -0.95 && room);
    }
  }
}

for (const key of JOURNEY_KEYS) validate(`journey:${key}`, JOURNEY_POSES[key]);
for (const [key, pose] of Object.entries(STATIC_POSES)) validate(`static:${key}`, pose);
for (let i = 0; i < 5; i++) validate(`focus:${i}`, focusPose(i));

// Knots: the spline passes exactly through every chapter's camera.
for (let k = 0; k <= JOURNEY_LENGTH; k++) {
  const at = journeyFrame(k === JOURNEY_LENGTH ? k : k).pose.camera.position;
  check(`spline knot ${k} (${JOURNEY_KEYS[k]}) exact`, len3(sub3(at, JOURNEY_POSES[JOURNEY_KEYS[k]!].camera.position)) < 1e-9);
}

// Sweep: continuous, never inside either formation it's morphing between.
let worstStep = 0;
let worstClear = Infinity;
let prev = journeyFrame(0).pose.camera.position;
for (let t = 0; t <= JOURNEY_LENGTH + 1e-9; t += 0.002) {
  const fr = journeyFrame(t);
  worstStep = Math.max(worstStep, len3(sub3(fr.pose.camera.position, prev)));
  worstClear = Math.min(worstClear, distToBox(fr.pose.camera.position, fr.from), distToBox(fr.pose.camera.position, fr.to));
  prev = fr.pose.camera.position;
}
check(`journey sweep: max camera step per 0.002t ≤ 0.1 (${worstStep.toFixed(4)})`, worstStep <= 0.1);
check(`journey sweep: clearance ≥ ${CLEARANCE} from both formations (min ${worstClear.toFixed(2)})`, worstClear >= CLEARANCE);
check("journey chapters morph in order", JOURNEY_KEYS.slice(0, -1).every((k, i) => {
  const fr = journeyFrame(i + 0.5);
  return fr.from === JOURNEY_POSES[k].formation && fr.to === JOURNEY_POSES[JOURNEY_KEYS[i + 1]!].formation;
}));
check("journey clamps below 0 and above end", journeyFrame(-5).mix === 0 && journeyFrame(99).mix === 1);

for (const aspect of [0.46, 0.75, 1, 1.33, 1.78, 2.4]) {
  const s = lensShift(aspect);
  const d = distanceScale(aspect);
  check(`framing @ aspect ${aspect}: shift within ±0.3, distance scale 1–1.8`, Math.abs(s.x) <= 0.3 && Math.abs(s.y) <= 0.3 && d >= 1 && d <= 1.8);
}

console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}`);
process.exit(failures === 0 ? 0 : 1);
