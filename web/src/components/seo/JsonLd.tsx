/**
 * Structured data. `<` is escaped so content can never close the script tag.
 * Browsers don't execute application/ld+json, so CSP script rules don't apply.
 */
export function JsonLd({ data }: { data: object | null | (object | null)[] }) {
  const items = (Array.isArray(data) ? data : [data]).filter(Boolean);
  if (items.length === 0) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(items.length === 1 ? items[0] : items).replace(/</g, "\\u003c"),
      }}
    />
  );
}
