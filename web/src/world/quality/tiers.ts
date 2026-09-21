/**
 * Quality tiers (plan §3). PURE: decisions from plain signals so
 * scripts/verify-tiers.mts can test them. No third-party GPU benchmark lookup
 * (detect-gpu fetches its database from a CDN at runtime; privacy + latency).
 *
 *   0 → static poster, no WebGL
 *   1 → mobile / modest GPUs: DPR ≤ 1.5, 1.4k chips, 800 dust, 30 fps idle
 *   2 → desktop: DPR ≤ 2, 3k chips, 3k dust, 60 fps idle
 *
 * Both WebGL tiers share one look: shadow maps, glass transmission and bloom
 * were removed after measurement (each ~450 ms of main-thread blocking at
 * start-up) in favour of baked lighting and cheap decals.
 */
export type Tier = 0 | 1 | 2;

export type Signals = {
  webgl2: boolean;
  saveData: boolean;
  /** navigator.deviceMemory (GB), when the browser exposes it. */
  deviceMemory?: number;
  hardwareConcurrency?: number;
  coarsePointer: boolean;
  /** Shorter screen side in CSS px. */
  screenMin: number;
  /** UNMASKED_RENDERER_WEBGL string, lower-cased, if available. */
  renderer?: string;
};

const SOFTWARE_RENDERERS = ["swiftshader", "llvmpipe", "software", "basic render", "microsoft basic"];
const WEAK_GPUS = ["mali-4", "mali-t", "adreno (tm) 3", "adreno (tm) 4", "adreno (tm) 50", "powervr sgx", "intel(r) hd graphics 4", "intel(r) hd graphics 5"];

export function initialTier(s: Signals): Tier {
  if (!s.webgl2 || s.saveData) return 0;
  const r = s.renderer ?? "";
  if (SOFTWARE_RENDERERS.some((k) => r.includes(k))) return 0;
  if ((s.deviceMemory !== undefined && s.deviceMemory < 2) || (s.hardwareConcurrency ?? 8) < 3) return 0;
  if (WEAK_GPUS.some((k) => r.includes(k))) return 1;
  if (s.coarsePointer || s.screenMin < 700) return 1;
  if (s.deviceMemory !== undefined && s.deviceMemory < 4) return 1;
  return 2;
}

export type TierSettings = {
  dpr: [number, number];
  /** Chips that form the shapes (one instanced draw call). */
  chips: number;
  /** Background dust particles. */
  particles: number;
  /** Ambient frame rate when nothing is moving (demand frameloop). */
  idleFps: number;
};

export const TIER_SETTINGS: Record<Exclude<Tier, 0>, TierSettings> = {
  1: { dpr: [1, 1.5], chips: 1400, particles: 800, idleFps: 30 },
  2: { dpr: [1, 2], chips: 3000, particles: 3000, idleFps: 60 },
};

/** Step down after the performance monitor reports sustained low FPS. */
export function declineTier(t: Tier): Tier {
  return t === 2 ? 1 : 0;
}
