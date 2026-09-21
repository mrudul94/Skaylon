// Zod-free constants the browser form needs (importing contact-schema from a
// client component would ship zod in the bundle).
export const BUDGETS = ["Under ₹2 lakh", "₹2–5 lakh", "₹5–15 lakh", "₹15 lakh+", "Not sure yet"] as const;

/** Minimum time a human takes to fill the form; faster = bot. */
export const MIN_FILL_MS = 3000;
/** A form older than this is stale (and its timestamp can't be replayed forever). */
export const MAX_FILL_MS = 2 * 60 * 60 * 1000;
