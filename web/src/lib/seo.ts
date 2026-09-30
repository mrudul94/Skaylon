import type { Metadata } from "next";

export const DEFAULT_OG_IMAGE = { url: "/og-default.jpg", width: 1200, height: 630, alt: "Skaylon: websites, web applications, mobile apps and custom software" };

/**
 * Per-page metadata with a canonical URL and full Open Graph/Twitter cards.
 * (Next replaces a layout's openGraph object wholesale when a page sets one,
 * so images are included here, not inherited.) Titles go through the root
 * layout's "%s | Skaylon" template.
 */
export function pageMetadata({
  title,
  absoluteTitle,
  description,
  path,
  noindex = false,
  image,
}: {
  title?: string;
  /** Full title that skips the "| Skaylon" template (home page). */
  absoluteTitle?: string;
  description: string;
  path: string;
  noindex?: boolean;
  image?: { url: string; width: number; height: number; alt: string };
}): Metadata {
  const og = image ?? DEFAULT_OG_IMAGE;
  const fullTitle = absoluteTitle ?? (title ? `${title} | Skaylon` : undefined);
  return {
    ...(absoluteTitle ? { title: { absolute: absoluteTitle } } : title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      ...(fullTitle ? { title: fullTitle } : {}),
      description,
      url: path,
      type: "website",
      siteName: "Skaylon",
      locale: "en_IN",
      images: [og],
    },
    twitter: { card: "summary_large_image", ...(fullTitle ? { title: fullTitle } : {}), description, images: [og.url] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
