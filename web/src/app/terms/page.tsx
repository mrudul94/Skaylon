import { getLegalPage } from "@/content";
import { LegalDocument } from "@/components/sections/LegalDocument";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms and Conditions",
  description: "The terms and conditions that govern your use of the Skaylon website and how enquiries are handled.",
  path: "/terms",
});

export default async function TermsPage() {
  return <LegalDocument page={await getLegalPage("terms")} />;
}
