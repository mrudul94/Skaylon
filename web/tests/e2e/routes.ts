import { services } from "../../src/content/seed/services";
import { projects } from "../../src/content/seed/pages";

/** Every public route, derived from the same content the site renders. */
export const routes: string[] = [
  "/",
  "/services",
  ...services.map((s) => `/services/${s.slug}`),
  "/work",
  ...projects.map((p) => `/work/${p.slug}`),
  "/showcase",
  "/pricing",
  "/about",
  "/process",
  "/contact",
  "/contact/thank-you",
  "/privacy",
  "/terms",
  "/cookies",
];

/** Keeps the enquiry pop-up out of tests that aren't about it. */
export const SUPPRESS_POPUP = () => {
  try {
    localStorage.setItem("skaylon:enquiry-popup-dismissed", String(Date.now()));
    // A consent choice already made, so the cookie banner stays closed.
    document.cookie = "skaylon_consent=1%3Adenied; Path=/";
  } catch {
    // ignore
  }
};
