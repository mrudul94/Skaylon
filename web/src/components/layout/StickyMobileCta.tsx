"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Small-screen bottom bar with the two primary actions. The body reserves its
 * height (globals.css), so it never covers content; it hides on the contact
 * pages (the visitor is already there), while a hero call to action marked
 * [data-hero-cta] is on screen (no duplicate buttons), and at the footer.
 */
export function StickyMobileCta({ phone }: { phone: string }) {
  const pathname = usePathname();
  const [footerVisible, setFooterVisible] = useState(false);
  const [heroCtaVisible, setHeroCtaVisible] = useState(false);
  const hidden = pathname.startsWith("/contact");

  useEffect(() => {
    document.body.dataset.stickyCta = hidden ? "false" : "true";
    return () => {
      delete document.body.dataset.stickyCta;
    };
  }, [hidden]);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setFooterVisible(Boolean(entry?.isIntersecting)));
    io.observe(footer);
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    const cta = document.querySelector("[data-hero-cta]");
    setHeroCtaVisible(false);
    if (!cta || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setHeroCtaVisible(Boolean(entry?.isIntersecting)));
    io.observe(cta);
    return () => io.disconnect();
  }, [pathname]);

  const tucked = footerVisible || heroCtaVisible;

  if (hidden) return null;
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t hairline bg-paper/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-200 md:hidden ${tucked ? "translate-y-full" : ""}`}
      aria-hidden={tucked || undefined}
      inert={tucked || undefined}
    >
      <div className="flex gap-3">
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="flex min-h-12 flex-1 items-center justify-center rounded-lg border border-line-strong bg-surface text-[0.95rem] font-medium"
          data-track="phone_click"
          data-track-label="sticky"
        >
          Call us
        </a>
        <Link
          href="/contact"
          className="flex min-h-12 flex-[1.4] items-center justify-center rounded-lg bg-ink text-[0.95rem] font-medium text-paper"
          data-track="cta_click"
          data-track-label="sticky"
        >
          Start a project
        </Link>
      </div>
    </div>
  );
}
