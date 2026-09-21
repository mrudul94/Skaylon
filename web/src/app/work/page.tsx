import { getProjects } from "@/content";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";
import { WorldPose } from "@/world/WorldPose";

export const metadata = pageMetadata({
  title: "Work",
  description: "Selected Skaylon case studies: the problem, the thinking, the solution and the measured outcome.",
  path: "/work",
});

export default async function WorkPage() {
  const projects = await getProjects();
  return (
    <>
      <WorldPose pose="work" />
      <PageHero
        eyebrow="Work"
        heading="Proof over promises."
        sub="Each case study follows the same arc: the problem, the thinking, the system we built, and what changed because of it."
      />
      <section aria-label="Case studies" className="pb-12">
        <Container>
          <ProjectGrid projects={projects} />
        </Container>
      </section>
      <CtaSection title="Your project could be the next case study." label="Start a project" />
    </>
  );
}
