import { services } from "../../src/content/seed/services";
import { projects } from "../../src/content/seed/pages";

/** Every public route, derived from the same content the site renders. */
export const routes: string[] = [
  "/",
  "/services",
  ...services.map((s) => `/services/${s.slug}`),
  "/work",
  ...projects.map((p) => `/work/${p.slug}`),
  "/about",
  "/process",
  "/contact",
  "/privacy",
  "/terms",
];
