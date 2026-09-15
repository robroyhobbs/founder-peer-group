import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-[var(--color-border)] bg-white">
      <div className="site-shell flex items-center justify-between gap-6 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 no-underline hover:opacity-90"
          >
            <Image
              src="/brand/mark.png"
              alt=""
              width={32}
              height={32}
              className="h-7 w-7 sm:h-8 sm:w-8 shrink-0"
              priority
            />
            <span className="text-[0.9375rem] font-semibold tracking-tight text-[var(--color-ink)]">
              founderpeergroups
            </span>
          </Link>
          <p className="hidden sm:block border-l border-[var(--color-border)] pl-3 text-xs font-medium text-[var(--color-gray)]">
            Independent peer group reference
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-5 text-sm font-medium text-[var(--color-muted)]">
          <Link href="/best/series-a/" className="no-underline hover:text-[var(--color-ink)]">
            Best for
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
