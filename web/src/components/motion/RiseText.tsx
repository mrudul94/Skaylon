import { Fragment } from "react";

/**
 * Splits a headline into masked words that rise into place on load (CSS
 * `.rise` in globals.css; no JS). The last `accentWords` words are set in
 * the gradient serif italic. textContent stays identical to `text`.
 */
export function RiseText({ text, accentWords = 0, delay = 0 }: { text: string; accentWords?: number; delay?: number }) {
  const words = text.split(" ");
  const firstAccent = words.length - accentWords;
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="rise">
            <span
              className={i >= firstAccent ? "serif-accent text-gradient" : undefined}
              style={{ "--i": i + delay } as React.CSSProperties}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </>
  );
}
