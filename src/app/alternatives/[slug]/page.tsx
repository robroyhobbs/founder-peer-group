import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ComparisonTable, RankingTable } from "@/components/ComparisonTable";
import { LastVerified } from "@/components/LastVerified";
import { SourcesList } from "@/components/SourcesList";
import { getGroup, getGroups } from "@/lib/data";
import {
  alternativeReason,
  alternativesIntro,
  rankAlternatives,
} from "@/lib/copy";
import { fnUrl } from "@/lib/utm";

export function generateStaticParams() {
  return getGroups().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = getGroup(slug);
  if (!g) return { title: "Alternatives" };
  return pageMetadata({
    title: `Alternatives to ${g.name} (2026)`,
    description: alternativesIntro(g).slice(0, 160),
    path: `/alternatives/${g.slug}/`,
  });
}

export default async function AlternativesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = getGroup(slug);
  if (!g) notFound();

  const alts = rankAlternatives(g, getGroups(), 7);
  const reasons: Record<string, string> = {};
  for (const alt of alts) {
    reasons[alt.slug] = alternativeReason(g, alt);
  }

  const fnInAlts = alts.find((a) => a.slug === "foundernexus");
  const showFnLink = Boolean(fnInAlts) && g.slug !== "foundernexus";

  return (
    <article>
      <LastVerified date={g.last_verified} />
      <h1 className="mt-2">Alternatives to {g.name}</h1>
      <p className="mt-4 prose-block text-base leading-relaxed">
        {alternativesIntro(g)}
      </p>

      <section className="section-gap">
        <h2>Ranked alternatives</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-[0.9375rem] text-[var(--color-muted)]">
          {alts.map((alt) => (
            <li key={alt.slug} className="pl-1">
              <Link
                href={`/groups/${alt.slug}/`}
                className="font-semibold text-[var(--color-ink)] link-quiet"
              >
                {alt.name}
              </Link>
              <span className="text-[var(--color-gray)]"> · </span>
              {reasons[alt.slug]}
              {showFnLink && alt.slug === "foundernexus" && (
                <>
                  {" "}
                  <a
                    href={fnUrl("/", "alternatives", slug)}
                    className="link-quiet"
                  >
                    FounderNexus site
                  </a>
                </>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="section-gap">
        <h2>Comparison table</h2>
        <div className="mt-4">
          <RankingTable groups={alts} reasons={reasons} />
        </div>
      </section>

      <section className="section-gap">
        <h2>
          {g.name} vs the top alternatives
        </h2>
        <div className="mt-4">
          <ComparisonTable groups={[g, ...alts.slice(0, 3)]} />
        </div>
      </section>

      <p className="section-gap text-sm">
        <Link href={`/groups/${g.slug}/`} className="link-quiet">
          Full {g.name} profile
        </Link>
      </p>

      <SourcesList groups={[g, ...alts]} />
    </article>
  );
}
