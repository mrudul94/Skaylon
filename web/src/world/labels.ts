"use client";

import type { FormationKey } from "./formations";

/**
 * Bridge between the canvas (which knows WHERE labels go, every frame) and the
 * DOM label layer (which renders WHAT they say). React only re-renders when
 * the labelled formation changes; per-frame positions are written directly.
 */
type Listener = (key: FormationKey | null) => void;

export const labelBus = {
  key: null as FormationKey | null,
  listeners: new Set<Listener>(),
  set(key: FormationKey | null) {
    if (key === this.key) return;
    this.key = key;
    this.listeners.forEach((l) => l(key));
  },
  subscribe(l: Listener) {
    this.listeners.add(l);
    return () => void this.listeners.delete(l);
  },
};

/** DOM nodes the projector positions each frame (registered by WorldLabels). */
export const labelNodes: {
  layer: HTMLDivElement | null;
  items: { label: HTMLDivElement | null; line: SVGLineElement | null; dot: SVGCircleElement | null }[];
  /** Caption mode (narrow screens): one caption, no leader lines. */
  caption: boolean;
} = { layer: null, items: [], caption: false };

/** Resolves "service:2" / "phase:0" references to display text. */
export const labelText: { map: Record<string, string> } = { map: {} };
export const resolveLabel = (text: string) => labelText.map[text] ?? text;
