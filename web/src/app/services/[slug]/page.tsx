import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, getServices } from "@/content";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqList } from "@/components/sections/FaqList";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceIcon } from "@/components/sections/ServiceIcon";
import { ServiceVisual } from "@/components/visuals/ServiceVisual";
import { JsonLd } from "@/components/seo/JsonLd";
import { Arrow, ButtonLink, CardGrid, Check, Container, SectionHeading, StepList, Summary } from "@/components/ui/primitives";
import { breadcrumbs, faqPage, serviceSchema, webPage } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { Reveal } from "@/scroll/Reveal";

type Props = { params: Promise<{ slug: string }> };

// Slugs published in Sanity after a deploy render on demand (then cache);
// unknown slugs still 404 via notFound().
export const dynamicParams = true;

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getService((await params).slug);
  if (!service) return {};
  return pageMetadata({
    title: service.seo.title ?? service.name,
    description: service.seo.description ?? service.summary,
    path: `/services/${service.slug}`,
    noindex: service.seo.noindex,
  });
}

export default async function ServicePage({ params }: Props) {
  const [service, all] = await Promise.all([getService((await params).slug), getServices()]);
  if (!service) notFound();
  const path = `/services/${service.slug}`;
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: service.name, href: path },
  ];
  const related = service.related
    .map((slug) => all.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s) && s!.slug !== service.slug);
  const contactHref = `/contact?service=${service.slug}`;

  return (
    <article>
      <JsonLd
        data={[
          webPage({ path, name: `${service.seo.title ?? service.name} | Skaylon`, description: service.seo.description ?? service.summary }),
          breadcrumbs(crumbs),
          serviceSchema(service),
          faqPage(service.faqs),
        ]}
      />
      <PageHero eyebrow={service.name} heading={service.headline} sub={service.summary} crumbs={crumbs} visual={<ServiceVisual slug={service.slug} />}>
        <div data-hero-cta className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={contactHref} data-track="cta_click" data-track-label={`hero-${service.slug}`}>
            {service.cta.label}
          </ButtonLink>
          <ButtonLink href="#faq-heading" variant="secondary" arrow={false}>
            Read common questions
          </ButtonLink>
        </div>
      </PageHero>

      <Container className="pt-4">
        <Summary label={`${service.name} in short`}>{service.overview}</Summary>
      </Container>

      <section aria-labelledby="build-heading" className="py-16 sm:py-20">
        <Container>
          <SectionHeading id="build-heading" eyebrow="Capabilities" heading={`What can Skaylon build?`} />
          <Reveal stagger className="mt-10">
            <CardGrid items={service.capabilities} />
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="fit-heading" className="border-y hairline bg-paper-2 py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading id="fit-heading" eyebrow="Use cases" heading="Who is this service for?">
            <p>Typical situations where businesses bring us in for {service.name.toLowerCase()}.</p>
          </SectionHeading>
          <Reveal as="ul" stagger className="space-y-4">
            {service.useCases.map((u) => (
              <li key={u.title} className="flex gap-3 rounded-xl border hairline bg-surface p-5">
                <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-wash text-accent-ink">
                  <Check />
                </span>
                <div>
                  <h3 className="font-semibold">{u.title}</h3>
                  <p className="mt-1 leading-relaxed text-ink-muted">{u.description}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="benefits-heading" className="py-16 sm:py-20">
        <Container>
          <SectionHeading id="benefits-heading" eyebrow="Approach" heading="What you can expect" />
          <Reveal stagger className="mt-10">
            <CardGrid items={service.benefits} />
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="process-heading" className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading id="process-heading" eyebrow="Process" heading="How does the engagement work?">
              <p>
                Every project starts with discovery and a written, fixed-scope proposal. You see progress on a staging
                environment throughout.
              </p>
            </SectionHeading>
            <Link href="/process" className="inline-flex shrink-0 items-center gap-2 font-medium text-accent-ink underline">
              How we work <Arrow />
            </Link>
          </div>
          <Reveal stagger className="mt-10">
            <StepList steps={service.process} />
          </Reveal>
        </Container>
      </section>

      {service.localContent && (
        <section aria-labelledby="local-heading" className="pb-4">
          <Container>
            <div className="max-w-prose rounded-xl border hairline bg-surface p-6">
              <h2 id="local-heading" className="text-title font-semibold">
                {service.localContent.heading}
              </h2>
              <p className="mt-3 leading-relaxed text-ink-muted">{service.localContent.text}</p>
            </div>
          </Container>
        </section>
      )}

      <FaqList faqs={service.faqs} heading={`${service.name}: common questions`} />

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="py-12">
          <Container>
            <h2 id="related-heading" className="text-title font-semibold">
              Related services
            </h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug} className="service-card card-link relative rounded-xl border hairline bg-surface p-5">
                  <ServiceIcon slug={r.slug} />
                  <h3 className="mt-4 font-semibold">
                    <Link href={`/services/${r.slug}`} className="after:absolute after:inset-0 after:rounded-xl">
                      {r.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{r.menuDescription}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <CtaSection title={service.cta.title} label={service.cta.label} href={contactHref} secondary={{ label: "See all services", href: "/services" }} />
    </article>
  );
}
