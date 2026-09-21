"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { live } from "./live";

/**
 * Drives the on-demand frame loop: render every display frame while anything
 * is moving (scroll, pose transitions, orbit), otherwise tick at `idleFps` for
 * the drifting dust — or not at all under reduced motion. rAF itself pauses
 * in background tabs, so hidden pages cost nothing.
 */
export function FrameDriver({ idleFps, reducedMotion }: { idleFps: number; reducedMotion: boolean }) {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    let raf = 0;
    let last = 0;
    let lastScroll = -1;
    const interval = reducedMotion ? Infinity : 1000 / idleFps;

    const loop = (now: number) => {
      const scrolled = window.scrollY !== lastScroll;
      lastScroll = window.scrollY;
      if (live.moving || scrolled || now - last >= interval) {
        last = now;
        invalidate();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [idleFps, reducedMotion, invalidate]);

  return null;
}
