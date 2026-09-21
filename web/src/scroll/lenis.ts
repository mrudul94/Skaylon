import type Lenis from "lenis";

/** The active Lenis instance, or null when smooth scrolling is off. */
export const lenisRef: { current: Lenis | null } = { current: null };
