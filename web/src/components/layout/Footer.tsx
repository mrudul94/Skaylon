import Link from "next/link";
import { getServices, getSiteSettings } from "@/content";
import { Logo } from "@/components/ui/Logo";
import { ArrowUpRight, Container } from "@/components/ui/primitives";
import { legalNav, primaryNav } from "@/lib/nav";

export async function Footer() {
  const [site, services] = await Promise.all([getSiteSettings(), getServices()]);
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-chalk/[0.08] bg-ink-950/70 pt-20 backdrop-blur-sm">
      <Container>
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-sm text-chalk-muted">{site.description}</p>
            <p className="mt-8 inline-flex items-center gap-3 rounded-full border border-chalk/10 px-4 py-2 font-mono text-xs text-chalk-muted uppercase">
              <span className="pulse-dot" aria-hidden="true" />
              Founder-led studio
            </p>
          </div>

          <nav aria-label="Services">
            <h2 className="font-mono text-eyebrow text-chalk-muted uppercase">Services</h2>
            <ul className="mt-6 space-y-3 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="link-draw pb-0.5 hover:text-chalk">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Studio">
            <h2 className="font-mono text-eyebrow text-chalk-muted uppercase">Studio</h2>
            <ul className="mt-6 space-y-3 text-sm">
              {[...primaryNav, { label: "Contact", href: "/contact" }].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-draw pb-0.5 hover:text-chalk">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-eyebrow text-chalk-muted uppercase">Contact</h2>
            <address className="mt-6 space-y-3 text-sm not-italic">
              <p>
                <a href={`mailto:${site.email}`} className="link-draw pb-0.5">
                  {site.email}
                </a>
              </p>
              <p>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="link-draw pb-0.5">
                  {site.phone}
                </a>
              </p>
              <p>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  data-track="whatsapp_click"
                  data-track-label="footer"
                  className="group inline-flex items-center gap-1.5"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="link-draw pb-0.5">WhatsApp</span>
                  <ArrowUpRight className="transition-transform duration-500 ease-cinematic group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>
              <p className="pt-2 text-chalk-muted">
                {site.address.locality}, {site.address.region}, {site.address.country}
              </p>
            </address>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-chalk/[0.08] pt-8 text-xs text-chalk-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legalName}. {site.credential.label}: {site.credential.value}
          </p>
          <ul className="flex gap-6">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-draw pb-0.5 hover:text-chalk">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {/* Oversized wordmark, cropped by the page edge. Decorative. */}
      <div aria-hidden="true" className="wordmark mt-10 select-none text-center leading-[0.8] font-semibold tracking-[-0.06em] text-chalk/[0.07] text-[23vw]">
        {"Skaylon".split("").map((c, i) => (
          <span key={i} data-numeral={c} className="numeral" style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>
    </footer>
  );
}
