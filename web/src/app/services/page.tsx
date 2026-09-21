import { getServices } from "@/content";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceList } from "@/components/sections/ServiceList";
import { Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";
import { WorldPose } from "@/world/WorldPose";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "Website development, web applications, mobile apps, custom software and UI/UX design, engineered by Skaylon in Kasaragod, Kerala.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <WorldPose pose="services" />
      <PageHero
        eyebrow="Services"
        heading="Five disciplines. One standard of engineering."
        sub="Every engagement is scoped around a business outcome, then designed and built by the same accountable team."
      />
      <section aria-label="All services" className="pb-12">
        <Container>
          <ServiceList services={services} headingLevel="h2" />
        </Container>
      </section>
      <CtaSection title="Not sure which one you need?" label="Talk it through with us" />
    </>
  );
}
