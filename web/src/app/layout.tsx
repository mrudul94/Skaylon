import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@/components/layout/Analytics";
import { ClickTracker } from "@/components/layout/ClickTracker";
import { Cursor } from "@/components/motion/Cursor";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteSettings } from "@/content";
import { env } from "@/lib/env";
import { organization, website } from "@/lib/jsonld";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { SmoothScroll } from "@/scroll/SmoothScroll";
import { WorldMount } from "@/world/WorldMount";
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
  // Small labels only: don't compete with the hero's fonts during LCP.
  preload: false,
});

// The italic accent word in headlines (including the hero h1, so preloaded).
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
  themeColor: "#06070a",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteSettings();
  return (
    <html lang="en-IN" className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}>
      <body className="min-h-svh antialiased">
        <JsonLd data={[organization(site), website(site)]} />
        <a
          href="#main"
          className="fixed top-3 left-3 z-[70] -translate-y-24 rounded-full bg-chalk px-5 py-3 text-sm text-ink-950 focus:translate-y-0"
        >
          Skip to content
        </a>
        <div className="atmosphere" aria-hidden="true" />
        <div className="grid-lines" aria-hidden="true" />
        <WorldMount />
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <div className="grain" aria-hidden="true" />
        <ScrollProgress />
        <Cursor />
        <SmoothScroll />
        <ClickTracker />
        <Analytics />
      </body>
    </html>
  );
}
