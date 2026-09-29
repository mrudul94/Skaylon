import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService, getServices } from "@/content";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqList } from "@/components/sections/FaqList";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbs, faqPage, serviceSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { Reveal } from "@/scroll/Reveal";
import { Tilt } from "@/components/motion/Tilt";
import { WorldPose } from "@/world/WorldPose";

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
  const service = await getService((await params).slug);
  if (!service) notFound();
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: service.name, href: `/services/${service.slug}` },
  ];

  return (
    <article data-wedge={service.wedgeIndex}>
      <JsonLd data={[breadcrumbs(crumbs), serviceSchema(service), faqPage(service.faqs)]} />
      <WorldPose focusWedge={service.wedgeIndex} />
      <PageHero eyebrow={service.name} heading={service.headline} sub={service.overview} crumbs={crumbs} />

      <section aria-labelledby="benefits-heading" className="py-20 sm:py-28">
        <Container>
          <Eyebrow>Benefits</Eyebrow>
          <h2 id="benefits-heading" className="mt-6 text-display font-medium">
            What you get
          </h2>
          <Reveal as="ul" stagger className="mt-14 grid gap-5 md:grid-cols-3">
            {service.benefits.map((b) => (
              <Tilt key={b.title} as="li" className="glass rounded-3xl p-8">
                <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-cyan text-ink-950">
                  <svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
                </span>
                <h3 className="mt-8 text-lg font-medium">{b.title}</h3>
                <p className="mt-3 text-chalk-muted">{b.description}</p>
              </Tilt>
            ))}
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="process-heading" className="py-20 sm:py-28">
        <Container>
          <Eyebrow>Delivery</Eyebrow>
          <h2 id="process-heading" className="mt-6 text-display font-medium">
            How we deliver it
          </h2>
          <Reveal as="ol" stagger className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {service.process.map((step, i) => (
              <Tilt key={step.title} as="li" className="glass rounded-3xl p-8">
                <span className="text-gradient text-5xl font-semibold tracking-[-0.06em] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-8 text-lg font-medium">{step.title}</h3>
                <p className="mt-3 text-chalk-muted">{step.description}</p>
              </Tilt>
            ))}
          </Reveal>
        </Container>
      </section>

      {service.localContent && (
        <section aria-labelledby="local-heading" className="py-20 sm:py-28">
          <Container>
            <Reveal className="max-w-3xl">
              <Eyebrow>Local & national</Eyebrow>
              <h2 id="local-heading" className="mt-6 text-title font-medium">
                {service.localContent.heading}
              </h2>
              <p className="mt-6 text-lead text-chalk-muted">{service.localContent.text}</p>
            </Reveal>
          </Container>
        </section>
      )}

      <FaqList faqs={service.faqs} />
      <CtaSection title={service.cta.title} label={service.cta.label} />
    </article>
  );
}
