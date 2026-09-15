import Image from "next/image";
import Link from "next/link";
import { homeMetadata } from "@/lib/seo";
import { getAllPairs, getGroups } from "@/lib/data";
import { SITUATIONS, STAGES } from "@/lib/types";

export const metadata = homeMetadata();

export default function HomePage() {
  const groups = getGroups();
  const pairs = getAllPairs();
  const topComparisons = [
    "hampton-vs-vistage",
    "eo-vs-ypo",
    "foundernexus-vs-hampton",
    "vistage-vs-ypo",
    "foundernexus-vs-vistage",
    "chief-vs-hampton",
  ]
    .map((slug) => pairs.find((p) => p.pairSlug === slug))
    .filter(Boolean) as typeof pairs;

  return (
    <div className="space-y-14">
      <section className="hero-panel">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="prose-block min-w-0">
            <p className="chip mb-4">Independent reference · {groups.length} groups</p>
            <h1>Founder and CEO peer groups, compared</h1>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)]">
              Costs, requirements, and stage fit from verified public sources. Every
              claim traces to a field in the dataset. Prices are never estimated.
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
        <div
          className="mt-6 flex items-center gap-3 border-t border-[var(--color-border)] pt-5"
          aria-hidden="true"
        >
          <Image src="/brand/mark.png" alt="" width={22} height={22} className="h-[22px] w-[22px] opacity-50" />
          <Image src="/brand/mark.png" alt="" width={22} height={22} className="h-[22px] w-[22px] opacity-35" />
          <Image src="/brand/mark.png" alt="" width={22} height={22} className="h-[22px] w-[22px] opacity-20" />
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
        <ul className="mt-4 space-y-2">
          {topComparisons.map((p) => (
            <li key={p.pairSlug}>
              <Link href={`/compare/${p.pairSlug}/`} className="link-quiet text-[0.9375rem]">
                {p.a.name} vs {p.b.name}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-[var(--color-gray)]">
          {pairs.length} pairwise pages generated from the dataset.
        </p>
      </section>

      <section>
        <h2>All groups</h2>
        <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
          {groups.map((g) => (
            <li key={g.slug} className="text-[0.9375rem]">
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
