// Zod-free constants the browser forms need (importing contact-schema from a
// client component would ship zod in the bundle).
export const BUDGETS = ["Under ₹25,000", "₹25,000–1 lakh", "₹1–2 lakh", "₹2–5 lakh", "₹5–15 lakh", "₹15 lakh+", "Not sure yet"] as const;

export const PROJECT_TYPES = [
  "Website",
  "Web Application",
  "Mobile App",
  "Custom Software",
  "UI/UX Design",
  "Backend/API",
  "Other",
] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const TIMELINES = ["As soon as possible", "Within 1–3 months", "In 3–6 months", "6 months or later", "Not sure yet"] as const;

/** Which form an enquiry came from (shown in the email). */
export const SOURCES = ["contact", "popup"] as const;

/** Service page slug → project type, to pre-select the form from /contact?service=… */
export const SERVICE_PROJECT_TYPE: Record<string, ProjectType> = {
  "website-development": "Website",
  "web-application-development": "Web Application",
  "mobile-app-development": "Mobile App",
  "custom-software-development": "Custom Software",
  "ui-ux-design": "UI/UX Design",
  "backend-api-development": "Backend/API",
};

/** Minimum time a human takes to fill the form; faster = bot. */
export const MIN_FILL_MS = 3000;
/** A form older than this is stale (and its timestamp can't be replayed forever). */
export const MAX_FILL_MS = 2 * 60 * 60 * 1000;

/** localStorage keys (values are a timestamp or "1"; never personal data). */
export const STORAGE_KEYS = {
  enquirySent: "skaylon:enquiry-sent",
  popupDismissed: "skaylon:enquiry-popup-dismissed",
} as const;
