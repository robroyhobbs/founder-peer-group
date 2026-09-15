import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-page)]">
      <div className="site-shell py-10 text-sm text-[var(--color-muted)]">
        <p className="max-w-2xl leading-relaxed">
          Maintained by the team at{" "}
          <a
            href="https://foundernexus.com"
            className="font-medium text-[var(--color-ink)] underline decoration-[var(--color-border-strong)] hover:text-[var(--color-action)]"
          >
            FounderNexus
          </a>
          . FounderNexus is one group in the dataset, described with the same
          fields and tone as every other row.
        </p>
        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[var(--color-gray)]">
          <Link href="/methodology/" className="hover:text-[var(--color-ink)]">
            Methodology
          </Link>
          <Link href="/data/" className="hover:text-[var(--color-ink)]">
            Full dataset
          </Link>
          <span>© {new Date().getFullYear()} founderpeergroups</span>
        </p>
      </div>
    </footer>
  );
}
