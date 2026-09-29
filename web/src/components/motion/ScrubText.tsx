"use client";

import { useEffect, useRef } from "react";
import { loadMotion } from "@/scroll/gsap";
import { useReducedMotion } from "@/scroll/useReducedMotion";

/**
 * A statement that lights up word by word as it scrolls through the
 * viewport. Server HTML (no JS, reduced motion) shows every word at full
 * strength; the dimmed start state only exists once GSAP drives it.
 */
export function ScrubText({
  text,
  className,
  as: Tag = "p",
  id,
}: {
  text: string;
  className?: string;
  as?: "p" | "h2";
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    let revert: (() => void) | undefined;
    let cancelled = false;
    loadMotion().then(({ gsap }) => {
      if (cancelled) return;
      const ctx = gsap.context(() => {
        gsap.fromTo(
          el.querySelectorAll("[data-word]"),
          // 50% keeps dimmed words above 4.5:1 on the page background (WCAG AA).
          { opacity: 0.5 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 45%", scrub: 0.6 },
          },
        );
      }, el);
      revert = () => ctx.revert();
    });
    return () => {
      cancelled = true;
      revert?.();
    };
  }, [reducedMotion]);

  const words = text.split(/\s+/);
  const Element = Tag as unknown as React.FC<
    React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
  >;
  return (
    <Element ref={ref} id={id} className={className}>
      {words.map((w, i) => (
        <span key={i} data-word="">
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Element>
  );
}
