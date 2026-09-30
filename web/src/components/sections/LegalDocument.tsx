import type { LegalPage } from "@/content/types";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/primitives";

export function LegalDocument({ page }: { page: LegalPage }) {
  const updated = new Date(page.lastUpdated).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });
  return (
    <>
      <PageHero
        eyebrow="Legal"
        heading={page.title}
        sub={page.intro}
        crumbs={[
          { label: "Home", href: "/" },
          { label: page.title, href: `/${page.slug}` },
        ]}
      >
        <p className="mt-5 text-sm text-ink-muted">
          Last updated <time dateTime={page.lastUpdated}>{updated}</time>
        </p>
      </PageHero>
      <Container className="pb-20">
        <div className="max-w-prose space-y-10">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-title font-semibold">{section.heading}</h2>
              <div className="mt-3 space-y-4 leading-relaxed text-ink-2">
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
