"use client";

import { useEffect, useRef } from "react";

/**
 * Counts a number up when it scrolls into view. The server HTML always holds
 * the final value (what crawlers, AI tools, no-JS and reduced-motion visitors
 * read); the count only runs in the browser, starting after hydration, and
 * ends on exactly that value.
 *
 * It only edits the value of React's own text node (never replaces the
 * element's children), so React's DOM stays consistent when the page unmounts.
 */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current?.firstChild;
    const el = ref.current;
    if (!el || !node || node.nodeType !== Node.TEXT_NODE || typeof IntersectionObserver === "undefined") return;
    const set = (v: number) => {
      node.nodeValue = String(v);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return; // already on screen: leave it
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const dur = 1100;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        set(Math.round(value * eased));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      set(0);
      raf = requestAnimationFrame(tick);
    }, { rootMargin: "0px 0px -10% 0px" });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      set(value);
    };
  }, [value]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {value}
    </span>
  );
}
