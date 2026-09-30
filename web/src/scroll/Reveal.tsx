"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  as?: "div" | "ul" | "ol" | "section";
  className?: string;
};

/**
 * Fades content up as it enters the viewport, with a CSS transition
 * (.reveal-armed in globals.css) and one IntersectionObserver: no animation
 * library.
 *
 * Content is fully visible in the server HTML. The hidden start state is only
 * applied after hydration, only to content still below the fold, and never
 * under prefers-reduced-motion, so no-JS visitors, crawlers and reduced-motion
 * users always see everything. Never wrap the page's h1 in this.
 */
export function Reveal({ children, as: Tag = "div", className, stagger = false }: RevealProps & { stagger?: boolean }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    el.classList.add("reveal-armed");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.classList.remove("reveal-armed", "is-visible");
    };
  }, []);

  const Element = Tag as unknown as React.FC<React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }>;
  return (
    <Element ref={ref} className={className} {...(stagger ? { "data-stagger": "" } : {})}>
      {children}
    </Element>
  );
}
