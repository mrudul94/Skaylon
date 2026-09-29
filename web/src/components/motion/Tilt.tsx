"use client";

import { useRef, type ReactNode } from "react";

/**
 * Spotlight card: tilts toward the pointer in 3D while a soft light and a lit
 * border follow it (styles: `.spotlight` in globals.css). Writes four CSS
 * variables per pointer move; no React state, no re-renders.
 */
export function Tilt({
  children,
  className,
  max = 6,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Maximum tilt in degrees. */
  max?: number;
  as?: "div" | "li" | "article";
}) {
  const ref = useRef<HTMLElement>(null);

  const move = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.dataset.active = "";
    el.style.setProperty("--mx", `${(px * r.width).toFixed(0)}px`);
    el.style.setProperty("--my", `${(py * r.height).toFixed(0)}px`);
    el.style.setProperty("--rx", `${((0.5 - py) * max).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((px - 0.5) * max).toFixed(2)}deg`);
  };

  const leave = () => {
    const el = ref.current;
    if (!el) return;
    delete el.dataset.active;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  // Typed as a plain HTML element: R3F's JSX augmentation otherwise widens
  // ElementType with three.js intrinsics and breaks polymorphic props.
  const Element = Tag as unknown as React.FC<
    React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
  >;
  return (
    <Element ref={ref} onPointerMove={move} onPointerLeave={leave} className={`spotlight ${className ?? ""}`}>
      {children}
    </Element>
  );
}
