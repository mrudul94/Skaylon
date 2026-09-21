import { getLegalPage } from "@/content";
import { LegalDocument } from "@/components/sections/LegalDocument";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "What personal data Skaylon collects through this website, why, and your rights.",
  path: "/privacy",
});

export default async function PrivacyPage() {
  return <LegalDocument page={await getLegalPage("privacy")} />;
}
