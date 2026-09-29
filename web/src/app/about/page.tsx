import { getAboutPage, getSiteSettings } from "@/content";
import { Tilt } from "@/components/motion/Tilt";
import { ScrubText } from "@/components/motion/ScrubText";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Eyebrow } from "@/components/ui/primitives";
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
          <div>
            <Eyebrow>Story</Eyebrow>
            <h2 id="story-heading" className="mt-6 text-title font-medium">
              Why we exist
            </h2>
          </div>
          <div className="space-y-8">
            {about.story.map((p) => (
              <ScrubText key={p} text={p} className="text-lead text-chalk sm:text-[1.5rem] sm:leading-snug" />
            ))}
          </div>
        </Container>
      </section>

      <section aria-label="Founder's principle" className="py-20 sm:py-32">
        <Container>
          <Reveal as="figure" className="glass relative overflow-hidden rounded-[2rem] px-6 py-14 sm:px-16 sm:py-20">
            <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
            <blockquote className="relative max-w-4xl text-display text-balance">
              <p className="serif-accent">
                <span className="text-gradient">“</span>
                {about.quote}
                <span className="text-gradient">”</span>
              </p>
            </blockquote>
            <figcaption className="relative mt-10 flex items-center gap-4 text-chalk-muted">
              <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-accent to-cyan font-medium text-ink-950">
                {site.founder.charAt(0)}
              </span>
              <span>
                <span className="block text-chalk">{site.founder}</span>
                <span className="font-mono text-xs uppercase">Founder</span>
              </span>
            </figcaption>
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="principles-heading" className="py-20 sm:py-28">
        <Container>
          <Eyebrow>Principles</Eyebrow>
          <h2 id="principles-heading" className="mt-6 text-display font-medium">
            How we work
          </h2>
          <Reveal as="ul" stagger className="mt-14 grid gap-5 md:grid-cols-2">
            {about.principles.map((p, i) => (
              <Tilt key={p.title} as="li" className="glass rounded-3xl p-8 sm:p-10">
                <span className="font-mono text-xs text-cyan">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-8 text-title font-medium">{p.title}</h3>
                <p className="mt-4 max-w-lg text-chalk-muted">{p.description}</p>
              </Tilt>
            ))}
          </Reveal>
          <p className="mt-14 inline-flex flex-wrap items-center gap-3 rounded-full border border-chalk/10 px-5 py-2.5 text-sm text-chalk-muted">
            <span className="pulse-dot" aria-hidden="true" />
            {site.credential.label}: <span className="font-mono text-chalk tabular-nums">{site.credential.value}</span>
          </p>
        </Container>
      </section>

      <CtaSection title="Work directly with the people building it." label="Start a conversation" />
    </>
  );
}
