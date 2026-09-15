import type { Group } from "@/lib/types";

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Short path-oriented label once the host heading is already shown. */
function pathLabel(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname === "/" ? "" : u.pathname.replace(/\/$/, "");
    if (!path) return u.hostname.replace(/^www\./, "");
    const short = path.length > 56 ? `${path.slice(0, 53)}…` : path;
    return short;
  } catch {
    return url;
  }
}

type SourceItem = { url: string; retrieved: string; name: string };

function groupByHost(items: SourceItem[]): {
  host: string;
  sources: SourceItem[];
}[] {
  const map = new Map<string, SourceItem[]>();
  for (const item of items) {
    const host = hostnameOf(item.url);
    const list = map.get(host);
    if (list) list.push(item);
    else map.set(host, [item]);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([host, sources]) => ({ host, sources }));
}

export function SourcesList({ groups }: { groups: Group[] }) {
  const seen = new Set<string>();
  const items: SourceItem[] = [];
  for (const g of groups) {
    for (const s of g.sources) {
      if (seen.has(s.url)) continue;
      seen.add(s.url);
      items.push({ url: s.url, retrieved: s.retrieved, name: g.name });
    }
  }

  const byHost = groupByHost(items);
  const sourceCount = items.length;
  const siteCount = byHost.length;
  const summaryLabel =
    sourceCount === 0
      ? "No sources listed"
      : `${sourceCount} source${sourceCount === 1 ? "" : "s"} from ${siteCount} site${siteCount === 1 ? "" : "s"}`;

  return (
    <section className="section-gap border-t border-[var(--color-border)] pt-8">
      <h2>Sources</h2>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        Primary public pages used for the fields above.
      </p>
      <details className="mt-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-page)] px-4 py-3">
        <summary className="cursor-pointer select-none text-sm font-medium text-[var(--color-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action)] focus-visible:ring-offset-2">
          {summaryLabel}
        </summary>
        {sourceCount > 0 ? (
          <div className="mt-4 space-y-5 border-t border-[var(--color-border)] pt-4">
            {byHost.map(({ host, sources }) => (
              <div key={host}>
                <h3 className="text-sm font-semibold text-[var(--color-ink)]">
                  {host}
                </h3>
                <ul className="mt-2 space-y-2 text-sm">
                  {sources.map((s) => (
                    <li key={s.url} className="leading-snug">
                      <a
                        href={s.url}
                        className="font-medium text-[var(--color-ink)] underline decoration-[var(--color-border-strong)] hover:text-[var(--color-action)]"
                        title={s.url}
                      >
                        {pathLabel(s.url)}
                      </a>
                      <span className="mt-0.5 block text-xs text-[var(--color-gray)]">
                        Retrieved {s.retrieved}
                        {s.name ? ` · ${s.name}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}
      </details>
    </section>
  );
}
