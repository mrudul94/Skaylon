import { getLegalPage } from "@/content";
import { LegalDocument } from "@/components/sections/LegalDocument";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description: "The terms that govern your use of the Skaylon website.",
  path: "/terms",
});

export default async function TermsPage() {
  return <LegalDocument page={await getLegalPage("terms")} />;
}
