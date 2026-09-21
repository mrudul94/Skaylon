import { documentTypes } from "./documents";
import { objectTypes } from "./objects";
import { singletonTypes } from "./singletons";

export const schemaTypes = [...objectTypes, ...singletonTypes, ...documentTypes];

/** Fixed-id documents: exactly one of each, shown directly in the desk. */
export const SINGLETONS = [
  { id: "siteSettings", type: "siteSettings", title: "Site settings" },
  { id: "homePage", type: "homePage", title: "Home page" },
  { id: "aboutPage", type: "aboutPage", title: "About page" },
  { id: "processPage", type: "processPage", title: "Process page" },
  { id: "privacyPage", type: "legalPage", title: "Privacy policy" },
  { id: "termsPage", type: "legalPage", title: "Terms of use" },
] as const;
