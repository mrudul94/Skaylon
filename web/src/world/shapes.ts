/**
 * The core's shape for every formation, as DATA: one chrome form that morphs
 * with the story. Idea (liquid sphere) → understanding (calm sphere) →
 * system (rounded cube) → product (a screen-like slab) → process (a faceted
 * crystal) → delivered (polished sphere). Service pages get a form for their
 * discipline (screen, app block, phone, crystal, liquid).
 *
 * PURE (no three.js, no DOM): scripts/verify-shapes.mts tests these numbers,
 * including that no pose can push the surface through the floor.
 *
 * The surface math is mirrored in GLSL in Core.tsx (`surface()`); keep the two
 * in step (the verify suite checks the TS side).
 */
import type { FormationKey, Vec3 } from "./formations.ts";

export type Shape = {
  /** Superellipsoid exponent: 1 octahedron, 2 sphere, → ∞ cube. */
  round: number;
  /** Per-axis stretch of the unit form. */
  scale: Vec3;
  /** Overall size (world units, radius of the p=2 sphere). */
  size: number;
  /** Liquid displacement strength, 0 still .. 1.6 turbulent. */
  noise: number;
  /** Twist about the vertical axis (radians per unit height). */
  twist: number;
  /** Orbit rings visibility 0..1. */
  rings: number;
  /** Service satellites visibility 0..1. */
  satellites: number;
  /** Where the core floats (world units, relative to the stage centre): moves it beside the text. */
  offset: Vec3;
};

/** Displacement = noise × NOISE_SCALE × fbm, and |fbm| ≤ FBM_MAX (three octaves: 1 + 0.46 + 0.2). */
export const NOISE_SCALE = 0.2;
export const FBM_MAX = 1.66;
/** Extra noise added at full scroll velocity, and the pointer bulge height. */
export const VELOCITY_NOISE = 0.35;
export const POINTER_BULGE = 0.22;
/** Maximum pointer tilt of the whole core (radians, each axis). */
export const MAX_TILT = 0.3;
/** Vertical stretch at full scroll velocity, and the idle float amplitude. */
export const MAX_STRETCH = 0.06;
export const FLOAT_AMPLITUDE = 0.08;
/** Centre of the core in world space: raised above the camera targets so liquid poses clear the floor. */
export const CORE_Y = 0.5;

const sphere: Shape = {
  round: 2,
  scale: [1, 1, 1],
  size: 1.35,
  noise: 0.35,
  twist: 0,
  rings: 0.5,
  satellites: 0,
  offset: [0, 0, 0],
};

export const SHAPES: Record<FormationKey, Shape> = {
  product: { ...sphere, size: 1.15, noise: 0.9, rings: 1, satellites: 0.6, offset: [0.35, 0, 0] },
  code: { ...sphere, size: 1.1, noise: 0.3, twist: 0.5, rings: 0.35, offset: [2.3, 0, -0.6] },
  services: { ...sphere, round: 5, size: 1.0, noise: 0.14, twist: 0.25, rings: 0.7, satellites: 1, offset: [3.1, 0, -0.9] },
  gallery: { ...sphere, round: 7, scale: [1.3, 0.92, 0.2], size: 1.1, noise: 0.08, rings: 0.25, offset: [2.6, 0, -0.6] },
  process: { ...sphere, round: 1.2, scale: [0.95, 1.15, 0.95], size: 1.1, noise: 0.12, twist: 0.9, rings: 1, offset: [2.8, 0, -1.2] },
  delivered: { ...sphere, size: 1.2, noise: 0.22, rings: 1, satellites: 1, offset: [0.6, 0, 0] },
  scatter: { ...sphere, size: 0.9, noise: 0.3, rings: 0, offset: [2.5, 0, -1] },
  missing: { ...sphere, size: 1.05, noise: 1.3, rings: 0.2, offset: [0.6, 0, 0] },
  // Service pages: 0 website, 1 web app, 2 mobile, 3 custom software, 4 UI/UX.
  focus0: { ...sphere, round: 7, scale: [1.3, 0.85, 0.18], size: 1.1, noise: 0.08, rings: 0.6, offset: [1.6, 0, 0] },
  focus1: { ...sphere, round: 5, size: 0.95, noise: 0.14, twist: 0.3, rings: 0.8, offset: [1.6, 0, 0] },
  focus2: { ...sphere, round: 7, scale: [0.6, 1.2, 0.18], size: 1.05, noise: 0.08, rings: 0.6, offset: [1.6, 0, 0] },
  focus3: { ...sphere, round: 1.2, scale: [0.95, 1.15, 0.95], size: 1.1, noise: 0.12, twist: 0.9, rings: 0.8, offset: [1.6, 0, 0] },
  focus4: { ...sphere, size: 1.1, noise: 0.6, rings: 0.8, offset: [1.6, 0, 0] },
};

const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const smooth = (u: number) => {
  const x = Math.min(1, Math.max(0, u));
  return x * x * (3 - 2 * x);
};

/** Eased blend (for scroll morphs). */
export function blendShape(a: Shape, b: Shape, u: number): Shape {
  return mixShape(a, b, smooth(u));
}

/** Linear blend (for per-frame damping toward a goal). */
export function mixShape(a: Shape, b: Shape, e: number): Shape {
  return {
    // Exponents blend in log space so 1.2 → 7 moves evenly through 2.
    round: Math.exp(lerp(Math.log(a.round), Math.log(b.round), e)),
    scale: [lerp(a.scale[0], b.scale[0], e), lerp(a.scale[1], b.scale[1], e), lerp(a.scale[2], b.scale[2], e)],
    size: lerp(a.size, b.size, e),
    noise: lerp(a.noise, b.noise, e),
    twist: lerp(a.twist, b.twist, e),
    rings: lerp(a.rings, b.rings, e),
    satellites: lerp(a.satellites, b.satellites, e),
    offset: [lerp(a.offset[0], b.offset[0], e), lerp(a.offset[1], b.offset[1], e), lerp(a.offset[2], b.offset[2], e)],
  };
}

/** The shape the world is heading for: morph `from` → `to` by `mix` (from = null: just `to`). */
export function shapeFor(from: FormationKey | null, to: FormationKey, mix: number): Shape {
  return from === null ? SHAPES[to] : blendShape(SHAPES[from], SHAPES[to], mix);
}

/**
 * How much of a shape's sideways offset to apply at a viewport aspect: all of
 * it on wide screens (text left, core right), little on portrait phones where
 * text runs full width and the lens shift already lifts the core above it.
 */
export function offsetScale(aspect: number): number {
  return Math.min(1, Math.max(0.12, (aspect - 0.75) / 0.85));
}

/**
 * Point on the (noise-free, untwisted) surface for unit direction d.
 * Superellipsoid radius r = (|x|^p + |y|^p + |z|^p)^(-1/p), then stretched.
 * Mirrors `surface()` in Core.tsx.
 */
export function surfacePoint(d: Vec3, s: Shape): Vec3 {
  const p = s.round;
  const r = Math.pow(Math.abs(d[0]) ** p + Math.abs(d[1]) ** p + Math.abs(d[2]) ** p, -1 / p);
  return [d[0] * r * s.scale[0] * s.size, d[1] * r * s.scale[1] * s.size, d[2] * r * s.scale[2] * s.size];
}
