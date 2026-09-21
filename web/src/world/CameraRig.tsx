"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { FogExp2, PerspectiveCamera, Vector3 } from "three";
import { distanceScale, journeyFrame, lensShift, progressFromScroll, resolvePose } from "./journey";
import { dimOverlay, live } from "./live";
import { journeyProgress, useWorld } from "./store";

const EPS = 1e-4;
const target = new Vector3();
const offset = new Vector3();

/**
 * Each frame: ask journey.ts what the world should look like (scroll position
 * on the home page, a fixed pose elsewhere) and ease the live state toward it.
 * Everything else only reads `live`. Reduced motion snaps instead of easing.
 */
export function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const scene = useThree((s) => s.scene);
  const size = useThree((s) => s.size);
  const lastT = useRef(-1);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    const { pose: req } = useWorld.getState();

    let goal;
    if (req.kind === "journey") {
      journeyProgress.t = progressFromScroll(window.scrollY, journeyProgress.anchors);
      const frame = journeyFrame(journeyProgress.t);
      goal = frame.pose;
      live.morph.from = frame.from;
      live.morph.to = frame.to;
      live.morph.mix = frame.mix;
    } else {
      goal = resolvePose(req);
      live.morph.from = null;
      live.morph.to = goal.formation;
      live.morph.mix = 1;
    }

    // Journey follows scroll closely (Lenis already smooths the input);
    // route changes glide more slowly, like a camera move between shots.
    const lambda = req.kind === "journey" ? 5.5 : 1.7;
    const k = reducedMotion ? 1 : 1 - Math.exp(-lambda * dt);
    let residual = 0;
    const approach = (cur: number, to: number) => {
      const next = cur + (to - cur) * k;
      residual += Math.abs(to - next);
      return next;
    };

    for (let a = 0; a < 3; a++) {
      live.camera.position[a] = approach(live.camera.position[a]!, goal.camera.position[a]!);
      live.camera.target[a] = approach(live.camera.target[a]!, goal.camera.target[a]!);
    }
    live.camera.fov = approach(live.camera.fov, goal.camera.fov);
    live.glow = approach(live.glow, goal.glow);
    live.warmth = approach(live.warmth, goal.warmth);
    live.fog = approach(live.fog, goal.fog);
    live.dim = approach(live.dim, goal.dim);
    live.shadow = approach(live.shadow, goal.shadow);
    live.shift = approach(live.shift, goal.shift);
    if (!reducedMotion) live.orbitAngle += goal.orbit * dt;
    live.moving = residual > EPS || goal.orbit > 0 || journeyProgress.t !== lastT.current;
    lastT.current = journeyProgress.t;

    // Camera: orbit about the target, pull back on narrow screens, and shift
    // the lens so the subject sits beside the text rather than behind it.
    const aspect = size.width / Math.max(1, size.height);
    target.fromArray(live.camera.target);
    offset.fromArray(live.camera.position).sub(target);
    offset.applyAxisAngle(camera.up, live.orbitAngle).multiplyScalar(distanceScale(aspect));
    camera.position.copy(target).add(offset);
    camera.lookAt(target);
    camera.fov = live.camera.fov;
    const shift = lensShift(aspect);
    camera.setViewOffset(
      size.width,
      size.height,
      shift.x * live.shift * size.width,
      shift.y * size.height,
      size.width,
      size.height,
    );
    camera.updateProjectionMatrix();

    if (scene.fog instanceof FogExp2) scene.fog.density = live.fog;
    if (dimOverlay.current) dimOverlay.current.style.opacity = (live.dim * 0.72).toFixed(3);
  }, -1);

  return null;
}
