import { getProjects } from "@/content";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/primitives";
import { webPage } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

const DESCRIPTION = "Skaylon case studies: the problem, the approach, what was built and the result, published with client permission.";

export const metadata = pageMetadata({ title: "Work and Case Studies", description: DESCRIPTION, path: "/work" });

export default async function WorkPage() {
  const projects = await getProjects();
  return (
    <>
      <JsonLd data={webPage({ path: "/work", name: "Work and Case Studies | Skaylon", description: DESCRIPTION, type: "CollectionPage" })} />
      <PageHero
        eyebrow="Work"
        heading="Work and case studies"
        sub="Each case study covers the problem, our approach, what we built and what changed, and is published only with the client's permission."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Work", href: "/work" },
        ]}
      />
      <section aria-label="Case studies" className="pb-8">
        <Container>
          <ProjectGrid projects={projects} />
        </Container>
      </section>
      <CtaSection title="Have a project in mind?" label="Start a project" />
    </>
  );
}
