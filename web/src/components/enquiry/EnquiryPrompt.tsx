"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/lib/contact-options";
import { track } from "@/lib/track";

// The dialog and its form only download when the prompt actually opens.
const EnquiryPopup = dynamic(() => import("./EnquiryPopup").then((m) => m.EnquiryPopup), { ssr: false });

/** Engagement required before the prompt may show at all. */
const MIN_TIME_MS = 15_000;
/** Mobile has no real exit intent: wait for genuine reading instead. */
const MOBILE_MIN_TIME_MS = 30_000;
const MOBILE_SCROLL_DEPTH = 0.6;
/** A dismissal keeps the prompt away for this long. */
const DISMISS_FOR_MS = 30 * 24 * 60 * 60 * 1000;

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function suppressed(): boolean {
  if (read(STORAGE_KEYS.enquirySent)) return true;
  const dismissedAt = Number(read(STORAGE_KEYS.popupDismissed));
  return Number.isFinite(dismissedAt) && dismissedAt > 0 && Date.now() - dismissedAt < DISMISS_FOR_MS;
}

/** Pages where the prompt would interrupt a flow the visitor is already in. */
const excluded = (path: string) => path.startsWith("/contact");
/** On touch devices, only show on pages where an enquiry is the natural next step. */
const mobileEligible = (path: string) => path === "/" || path.startsWith("/services");

/**
 * "Before you go" project enquiry prompt.
 *
 * Desktop (fine pointer + hover): shows when the cursor leaves through the top
 * of the window (toward the tabs/close button), and only after 15 s on the
 * page plus a scroll or interaction.
 * Mobile: no fake exit intent. Shows after 30 s of engagement and 60% scroll
 * depth on the home or a services page.
 * Never on /contact, never twice in one visit, not for 30 days after a
 * dismissal, and never again after an enquiry has been sent.
 */
export function EnquiryPrompt({ siteKey }: { siteKey: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  // Wall-clock start of the page view that triggered the prompt. The server's
  // bot check measures fill time from here: the visitor has been reading for
  // 15 s+ by then, and autofill can complete two fields in under 3 s.
  const [since, setSince] = useState(0);

  useEffect(() => {
    if (shown || excluded(pathname) || suppressed()) return;

    const start = performance.now();
    const startWall = Date.now();
    let interacted = false;
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const elapsed = () => performance.now() - start;
    const show = () => {
      if (suppressed()) return;
      setSince(startWall);
      setShown(true);
      setOpen(true);
      track("enquiry_popup_shown", desktop ? "exit-intent" : "engagement");
    };

    const onInteract = () => {
      interacted = true;
    };
    const onScroll = () => {
      if (window.scrollY > 200) interacted = true;
      if (!desktop && mobileEligible(pathname) && elapsed() >= MOBILE_MIN_TIME_MS) {
        const depth = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
        if (depth >= MOBILE_SCROLL_DEPTH) show();
      }
    };
    const onMouseOut = (e: MouseEvent) => {
      if (e.relatedTarget || e.clientY > 8) return;
      if (interacted && elapsed() >= MIN_TIME_MS) show();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onInteract, { passive: true });
    window.addEventListener("keydown", onInteract);
    if (desktop) document.addEventListener("mouseout", onMouseOut);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [pathname, shown]);

  if (!shown) return null;
  return (
    <EnquiryPopup
      open={open}
      siteKey={siteKey}
      since={since}
      onDismiss={() => {
        track("enquiry_popup_dismissed");
        try {
          localStorage.setItem(STORAGE_KEYS.popupDismissed, String(Date.now()));
        } catch {
          // Storage unavailable: the in-memory `shown` flag still stops repeats this visit.
        }
      }}
      onClosed={() => setOpen(false)}
    />
  );
}
