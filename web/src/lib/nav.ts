/** Top-level links after the Services menu (which is built from the CMS services). */
export const primaryNav = [
  { label: "Work", href: "/work" },
  { label: "Showcase", href: "/showcase" },
  { label: "Pricing", href: "/pricing" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
] as const;

export const companyNav = [
  { label: "About", href: "/about" },
  { label: "How we work", href: "/process" },
  { label: "Work", href: "/work" },
  { label: "Showcase", href: "/showcase" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
] as const;

export const legalNav = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms and Conditions", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
] as const;

/** The subset of a service the navigation needs (kept small: it ships to the client). */
export type NavService = { slug: string; name: string; description: string };

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
