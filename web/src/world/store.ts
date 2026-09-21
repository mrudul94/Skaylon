"use client";

import { create } from "zustand";
import type { PoseRequest } from "./journey";
import type { Tier } from "./quality/tiers";

type WorldState = {
  /** What the current route wants the world to show. */
  pose: PoseRequest;
  /** null until detected on the client (the server never guesses). */
  tier: Tier | null;
  /** First frame rendered: the canvas can fade in. */
  ready: boolean;
  /** WebGL context lost: fall back to the poster. */
  lost: boolean;
  /** Service icon highlighted by hovering/focusing a service in the DOM. */
  activeWedge: number | null;
  setPose: (pose: PoseRequest) => void;
  setTier: (tier: Tier) => void;
  setReady: (ready: boolean) => void;
  setLost: (lost: boolean) => void;
  setActiveWedge: (wedge: number | null) => void;
};

export const useWorld = create<WorldState>()((set) => ({
  pose: { kind: "journey" },
  tier: null,
  ready: false,
  lost: false,
  activeWedge: null,
  setPose: (pose) => set({ pose }),
  setTier: (tier) => set({ tier }),
  setReady: (ready) => set({ ready }),
  setLost: (lost) => set({ lost }),
  setActiveWedge: (activeWedge) => set({ activeWedge }),
}));

/**
 * Journey progress lives outside React state: it changes every frame and is
 * read inside useFrame, so it must never trigger renders.
 */
export const journeyProgress = { t: 0, anchors: [] as number[] };
