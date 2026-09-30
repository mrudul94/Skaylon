import { SocialLinks } from "@/components/layout/SocialLinks";
import { getSiteSettings } from "@/content";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Check, Container } from "@/components/ui/primitives";
import { env } from "@/lib/env";
import { webPage } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

const DESCRIPTION =
  "Contact Skaylon to start a website, app or software project. Send an enquiry, email, call or WhatsApp. We reply within one to two working days.";

export const metadata = pageMetadata({ title: "Contact Skaylon", description: DESCRIPTION, path: "/contact" });

export default async function ContactPage() {
  const site = await getSiteSettings();
  const siteKey = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const channels = [
    { label: "Email", value: site.email, href: `mailto:${site.email}`, track: "email_click" },
    { label: "Phone", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}`, track: "phone_click" },
    {
      label: "WhatsApp",
      value: "Send a message",
      href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hi Skaylon, I'd like to discuss a project.")}`,
      external: true,
      track: "whatsapp_click",
    },
  ];

  return (
    <>
      <JsonLd data={webPage({ path: "/contact", name: "Contact Skaylon | Skaylon", description: DESCRIPTION, type: "ContactPage" })} />
      <PageHero
        eyebrow="Contact"
        heading="Start a project with Skaylon"
        sub="Tell us what you want to build or improve. We reply within one to two working days, usually to arrange a short call."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
        ]}
      />

      <section aria-label="Contact options" className="pb-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div className="space-y-10">
            <div>
              <h2 className="text-title font-semibold">Reach us directly</h2>
              <ul className="mt-5 space-y-3">
                {channels.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      data-track={c.track}
                      data-track-label={`contact-${c.label}`}
                      className="card-link flex items-center justify-between gap-4 rounded-xl border hairline bg-surface px-5 py-4"
                      {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      <span className="text-sm text-ink-muted">{c.label}</span>
                      <span className="font-medium break-all">
                        {c.value}
                        {c.external && <span className="sr-only"> (opens in a new tab)</span>}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-ink-muted">
                Based in {site.address.locality}, {site.address.region}, {site.address.country}. We work with clients across
                India and abroad over video calls.
              </p>
              <SocialLinks socials={site.socials} className="mt-4" />
            </div>

            <div>
              <h2 className="text-title font-semibold">What happens next?</h2>
              <ol className="mt-4 space-y-3">
                {[
                  "We read your enquiry and reply within one to two working days.",
                  "A short call to understand your goals, users and timeline.",
                  "A discovery phase, then a fixed-scope proposal with price and timeline.",
                ].map((step) => (
                  <li key={step} className="flex gap-3 text-ink-2">
                    <Check className="mt-1 shrink-0 text-success" />
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h2 className="text-title font-semibold">How we use your details</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                We collect only what you enter in the form: your name, email and the optional details you choose to share.
                They are emailed to our inbox so we can reply, are not stored on this website and are never sold or used
                for marketing lists. Spam protection is provided by Cloudflare Turnstile. See our{" "}
                <a href="/privacy" className="font-medium text-ink underline">
                  Privacy Policy
                </a>{" "}
                for details.
              </p>
            </div>
          </div>

          <div id="enquiry" className="rounded-2xl border hairline bg-surface p-5 sm:p-8">
            {siteKey ? (
              <ContactForm siteKey={siteKey} email={site.email} />
            ) : (
              // Until Turnstile is configured, never show a form that can't send.
              <>
                <h2 className="text-title font-semibold">Send a project enquiry</h2>
                <p className="mt-3 text-ink-muted">
                  Email{" "}
                  <a href={`mailto:${site.email}`} data-track="email_click" className="font-medium text-ink underline">
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
