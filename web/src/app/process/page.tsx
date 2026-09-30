import { getProcessPage } from "@/content";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqList } from "@/components/sections/FaqList";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { Container, Summary } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqPage, webPage } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

const DESCRIPTION =
  "How Skaylon runs a software project: discovery, planning and design, build, then launch and support, with a fixed-scope proposal before development.";

export const metadata = pageMetadata({ title: "Our Process", description: DESCRIPTION, path: "/process" });

export default async function ProcessPage() {
  const process = await getProcessPage();
  return (
    <>
      <JsonLd data={[webPage({ path: "/process", name: "Our Process | Skaylon", description: DESCRIPTION }), faqPage(process.faqs)]} />
      <PageHero
        eyebrow="Process"
        heading={process.intro.heading}
        sub={process.intro.sub}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Process", href: "/process" },
        ]}
      />
      <Container>
        <Summary>
          Projects move through {process.phases.length} phases: {process.phases.map((p) => `${p.title} (${p.duration})`).join(", ")}.
          Price, scope and timeline are agreed in writing before development starts.
        </Summary>
      </Container>
      <section aria-labelledby="phases-heading" className="py-12 sm:py-16">
        <Container>
          <h2 id="phases-heading" className="sr-only">
            Project phases
          </h2>
          <ProcessSteps phases={process.phases} detailed />
        </Container>
      </section>
      <FaqList faqs={process.faqs} heading="Questions about working with us" />
      <CtaSection title="Start with a discovery conversation." label="Book a consultation" />
    </>
  );
}
