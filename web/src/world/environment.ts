/**
 * The studio environment as DATA: emissive panels ("lightformers") around the
 * origin, each facing it. scripts/bake-environment.mjs renders exactly this
 * through three's PMREM once, offline, and ships the result. At runtime there
 * is no environment rendering or PMREM work at all (measured: 0.5–1.2 s of
 * main-thread blocking on start-up when done live).
 *
 * PURE: no three.js. Change anything here → `npm run bake:env` (verify-env
 * fails until the baked file matches this data).
 */
import type { Vec3 } from "./formations.ts";

export type Lightformer = {
  name: string;
  position: Vec3;
  /** Width × height of the panel. */
  scale: [number, number];
  intensity: number;
  /** Linear RGB multiplier. */
  color: Vec3;
};

const WHITE: Vec3 = [1, 1, 1];

export const LIGHTFORMERS: Lightformer[] = [
  { name: "overhead softbox", position: [0, 6, 1], scale: [8, 2.5], intensity: 1.1, color: WHITE },
  { name: "key strip, front left", position: [-4, 1.5, 5], scale: [0.5, 9], intensity: 4, color: WHITE },
  { name: "broad soft box, left", position: [-7, 2, 1.5], scale: [5, 7], intensity: 0.9, color: WHITE },
  { name: "warm rim, back right", position: [5, 1.5, -4], scale: [0.35, 9], intensity: 3, color: [1, 0.81, 0.69] },
  { name: "face fill, front left low", position: [-3.5, -0.5, 7.5], scale: [7, 4], intensity: 0.75, color: WHITE },
  { name: "face fill, front right", position: [3.5, 0.5, 7.5], scale: [4, 3], intensity: 0.3, color: WHITE },
];

/** Cube face size the environment is baked at. */
export const ENV_SIZE = 128;

/** PMREM (CubeUV) texture layout for ENV_SIZE, as three.js lays it out. */
export const ENV_TEXTURE = {
  width: 3 * Math.max(ENV_SIZE, 16 * 7),
  height: 4 * ENV_SIZE,
  file: `/env/studio-${ENV_SIZE}.rgbe.gz`,
};

/** Stable fingerprint of the lighting data; the bake records it. */
export function environmentHash(): string {
  const text = JSON.stringify({ LIGHTFORMERS, ENV_SIZE });
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

/** RGBE (Radiance) encode/decode: 4 bytes per texel, shared exponent. */
export function encodeRGBE(r: number, g: number, b: number, out: Uint8Array, o: number): void {
  const max = Math.max(r, g, b);
  if (max < 1e-32) {
    out[o] = out[o + 1] = out[o + 2] = out[o + 3] = 0;
    return;
  }
  const e = Math.ceil(Math.log2(max));
  const scale = 255 / 2 ** e;
  out[o] = Math.min(255, Math.round(r * scale));
  out[o + 1] = Math.min(255, Math.round(g * scale));
  out[o + 2] = Math.min(255, Math.round(b * scale));
  out[o + 3] = e + 128;
}

/**
 * Float → IEEE half bits, without three.js (so verify-env can check it against
^ * three independently). Round-to-nearest; see
 * three's DataUtils.toHalfFloat in verify-env.
 */
const f32 = new Float32Array(1);
const u32 = new Uint32Array(f32.buffer);
export function toHalf(value: number): number {
  f32[0] = value;
  const x = u32[0]!;
  const sign = (x >>> 16) & 0x8000;
  const exp = (x >>> 23) & 0xff;
  let mant = x & 0x7fffff;
  if (exp === 0xff) return sign | 0x7c00 | (mant ? 0x200 : 0); // Inf / NaN
  const e = exp - 127 + 15;
  if (e >= 0x1f) return sign | 0x7c00; // overflow → Inf
  if (e <= 0) {
    if (e < -10) return sign; // underflow → ±0
    mant |= 0x800000; // subnormal
    const shift = 14 - e;
    let half = mant >>> shift;
    if ((mant >>> (shift - 1)) & 1) half++; // round
    return sign | half;
  }
  let half = sign | (e << 10) | (mant >>> 13);
  if (mant & 0x1000) half++; // round to nearest (may carry into exponent: correct)
  return half;
}

/** Decodes texels [from, to) of an RGBE buffer into RGBA half-float bits (alpha = 1). */
export function rgbeToHalfRange(rgbe: Uint8Array, out: Uint16Array, from: number, to: number): void {
  const one = toHalf(1);
  for (let i = from, o = from * 4; i < to; i++, o += 4) {
    const e = rgbe[o + 3]!;
    if (e === 0) {
      out[o] = out[o + 1] = out[o + 2] = 0;
      out[o + 3] = one;
      continue;
    }
    const f = 2 ** (e - 128) / 255;
    out[o] = toHalf(rgbe[o]! * f);
    out[o + 1] = toHalf(rgbe[o + 1]! * f);
    out[o + 2] = toHalf(rgbe[o + 2]! * f);
    out[o + 3] = one;
  }
}

/** Decodes a whole RGBE buffer into RGBA half-float bits (alpha = 1). */
export function rgbeToHalf(rgbe: Uint8Array): Uint16Array {
  const out = new Uint16Array(rgbe.length);
  rgbeToHalfRange(rgbe, out, 0, rgbe.length / 4);
  return out;
}

/**
 * Same result as rgbeToHalf, but time-sliced: yields to the event loop every
 * `sliceMs`, so no single main-thread task gets long (≈200 ms of work on a
 * mid-range phone otherwise).
 */
export async function rgbeToHalfSliced(rgbe: Uint8Array, sliceMs = 8): Promise<Uint16Array> {
  const out = new Uint16Array(rgbe.length);
  const texels = rgbe.length / 4;
  let i = 0;
  while (i < texels) {
    const start = performance.now();
    while (i < texels && performance.now() - start < sliceMs) {
      const end = Math.min(texels, i + 4096);
      rgbeToHalfRange(rgbe, out, i, end);
      i = end;
    }
    if (i < texels) await new Promise((r) => setTimeout(r, 0));
  }
  return out;
}

export function decodeRGBE(bytes: Uint8Array, o: number): Vec3 {
  const e = bytes[o + 3]!;
  if (e === 0) return [0, 0, 0];
  const f = 2 ** (e - 128) / 255;
  return [bytes[o]! * f, bytes[o + 1]! * f, bytes[o + 2]! * f];
}
