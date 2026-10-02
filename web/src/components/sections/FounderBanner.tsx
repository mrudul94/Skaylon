import type { SiteSettings } from "@/content/types";

/**
 * Wide founder banner: a black-and-white photo with the founder's principle
 * set over a dark fade. The quote, name and role are real text (readable by
 * search engines and AI tools); the photo has descriptive alt text. Images are
 * pre-sized local WebP files, lazy-loaded, with a portrait crop on phones.
 */
export function FounderBanner({ site, quote, className }: { site: SiteSettings; quote: string; className?: string }) {
  return (
    <figure className={`founder-banner group relative isolate overflow-hidden rounded-2xl bg-ink text-paper ${className ?? ""}`}>
      <picture>
        <source media="(min-width: 1024px)" srcSet="/founder-wide-960.webp 960w, /founder-wide-1600.webp 1600w" sizes="(min-width: 1280px) 1216px, 100vw" />
        <img
          src="/founder-portrait-720.webp"
          alt={`${site.founder}, founder of ${site.legalName}, standing in a corridor with arms folded`}
          width={720}
          height={723}
          loading="lazy"
          decoding="async"
          className="founder-banner-img absolute inset-0 -z-20 h-full w-full object-cover object-[50%_20%] lg:object-[58%_30%]"
        />
      </picture>
      {/* Dark fade so the text always meets contrast: from the bottom on
          phones, from the left on wider screens. */}
      <div
        aria-hidden="true"
        className="founder-banner-fade absolute inset-0 -z-10"
      />
      <div className="flex min-h-[34rem] flex-col justify-end p-6 sm:p-10 lg:min-h-[32rem] lg:max-w-[28rem] lg:p-14">
        <p className="text-xs font-semibold tracking-[0.14em] text-paper/75 uppercase">Founder&apos;s principle</p>
        <blockquote className="mt-4">
          <p className="font-serif-accent text-[clamp(1.9rem,1.4rem+1.6vw,2.7rem)] leading-[1.1] text-paper">&ldquo;{quote}&rdquo;</p>
        </blockquote>
        <span aria-hidden="true" className="mt-8 block h-px w-40 bg-paper/25" />
        <figcaption className="mt-5">
          <span className="block font-medium text-paper">{site.founder}</span>
          <span className="mt-1 block text-sm tracking-[0.08em] text-paper/70 uppercase">Founder, {site.name}</span>
        </figcaption>
      </div>
    </figure>
  );
}
