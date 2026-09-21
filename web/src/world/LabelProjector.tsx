"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { anchorsFor } from "./formations";
import { labelBus, labelNodes } from "./labels";
import { live } from "./live";

const v = new Vector3();
const OFFSET = { x: 56, y: -44 }; // side labels: up and out from the anchor
const UP = [34, 66] as const; // "up" labels: line length per level (px)

/**
 * Pins the DOM labels to their 3D anchors: projects each anchor through the
 * live camera (lens shift included) and writes positions straight to the DOM.
 */
export function LabelProjector() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  useFrame(() => {
    labelBus.set(live.labels.key);
    const { layer, items, caption } = labelNodes;
    if (!layer) return;
    const opacity = live.labels.key ? live.labels.opacity * (1 - live.dim * 0.6) : 0;
    layer.style.opacity = opacity.toFixed(3);
    if (caption || !live.labels.key || opacity <= 0.001) return;

    const anchors = anchorsFor(live.labels.key);
    anchors.forEach((anchor, i) => {
      const item = items[i];
      if (!item?.label || !item.line || !item.dot) return;
      v.fromArray(anchor.point).project(camera);
      const behind = v.z > 1;
      const x = ((v.x + 1) / 2) * size.width;
      const y = ((1 - v.y) / 2) * size.height;
      if (anchor.side === "up") {
        // Centred above the anchor; neighbours alternate heights so they never overlap.
        const ly = y - UP[anchor.level ?? 0];
        item.label.style.transform = `translate(${x.toFixed(1)}px, ${ly.toFixed(1)}px) translate(-50%, -100%)`;
        item.line.setAttribute("x1", x.toFixed(1));
        item.line.setAttribute("y1", y.toFixed(1));
        item.line.setAttribute("x2", x.toFixed(1));
        item.line.setAttribute("y2", (ly + 4).toFixed(1));
      } else {
        const dir = anchor.side === "left" ? -1 : 1;
        const lx = x + OFFSET.x * dir;
        const ly = y + OFFSET.y;
        item.label.style.transform = `translate(${lx.toFixed(1)}px, ${ly.toFixed(1)}px) translate(${dir < 0 ? "-100%" : "0"}, -50%)`;
        item.line.setAttribute("x1", x.toFixed(1));
        item.line.setAttribute("y1", y.toFixed(1));
        item.line.setAttribute("x2", (lx - 6 * dir).toFixed(1));
        item.line.setAttribute("y2", ly.toFixed(1));
      }
      item.label.style.visibility = behind ? "hidden" : "visible";
      item.dot.setAttribute("cx", x.toFixed(1));
      item.dot.setAttribute("cy", y.toFixed(1));
    });
  });
  return null;
}
