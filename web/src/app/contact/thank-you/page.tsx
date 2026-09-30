import Link from "next/link";
import { getServices, getSiteSettings } from "@/content";
import { ButtonLink, Check, Container, Eyebrow } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Thank you",
  description: "Your enquiry has reached Skaylon. Here is what happens next.",
  path: "/contact/thank-you",
  noindex: true,
});

export default async function ThankYouPage() {
  const [site, services] = await Promise.all([getSiteSettings(), getServices()]);
  return (
    <section className="relative pt-32 pb-20 sm:pt-40">
      <div className="backdrop" aria-hidden="true" />
      <Container>
        <div className="max-w-3xl">
        <Eyebrow>Enquiry received</Eyebrow>
        <h1 className="mt-4 text-display-xl font-semibold text-balance">Thank you. Your enquiry has been sent.</h1>
        <p className="mt-5 text-lead text-ink-muted">
          We reply to every enquiry within one to two working days. If it&apos;s urgent, email{" "}
          <a href={`mailto:${site.email}`} className="font-medium text-ink underline" data-track="email_click" data-track-label="thank-you">
            {site.email}
          </a>{" "}
          or call{" "}
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="font-medium text-ink underline" data-track="phone_click" data-track-label="thank-you">
            {site.phone}
          </a>
          .
        </p>

        <h2 className="mt-12 text-title font-semibold">What happens next</h2>
        <ol className="mt-4 space-y-3">
          {[
            "We review your enquiry and reply by email.",
            "If it looks like a good fit, we arrange a short call.",
            "After a discovery phase you receive a fixed-scope proposal.",
          ].map((step) => (
            <li key={step} className="flex gap-3 text-ink-2">
              <Check className="mt-1 shrink-0 text-success" />
              {step}
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/process">Read how we work</ButtonLink>
          <ButtonLink href="/" variant="secondary" arrow={false}>
            Back to the home page
          </ButtonLink>
        </div>

        <nav aria-labelledby="ty-services" className="mt-14">
          <h2 id="ty-services" className="text-title font-semibold">
            Explore our services
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="block rounded-lg border hairline bg-surface px-3 py-2 text-sm hover:border-line-strong">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        </div>
      </Container>
    </section>
  );
}
