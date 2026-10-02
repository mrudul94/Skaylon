"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { OPEN_SETTINGS_EVENT, readConsent, saveConsent, type ConsentChoice } from "@/lib/consent";

/**
 * Cookie consent banner. Shown on the first visit and whenever "Cookie
 * settings" is used. Not a modal: the page stays usable behind it. "Reject"
 * and "Accept" are equally prominent, nothing is pre-selected, and nothing
 * optional runs until the visitor accepts (see lib/consent.ts).
 */
export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<ConsentChoice | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const choice = readConsent();
    setCurrent(choice);
    if (!choice) setOpen(true);
    const reopen = () => {
      setCurrent(readConsent());
      setOpen(true);
      requestAnimationFrame(() => headingRef.current?.focus());
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, reopen);
  }, []);

  useEffect(() => {
    document.body.dataset.consentOpen = open ? "true" : "false";
  }, [open]);

  if (!open) return null;

  const choose = (choice: ConsentChoice) => {
    saveConsent(choice);
    setCurrent(choice);
    setOpen(false);
  };

  const button =
    "inline-flex min-h-11 flex-1 items-center justify-center rounded-lg px-4 text-sm font-medium sm:flex-none sm:min-w-32";

  return (
    <section
      aria-labelledby="consent-heading"
      className="consent-banner fixed inset-x-3 bottom-3 z-[55] mx-auto max-w-xl rounded-2xl border hairline bg-surface p-5 shadow-[0_24px_60px_-20px_rgb(10_20_53/0.35)] sm:inset-x-auto sm:right-5 sm:bottom-5 sm:p-6"
    >
      <h2 id="consent-heading" ref={headingRef} tabIndex={-1} className="text-base font-semibold outline-none">
        Cookies and analytics
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        We&apos;d like to measure visits with Cloudflare Web Analytics and count anonymous actions (such as &ldquo;enquiry
        sent&rdquo;) to improve the site. This uses no advertising or tracking cookies and never identifies you. It only
        runs if you accept. Read our{" "}
        <Link href="/cookies" className="font-medium text-ink underline">
          Cookie Policy
        </Link>
        .
      </p>
      {current && (
        <p className="mt-2 text-sm text-ink-muted">
          Current choice: <strong className="font-medium text-ink">{current === "granted" ? "accepted" : "rejected"}</strong>
        </p>
      )}
      <div className="mt-4 flex gap-3">
        <button type="button" onClick={() => choose("denied")} className={`${button} border border-ink bg-surface text-ink hover:bg-paper`}>
          Reject
        </button>
        <button type="button" onClick={() => choose("granted")} className={`${button} border border-ink bg-ink text-paper hover:bg-ink-2`}>
          Accept
        </button>
      </div>
    </section>
  );
}

/** Footer link that re-opens the banner. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))}
    >
      Cookie settings
    </button>
  );
}
