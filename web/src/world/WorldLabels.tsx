"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { anchorsFor, type FormationKey } from "./formations";
import { labelBus, labelNodes, resolveLabel } from "./labels";

const subscribe = (cb: () => void) => labelBus.subscribe(cb);
const getKey = () => labelBus.key;
const getServerKey = () => null;

/** Text that types itself in, one character at a time (instant under reduced motion). */
function TypeText({ text, reducedMotion, delay = 0 }: { text: string; reducedMotion: boolean; delay?: number }) {
  const [shown, setShown] = useState(reducedMotion ? text.length : 0);
  useEffect(() => {
    if (reducedMotion) {
      setShown(text.length);
      return;
    }
    setShown(0);
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      i++;
      setShown(i);
      if (i < text.length) timer = setTimeout(tick, 28);
    };
    timer = setTimeout(tick, delay);
    return () => clearTimeout(timer);
  }, [text, reducedMotion, delay]);
  return (
    <>
      {text.slice(0, shown)}
      {shown < text.length && <span className="ml-px inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-ember" />}
    </>
  );
}

/**
 * Labels that explain what each group of chips represents. Wide screens: a
 * leader line from each chip group to its label. Narrow screens: one caption
 * at a time, cycling. Decorative duplicate of on-page text, so aria-hidden
 * (the world layer as a whole is aria-hidden).
 */
export function WorldLabels({ reducedMotion }: { reducedMotion: boolean }) {
  const key = useSyncExternalStore(subscribe, getKey, getServerKey) as FormationKey | null;
  const anchors = key ? anchorsFor(key) : [];
  const [narrow, setNarrow] = useState(false);
  const [captionIndex, setCaptionIndex] = useState(0);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setNarrow(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  labelNodes.caption = narrow;

  // Caption mode cycles through a formation's labels.
  useEffect(() => {
    setCaptionIndex(0);
    if (!narrow || anchors.length < 2 || reducedMotion) return;
    const id = setInterval(() => setCaptionIndex((i) => (i + 1) % anchors.length), 2600);
    return () => clearInterval(id);
  }, [key, narrow, anchors.length, reducedMotion]);

  if (narrow) {
    const anchor = anchors[captionIndex];
    return (
      <div data-world-labels ref={(el) => void (labelNodes.layer = el)} className="absolute inset-x-0 top-[46%] flex justify-center px-4" style={{ opacity: 0 }}>
        {anchor && (
          <div className="rounded-full border border-bone/15 bg-graphite-950/70 px-4 py-2 text-xs tracking-[0.12em] text-bone uppercase backdrop-blur-sm">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-ember align-middle" />
            <TypeText key={`${key}-${captionIndex}`} text={resolveLabel(anchor.text)} reducedMotion={reducedMotion} />
          </div>
        )}
      </div>
    );
  }

  labelNodes.items = anchors.map((_, i) => labelNodes.items[i] ?? { label: null, line: null, dot: null });
  return (
    <div data-world-labels ref={(el) => void (labelNodes.layer = el)} className="absolute inset-0" style={{ opacity: 0 }}>
      <svg className="absolute inset-0 h-full w-full overflow-visible">
        {anchors.map((a, i) => (
          <g key={`${key}-${i}`}>
            <line
              ref={(el) => void (labelNodes.items[i] && (labelNodes.items[i]!.line = el))}
              stroke="rgb(236 232 225 / 0.35)"
              strokeWidth="1"
            />
            <circle ref={(el) => void (labelNodes.items[i] && (labelNodes.items[i]!.dot = el))} r="3" fill="var(--color-ember)" />
          </g>
        ))}
      </svg>
      {anchors.map((a, i) => (
        <div
          key={`${key}-${i}`}
          ref={(el) => void (labelNodes.items[i] && (labelNodes.items[i]!.label = el))}
          className="absolute top-0 left-0 whitespace-nowrap text-xs font-medium tracking-[0.14em] text-bone uppercase"
          style={{ visibility: "hidden" }}
        >
          <TypeText text={resolveLabel(a.text)} reducedMotion={reducedMotion} delay={i * 180} />
        </div>
      ))}
    </div>
  );
}
