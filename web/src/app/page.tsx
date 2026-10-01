import type { Metadata } from "next";
import { getHomePage, getProcessPage, getProjects, getServices, getSiteSettings } from "@/content";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqList } from "@/components/sections/FaqList";
import { FounderCard } from "@/components/sections/FounderCard";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { ServiceList } from "@/components/sections/ServiceList";
import { TechStrip } from "@/components/sections/TechStrip";
import { ProductStack } from "@/components/visuals/ProductStack";
import { JsonLd } from "@/components/seo/JsonLd";
import { AccentPhrase, ButtonLink, CardGrid, Check, Container, SectionHeading, Summary } from "@/components/ui/primitives";
import { faqPage, webPage } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { Tilt } from "@/components/visuals/Tilt";
import { Reveal } from "@/scroll/Reveal";

const TITLE = "Skaylon | Websites, Web Apps, Mobile Apps & Custom Software";
const DESCRIPTION =
  "Skaylon designs and builds business websites, web applications, iOS and Android apps, custom software and APIs. Founder-led studio in Kerala, India. Fixed-scope proposals.";

export const metadata: Metadata = pageMetadata({ absoluteTitle: TITLE, description: DESCRIPTION, path: "/" });

export default async function HomePage() {
  const [home, services, projects, process, site] = await Promise.all([
    getHomePage(),
    getServices(),
    getProjects({ featured: true }),
    getProcessPage(),
    getSiteSettings(),
  ]);

  return (
    <>
      <JsonLd data={[webPage({ path: "/", name: TITLE, description: DESCRIPTION }), faqPage(home.faqs)]} />

      {/* ------------------------------------------------ hero */}
      <section aria-labelledby="hero-heading" className="relative overflow-hidden pt-28 pb-14 sm:pt-36 sm:pb-20">
        <div className="backdrop" aria-hidden="true" />
        <Container className="grid items-center gap-12 lg:grid-cols-[1.55fr_1fr] xl:gap-12">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border hairline bg-surface px-3 py-1.5 text-sm text-ink-2">
              <span aria-hidden="true" className="ps-pulse relative h-2 w-2 rounded-full bg-accent" />
              {home.hero.eyebrow}
            </p>
            {/* The LCP element: painted final on first frame, never animated. */}
            <h1 id="hero-heading" className="mt-6 text-[clamp(2.5rem,1.5rem+3.3vw,4.35rem)] leading-[1.03] font-semibold tracking-[-0.04em] text-balance">
              <AccentPhrase text={home.hero.heading} phrases={["custom software", "growing businesses"]} />
            </h1>
            <p className="hero-in mt-6 max-w-xl text-lead text-ink-muted" style={{ "--d": "80ms" } as React.CSSProperties}>
              {home.hero.sub}
            </p>
            <div data-hero-cta className="hero-in mt-8 flex flex-col gap-3 sm:flex-row" style={{ "--d": "160ms" } as React.CSSProperties}>
              <ButtonLink href="/contact" data-track="cta_click" data-track-label="hero">
                Start a project
              </ButtonLink>
              <ButtonLink href="/services" variant="secondary" arrow={false}>
                Explore services
              </ButtonLink>
            </div>
            <ul className="hero-in mt-8 flex flex-wrap gap-2 text-sm text-ink-2" style={{ "--d": "240ms" } as React.CSSProperties}>
              {["Founder-led projects", "Fixed-scope proposals", "You own the code"].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5 rounded-full border hairline bg-surface/80 px-3 py-1.5 shadow-[0_1px_2px_rgb(20_22_26/0.04)]">
                  <Check className="text-success" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Decorative: what we build, as stylised UI. Desktop and tablet only. */}
          <div className="hero-in hidden md:block" style={{ "--d": "200ms" } as React.CSSProperties}>
            <Tilt>
              <ProductStack />
            </Tilt>
          </div>
        </Container>
      </section>

      <TechStrip />

      {/* ------------------------------------------------ summary (AEO) */}
      <Container className="pt-16 sm:pt-20">
        <Summary label="Skaylon in short">{home.summary}</Summary>
      </Container>

      {/* ------------------------------------------------ services */}
      <section aria-labelledby="services-heading" className="py-16 sm:py-24">
        <Container>
          <SectionHeading id="services-heading" eyebrow="Services" heading="What can Skaylon build for your business?">
            <p>Six services that cover a digital product from first design to the systems behind it. Each has its own page with use cases, process and answers to common questions.</p>
          </SectionHeading>
          <div className="mt-10">
            <ServiceList services={services} />
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------ who we help */}
      <section aria-labelledby="audience-heading" className="border-y hairline bg-paper-2 py-16 sm:py-24">
        <Container>
          <SectionHeading id="audience-heading" eyebrow="Who we help" heading="Who is Skaylon a good fit for?">
            <p>We work best with organisations that want a dependable partner and a clear plan rather than the cheapest quote.</p>
          </SectionHeading>
          <Reveal stagger className="mt-10">
            <CardGrid items={home.audiences} />
          </Reveal>
        </Container>
      </section>

      {/* ------------------------------------------------ how it works */}
      <section aria-labelledby="process-heading" className="dark-band relative overflow-hidden bg-ink py-16 text-paper sm:py-24">
        <div aria-hidden="true" className="cta-glow pointer-events-none absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <Container className="relative">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="flex items-center gap-2.5 font-mono text-eyebrow font-medium text-accent uppercase">
                <span aria-hidden="true" className="h-px w-5 bg-accent" />
                How it works
              </p>
              <h2 id="process-heading" className="mt-4 text-display font-semibold text-balance">
                How does a project with Skaylon work?
              </h2>
              <p className="mt-5 text-lead text-paper/75">{process.intro.sub}</p>
            </div>
            <ButtonLink href="/process" variant="secondary" className="shrink-0 border-paper/30 bg-transparent text-paper hover:border-paper">
              See the full process
            </ButtonLink>
          </div>
          <div className="mt-12">
            <ProcessTimeline phases={process.phases} />
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------ engagement */}
      <section aria-labelledby="engagement-heading" className="py-16 sm:py-20">
        <Container>
          <SectionHeading id="engagement-heading" eyebrow="Engagement" heading="Ways to work together">
            <p>Every engagement starts with a short discovery phase. After that, pick the model that fits the project.</p>
          </SectionHeading>
          <Reveal stagger className="mt-10">
            <CardGrid items={home.engagement} />
          </Reveal>
        </Container>
      </section>

      {/* ------------------------------------------------ why us */}
      <section aria-labelledby="why-heading" className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading id="why-heading" eyebrow="Why Skaylon" heading="Why businesses choose Skaylon">
            <p>
              No inflated claims: here is how we work. Want to talk it through? Call{" "}
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="font-medium text-ink underline" data-track="phone_click" data-track-label="why">
                {site.phone}
              </a>
              .
            </p>
            <FounderCard site={site} className="mt-8 rounded-xl border hairline bg-surface p-4" />
          </SectionHeading>
          <Reveal as="ul" stagger className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {home.whyUs.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span aria-hidden="true" className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-wash text-accent-ink">
                  <Check />
                </span>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 leading-relaxed text-ink-muted">{item.description}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* ------------------------------------------------ work (only when real case studies exist) */}
      {projects.length > 0 && (
        <section aria-labelledby="work-heading" className="py-16 sm:py-20">
          <Container>
            <SectionHeading id="work-heading" eyebrow="Work" heading="Selected projects" />
            <div className="mt-10">
              <ProjectGrid projects={projects} />
            </div>
          </Container>
        </section>
      )}

      <FaqList faqs={home.faqs} intro="Short, factual answers to what people ask before getting in touch." />

      <CtaSection title={home.cta.title} label={home.cta.label} href={home.cta.href} secondary={{ label: "Browse services", href: "/services" }} />
    </>
  );
}
