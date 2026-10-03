import type { ReactNode } from "react";

/**
 * Decorative hero illustration per service (aria-hidden, CSS only, no text
 * nodes: see ProductStack). Unknown slugs get the generic window.
 */
function Window({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-xl border hairline bg-surface shadow-[0_40px_80px_-40px_rgb(20_22_26/0.45)] ${className ?? ""}`}>
      <div className="flex items-center gap-1.5 border-b hairline bg-paper px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#e8b4a0]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ead9b8]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#c9d8c5]" />
        <span className="ml-3 h-4 flex-1 rounded bg-paper-2" />
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

const Line = ({ w, dark }: { w: string; dark?: boolean }) => (
  <span className={`block h-2 rounded ${dark ? "bg-ink-2" : "bg-line"}`} style={{ width: w }} />
);

function Phone({ className, accent = true }: { className?: string; accent?: boolean }) {
  return (
    <div className={`rounded-[1.4rem] border-[5px] border-ink bg-surface p-2 shadow-[0_40px_70px_-30px_rgb(20_22_26/0.55)] ${className ?? ""}`}>
      <span className="mx-auto block h-1.5 w-8 rounded-full bg-ink" />
      <span className={`mt-3 block h-16 rounded-lg ${accent ? "bg-gradient-to-br from-accent to-accent-ink" : "bg-paper-2"}`} />
      <div className="mt-2 space-y-1.5">
        <Line w="80%" dark />
        <Line w="100%" />
        <Line w="70%" />
      </div>
      <div className="mt-3 space-y-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="flex items-center gap-1.5 rounded-md bg-paper p-1.5">
            <span className="h-4 w-4 rounded bg-accent-wash" />
            <span className="h-1.5 flex-1 rounded bg-line" />
          </span>
        ))}
      </div>
      <span className="mt-3 block h-5 rounded-md bg-ink" />
    </div>
  );
}

const visuals: Record<string, ReactNode> = {
  "website-development": (
    <Window className="ps-float-a">
      <div className="flex items-center justify-between">
        <span className="h-3 w-14 rounded bg-ink" />
        <span className="flex gap-2">
          <span className="h-2 w-8 rounded bg-line" />
          <span className="h-2 w-8 rounded bg-line" />
          <span className="h-4 w-12 rounded bg-accent" />
        </span>
      </div>
      <div className="mt-6 grid grid-cols-[1.3fr_1fr] items-center gap-4">
        <div className="space-y-2">
          <span className="block h-4 w-full rounded bg-ink" />
          <span className="block h-4 w-3/4 rounded bg-ink" />
          <Line w="90%" />
          <Line w="70%" />
          <span className="mt-3 block h-5 w-20 rounded bg-accent-ink" />
        </div>
        <span className="ps-glow block aspect-square rounded-2xl bg-gradient-to-br from-accent-wash via-accent/60 to-accent-ink" />
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-lg border hairline p-2">
            <span className="block h-5 w-5 rounded bg-accent-wash" />
            <span className="mt-2 block h-1.5 w-4/5 rounded bg-ink-2" />
            <span className="mt-1.5 block h-1.5 w-full rounded bg-line" />
          </div>
        ))}
      </div>
    </Window>
  ),
  "web-application-development": (
    <Window className="ps-float-a">
      <div className="grid grid-cols-[4rem_1fr] gap-3">
        <div className="space-y-2">
          <span className="block h-2.5 w-full rounded bg-ink" />
          {["80%", "60%", "80%", "40%", "70%"].map((w, i) => (
            <Line key={i} w={w} />
          ))}
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {["74%", "48%", "62%"].map((w) => (
              <div key={w} className="rounded-lg border hairline p-2">
                <span className="block h-1.5 w-1/2 rounded bg-line" />
                <span className="mt-2 block h-3 rounded bg-ink-2" style={{ width: w }} />
              </div>
            ))}
          </div>
          <div className="flex h-28 items-end gap-1.5 rounded-lg border hairline p-2">
            {[38, 55, 46, 70, 62, 84, 58, 92, 76, 88].map((h, i) => (
              <span key={i} className="ps-bar flex-1 rounded-sm bg-accent/80" style={{ height: `${h}%`, "--i": i } as React.CSSProperties} />
            ))}
          </div>
          {[0, 1, 2].map((i) => (
            <span key={i} className="flex items-center gap-2 border-b hairline pb-1.5">
              <span className="h-3 w-3 rounded-full bg-accent-wash" />
              <span className="h-1.5 flex-1 rounded bg-line" />
              <span className="h-3 w-10 rounded-full bg-[#dcebdd]" />
            </span>
          ))}
        </div>
      </div>
    </Window>
  ),
  "mobile-app-development": (
    <div className="relative h-full">
      <Phone className="ps-float-a absolute top-[4%] left-[14%] w-[38%]" />
      <Phone className="ps-float-b absolute top-[16%] right-[12%] w-[38%]" accent={false} />
    </div>
  ),
  "custom-software-development": (
    <div className="relative h-full">
      <svg viewBox="0 0 400 320" className="absolute inset-0 h-full w-full" fill="none">
        <path className="ps-draw" d="M95 70 C 170 70, 170 160, 200 160 S 240 250, 305 250" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="6 6" />
        <path className="ps-draw" d="M95 250 C 150 250, 160 160, 200 160 S 260 70, 305 70" stroke="var(--color-line-strong)" strokeWidth="2" strokeDasharray="6 6" />
      </svg>
      {[
        ["top-[12%] left-[4%]", "bg-surface"],
        ["top-[68%] left-[4%]", "bg-surface"],
        ["top-[40%] left-[36%]", "bg-ink"],
        ["top-[12%] right-[4%]", "bg-surface"],
        ["top-[68%] right-[4%]", "bg-surface"],
      ].map(([pos, bg], i) => (
        <div key={i} className={`ps-float-${i % 2 ? "b" : "a"} absolute ${pos} w-[28%] rounded-xl border hairline ${bg} p-3 shadow-[0_20px_40px_-24px_rgb(20_22_26/0.45)]`}>
          <span className={`block h-6 w-6 rounded-md ${bg === "bg-ink" ? "bg-accent" : "bg-accent-wash"}`} />
          <span className={`mt-2 block h-2 w-4/5 rounded ${bg === "bg-ink" ? "bg-paper/80" : "bg-ink-2"}`} />
          <span className={`mt-1.5 block h-1.5 w-full rounded ${bg === "bg-ink" ? "bg-paper/30" : "bg-line"}`} />
        </div>
      ))}
    </div>
  ),
  "ui-ux-design": (
    <Window className="ps-float-a">
      <div className="grid grid-cols-[1fr_5.5rem] gap-3">
        <div className="relative rounded-lg border border-dashed border-line-strong bg-paper p-3">
          <span className="block h-3 w-2/3 rounded bg-ink" />
          <span className="mt-2 block h-2 w-full rounded bg-line" />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <span className="h-14 rounded-md bg-accent-wash" />
            <span className="relative h-14 rounded-md border-2 border-accent bg-surface">
              <span className="absolute -top-1.5 -left-1.5 h-2.5 w-2.5 border-2 border-accent bg-surface" />
              <span className="absolute -right-1.5 -bottom-1.5 h-2.5 w-2.5 border-2 border-accent bg-surface" />
            </span>
          </div>
          <span className="mt-3 block h-5 w-20 rounded bg-ink" />
          <svg viewBox="0 0 24 24" className="ps-cursor absolute top-[55%] left-[62%] h-5 w-5 drop-shadow" fill="var(--color-ink)">
            <path d="M4 3l14 7-6 1.5L9 18z" stroke="white" strokeWidth="1.2" />
          </svg>
        </div>
        <div className="space-y-2">
          {["#0a1435", "#0068fd", "#0052cc", "#eef1f7"].map((c) => (
            <span key={c} className="flex items-center gap-1.5">
              <span className="h-5 w-5 rounded border hairline" style={{ background: c }} />
              <span className="h-1.5 flex-1 rounded bg-line" />
            </span>
          ))}
          <span className="mt-3 block h-6 rounded bg-paper-2" />
          <span className="block h-6 rounded bg-paper-2" />
        </div>
      </div>
    </Window>
  ),
  "backend-api-development": (
    <div className="relative h-full">
      <div className="ps-float-a absolute top-[4%] left-0 w-[70%] rounded-xl bg-ink p-4 font-mono text-[0.68rem] leading-relaxed shadow-[0_30px_60px_-30px_rgb(20_22_26/0.6)]">
        {[
          ["POST", "/v1/orders", "201"],
          ["GET", "/v1/orders/42", "200"],
          ["PATCH", "/v1/stock", "200"],
          ["POST", "/webhooks/pay", "202"],
        ].map(([m, path, code], i) => (
          <div key={i} className="ps-row flex items-center gap-2 py-1" style={{ "--i": i } as React.CSSProperties}>
            <span data-t={m} className="gen-text w-12 rounded bg-paper/10 px-1.5 text-center text-accent" />
            <span data-t={path} className="gen-text text-paper/70" />
            <span data-t={code} className="gen-text ml-auto text-[#9fd8b4]" />
          </div>
        ))}
      </div>
      <div className="ps-float-b absolute right-[4%] bottom-[4%] w-[46%] rounded-xl border hairline bg-surface p-3 shadow-[0_30px_60px_-30px_rgb(20_22_26/0.45)]">
        {[0, 1, 2].map((i) => (
          <div key={i} className="mb-2 flex items-center gap-2 last:mb-0">
            <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-accent-ink" fill="none" stroke="currentColor" strokeWidth="1.6">
              <ellipse cx="12" cy="6" rx="7" ry="3" />
              <path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
            </svg>
            <span className="h-1.5 flex-1 rounded bg-line" />
            <span className="ps-pulse relative h-2 w-2 rounded-full bg-success" />
          </div>
        ))}
      </div>
    </div>
  ),
};

export function ServiceVisual({ slug, className }: { slug: string; className?: string }) {
  return (
    <div aria-hidden="true" className={`tone-light relative aspect-[5/4] w-full select-none ${className ?? ""}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="relative flex h-full w-full flex-col justify-center">{visuals[slug] ?? visuals["web-application-development"]}</div>
      </div>
    </div>
  );
}
