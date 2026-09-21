import type { Metadata } from "next";
import { getHomePage, getProcessPage, getProjects, getServices } from "@/content";
import { CtaSection } from "@/components/sections/CtaSection";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { ServiceList } from "@/components/sections/ServiceList";
import { ButtonLink, Container, Eyebrow, SectionHeading } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";
import { Reveal } from "@/scroll/Reveal";
import { WorldPose } from "@/world/WorldPose";

export const metadata: Metadata = {
  ...pageMetadata({
    description:
      "Skaylon is a software studio in Kasaragod, Kerala, designing and engineering high-performance websites, web apps, mobile apps and custom software for businesses across India.",
    path: "/",
  }),
  title: { absolute: "Skaylon — Digital flagships, engineered" },
};

/*
 * Each <section data-chapter> is an anchor the 3D camera journey maps onto
 * (src/world/journey.ts; order checked by verify-anchors). Sections are tall
 * enough to give the world room.
 */
export default async function HomePage() {
  const [home, services, projects, process] = await Promise.all([
    getHomePage(),
    getServices(),
    getProjects({ featured: true }),
    getProcessPage(),
  ]);
  const { chapters } = home;

  return (
    <>
      <WorldPose journey />
      <section data-chapter="hero" className="flex min-h-svh items-end pb-20 sm:pb-28">
        <Container>
          <Eyebrow>{home.hero.eyebrow}</Eyebrow>
          <h1 className="mt-6 max-w-4xl text-display-xl font-light text-balance">{home.hero.heading}</h1>
          <div className="mt-10 max-w-xl">
            <p className="text-lead text-bone-muted">{home.hero.sub}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href="/contact">Start a project</ButtonLink>
              <ButtonLink href="/services" variant="ghost">
                Explore services
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <section data-chapter="understanding" aria-labelledby="ch-understanding" className="min-h-[105vh] flex items-center py-32 sm:py-48">
        {/* Text holds the left of the frame; the world owns the right. */}
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>{chapters.understanding.eyebrow}</Eyebrow>
            <h2 id="ch-understanding" className="mt-5 text-display font-light text-balance">
              {chapters.understanding.heading}
            </h2>
            <div className="mt-8 space-y-6 text-lead text-bone-muted">
              {chapters.understanding.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <section data-chapter="capabilities" aria-labelledby="ch-capabilities" className="min-h-[115vh] flex flex-col justify-center py-32 sm:py-48">
        <Container>
          <Reveal>
            <SectionHeading id="ch-capabilities" eyebrow={chapters.capabilities.eyebrow} heading={chapters.capabilities.heading}>
              {chapters.capabilities.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </SectionHeading>
          </Reveal>
          <div className="mt-16 lg:max-w-[62%]">
            <ServiceList services={services} />
          </div>
          <Reveal as="ul" stagger className="mt-20 grid gap-8 md:grid-cols-3 lg:max-w-[62%]">
            {home.outcomes.map((o) => (
              <li key={o} className="hairline border-t pt-6 text-bone-muted">
                {o}
              </li>
            ))}
          </Reveal>
        </Container>
      </section>

      <section data-chapter="proof" aria-labelledby="ch-proof" className="min-h-[115vh] flex flex-col justify-center py-32 sm:py-48">
        <Container>
          <Reveal>
            <SectionHeading id="ch-proof" eyebrow={chapters.proof.eyebrow} heading={chapters.proof.heading}>
              {chapters.proof.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </SectionHeading>
          </Reveal>
          <div className="mt-16 lg:max-w-[62%]">
            <ProjectGrid projects={projects} />
          </div>
        </Container>
      </section>

      <section data-chapter="process" aria-labelledby="ch-process" className="min-h-[115vh] flex flex-col justify-center py-32 sm:py-48">
        <Container>
          <Reveal>
            <SectionHeading id="ch-process" eyebrow={chapters.process.eyebrow} heading={chapters.process.heading}>
              {chapters.process.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </SectionHeading>
          </Reveal>
          <div className="mt-16">
            <ProcessSteps phases={process.phases} />
          </div>
        </Container>
      </section>

      <CtaSection
        chapter="commitment"
        eyebrow={chapters.commitment.eyebrow}
        title={chapters.commitment.heading}
        label={home.cta.label}
        href={home.cta.href}
      />
    </>
  );
}
