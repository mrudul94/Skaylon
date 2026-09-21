/**
 * The world's choreography as DATA: every pose (camera + which formation the
 * chips hold + light/haze), the home-page camera spline, the scroll → journey
 * mapping and the route → pose mapping.
 *
 * PURE (no three.js, no DOM) so scripts/verify-camera.mts and
 * verify-anchors.mts test exactly what ships.
 */
import type { FormationKey, Vec3 } from "./formations.ts";

export type Pose = {
  camera: { position: Vec3; target: Vec3; fov: number };
  /** Which arrangement the chips hold in this pose. */
  formation: FormationKey;
  /** Glow halo behind the subject, 0..1. */
  glow: number;
  /** Colour temperature of glow + accents, 0 cool .. 1 warm. */
  warmth: number;
  /** Exponential fog density (haze). */
  fog: number;
  /** 0..1 dims the whole world behind text-heavy content. */
  dim: number;
  /** Slow ambient orbit, rad/s. */
  orbit: number;
  /** Contact shadow under a grounded product, 0..1. */
  shadow: number;
  /** How much of the side-of-text lens shift to apply (wide formations use less). */
  shift: number;
};

export const JOURNEY_KEYS = ["hero", "understanding", "capabilities", "proof", "process", "commitment"] as const;
export type JourneyKey = (typeof JOURNEY_KEYS)[number];

export type StaticPoseKey = "services" | "work" | "about" | "process" | "contact" | "legal" | "missing";

export type PoseRequest =
  | { kind: "journey" }
  | { kind: "static"; key: StaticPoseKey }
  | { kind: "focus"; wedge: number };

// ---------------------------------------------------------------- math

export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
export const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
export const smoothstep = (u: number) => {
  const x = clamp(u, 0, 1);
  return x * x * (3 - 2 * x);
};
export const lerp3 = (a: Vec3, b: Vec3, u: number): Vec3 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
export const sub3 = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const add3 = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const len3 = (a: Vec3) => Math.hypot(a[0], a[1], a[2]);

/** Uniform Catmull-Rom through p1→p2 (p0/p3 are neighbours). C1-continuous at knots. */
export function catmullRom(p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3, u: number): Vec3 {
  const u2 = u * u;
  const u3 = u2 * u;
  const out: Vec3 = [0, 0, 0];
  for (let k = 0; k < 3; k++) {
    out[k] =
      0.5 *
      (2 * p1[k]! +
        (-p0[k]! + p2[k]!) * u +
        (2 * p0[k]! - 5 * p1[k]! + 4 * p2[k]! - p3[k]!) * u2 +
        (-p0[k]! + 3 * p1[k]! - 3 * p2[k]! + p3[k]!) * u3);
  }
  return out;
}

// ---------------------------------------------------------------- poses

const base = { glow: 0.2, warmth: 0.35, fog: 0.03, dim: 0, orbit: 0, shadow: 0, shift: 1 };

export const JOURNEY_POSES: Record<JourneyKey, Pose> = {
  hero: {
    ...base,
    camera: { position: [4.2, 1.0, 8.8], target: [0, 0.15, 0], fov: 30 },
    formation: "product",
    glow: 0.35,
    shadow: 1,
  },
  understanding: {
    ...base,
    camera: { position: [0.6, 0.7, 9.6], target: [0.2, 0.45, -0.4], fov: 34 },
    formation: "code",
    glow: 0.1,
    dim: 0.15,
    shift: 0.35,
  },
  capabilities: {
    ...base,
    camera: { position: [0, 1.2, 12.2], target: [0, 0.3, -0.4], fov: 32 },
    formation: "services",
    glow: 0.15,
    dim: 0.2,
    shift: 0.25,
  },
  proof: {
    ...base,
    camera: { position: [-0.6, 0.6, 9.6], target: [0, 0.4, -0.3], fov: 34 },
    formation: "gallery",
    glow: 0.1,
    dim: 0.2,
    shift: 0.3,
  },
  process: {
    ...base,
    camera: { position: [1.4, 1.8, 11.8], target: [0, 0.25, -0.8], fov: 34 },
    formation: "process",
    glow: 0.1,
    dim: 0.25,
    shift: 0.25,
  },
  commitment: {
    ...base,
    camera: { position: [-3.8, 0.7, 8.5], target: [0, 0.15, 0], fov: 30 },
    formation: "delivered",
    glow: 1,
    warmth: 0.9,
    shadow: 1,
  },
};

export const STATIC_POSES: Record<StaticPoseKey, Pose> = {
  services: { ...JOURNEY_POSES.capabilities, dim: 0.35 },
  work: { ...JOURNEY_POSES.proof, dim: 0.45 },
  about: {
    ...JOURNEY_POSES.hero,
    camera: { position: [5.6, 1.2, 8.1], target: [0, 0.15, 0], fov: 30 },
    dim: 0.35,
    orbit: 0.035,
  },
  process: { ...JOURNEY_POSES.process, dim: 0.35 },
  contact: { ...JOURNEY_POSES.commitment, camera: { position: [3.6, 0.6, 9.0], target: [0, 0.15, 0], fov: 30 }, dim: 0.2 },
  legal: {
    ...base,
    camera: { position: [0, 0.6, 13], target: [0, 0.4, -2], fov: 30 },
    formation: "scatter",
    glow: 0,
    dim: 0.85,
    shift: 0,
  },
  missing: {
    ...JOURNEY_POSES.hero,
    formation: "missing",
    camera: { position: [4.6, 0.9, 9.0], target: [0.4, -0.1, 0.3], fov: 30 },
    glow: 0.3,
    warmth: 0.9,
  },
};

