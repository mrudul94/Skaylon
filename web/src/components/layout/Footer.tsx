import Link from "next/link";
import { getServices, getSiteSettings } from "@/content";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/primitives";
import { legalNav, primaryNav } from "@/lib/nav";

export async function Footer() {
  const [site, services] = await Promise.all([getSiteSettings(), getServices()]);
  const year = new Date().getFullYear();

  return (
    <footer className="hairline border-t pt-20 pb-10">
      <Container>
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-sm text-bone-muted">{site.description}</p>
          </div>

          <nav aria-label="Services">
            <h2 className="text-eyebrow text-bone-muted uppercase">Services</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="hover:text-ember">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Studio">
            <h2 className="text-eyebrow text-bone-muted uppercase">Studio</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {[...primaryNav, { label: "Contact", href: "/contact" }].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-ember">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-eyebrow text-bone-muted uppercase">Contact</h2>
            <address className="mt-5 space-y-3 text-sm not-italic">
              <p>
                <a href={`mailto:${site.email}`} className="hover:text-ember">
                  {site.email}
                </a>
              </p>
              <p>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-ember">
                  {site.phone}
                </a>
              </p>
              <p>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  data-track="whatsapp_click"
                  data-track-label="footer"
                  className="hover:text-ember"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  WhatsApp<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>
              <p className="text-bone-muted">
                {site.address.locality}, {site.address.region}, {site.address.country}
              </p>
            </address>
          </div>
        </div>

        <div className="hairline mt-20 flex flex-col gap-6 border-t pt-8 text-xs text-bone-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legalName}. {site.credential.label}: {site.credential.value}
          </p>
          <ul className="flex gap-6">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-bone">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
