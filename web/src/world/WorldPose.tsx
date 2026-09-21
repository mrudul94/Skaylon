"use client";

import { useEffect } from "react";
import type { PoseRequest, StaticPoseKey } from "./journey";
import { useWorld } from "./store";

/**
 * Declares which pose the persistent world should ease into for this page.
 * Render it anywhere in a page; it renders nothing.
 */
export function WorldPose(props: { journey: true } | { pose: StaticPoseKey } | { focusWedge: number }) {
  const setPose = useWorld((s) => s.setPose);
  const req: PoseRequest =
    "journey" in props
      ? { kind: "journey" }
      : "pose" in props
        ? { kind: "static", key: props.pose }
        : { kind: "focus", wedge: props.focusWedge };
  const key = JSON.stringify(req);

  useEffect(() => {
    setPose(JSON.parse(key) as PoseRequest);
  }, [key, setPose]);

  return null;
}

/** Hover / focus a service in the DOM → its icon glows in the world. */
export function useWedgeHighlight(wedge: number) {
  const setActiveWedge = useWorld((s) => s.setActiveWedge);
  return {
    onMouseEnter: () => setActiveWedge(wedge),
    onMouseLeave: () => setActiveWedge(null),
    onFocus: () => setActiveWedge(wedge),
    onBlur: () => setActiveWedge(null),
  };
}
