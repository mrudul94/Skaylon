"use client";

import { useEffect, useState } from "react";
import { THEME_STORAGE_KEY as STORAGE_KEY, type Theme } from "@/lib/theme";

function readSaved(): Theme | null {
  try {
    const t = localStorage.getItem(STORAGE_KEY);
    return t === "light" || t === "dark" ? t : null;
  } catch {
    return null;
  }
}

/** Light/dark switch. Both icons are server-rendered; CSS shows the right one. */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    // If React had to re-render <html> (hydration error recovery) it drops the
    // attribute themeScript set, so put it back.
    const root = document.documentElement;
    if (root.dataset.theme !== "light" && root.dataset.theme !== "dark")
      root.dataset.theme = readSaved() ?? (media.matches ? "dark" : "light");
    // The header renders two toggles (desktop and tablet): the attribute on
    // <html> is the single source of truth, and both mirror it.
    const sync = () => setTheme(root.dataset.theme === "dark" ? "dark" : "light");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    // Follow the system setting until the visitor picks a theme themselves.
    const onChange = (e: MediaQueryListEvent) => {
      if (!readSaved()) root.dataset.theme = e.matches ? "dark" : "light";
    };
    media.addEventListener("change", onChange);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", onChange);
    };
  }, []);

  const toggle = () => {
    const next: Theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private mode or blocked storage: the switch still works for this page view.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Dark theme"
      aria-pressed={theme === null ? undefined : theme === "dark"}
      title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className={`flex min-h-11 min-w-11 items-center justify-center rounded-full border hairline bg-surface text-ink-2 transition-colors hover:border-line-strong hover:text-ink ${className ?? ""}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="theme-light-only"
      >
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="theme-dark-only"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
