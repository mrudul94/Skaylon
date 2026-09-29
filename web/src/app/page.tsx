import type { Metadata } from "next";
import { getHomePage, getProcessPage, getProjects, getServices, getSiteSettings } from "@/content";
import { Parallax } from "@/components/motion/Parallax";
import { RiseText } from "@/components/motion/RiseText";
import { ScrubText } from "@/components/motion/ScrubText";
import { Tilt } from "@/components/motion/Tilt";
import { CtaSection } from "@/components/sections/CtaSection";
import { ProcessTrack } from "@/components/sections/ProcessTrack";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { ServiceList } from "@/components/sections/ServiceList";
import { AccentLast, ButtonLink, Container, Eyebrow } from "@/components/ui/primitives";
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

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as React.CSSProperties;

/*
 * Each <section data-chapter> is an anchor the 3D camera journey maps onto
 * (src/world/journey.ts; order checked by verify-anchors). Sections are tall
 * enough to give the world room.
 */
export default async function HomePage() {
  const [home, services, projects, process, site] = await Promise.all([
    getHomePage(),
    getServices(),
    getProjects({ featured: true }),
    getProcessPage(),
    getSiteSettings(),
  ]);
  const { chapters } = home;

  // Facts only (all from the About page / site settings), no invented numbers.
  const facts = [
    { k: "Founder-led", v: `${site.founder} handles every project personally` },
    { k: "Fixed scope", v: "Price agreed before engineering starts" },
    { k: "MSME registered", v: "Udyam certified studio" },
  ];

  return (
    <>
      <WorldPose journey />

      {/* ------------------------------------------------ hero */}
      <section data-chapter="hero" className="relative flex min-h-svh flex-col justify-end pt-32 pb-8 sm:pb-10">
        <Container>
          <p
            className="fade-in inline-flex items-center gap-3 rounded-full border border-chalk/10 bg-ink-900/50 px-4 py-2 font-mono text-xs text-chalk-muted uppercase backdrop-blur-md"
            style={delay(0)}
          >
            <span className="pulse-dot" aria-hidden="true" />
            {home.hero.eyebrow}
          </p>
          <h1 className="mt-8 max-w-[12ch] text-display-xl font-medium">
            <RiseText text={home.hero.heading} accentWords={1} />
          </h1>
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,34rem)_1fr] lg:items-end">
            <div className="fade-in" style={delay(650)}>
              <p className="text-lead text-chalk-muted">{home.hero.sub}</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/contact" data-track="cta_click" data-track-label="hero">
                  Start a project
                </ButtonLink>
                <ButtonLink href="/services" variant="ghost">
                  Explore services
                </ButtonLink>
              </div>
            </div>
          </div>

          <div
            className="fade-in mt-16 grid grid-cols-1 gap-6 border-t border-chalk/[0.09] pt-6 sm:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_auto]"
            style={delay(950)}
          >
            {facts.map((f) => (
              <div key={f.k}>
                <p className="text-sm font-medium">{f.k}</p>
                <p className="mt-1 text-sm text-chalk-muted">{f.v}</p>
              </div>
            ))}
            <div aria-hidden="true" className="hidden items-center gap-4 lg:flex">
              <span className="font-mono text-[0.68rem] text-chalk-muted uppercase">Scroll</span>
              <span className="scroll-cue" />
            </div>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------ marquee */}
      <div aria-hidden="true" className="relative border-y border-chalk/[0.07] bg-ink-950/40 py-7 backdrop-blur-sm">
        <div className="marquee">
          {[0, 1].map((copy) => (
            <div key={copy} className="marquee-track">
              {services.map((s) => (
                <span key={s.slug} className="flex shrink-0 items-center text-3xl font-medium tracking-[-0.03em] sm:text-5xl">
                  <span className="px-8 transition-colors duration-500 hover:text-accent sm:px-12">{s.name}</span>
                  <svg viewBox="0 0 24 24" width="22" height="22" className="shrink-0 text-accent">
                    <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" fill="currentColor" />
                  </svg>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------ 01 understanding */}
      <section
        data-chapter="understanding"
        aria-labelledby="ch-understanding"
        className="relative flex min-h-[110vh] items-center py-32 sm:py-48"
      >
        <Parallax speed={25} className="pointer-events-none absolute top-24 right-4 hidden lg:block">
          <span aria-hidden="true" data-numeral="01" className="numeral text-[16rem] leading-none font-semibold tracking-[-0.08em] text-chalk/[0.035]" />
        </Parallax>
        <Container>
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>{chapters.understanding.eyebrow}</Eyebrow>
              <h2 id="ch-understanding" className="mt-6 text-display font-medium text-balance">
                <AccentLast text={chapters.understanding.heading} />
              </h2>
            </Reveal>
            <div className="mt-14 space-y-10">
              {chapters.understanding.body.map((p) => (
                <ScrubText key={p} text={p} className="text-title font-normal text-chalk" />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------ 02 capabilities */}
      <section
        data-chapter="capabilities"
        aria-labelledby="ch-capabilities"
        className="relative flex min-h-[115vh] flex-col justify-center py-32 sm:py-48"
      >
        <Container>
          <Reveal className="max-w-3xl">
            <div>
              <Eyebrow>{chapters.capabilities.eyebrow}</Eyebrow>
              <h2 id="ch-capabilities" className="mt-6 text-display font-medium text-balance">
                <AccentLast text={chapters.capabilities.heading} />
              </h2>
            </div>
            <div className="mt-7 space-y-4 text-lead text-chalk-muted">
              {chapters.capabilities.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
          <div className="mt-16 sm:mt-20 lg:max-w-[66%]">
            <ServiceList services={services} />
          </div>
          <Reveal as="ul" stagger className="mt-16 grid gap-5 md:grid-cols-3 lg:max-w-[66%]">
            {home.outcomes.map((o, i) => (
              <Tilt key={o} as="li" className="glass rounded-3xl p-8">
                <span className="font-mono text-xs text-cyan">{`0${i + 1}`}</span>
                <p className="mt-8 text-lg leading-snug">{o}</p>
              </Tilt>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* ------------------------------------------------ 03 proof */}
      <section
        data-chapter="proof"
        aria-labelledby="ch-proof"
        className="relative flex min-h-[115vh] flex-col justify-center py-32 sm:py-48"
      >
        <Container>
          <Reveal className="max-w-3xl">
            <Eyebrow>{chapters.proof.eyebrow}</Eyebrow>
            <h2 id="ch-proof" className="mt-6 text-display font-medium text-balance">
              <AccentLast text={chapters.proof.heading} />
            </h2>
            <div className="mt-7 space-y-4 text-lead text-chalk-muted">
              {chapters.proof.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
          <div className="mt-16 lg:max-w-[60%]">
            <ProjectGrid projects={projects} />
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------ 04 process */}
      <section
        data-chapter="process"
        aria-labelledby="ch-process"
        className="relative flex min-h-[115vh] flex-col justify-center overflow-x-clip py-32 sm:py-48"
      >
        <Container>
          <Reveal className="max-w-3xl">
            <div>
              <Eyebrow>{chapters.process.eyebrow}</Eyebrow>
              <h2 id="ch-process" className="mt-6 text-display font-medium text-balance">
                <AccentLast text={chapters.process.heading} />
              </h2>
            </div>
            <div className="mt-7 space-y-4 text-lead text-chalk-muted">
              {chapters.process.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
          <div className="mt-16">
            <ProcessTrack phases={process.phases} />
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------ 05 commitment */}
      <CtaSection
        chapter="commitment"
        eyebrow={chapters.commitment.eyebrow}
        title={chapters.commitment.heading}
        body={chapters.commitment.body.join(" ")}
        label={home.cta.label}
        href={home.cta.href}
      />
    </>
  );
}
