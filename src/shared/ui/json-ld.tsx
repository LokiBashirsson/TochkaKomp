/**
 * Structured data emitter.
 *
 * `JSON.stringify` output is escaped for `<` so a product name containing
 * markup cannot break out of the script tag.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
