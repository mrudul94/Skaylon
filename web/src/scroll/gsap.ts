"use client";

import type { gsap as GSAP } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

export type Motion = { gsap: typeof GSAP; ScrollTrigger: typeof ScrollTriggerType };

let motion: Promise<Motion> | null = null;

/**
 * GSAP + ScrollTrigger, loaded on demand after hydration so they stay out of
 * the initial bundle (plan §6: ≤130 KB initial JS). Content never depends on
 * them; they only add motion. Memoised: one download, one registration.
 */
export function loadMotion(): Promise<Motion> {
  motion ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
    g.gsap.registerPlugin(st.ScrollTrigger);
    // iOS address-bar show/hide resizes the viewport; don't re-measure for it.
    st.ScrollTrigger.config({ ignoreMobileResize: true });
    return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
  });
  return motion;
}

/** Re-measure all triggers, if motion has loaded. Never forces the download. */
export function refreshScrollTriggers() {
  motion?.then(({ ScrollTrigger }) => ScrollTrigger.refresh());
}
