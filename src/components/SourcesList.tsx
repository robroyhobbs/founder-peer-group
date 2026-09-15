import type { Group } from "@/lib/types";

export function SourcesList({ groups }: { groups: Group[] }) {
  const seen = new Set<string>();
  const items: { url: string; retrieved: string; name: string }[] = [];
  for (const g of groups) {
    for (const s of g.sources) {
      if (seen.has(s.url)) continue;
      seen.add(s.url);
      items.push({ url: s.url, retrieved: s.retrieved, name: g.name });
    }
  }
  return (
    <section className="section-gap border-t border-[var(--color-border)] pt-8">
      <h2>Sources</h2>
      <ul className="mt-4 space-y-2 text-sm text-[var(--color-muted)]">
        {items.map((s) => (
          <li key={s.url} className="leading-snug">
            <a href={s.url} className="link-quiet break-all">
              {s.url}
            </a>
            <span className="text-[var(--color-gray)]">
              {" "}
              · retrieved {s.retrieved} · via {s.name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
