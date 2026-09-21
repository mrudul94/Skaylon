import { getProcessPage } from "@/content";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqList } from "@/components/sections/FaqList";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { Container } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqPage } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { WorldPose } from "@/world/WorldPose";

export const metadata = pageMetadata({
  title: "Process",
  description:
    "How Skaylon delivers: Discover, Architect, Build, Launch & support. Fixed scope, full transparency, working software early.",
  path: "/process",
});

export default async function ProcessPage() {
  const process = await getProcessPage();
  return (
    <>
      <JsonLd data={faqPage(process.faqs)} />
      <WorldPose pose="process" />
      <PageHero eyebrow="Process" heading={process.intro.heading} sub={process.intro.sub} />
      <section aria-label="Phases" className="pb-12">
        <Container>
          <ProcessSteps phases={process.phases} detailed />
        </Container>
      </section>
      <FaqList faqs={process.faqs} />
      <CtaSection title="Start with a discovery conversation." label="Book a call" />
    </>
  );
}
