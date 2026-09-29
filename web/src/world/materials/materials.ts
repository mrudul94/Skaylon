import { Color } from "three";

/** The world's palette (matches the CSS tokens in globals.css). */
export const PALETTE = {
  void: new Color("#06070a"),
  iris: new Color("#8f7cff"),
  cyan: new Color("#3fd8ff"),
  /** Glow halo colours: live.warmth blends cool (cyan) → warm (iris). */
  warmCore: new Color("#b7a6ff"),
  coolCore: new Color("#9fefff"),
};
