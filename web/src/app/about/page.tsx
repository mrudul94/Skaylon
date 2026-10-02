import { getAboutPage, getSiteSettings } from "@/content";
import { FounderBanner } from "@/components/sections/FounderBanner";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { CardGrid, Container, SectionHeading } from "@/components/ui/primitives";
import { webPage } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { Reveal } from "@/scroll/Reveal";

const DESCRIPTION =
  "About Skaylon Technology: a founder-led software studio and registered MSME in Kasaragod, Kerala, building websites, apps and custom software.";

export const metadata = pageMetadata({ title: "About Skaylon", description: DESCRIPTION, path: "/about" });

export default async function AboutPage() {
  const [about, site] = await Promise.all([getAboutPage(), getSiteSettings()]);
  return (
    <>
      <JsonLd data={webPage({ path: "/about", name: "About Skaylon | Skaylon", description: DESCRIPTION, type: "AboutPage" })} />
      <PageHero
        eyebrow="About Skaylon"
        heading={about.intro.heading}
        sub={about.intro.sub}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
        ]}
      />

      <section aria-labelledby="story-heading" className="py-12 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading id="story-heading" eyebrow="Our story" heading="Why Skaylon exists" />
          <div className="max-w-prose space-y-5 text-lead text-ink-2">
            {about.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Container>
      </section>

      {about.quote && (
        <section aria-label="Founder's principle" className="py-10">
          <Container>
            <FounderBanner site={site} quote={about.quote} />
          </Container>
        </section>
      )}

      <section aria-labelledby="principles-heading" className="py-12 sm:py-16">
        <Container>
          <SectionHeading id="principles-heading" eyebrow="Principles" heading="How we work" />
          <Reveal stagger className="mt-10">
            <CardGrid items={about.principles} columns={2} />
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="facts-heading" className="py-12 sm:py-16">
        <Container>
          <h2 id="facts-heading" className="text-title font-semibold">
            Company details
          </h2>
          <dl className="mt-6 grid gap-x-8 gap-y-5 rounded-xl border hairline bg-surface p-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-sm text-ink-muted">Legal name</dt>
              <dd className="mt-1 font-medium">{site.legalName}</dd>
            </div>
            <div>
              <dt className="text-sm text-ink-muted">Location</dt>
              <dd className="mt-1 font-medium">
                {site.address.locality}, {site.address.region}, {site.address.country}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-ink-muted">{site.credential.label}</dt>
              <dd className="mt-1 font-mono font-medium tabular-nums">{site.credential.value}</dd>
            </div>
            <div>
              <dt className="text-sm text-ink-muted">Contact</dt>
              <dd className="mt-1 font-medium">
                <a href={`mailto:${site.email}`} className="underline hover:text-accent-ink" data-track="email_click" data-track-label="about">
                  {site.email}
                </a>
              </dd>
            </div>
          </dl>
        </Container>
      </section>

      <CtaSection title="Work directly with the person building it." label="Start a conversation" />
    </>
  );
}
