import Image from "next/image";
import Link from "next/link";
import { FnLink } from "@/components/FnLink";
import { fnUrl } from "@/lib/utm";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-page)]">
      <div className="site-shell py-10 text-sm text-[var(--color-muted)]">
        <div className="flex items-start gap-3">
          <Image
            src="/brand/mark.png"
            alt=""
            width={24}
            height={24}
            className="mt-0.5 h-5 w-5 shrink-0 opacity-80"
          />
          <p className="max-w-2xl leading-relaxed">
            Maintained by the team at{" "}
            <FnLink
              href={fnUrl("/", "footer", "disclosure")}
              slug="footer"
              className="font-medium text-[var(--color-ink)] underline decoration-[var(--color-border-strong)] hover:text-[var(--color-action)]"
            >
              FounderNexus
            </FnLink>
            . FounderNexus is one group in the dataset, described with the same
            fields and tone as every other row.
          </p>
        </div>
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
