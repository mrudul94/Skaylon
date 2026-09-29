"use client";

/**
 * The mouse position in normalised device coordinates (-1..1, y up), read by
 * the world every frame. The canvas itself takes no pointer events (content
 * sits above it), so this listens on window. Touch and pen are ignored: on
 * phones the core just breathes on its own.
 */
export const pointer = { x: 0, y: 0, active: false, lastMove: 0 };

let listening = false;

export function listenPointer(): () => void {
  if (listening) return () => undefined;
  listening = true;
  const move = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    pointer.active = true;
    pointer.lastMove = performance.now();
  };
  const leave = () => (pointer.active = false);
  window.addEventListener("pointermove", move, { passive: true });
  document.documentElement.addEventListener("pointerleave", leave);
  return () => {
    listening = false;
    window.removeEventListener("pointermove", move);
    document.documentElement.removeEventListener("pointerleave", leave);
  };
}
