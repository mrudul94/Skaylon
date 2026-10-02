import type { SiteSettings } from "../types";

// Contact details and credential carried over from the previous Skaylon site.
export const siteSettings: SiteSettings = {
  name: "Skaylon",
  legalName: "Skaylon Technology",
  tagline: "Websites, apps and custom software for growing businesses.",
  description:
    "Skaylon is a founder-led software studio in Kasaragod, Kerala, that designs and builds websites, web applications, mobile apps, custom software and backend systems for businesses in India and abroad.",
  email: "skaylon.in@gmail.com",
  phone: "+91 80759 15386",
  whatsapp: "918075915386",
  founder: "Mrudul",
  address: { locality: "Kasaragod", region: "Kerala", country: "India", countryCode: "IN" },
  credential: { label: "MSME registered (Udyam)", value: "UDYAM-KL-05-0037475" },
  founderPhoto: {
    url: "/founder-480.webp",
    alt: "Mrudul, founder of Skaylon Technology",
    width: 480,
    height: 480,
  },
  socials: [],
};
