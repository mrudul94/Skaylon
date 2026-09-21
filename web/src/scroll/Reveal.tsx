"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { loadMotion } from "./gsap";
import { useReducedMotion } from "./useReducedMotion";

type RevealProps = {
  children: ReactNode;
  as?: "div" | "ul" | "ol" | "dl" | "figure" | "section";
  className?: string;
  /** Stagger direct children instead of revealing the wrapper as one block. */
  stagger?: boolean;
};

/**
 * Fades content up as it enters the viewport.
 *
 * Content is fully visible in the server HTML; the hidden start state is only
 * applied by JS once GSAP has loaded, and only to content still below the
 * fold, so no-JS, crawlers and reduced motion always see everything. Never
 * wrap the LCP element (the page's h1) in this.
 */
export function Reveal({ children, as: Tag = "div", className, stagger = false }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    let revert: (() => void) | undefined;
    let cancelled = false;

    loadMotion().then(({ gsap }) => {
      // Already on screen (or unmounted) by the time motion arrives: leave it
      // alone rather than hide it and fade it back in.
      if (cancelled || el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
      const ctx = gsap.context(() => {
        gsap.from(stagger ? Array.from(el.children) : el, {
          autoAlpha: 0,
          y: 28,
          duration: 1.1,
          ease: "power3.out",
          stagger: stagger ? 0.08 : 0,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      }, el);
      revert = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [reducedMotion, stagger]);

  // Typed as a plain HTML element: R3F's JSX augmentation otherwise widens
  // ElementType with three.js intrinsics and breaks polymorphic props.
  const Element = Tag as unknown as React.FC<React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }>;
  return (
    <Element ref={ref} className={className}>
      {children}
    </Element>
  );
}
