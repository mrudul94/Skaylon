"use client";

import { useEffect, useRef, useState } from "react";
import type { ProcessPhase } from "@/content/types";
import { Tilt } from "@/components/motion/Tilt";
import { loadMotion } from "@/scroll/gsap";
import { useReducedMotion } from "@/scroll/useReducedMotion";

/**
 * The four phases as a horizontal track that scrolls sideways while the
 * section is pinned (wide screens with motion). Server HTML, phones and
 * reduced motion get a plain grid: the horizontal layout only exists once
 * GSAP is driving it.
 */
export function ProcessTrack({ phases }: { phases: ProcessPhase[] }) {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [horizontal, setHorizontal] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    const mq = window.matchMedia("(min-width: 1024px) and (min-height: 640px)");
    const sync = () => setHorizontal(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reducedMotion]);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!horizontal || !pin || !track) return;
    let revert: (() => void) | undefined;
    let cancelled = false;
    loadMotion().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      const distance = () => Math.max(0, track.scrollWidth - pin.clientWidth);
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            start: "center center",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        tl.to(track, { x: () => -distance(), ease: "none" }, 0);
        if (barRef.current) tl.fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
      }, pin);
      // Pinning adds scroll length below: re-measure everything (incl. the 3D anchors).
      ScrollTrigger.refresh();
      window.dispatchEvent(new Event("resize"));
      revert = () => ctx.revert();
    });
    return () => {
      cancelled = true;
      revert?.();
    };
  }, [horizontal]);

  return (
    <div ref={pinRef} className={horizontal ? "overflow-hidden py-6" : undefined}>
      <ol
        ref={trackRef}
        className={
          horizontal
            ? "flex w-max gap-6 pr-[8vw] will-change-transform"
            : "grid gap-5 md:grid-cols-2"
        }
      >
        {phases.map((phase) => (
          <Tilt
            key={phase.number}
            as="li"
            max={5}
            className={`glass flex flex-col rounded-3xl p-8 sm:p-10 ${horizontal ? "min-h-[26rem] w-[min(34rem,42vw)]" : ""}`}
          >
            <div className="flex items-start justify-between gap-6">
              <span className="text-gradient text-7xl font-semibold tracking-[-0.06em] tabular-nums sm:text-8xl">
                {phase.number}
              </span>
              <span className="rounded-full border border-chalk/10 px-3 py-1.5 font-mono text-[0.7rem] text-chalk-muted uppercase">
                {phase.duration}
              </span>
            </div>
            <h3 className="mt-10 text-title font-medium">{phase.title}</h3>
            <p className="mt-4 text-chalk-muted">{phase.summary}</p>
            <ul className="mt-auto flex flex-wrap gap-2 pt-8">
              {phase.deliverables.map((d) => (
                <li key={d} className="rounded-full bg-chalk/[0.05] px-3 py-1.5 text-xs text-chalk-muted">
                  {d}
                </li>
              ))}
            </ul>
          </Tilt>
        ))}
      </ol>
      {horizontal && (
        <div aria-hidden="true" className="mt-10 h-px w-full bg-chalk/10">
          <div ref={barRef} className="h-full origin-left bg-gradient-to-r from-accent to-cyan" />
        </div>
      )}
    </div>
  );
}
