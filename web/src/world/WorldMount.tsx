"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useReducedMotion } from "@/scroll/useReducedMotion";
import { anchorFor } from "./journey";
import { dimOverlay } from "./live";
import { detectTier } from "./quality/detect";
import { labelText } from "./labels";
import { journeyProgress, useWorld } from "./store";

const WorldCanvas = dynamic(() => import("./WorldCanvas"), { ssr: false });

/**
 * Mounted once in the root layout, behind all content, and never unmounted by
 * navigation: the one persistent world. The server renders only the static
 * atmosphere; tier detection, three.js and the canvas all arrive after the
 * page is interactive. Decorative: aria-hidden, no pointer events.
 */
export function WorldMount({ labels }: { labels: Record<string, string> }) {
  labelText.map = labels;
  const tier = useWorld((s) => s.tier);
  const lost = useWorld((s) => s.lost);
  const ready = useWorld((s) => s.ready);
  const setTier = useWorld((s) => s.setTier);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      await idle(controller.signal);
      performance.mark("world:detect");
      const detected = detectTier();
      // Phones (tier 1): three.js takes real main-thread time to evaluate on
      // a mid-range CPU. Start only once the page has settled AND the visitor
      // has paused, so the first taps and scrolls (the moments INP measures)
      // never compete with it. Desktop starts right away.
      if (detected === 1) await settled(controller.signal, { minDelayMs: 3000, quietMs: 1200 });
      if (!controller.signal.aborted) setTier(detected);
    })().catch(() => undefined);
    return () => controller.abort();
  }, [setTier]);

  const showCanvas = tier !== null && tier > 0 && !lost;

  return (
    <div aria-hidden="true" data-world className="pointer-events-none fixed inset-0 z-[-1]">
      {(tier === 0 || lost) && <Poster />}
      {showCanvas && (
        <div className="absolute inset-0 transition-opacity duration-[1800ms] ease-out" style={{ opacity: ready ? 1 : 0 }}>
          <WorldCanvas key={tier} tier={tier as 1 | 2} reducedMotion={reducedMotion} />
        </div>
      )}
      <div ref={(el) => void (dimOverlay.current = el)} className="absolute inset-0 bg-graphite-950" style={{ opacity: 0 }} />
      <div data-world-scrim className="world-scrim absolute inset-0" />
      <JourneyAnchors />
    </div>
  );
}

function idle(signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const done = () => (signal.aborted ? reject(new Error("aborted")) : resolve());
    if ("requestIdleCallback" in window) window.requestIdleCallback(done, { timeout: 2500 });
    else setTimeout(done, 900);
  });
}

/**
 * Resolves once at least `minDelayMs` have passed since load AND there has
 * been no scroll/touch/pointer/key input for `quietMs`.
 */
function settled(signal: AbortSignal, { minDelayMs, quietMs }: { minDelayMs: number; quietMs: number }): Promise<void> {
  return new Promise((resolve, reject) => {
    const events = ["scroll", "wheel", "touchstart", "touchmove", "pointerdown", "keydown"] as const;
    let lastInput = performance.now();
    const onInput = () => (lastInput = performance.now());
    events.forEach((e) => window.addEventListener(e, onInput, { passive: true, capture: true }));
    const cleanup = () => events.forEach((e) => window.removeEventListener(e, onInput, { capture: true }));
    const check = () => {
      if (signal.aborted) {
        cleanup();
        reject(new Error("aborted"));
        return;
      }
      const now = performance.now();
      if (now >= minDelayMs && now - lastInput >= quietMs) {
        cleanup();
        resolve();
      } else {
        setTimeout(check, 250);
      }
    };
    check();
  });
}

/** T0 / context-loss fallback: a still of the hero composition. */
function Poster() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/posters/world-1600.webp"
      srcSet="/posters/world-900.webp 900w, /posters/world-1600.webp 1600w"
      sizes="100vw"
      alt=""
      decoding="async"
      fetchPriority="low"
      onError={(e) => (e.currentTarget.style.display = "none")}
      className="absolute inset-0 h-full w-full object-cover object-[70%_center] opacity-80"
    />
  );
}

/**
 * Measures where each home chapter sits so journey.ts can map scroll → t.
 * Re-measures on navigation, resize, late fonts and any layout change.
 */
function JourneyAnchors() {
  const pathname = usePathname();

  useEffect(() => {
    const measure = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
      const vh = window.innerHeight;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);
      journeyProgress.anchors = sections.map((el, i) =>
        anchorFor(i, el.getBoundingClientRect().top + window.scrollY, vh, maxScroll),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pathname]);

  return null;
}
