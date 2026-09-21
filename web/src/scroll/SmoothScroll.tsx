"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { loadMotion, refreshScrollTriggers } from "./gsap";
import { lenisRef } from "./lenis";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Lenis driven by GSAP's ticker, with ScrollTrigger updated from Lenis so DOM
 * animation and (later) the 3D camera read one scroll position.
 *
 * Both libraries load after hydration; until then (and without JS) scrolling
 * is simply native. Never hijacks: keyboard, anchors, find-in-page and
 * scrollbars stay native. Disabled entirely under prefers-reduced-motion.
 */
export function SmoothScroll() {
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (reducedMotion) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    Promise.all([loadMotion(), import("lenis")]).then(([{ gsap, ScrollTrigger }, { default: Lenis }]) => {
      if (cancelled) return;
      const lenis = new Lenis({
        autoRaf: false,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 0.75,
        touchMultiplier: 1.2,
        smoothWheel: true,
        anchors: true,
      });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);

      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [reducedMotion]);

  // New route: start at the top (unless targeting a hash) and re-measure
  // triggers once the new page has laid out.
  useEffect(() => {
    if (!window.location.hash) lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    const id = requestAnimationFrame(refreshScrollTriggers);
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  // Late fonts shift layout; re-measure once they're in.
  useEffect(() => {
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) refreshScrollTriggers();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
