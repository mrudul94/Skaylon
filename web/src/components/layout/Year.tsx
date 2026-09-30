"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * The current year. Pages are statically generated, so a server-rendered year
 * would freeze at build time; the client corrects it after hydration. The
 * server value is the build year, so no-JS visitors still see a real year.
 */
export function Year() {
  const year = useSyncExternalStore(
    noop,
    () => new Date().getFullYear(),
    () => BUILD_YEAR,
  );
  return <span suppressHydrationWarning>{year}</span>;
}

const BUILD_YEAR = new Date().getFullYear();
