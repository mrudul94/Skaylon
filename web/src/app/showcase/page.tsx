import { getShowcase } from "@/content";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { ShowcaseGallery } from "@/components/sections/ShowcaseGallery";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/primitives";
import { webPage } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

const DESCRIPTION =
  "Live demo sites and design concepts built by Skaylon: landing pages, business websites, stores and web apps you can open and try.";

export const metadata = pageMetadata({ title: "Showcase: Demo Sites and Concepts", description: DESCRIPTION, path: "/showcase" });

export default async function ShowcasePage() {
  const items = await getShowcase();
  return (
    <>
      <JsonLd data={webPage({ path: "/showcase", name: "Showcase | Skaylon", description: DESCRIPTION, type: "CollectionPage" })} />
      <PageHero
        eyebrow="Showcase"
        heading="Demo sites and design concepts"
        sub="Sites we designed and built to explore layouts, interactions and ideas. They are demos, not client projects: open any of them to try it live."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Showcase", href: "/showcase" },
        ]}
      />
      <section aria-label="Demo sites" className="pb-8">
        <Container>
          <ShowcaseGallery items={items} />
        </Container>
      </section>
      <CtaSection title="Like what you see? Let's build yours." label="Start a project" />
    </>
  );
}
