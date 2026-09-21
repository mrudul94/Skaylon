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
          <h2 id="benefits-heading" className="text-title font-light">
            What you get
          </h2>
          <Reveal as="ul" stagger className="mt-12 grid gap-10 md:grid-cols-3">
            {service.benefits.map((b) => (
              <li key={b.title} className="hairline border-t pt-8">
                <h3 className="text-lg">{b.title}</h3>
                <p className="mt-3 text-bone-muted">{b.description}</p>
              </li>
            ))}
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="process-heading" className="py-20 sm:py-28">
        <Container>
          <h2 id="process-heading" className="text-title font-light">
            How we deliver it
          </h2>
          <Reveal as="ol" stagger className="mt-12 grid gap-px overflow-hidden rounded-sm bg-bone/10 md:grid-cols-2 xl:grid-cols-4">
            {service.process.map((step, i) => (
              <li key={step.title} className="bg-graphite-950 p-8">
                <span className="font-serif text-4xl text-ember">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-lg">{step.title}</h3>
                <p className="mt-3 text-bone-muted">{step.description}</p>
              </li>
            ))}
          </Reveal>
        </Container>
      </section>

      {service.localContent && (
        <section aria-labelledby="local-heading" className="py-20 sm:py-28">
          <Container>
            <Reveal className="max-w-3xl">
              <Eyebrow>Local & national</Eyebrow>
              <h2 id="local-heading" className="mt-5 text-title font-light">
                {service.localContent.heading}
              </h2>
              <p className="mt-6 text-lead text-bone-muted">{service.localContent.text}</p>
            </Reveal>
          </Container>
        </section>
      )}

      <FaqList faqs={service.faqs} />
      <CtaSection title={service.cta.title} label={service.cta.label} />
    </article>
  );
}
