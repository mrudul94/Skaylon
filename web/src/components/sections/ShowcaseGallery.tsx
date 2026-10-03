"use client";

import { useState } from "react";
import type { ShowcaseCategory, ShowcaseItem } from "@/content/types";
import { CmsImage } from "@/components/ui/CmsImage";
import { ButtonLink } from "@/components/ui/primitives";
import { SHOWCASE_CATEGORY_LABELS } from "@/lib/showcase";

/**
 * Gallery of demo sites. Each card opens the live demo in a new tab; a tall
 * (full-page) screenshot scrolls from top to bottom while the card is hovered
 * or focused. The category filter only appears once there are two or more
 * categories.
 */
export function ShowcaseGallery({ items }: { items: ShowcaseItem[] }) {
  const [filter, setFilter] = useState<ShowcaseCategory | "all">("all");
  if (items.length === 0) return <ShowcaseEmptyState />;

  // Chips only for categories that have at least one item, in a fixed order.
  const categories = (Object.keys(SHOWCASE_CATEGORY_LABELS) as ShowcaseCategory[]).filter((c) =>
    items.some((i) => i.category === c),
  );
  const shown = filter === "all" ? items : items.filter((i) => i.category === filter);

  return (
    <>
      {categories.length > 1 && (
        <div role="group" aria-label="Filter by category" className="mb-10 flex flex-wrap gap-2">
          {(["all", ...categories] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
              className="min-h-11 rounded-full border border-line-strong bg-surface px-4 text-sm font-medium text-ink-2 transition-colors hover:border-ink hover:text-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper"
            >
              {c === "all" ? "All" : SHOWCASE_CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      )}
      <p aria-live="polite" className="sr-only">
        Showing {shown.length} {shown.length === 1 ? "demo" : "demos"}
      </p>
      <ul className="grid gap-x-8 gap-y-12 md:grid-cols-2">
        {shown.map((item, i) => (
          <li key={item.id}>
            <ShowcaseCard item={item} priority={i < 2} />
          </li>
        ))}
      </ul>
    </>
  );
}

function ShowcaseCard({ item, priority }: { item: ShowcaseItem; priority: boolean }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener"
      className="showcase-card group block"
      data-track="showcase_click"
      data-track-label={item.title}
    >
      <div className="showcase-frame relative aspect-[16/11] overflow-hidden rounded-xl border hairline bg-paper-2">
        <CmsImage
          src={item.screenshot.url}
          alt={item.screenshot.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          priority={priority}
          className="showcase-shot object-cover object-top"
        />
        <span
          aria-hidden="true"
          className="showcase-visit absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-sm font-medium text-paper"
        >
          Visit site
          <svg viewBox="0 0 16 16" width="14" height="14">
            <path d="M5 11L11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-6">
        <h2 className="text-title font-semibold group-hover:underline">
          {item.title}
          <span className="sr-only"> (opens in a new tab)</span>
        </h2>
        <span className="shrink-0 text-sm whitespace-nowrap text-ink-muted tabular-nums">
          {SHOWCASE_CATEGORY_LABELS[item.category] ?? item.category} · {item.year}
        </span>
      </div>
      {item.description && <p className="mt-2 text-ink-muted">{item.description}</p>}
      {item.techStack.length > 0 && (
        <ul aria-label="Built with" className="mt-3 flex flex-wrap gap-1.5">
          {item.techStack.map((t) => (
            <li key={t} className="rounded-full border hairline px-2.5 py-1 font-mono text-xs text-ink-muted">
              {t}
            </li>
          ))}
        </ul>
      )}
    </a>
  );
}

function ShowcaseEmptyState() {
  return (
    <div className="rounded-xl border hairline bg-surface px-6 py-12 text-center sm:px-12">
      <h2 className="text-title font-semibold">Demo sites are on their way</h2>
      <p className="mx-auto mt-3 max-w-xl text-ink-muted">
        We are putting together a set of live demos you can click through. Until then, we are happy to show you
        relevant examples on a call.
      </p>
      <div className="mt-8 flex justify-center">
        <ButtonLink href="/contact" variant="secondary">
          Ask for examples
        </ButtonLink>
      </div>
    </div>
  );
}
