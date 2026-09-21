import { getAboutPage, getSiteSettings } from "@/content";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";
import { Reveal } from "@/scroll/Reveal";
import { WorldPose } from "@/world/WorldPose";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Skaylon is a founder-led software studio in Kasaragod, Kerala, and a registered MSME, building accountable software for businesses across India.",
  path: "/about",
});

export default async function AboutPage() {
  const [about, site] = await Promise.all([getAboutPage(), getSiteSettings()]);
  return (
    <>
      <WorldPose pose="about" />
      <PageHero eyebrow="About Skaylon" heading={about.intro.heading} sub={about.intro.sub} />

      <section aria-labelledby="story-heading" className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <h2 id="story-heading" className="text-title font-light">
            Why we exist
          </h2>
          <Reveal className="space-y-6 text-lead text-bone-muted">
            {about.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
        </Container>
      </section>

      <section aria-label="Founder's principle" className="py-20 sm:py-28">
        <Container>
          <Reveal as="figure" className="max-w-4xl">
            <blockquote className="font-serif text-display text-balance">
              <p>“{about.quote}”</p>
            </blockquote>
            <figcaption className="mt-8 text-bone-muted">
              {site.founder}, Founder
            </figcaption>
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="principles-heading" className="py-20 sm:py-28">
        <Container>
          <h2 id="principles-heading" className="text-title font-light">
            How we work
          </h2>
          <Reveal as="ul" stagger className="mt-12 grid gap-10 md:grid-cols-2">
            {about.principles.map((p) => (
              <li key={p.title} className="hairline border-t pt-8">
                <h3 className="text-lg">{p.title}</h3>
                <p className="mt-3 max-w-lg text-bone-muted">{p.description}</p>
              </li>
            ))}
          </Reveal>
          <p className="mt-16 text-sm text-bone-muted">
            {site.credential.label}: <span className="text-bone tabular-nums">{site.credential.value}</span>
          </p>
        </Container>
      </section>

      <CtaSection title="Work directly with the people building it." label="Start a conversation" />
    </>
  );
}
