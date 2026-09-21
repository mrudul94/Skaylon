"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import { AgXToneMapping, type DataTexture } from "three";
import { loadBakedEnvironment } from "./bakedEnvironment";
import { CameraRig } from "./CameraRig";
import { FrameDriver } from "./FrameDriver";
import { live } from "./live";
import { Chips } from "./Chips";
import { LabelProjector } from "./LabelProjector";
import { Particles } from "./Particles";
import { declineTier, TIER_SETTINGS } from "./quality/tiers";
import { Stage } from "./Stage";
import { useWorld } from "./store";

// Start-up phases as User Timing marks (visible in DevTools and RUM tools).
const mark = (name: string) => performance.mark(`world:${name}`);
mark("module");

/**
 * The persistent 3D world. Loaded with next/dynamic (ssr: false) from
 * WorldMount, so three.js and friends stay out of every page's initial JS.
 *
 * Start-up keeps the main thread free (scripts/longtasks.mjs: 0 long tasks
 * on this machine, both tiers):
 *   1. fetch + decode the pre-baked environment (no live PMREM work)
 *   2. compile every shader in parallel (KHR_parallel_shader_compile)
 *   3. only then render, and fade in
 * Real-time shadow maps and bloom were removed for the same reason: each
 * cost ~450 ms of blocking on the first frame (see Atmosphere.tsx).
 */
export default function WorldCanvas({ tier, reducedMotion }: { tier: 1 | 2; reducedMotion: boolean }) {
  const settings = TIER_SETTINGS[tier];
  const setTier = useWorld((s) => s.setTier);
  const setLost = useWorld((s) => s.setLost);
  const onLost = useCallback(() => setLost(true), [setLost]);

  const [environment, setEnvironment] = useState<DataTexture | null>(null);
  const [environmentSettled, setEnvironmentSettled] = useState(false);
  useEffect(() => {
    let cancelled = false;
    loadBakedEnvironment()
      .then((t) => !cancelled && setEnvironment(t))
      .catch(() => undefined) // renders without reflections rather than not at all
      .finally(() => {
        if (!cancelled) {
          mark("environment");
          setEnvironmentSettled(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const [compiled, setCompiled] = useState(false);
  const onCompiled = useCallback(() => setCompiled(true), []);

  return (
    <Canvas
      // No frames at all until every shader has compiled off the main thread.
      frameloop={compiled ? "demand" : "never"}
      dpr={settings.dpr}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: AgXToneMapping,
        stencil: false,
      }}
      camera={{ fov: live.camera.fov, near: 0.1, far: 90, position: live.camera.position }}
      onCreated={({ gl }) => {
        mark("gl-created");
        // Production: skip three's per-program error queries (synchronous GL
        // reads that stall on in-flight compiles). Kept on in development.
        gl.debug.checkShaderErrors = process.env.NODE_ENV !== "production";
      }}
    >
      <ContextLossGuard onLost={onLost} />
      <PerformanceMonitor
        // Sustained low FPS steps the tier down (2 → 1 → poster), at most twice.
        // Floors sit below each tier's deliberate idle rate (60 / 30 fps on the
        // demand loop) so an idle page is never mistaken for a slow one.
        bounds={() => (tier === 2 ? [40, 1000] : [22, 1000])}
        flipflops={2}
        onDecline={() => setTier(declineTier(tier))}
      />
      <CameraRig reducedMotion={reducedMotion} />
      <Stage environment={environment} />
      <Chips count={settings.chips} reducedMotion={reducedMotion} />
      <LabelProjector />
      <Particles count={settings.particles} reducedMotion={reducedMotion} />
      <FrameDriver idleFps={settings.idleFps} reducedMotion={reducedMotion} />
      <ReadySignal />
      {/* Last child, so every mesh and material above exists when it compiles.
          Waits for the environment: its presence is part of each program key. */}
      {environmentSettled && <ShaderWarmup onCompiled={onCompiled} />}
    </Canvas>
  );
}

/**
 * Compiles every shader in the scene in parallel (KHR_parallel_shader_compile)
 * before the first frame, instead of inline in the first render: that was a
 * single 3.1 s long task under Lighthouse's mobile throttling.
 */
function ShaderWarmup({ onCompiled }: { onCompiled: () => void }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    let cancelled = false;
    // Yield first so the page's own work finishes before we start.
    const id = setTimeout(() => {
      mark("compile-start");
      gl.compileAsync(scene, camera)
        .then(() => mark("compiled"))
        .catch(() => undefined) // worst case the first frame compiles synchronously
        .then(() => {
          if (!cancelled) onCompiled();
        });
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [gl, scene, camera, onCompiled]);
  return null;
}

/**
 * Real context loss (GPU reset, iOS backgrounding) → poster. Registered from a
 * CHILD effect on purpose: children clean up before the Canvas disposes its
 * renderer, and that disposal forces a context loss of its own (on unmount,
 * tier change, hot reload) which must not be mistaken for a real one.
 */
function ContextLossGuard({ onLost }: { onLost: () => void }) {
  const canvas = useThree((s) => s.gl.domElement);
  useEffect(() => {
    const lost = (e: Event) => {
      e.preventDefault(); // allow the browser to restore it
      onLost();
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [canvas, onLost]);
  return null;
}

/** Marks the world ready after a couple of real frames, so it fades in composed. */
function ReadySignal() {
  const frames = useRef(0);
  const setReady = useWorld((s) => s.setReady);
  useFrame(() => {
    frames.current++;
    if (frames.current === 1) requestAnimationFrame(() => mark("first-frame"));
    if (frames.current === 3) setReady(true);
  });
  return null;
}
