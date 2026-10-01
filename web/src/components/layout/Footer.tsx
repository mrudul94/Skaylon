import Link from "next/link";
import { getServices, getSiteSettings } from "@/content";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/primitives";
import { companyNav, legalNav } from "@/lib/nav";
import { SocialLinks } from "./SocialLinks";
import { Year } from "./Year";

const linkClass = "text-ink-2 hover:text-ink hover:underline";

export async function Footer() {
  const [site, services] = await Promise.all([getSiteSettings(), getServices()]);

  return (
    <footer className="overflow-hidden border-t hairline bg-paper-2 pt-14">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" aria-label="Skaylon home" className="inline-block rounded-md">
              <Logo />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">{site.description}</p>
            <SocialLinks socials={site.socials} className="mt-5" />
          </div>

          <nav aria-label="Services">
            <h2 className="text-sm font-semibold">Services</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className={linkClass}>
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="text-sm font-semibold">Company</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {companyNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold">Contact</h2>
            <address className="mt-4 space-y-2.5 text-sm not-italic">
              <p>
                <a href={`mailto:${site.email}`} className={linkClass} data-track="email_click" data-track-label="footer">
                  {site.email}
                </a>
              </p>
              <p>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className={linkClass} data-track="phone_click" data-track-label="footer">
                  {site.phone}
                </a>
              </p>
              <p>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  className={linkClass}
                  data-track="whatsapp_click"
                  data-track-label="footer"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  WhatsApp<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>
              <p className="pt-1 text-ink-muted">
                {site.address.locality}, {site.address.region}, {site.address.country}
              </p>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t hairline pt-6 text-sm text-ink-muted md:flex-row md:items-center md:justify-between">
          <p>
            © <Year /> {site.legalName}. {site.credential.label}: {site.credential.value}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
          <div aria-hidden="true" className="footer-wordmark mt-12 select-none">
        <span data-t="Skaylon" className="gen-text" />
      </div>
    </footer>
  );
}
