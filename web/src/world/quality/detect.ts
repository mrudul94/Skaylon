"use client";

import { initialTier, type Signals, type Tier } from "./tiers";

/** Gather browser signals for initialTier(). Cheap; runs once, after idle. */
export function readSignals(): Signals {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  let webgl2 = false;
  let renderer: string | undefined;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    if (gl) {
      webgl2 = true;
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER)).toLowerCase();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch {
    webgl2 = false;
  }
  return {
    webgl2,
    renderer,
    saveData: Boolean(nav.connection?.saveData),
    deviceMemory: nav.deviceMemory,
    hardwareConcurrency: nav.hardwareConcurrency,
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
    screenMin: Math.min(window.screen.width, window.screen.height),
  };
}

/** `?tier=0|1|2` overrides detection (QA and poster rendering). */
export function detectTier(): Tier {
  const forced = new URLSearchParams(window.location.search).get("tier");
  if (forced === "0" || forced === "1" || forced === "2") return Number(forced) as Tier;
  return initialTier(readSignals());
}
