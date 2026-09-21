"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useWedgeHighlight } from "@/world/WorldPose";

/** A service link that lights its icon in the 3D world on hover/focus. */
export function ServiceRowLink({ wedge, ...props }: ComponentProps<typeof Link> & { wedge: number }) {
  return <Link {...props} {...useWedgeHighlight(wedge)} />;
}
