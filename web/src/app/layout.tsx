import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter_Tight } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@/components/layout/Analytics";
import { ClickTracker } from "@/components/layout/ClickTracker";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { getProcessPage, getServices, getSiteSettings } from "@/content";
import { env } from "@/lib/env";
import { organization, website } from "@/lib/jsonld";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { SmoothScroll } from "@/scroll/SmoothScroll";
import { WorldMount } from "@/world/WorldMount";
import "./globals.css";

// Self-hosted at build time by next/font (no runtime request to Google),
// with metric-matched fallbacks so late font swaps don't shift layout.
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
  // Only used for numerals below the fold: don't compete with the hero's
  // font for bandwidth during the LCP window.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "Skaylon — Digital flagships, engineered",
    template: "%s | Skaylon",
  },
  description:
    "Skaylon is a software studio in Kasaragod, Kerala, designing and engineering high-performance websites, web apps, mobile apps and custom software.",
  applicationName: "Skaylon",
  formatDetection: { telephone: false },
  openGraph: { type: "website", siteName: "Skaylon", locale: "en_IN", images: [DEFAULT_OG_IMAGE] },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE.url] },
};

export const viewport: Viewport = {
  themeColor: "#08090a",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [site, services, process] = await Promise.all([getSiteSettings(), getServices(), getProcessPage()]);
  // Text for the 3D labels ("service:2" → "03 Mobile App Development").
  const worldLabels: Record<string, string> = {};
  services.forEach((s) => (worldLabels[`service:${s.wedgeIndex}`] = `${String(s.wedgeIndex + 1).padStart(2, "0")} ${s.name}`));
  process.phases.forEach((p, i) => (worldLabels[`phase:${i}`] = `${p.number} ${p.title}`));
  return (
    <html lang="en-IN" className={`${interTight.variable} ${instrumentSerif.variable}`}>
      <body className="min-h-svh antialiased">
        <JsonLd data={[organization(site), website(site)]} />
        <a
          href="#main"
          className="fixed top-3 left-3 z-[70] -translate-y-24 rounded-full bg-bone px-5 py-3 text-sm text-graphite-950 focus:translate-y-0"
        >
          Skip to content
        </a>
        <div className="atmosphere" aria-hidden="true" />
        <WorldMount labels={worldLabels} />
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <div className="grain" aria-hidden="true" />
        <SmoothScroll />
        <ClickTracker />
        <Analytics />
      </body>
    </html>
  );
}
