import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@/components/layout/Analytics";
import { ClickTracker } from "@/components/layout/ClickTracker";
import { Header } from "@/components/layout/Header";
import { StickyMobileCta } from "@/components/layout/StickyMobileCta";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { EnquiryPrompt } from "@/components/enquiry/EnquiryPrompt";
import { PointerGlow } from "@/components/visuals/PointerGlow";
import { JsonLd } from "@/components/seo/JsonLd";
import { getServices, getSiteSettings } from "@/content";
import { env } from "@/lib/env";
import { organization, website } from "@/lib/jsonld";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import "./globals.css";

// Self-hosted at build time by next/font (no runtime request to Google),
// with metric-matched fallbacks so late font swaps don't shift layout.
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  // Small labels only: don't compete with the hero's font during LCP.
  preload: false,
});

// Italic serif for accent words and figures (one weight, ~20 KB). Preloaded
// because the home h1 uses it; the metric-matched fallback avoids layout shift.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "Skaylon | Websites, Web Apps, Mobile Apps & Custom Software",
    template: "%s | Skaylon",
  },
  description:
    "Skaylon is a founder-led software studio in Kerala, India, designing and building websites, web applications, mobile apps, custom software and backend systems for businesses.",
  applicationName: "Skaylon",
  formatDetection: { telephone: false },
  openGraph: { type: "website", siteName: "Skaylon", locale: "en_IN", images: [DEFAULT_OG_IMAGE] },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE.url] },
};

export const viewport: Viewport = {
  themeColor: "#f7f8fb",
  colorScheme: "light",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [site, services] = await Promise.all([getSiteSettings(), getServices()]);
  const navServices = services.map((s) => ({ slug: s.slug, name: s.name, description: s.menuDescription }));
  const siteKey = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  return (
    <html lang="en-IN" className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}>
      <body className="min-h-svh antialiased">
        <JsonLd data={[organization(site, services), website(site)]} />
        <a
          href="#main"
          className="fixed top-3 left-3 z-[70] -translate-y-24 rounded-lg bg-ink px-5 py-3 text-sm font-medium text-paper focus:translate-y-0"
        >
          Skip to content
        </a>
        <div className="scroll-progress" aria-hidden="true" />
        <Header services={navServices} phone={site.phone} />
        <main id="main" tabIndex={-1} className="relative outline-none">
          {children}
        </main>
        <Footer />
        <StickyMobileCta phone={site.phone} />
        <WhatsAppButton number={site.whatsapp} />
        {siteKey && <EnquiryPrompt siteKey={siteKey} />}
        <PointerGlow />
        <ClickTracker />
        <Analytics token={env.NEXT_PUBLIC_CF_BEACON_TOKEN} />
        <CookieConsent />
      </body>
    </html>
  );
}
