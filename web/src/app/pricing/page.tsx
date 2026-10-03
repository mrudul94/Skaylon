import { getPricingPage } from "@/content";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqList } from "@/components/sections/FaqList";
import { PageHero } from "@/components/sections/PageHero";
import { PricingCards } from "@/components/sections/PricingCards";
import { Container, Eyebrow, Summary } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqPage, pricingCatalog, webPage } from "@/lib/jsonld";
import { formatInr } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

const DESCRIPTION =
  "Skaylon pricing: business websites from ₹7,999 and e-commerce stores from ₹15,999. Apps and custom software are priced on features, with a fixed quote.";

export const metadata = pageMetadata({ title: "Pricing and Packages", description: DESCRIPTION, path: "/pricing" });

export default async function PricingPage() {
  const pricing = await getPricingPage();
  const priced = pricing.packages.filter((p) => p.priceFrom != null);
  return (
    <>
      <JsonLd
        data={[
          webPage({ path: "/pricing", name: "Pricing and Packages | Skaylon", description: DESCRIPTION }),
          pricingCatalog(pricing.packages),
          faqPage(pricing.faqs),
        ]}
      />
      <PageHero
        eyebrow="Pricing"
        heading={pricing.intro.heading}
        sub={pricing.intro.sub}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Pricing", href: "/pricing" },
        ]}
      />
      {priced.length > 0 && (
        <Container>
          <Summary>
            {priced.map((p) => `${p.name} from ${formatInr(p.priceFrom!)}`).join("; ")}. Other projects are priced on their
            features. The final price is agreed in a written, fixed-price proposal before work starts.
          </Summary>
        </Container>
      )}

      <section aria-labelledby="packages-heading" className="py-12 sm:py-16">
        <Container>
          <h2 id="packages-heading" className="sr-only">
            Packages
          </h2>
          <PricingCards packages={pricing.packages} />
          {pricing.note && <p className="mt-8 text-sm text-ink-muted">{pricing.note}</p>}
        </Container>
      </section>

      {pricing.factors.length > 0 && (
        <section aria-labelledby="factors-heading" className="border-y hairline bg-paper-2 py-16 sm:py-20">
          <Container>
            <Eyebrow>Apps and custom software</Eyebrow>
            <h2 id="factors-heading" className="mt-4 max-w-2xl text-display font-semibold text-balance">
              What affects the price
            </h2>
            <p className="mt-4 max-w-2xl text-lead text-ink-muted">
              Software is priced on what it needs to do. These are the things that move the number most.
            </p>
            <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {pricing.factors.map((f, i) => (
                <li key={f.title} className="border-t hairline pt-5">
                  <span className="font-mono text-xs text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-ink-muted">{f.description}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <FaqList faqs={pricing.faqs} heading="Questions about pricing" />
      <CtaSection title="Tell us what you need. We'll send a fixed quote." label="Get a quote" />
    </>
  );
}