export function focusPose(index: number): Pose {
  const i = clamp(Math.round(index), 0, 4) as 0 | 1 | 2 | 3 | 4;
  return {
    ...base,
    camera: { position: [2.4, 0.9, 8.4], target: [0, 0.3, 0.4], fov: 30 },
    formation: `focus${i}`,
    glow: 0.3,
    warmth: 0.6,
    dim: 0.3,
    shift: 0.5,
  };
}

// ---------------------------------------------------------------- blending

/** Blends everything except the formation (the renderer morphs chips itself). */
export function blendPose(a: Pose, b: Pose, u: number): Pose {
  const e = smoothstep(u);
  return {
    camera: {
      position: lerp3(a.camera.position, b.camera.position, e),
      target: lerp3(a.camera.target, b.camera.target, e),
      fov: lerp(a.camera.fov, b.camera.fov, e),
    },
    formation: e < 0.5 ? a.formation : b.formation,
    glow: lerp(a.glow, b.glow, e),
    warmth: lerp(a.warmth, b.warmth, e),
    fog: lerp(a.fog, b.fog, e),
    dim: lerp(a.dim, b.dim, e),
    orbit: lerp(a.orbit, b.orbit, e),
    shadow: lerp(a.shadow, b.shadow, e),
    shift: lerp(a.shift, b.shift, e),
  };
}

const JOURNEY = JOURNEY_KEYS.map((k) => JOURNEY_POSES[k]);
export const JOURNEY_LENGTH = JOURNEY.length - 1;

export type JourneyFrame = { pose: Pose; from: FormationKey; to: FormationKey; mix: number };

/**
 * The home page's world at journey time t ∈ [0, JOURNEY_LENGTH]: chapter
 * floor(t) morphing into the next (mix = fraction). The camera rides a
 * Catmull-Rom spline through every chapter's camera position.
 */
export function journeyFrame(t: number): JourneyFrame {
  const tc = clamp(t, 0, JOURNEY_LENGTH);
  const i = Math.min(Math.floor(tc), JOURNEY_LENGTH - 1);
  const u = tc - i;
  const pose = blendPose(JOURNEY[i]!, JOURNEY[i + 1]!, u);
  const at = (k: number) => JOURNEY[clamp(k, 0, JOURNEY_LENGTH)]!.camera.position;
  pose.camera.position = catmullRom(at(i - 1), at(i), at(i + 1), at(i + 2), smoothstep(u));
  return { pose, from: JOURNEY[i]!.formation, to: JOURNEY[i + 1]!.formation, mix: u };
}

export function resolvePose(req: PoseRequest): Pose {
  if (req.kind === "focus") return focusPose(req.wedge);
  if (req.kind === "static") return STATIC_POSES[req.key];
  return JOURNEY_POSES.hero;
}

// ---------------------------------------------------------------- scroll → journey

/**
 * Maps page scroll to journey time. `anchors[i]` is the scrollY at which
 * chapter i is fully "arrived" (its section's top at mid-viewport; chapter 0
 * at the top of the page). Between anchors t is linear; outside it clamps.
 * Degenerate (non-increasing) anchors are tolerated: t never goes backwards.
 */
export function progressFromScroll(scrollY: number, anchors: readonly number[]): number {
  if (anchors.length === 0) return 0;
  if (scrollY <= anchors[0]!) return 0;
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i]!;
    const b = anchors[i + 1]!;
    if (scrollY < b) return b > a ? i + (scrollY - a) / (b - a) : i + 1;
  }
  return anchors.length - 1;
}

/** Anchor for a section whose top sits at `top` px in the document. */
export function anchorFor(index: number, top: number, viewportHeight: number, maxScroll: number): number {
  if (index === 0) return 0;
  return clamp(top - viewportHeight * 0.5, 0, maxScroll);
}

// ---------------------------------------------------------------- framing

/**
 * Lens shift (fraction of the viewport) so the subject sits beside the text,
 * not behind it: right of centre on wide screens, above centre on tall ones.
 * Applied with PerspectiveCamera.setViewOffset, so perspective is unchanged.
 */
export function lensShift(aspect: number): { x: number; y: number } {
  if (aspect >= 1.2) return { x: -0.17, y: 0 };
  if (aspect >= 0.9) return { x: -0.08, y: 0.04 };
  return { x: 0, y: 0.26 };
}

/** Pull the camera back on narrow screens so the subject still fits. */
export function distanceScale(aspect: number): number {
  if (aspect >= 1.6) return 1;
  if (aspect >= 1) return 1 + (1.6 - aspect) * 0.25; // 4:3 laptops/tablets: a little further back
  return clamp(1.15 + (1 - aspect) * 1.1, 1, 1.8);
}
