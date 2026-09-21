"use client";

import type { FormationKey, Vec3 } from "./formations";
import { JOURNEY_POSES, type Pose } from "./journey";

/**
 * The world's CURRENT (damped) state, mutated every frame by CameraRig and
 * read by the meshes. Lives outside React: per-frame values must never cause
 * renders. Starts at the hero pose so the first frame is already composed.
 */
export type LiveState = {
  camera: { position: Vec3; target: Vec3; fov: number };
  glow: number;
  warmth: number;
  fog: number;
  dim: number;
  shadow: number;
  shift: number;
  orbitAngle: number;
  /** What the chips should be doing: morph `from` → `to` by `mix` (from = null: from wherever they are). */
  morph: { from: FormationKey | null; to: FormationKey; mix: number };
  /** Formation whose labels are showing (null while mid-morph) and their opacity. */
  labels: { key: FormationKey | null; opacity: number };
  /** True while anything is still easing toward its target. */
  moving: boolean;
};

export function liveFromPose(pose: Pose): LiveState {
  return {
    camera: { position: [...pose.camera.position], target: [...pose.camera.target], fov: pose.camera.fov },
    glow: pose.glow,
    warmth: pose.warmth,
    fog: pose.fog,
    dim: pose.dim,
    shadow: pose.shadow,
    shift: pose.shift,
    orbitAngle: 0,
    morph: { from: null, to: pose.formation, mix: 1 },
    labels: { key: null, opacity: 0 },
    moving: true,
  };
}

/** The one live state (there is only ever one world). */
export const live: LiveState = liveFromPose(JOURNEY_POSES.hero);

/** DOM overlay that darkens the world behind text-heavy sections. */
export const dimOverlay: { current: HTMLDivElement | null } = { current: null };
