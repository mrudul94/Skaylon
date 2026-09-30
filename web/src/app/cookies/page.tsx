import { getLegalPage } from "@/content";
import { LegalDocument } from "@/components/sections/LegalDocument";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cookie Policy",
  description: "Which cookies and browser storage the Skaylon website uses. No advertising, analytics or tracking cookies.",
  path: "/cookies",
});

export default async function CookiesPage() {
  return <LegalDocument page={await getLegalPage("cookies")} />;
}
