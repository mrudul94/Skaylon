"use client";

import { useEffect } from "react";
import { track, type TrackEvent } from "@/lib/track";

/**
 * One delegated listener: any element with data-track="event" (and optional
 * data-track-label) reports a click. Lets server components tag links without
 * becoming client components.
 */
export function ClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-track]");
      if (el) track(el.dataset.track as TrackEvent, el.dataset.trackLabel);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
