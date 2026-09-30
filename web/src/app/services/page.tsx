import { getServices } from "@/content";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqList } from "@/components/sections/FaqList";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceList } from "@/components/sections/ServiceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container, Summary } from "@/components/ui/primitives";
import { faqPage, serviceList, webPage } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

const DESCRIPTION =
  "Skaylon's services: website development, web applications, mobile apps, custom software, UI/UX design, and backend and API systems for businesses.";

export const metadata = pageMetadata({ title: "Software Development Services", description: DESCRIPTION, path: "/services" });

const faqs = [
  {
    question: "I'm not sure which service I need. What should I do?",
    answer:
      "Describe the problem you want to solve in the enquiry form. We will recommend the right mix, which is often a combination, such as UI/UX design with a web application and its backend.",
  },
  {
    question: "Can one project include several services?",
    answer:
      "Yes. Many projects combine design, a front end (website, web or mobile app) and a backend. They are planned and delivered as one project with one proposal.",
  },
  {
    question: "Do you take over or improve existing software?",
    answer:
      "Yes. We start by reviewing the current code, design or infrastructure, then recommend whether to improve it step by step or rebuild specific parts.",
  },
];

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <JsonLd
        data={[
          webPage({ path: "/services", name: "Software Development Services | Skaylon", description: DESCRIPTION, type: "CollectionPage" }),
          serviceList(services),
          faqPage(faqs),
        ]}
      />
      <PageHero
        eyebrow="Services"
        heading="Software development services for growing businesses"
        sub="From the website your customers see to the systems your team relies on, Skaylon designs and builds each part, or the whole product."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
        ]}
      />
      <Container>
        <Summary>
          Skaylon offers {services.length} services: {services.map((s) => s.name).join(", ")}. Each project starts with a short
          discovery phase and a fixed-scope proposal, and you own the code and designs at the end.
        </Summary>
      </Container>
      <section aria-label="All services" className="py-12 sm:py-16">
        <Container>
          <ServiceList services={services} headingLevel="h2" />
        </Container>
      </section>
      <FaqList faqs={faqs} heading="Choosing the right service" />
      <CtaSection title="Not sure which service you need?" label="Talk it through with us" />
    </>
  );
}
