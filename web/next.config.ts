import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import { legacyRedirects, securityHeaders } from "./src/lib/security-headers";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // CSS inlined into the HTML (~9 KB gz): removes the one render-blocking
    // request, i.e. a full round-trip before the hero text can paint (LCP).
    inlineCss: true,
  },
  images: {
    // Workers has no built-in Next image optimizer: Sanity's CDN resizes.
    loader: "custom",
    loaderFile: "./src/sanity/imageLoader.ts",
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return legacyRedirects;
  },
};

export default nextConfig;

// Exposes Cloudflare bindings to `next dev`.
initOpenNextCloudflareForDev();
