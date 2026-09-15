import type { Group } from "@/lib/types";

function sourceLabel(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    const path = u.pathname === "/" ? "" : u.pathname.replace(/\/$/, "");
    const short =
      path.length > 48 ? `${path.slice(0, 45)}…` : path;
    return short ? `${host}${short}` : host;
  } catch {
    return url;
  }
}

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
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        Primary public pages used for the fields above.
      </p>
      <ul className="mt-4 space-y-3 text-sm">
        {items.map((s) => (
          <li key={s.url} className="leading-snug">
            <a
              href={s.url}
              className="font-medium text-[var(--color-ink)] underline decoration-[var(--color-border-strong)] hover:text-[var(--color-action)]"
              title={s.url}
            >
              {sourceLabel(s.url)}
            </a>
            <span className="mt-0.5 block text-xs text-[var(--color-muted)]">
              Retrieved {s.retrieved} · {s.name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
