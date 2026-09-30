/**
 * Decorative hero illustration: the three things Skaylon builds, as stylised
 * UI (a web dashboard, a phone app and an API response) layered together.
 * Pure HTML/CSS, aria-hidden, no images and no JS, so it costs nothing for
 * LCP, crawlers or screen readers. The motion is CSS only and stops under
 * prefers-reduced-motion (globals.css).
 *
 * Every string in it is CSS generated content (`<T t="…" />`), not text
 * nodes, so search engines and AI crawlers never read the mock UI as page
 * copy.
 */
function T({ t, className }: { t: string; className?: string }) {
  return <span data-t={t} className={`gen-text ${className ?? ""}`} />;
}

export function ProductStack({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`product-stack relative mx-auto aspect-[5/4] w-full max-w-[36rem] select-none ${className ?? ""}`}>
      {/* Browser window with a dashboard */}
      <div className="ps-float-a absolute top-[6%] left-0 w-[82%] overflow-hidden rounded-xl border hairline bg-surface shadow-[0_40px_80px_-40px_rgb(20_22_26/0.45)]">
        <div className="flex items-center gap-1.5 border-b hairline bg-paper px-3 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#e8b4a0]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ead9b8]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#c9d8c5]" />
          <span className="ml-3 h-4 flex-1 rounded bg-paper-2" />
        </div>
        <div className="grid grid-cols-[4.5rem_1fr] gap-3 p-3">
          <div className="space-y-2">
            <span className="block h-2.5 w-full rounded bg-ink" />
            <span className="block h-2 w-4/5 rounded bg-line" />
            <span className="block h-2 w-3/5 rounded bg-line" />
            <span className="block h-2 w-4/5 rounded bg-line" />
            <span className="block h-2 w-2/5 rounded bg-line" />
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
            <div className="flex h-24 items-end gap-1.5 rounded-lg border hairline p-2">
              {[38, 55, 46, 70, 62, 84, 58, 92, 76, 88].map((h, i) => (
                <span
                  key={i}
                  className="ps-bar flex-1 rounded-sm bg-accent/80"
                  style={{ height: `${h}%`, "--i": i } as React.CSSProperties}
                />
              ))}
            </div>
            <div className="space-y-1.5">
              <span className="block h-2 w-full rounded bg-line" />
              <span className="block h-2 w-5/6 rounded bg-line" />
            </div>
          </div>
        </div>
      </div>

      {/* Phone */}
      <div className="ps-float-b absolute right-[2%] bottom-[2%] w-[30%] rounded-[1.4rem] border-[5px] border-ink bg-surface p-2 shadow-[0_40px_70px_-30px_rgb(20_22_26/0.55)]">
        <span className="mx-auto block h-1.5 w-8 rounded-full bg-ink" />
        <span className="mt-3 block h-14 rounded-lg bg-gradient-to-br from-accent to-accent-ink" />
        <div className="mt-2 space-y-1.5">
          <span className="block h-2 w-4/5 rounded bg-ink-2" />
          <span className="block h-1.5 w-full rounded bg-line" />
          <span className="block h-1.5 w-3/4 rounded bg-line" />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          <span className="h-8 rounded-md bg-paper-2" />
          <span className="h-8 rounded-md bg-paper-2" />
        </div>
        <span className="mt-3 block h-5 rounded-md bg-ink" />
      </div>

      {/* API response */}
      <div className="ps-float-c absolute top-[54%] left-[8%] w-[46%] rounded-xl bg-ink p-3 font-mono text-[0.6rem] leading-relaxed text-paper/80 shadow-[0_30px_60px_-30px_rgb(20_22_26/0.6)] sm:text-[0.68rem]">
        <div className="flex items-center gap-2">
          <T t="GET" className="rounded bg-success/30 px-1.5 py-0.5 text-[#9fd8b4]" />
          <T t="/api/orders" className="text-paper/60" />
          <T t="200" className="ml-auto text-[#9fd8b4]" />
        </div>
        <div className="mt-2">
          <T t="{" className="text-paper/40" />
          <div className="pl-3">
            <T t={'"status": '} className="text-accent" />
            <T t={'"shipped",'} className="text-[#9fd8b4]" />
          </div>
          <div className="pl-3">
            <T t={'"items": '} className="text-accent" />
            <T t="3" className="text-paper" />
            <span className="ps-caret ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-paper/70" />
          </div>
          <T t="}" className="text-paper/40" />
        </div>
      </div>

      {/* Status chip */}
      <div className="ps-float-a absolute top-0 right-[6%] flex items-center gap-2 rounded-full border hairline bg-surface px-3 py-1.5 text-[0.7rem] font-medium text-ink-2 shadow-sm">
        <span className="ps-pulse relative h-2 w-2 rounded-full bg-success" />
        <T t="Deployed to staging" />
      </div>
    </div>
  );
}
