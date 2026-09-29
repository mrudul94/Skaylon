import { getServices, getSiteSettings } from "@/content";
import { ContactForm } from "@/components/contact/ContactForm";
import { env } from "@/lib/env";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";
import { WorldPose } from "@/world/WorldPose";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Tell Skaylon about the problem you're facing. Email, call or WhatsApp our studio in Kasaragod, Kerala.",
  path: "/contact",
});

export default async function ContactPage() {
  const [site, services] = await Promise.all([getSiteSettings(), getServices()]);
  const siteKey = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const channels = [
    { label: "Email", value: site.email, href: `mailto:${site.email}`, track: "email_click" },
    { label: "Phone", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}`, track: "cta_click" },
    {
      label: "WhatsApp",
      value: "Message us",
      href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hi Skaylon, I'd like to discuss a project.")}`,
      external: true,
      track: "whatsapp_click",
    },
  ];

  return (
    <>
      <WorldPose pose="contact" />
      <PageHero
        eyebrow="Contact"
        heading="Tell us about the problem, not the product."
        sub="What keeps you from moving forward? Describe the friction you're facing and the founder will reply personally."      />

      <section aria-labelledby="channels-heading" className="pb-28">
        <Container className="grid gap-16 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 id="channels-heading" className="text-title font-medium">
              Reach the studio directly
            </h2>
            <ul className="mt-10 space-y-3">
              {channels.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    data-track={c.track}
                    data-track-label={c.label}
                    className="group relative isolate flex items-center justify-between gap-6 overflow-hidden rounded-2xl border border-chalk/[0.08] bg-ink-900/50 px-6 py-5 backdrop-blur-sm transition-colors duration-500 hover:border-transparent hover:text-ink-950"
                    {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <span aria-hidden="true" className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-gradient-to-r from-accent to-cyan transition-transform duration-700 ease-cinematic group-hover:scale-y-100" />
                    <span className="font-mono text-eyebrow text-chalk-muted uppercase transition-colors duration-500 group-hover:text-ink-950">{c.label}</span>
                    <span className="text-lg font-medium">
                      {c.value}
                      {c.external && <span className="sr-only"> (opens in a new tab)</span>}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-chalk-muted">
              {site.address.locality}, {site.address.region}, {site.address.country}. Working with clients across India
              and internationally.
            </p>
          </div>

          <div id="brief" className="glass relative rounded-[2rem] p-6 sm:p-12">
            {siteKey ? (
              <ContactForm services={services.map((s) => s.name)} siteKey={siteKey} email={site.email} />
            ) : (
              // Until Turnstile is configured, never show a form that can't send.
              <>
                <h2 className="text-title font-medium">Send a project brief</h2>
                <p className="mt-4 text-chalk-muted">
                  Email{" "}
                  <a
                    href={`mailto:${site.email}`}
                    data-track="email_click"
                    className="text-chalk underline underline-offset-4 hover:text-accent"
                  >
                    {site.email}
                  </a>{" "}
                  with a few lines about your goals, timeline and budget.
                </p>
              </>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
