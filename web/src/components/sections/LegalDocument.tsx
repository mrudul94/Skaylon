import type { LegalPage } from "@/content/types";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/primitives";
import { WorldPose } from "@/world/WorldPose";

export function LegalDocument({ page }: { page: LegalPage }) {
  const updated = new Date(page.lastUpdated).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });
  return (
    <>
      <WorldPose pose="legal" />
      <PageHero eyebrow="Legal" heading={page.title} sub={page.intro}>
        <p className="mt-6 text-sm text-bone-muted">
          Last updated <time dateTime={page.lastUpdated}>{updated}</time>
        </p>
      </PageHero>
      <Container className="pb-28">
        <div className="max-w-3xl space-y-14">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-title font-light">{section.heading}</h2>
              <div className="mt-5 space-y-4 leading-relaxed text-bone-muted">
                {section.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
