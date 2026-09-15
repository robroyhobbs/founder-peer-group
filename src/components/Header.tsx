import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-[var(--color-border)] bg-white">
      <div className="site-shell flex items-center justify-between gap-6 py-4">
        <div>
          <Link
            href="/"
            className="text-[0.9375rem] font-semibold tracking-tight text-[var(--color-ink)] no-underline hover:text-[var(--color-action)]"
          >
            founderpeergroups
          </Link>
          <p className="mt-0.5 text-xs font-medium text-[var(--color-gray)]">
            Independent peer group reference
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-5 text-sm font-medium text-[var(--color-muted)]">
          <Link href="/best/series-a/" className="no-underline hover:text-[var(--color-ink)]">
            By stage
          </Link>
          <Link href="/data/" className="no-underline hover:text-[var(--color-ink)]">
            Data
          </Link>
          <Link href="/methodology/" className="no-underline hover:text-[var(--color-ink)]">
            Methodology
          </Link>
        </nav>
      </div>
    </header>
  );
}
