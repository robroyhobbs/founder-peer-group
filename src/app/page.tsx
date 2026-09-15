import Image from "next/image";
import Link from "next/link";
import { LastVerified } from "@/components/LastVerified";
import { homeMetadata } from "@/lib/seo";
import { getAllPairs, getGroups, latestVerified, stageFitSummary } from "@/lib/data";
import { FEATURED_COMPARE_SLUGS } from "@/lib/featured";
import { SITUATIONS, STAGE_ALIASES, STAGES, type Group } from "@/lib/types";

export const metadata = homeMetadata();

/** Quiet supporting line from dataset fields only (no costs). */
function pairSupportLine(a: Group, b: Group): string {
  if (a.structure !== b.structure) {
    return `${a.structure} vs ${b.structure}`;
  }
  if (a.format !== b.format) {
    return `${a.format} vs ${b.format}`;
  }
  const aFit = stageFitSummary(a);
  const bFit = stageFitSummary(b);
  if (aFit !== bFit) {
    return `${aFit} · ${bFit}`;
  }
  if (a.facilitation !== b.facilitation) {
    return `${a.facilitation} vs ${b.facilitation}`;
  }
  return `${a.structure} · ${a.facilitation}`;
}

export default function HomePage() {
  const groups = getGroups();
  const pairs = getAllPairs();
  const topComparisons = FEATURED_COMPARE_SLUGS.map((slug) =>
    pairs.find((p) => p.pairSlug === slug)
  ).filter(Boolean) as typeof pairs;

  return (
    <div className="space-y-14">
      <LastVerified date={latestVerified(groups)} />
      <section className="hero-panel">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="prose-block min-w-0">
            <p className="chip mb-4">Independent reference · {groups.length} groups</p>
            <h1>Founder and CEO peer groups, compared</h1>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)]">
              Costs, requirements, and stage fit from verified public sources. Every
              claim traces to a field in the dataset. Prices are never estimated.
            </p>
            <p className="mt-5 text-sm leading-relaxed text-[var(--color-muted)]">
              <span className="font-medium text-[var(--color-ink)]">How to use this.</span>{" "}
              Pick a stage, open a comparison, then check the sources on each page.
            </p>
          </div>
          <div
            className="hidden sm:flex shrink-0 items-center justify-center"
            aria-hidden="true"
          >
            <Image
              src="/brand/mark.png"
              alt=""
              width={72}
              height={72}
              className="h-[4.5rem] w-[4.5rem] opacity-90"
              priority
            />
          </div>
        </div>
      </section>

      <section>
        <h2>Start by stage</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Pick the ARR band that matches your company.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {STAGES.map((s) => (
            <li key={s.slug}>
              <Link href={`/best/${s.slug}/`} className="card card-interactive block no-underline">
                <span className="font-semibold text-[var(--color-ink)]">
                  {s.label}
                </span>
                <span className="mt-1 block text-sm text-[var(--color-muted)]">
                  {s.arrBand}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-gray)]">
            By raise round
          </p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {STAGE_ALIASES.map((a, i) => (
              <span key={a.slug}>
                {i > 0 ? <span className="text-[var(--color-gray)]"> · </span> : null}
                <Link href={`/best/${a.slug}/`} className="link-quiet font-medium">
                  {a.label}
                </Link>
              </span>
            ))}
          </p>
        </div>
      </section>

      <section>
        <h2>Start by situation</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Same dataset, ranked for common founder situations.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {SITUATIONS.map((s) => (
            <li key={s.slug}>
              <Link href={`/best/${s.slug}/`} className="card card-interactive block no-underline">
                <span className="font-semibold text-[var(--color-ink)]">
                  {s.label}
                </span>
                <span className="mt-1 block text-sm text-[var(--color-muted)]">
                  {s.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Top comparisons</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {topComparisons.map((p) => (
            <li key={p.pairSlug}>
              <Link
                href={`/compare/${p.pairSlug}/`}
                className="card card-interactive block no-underline"
              >
                <span className="font-semibold text-[var(--color-ink)]">
                  {p.a.name} vs {p.b.name}
                </span>
                <span className="mt-1 block text-sm text-[var(--color-muted)]">
                  {pairSupportLine(p.a, p.b)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-[var(--color-gray)]">
          {pairs.length} pairwise pages generated from the dataset.
        </p>
      </section>

      <section>
        <h3 className="text-base font-semibold text-[var(--color-ink)]">All groups</h3>
        <ul className="mt-3 grid gap-x-5 gap-y-1.5 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <li key={g.slug}>
              <Link href={`/groups/${g.slug}/`} className="font-medium link-quiet">
                {g.name}
              </Link>
              <span className="text-[var(--color-gray)]">
                {" "}
                ·{" "}
                <Link href={`/alternatives/${g.slug}/`} className="link-quiet">
                  alternatives
                </Link>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--color-border)] pt-8 text-sm text-[var(--color-muted)]">
        <Link href="/data/" className="link-quiet">
          Browse the full dataset
        </Link>
        <Link href="/methodology/" className="link-quiet">
          How groups are evaluated
        </Link>
      </section>
    </div>
  );
}

