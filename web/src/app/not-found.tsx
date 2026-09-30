import type { Metadata } from "next";
import Link from "next/link";
import { getServices } from "@/content";
import { ButtonLink, Container, Eyebrow } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default async function NotFound() {
  const services = await getServices();
  return (
    <section className="relative pt-32 pb-20 sm:pt-40">
      <div className="backdrop" aria-hidden="true" />
      <Container>
        <Eyebrow>Error 404</Eyebrow>
        <h1 className="mt-4 max-w-3xl text-display-xl font-semibold text-balance">We couldn&apos;t find that page</h1>
        <p className="mt-5 max-w-xl text-lead text-ink-muted">
          The link may be old, or the page may have moved. These pages are a good place to continue.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/">Go to the home page</ButtonLink>
          <ButtonLink href="/contact" variant="secondary" arrow={false}>
            Contact us
          </ButtonLink>
        </div>
        <nav aria-labelledby="nf-services" className="mt-14">
          <h2 id="nf-services" className="text-title font-semibold">
            Our services
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="block rounded-lg border hairline bg-surface p-4 hover:border-line-strong">
                  <span className="block font-medium">{s.name}</span>
                  <span className="block text-sm text-ink-muted">{s.menuDescription}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}
