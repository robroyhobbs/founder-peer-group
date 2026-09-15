import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RankingTable } from "@/components/ComparisonTable";
import { JsonLd } from "@/components/JsonLd";
import { LastVerified } from "@/components/LastVerified";
import { SourcesList } from "@/components/SourcesList";
import { getGroups, getStage } from "@/lib/data";
import {
  rankForStage,
  stageAskQuestions,
  stageNeedsCopy,
} from "@/lib/copy";
import { STAGES, type StageSlug } from "@/lib/types";
import { fnUrl } from "@/lib/utm";

export function generateStaticParams() {
  return STAGES.map((s) => ({ stage: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ stage: string }>;
}): Promise<Metadata> {
  const { stage } = await params;
  const meta = getStage(stage);
  if (!meta) return { title: "Best peer groups" };
  return {
    title: `Best peer group for ${meta.label.toLowerCase()} founders (2026)`,
    description: `Ranked founder peer groups for ${meta.label} (${meta.arrBand}), from verified public data.`,
  };
}

export default async function BestStagePage({
  params,
}: {
  params: Promise<{ stage: string }>;
}) {
  const { stage } = await params;
  const meta = getStage(stage);
  if (!meta) notFound();
  const stageSlug = meta.slug as StageSlug;

  const ranked = rankForStage(stageSlug, getGroups(), 7);
  const reasons: Record<string, string> = {};
  for (const g of ranked) {
    if (g.stage_fit.includes(stageSlug)) {
      reasons[g.slug] = g.best_for;
    } else if (!g.stage_fit.length) {
      reasons[g.slug] =
        "Not framed by VC stage; listed for context when stage-tagged options are few.";
    } else {
      reasons[g.slug] = g.best_for;
    }
  }

  const lastVerified =
    ranked
      .map((g) => g.last_verified)
      .sort()
      .reverse()[0] ?? "2026-09-15";

  const fnRanked = ranked.find((g) => g.slug === "foundernexus");
  const showFnLink = Boolean(
    fnRanked && fnRanked.stage_fit.includes(stageSlug)
  );

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Best peer groups for ${meta.label} founders`,
    itemListElement: ranked.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: g.name,
      url: `https://founderpeergroups.com/groups/${g.slug}/`,
    })),
  };

  return (
    <article>
      <JsonLd data={itemList} />
      <LastVerified date={lastVerified} />
      <h1 className="mt-2">
        Best peer groups for {meta.label.toLowerCase()} founders
      </h1>
      <p className="mt-2">
        <span className="chip">{meta.arrBand}</span>
      </p>
      <p className="mt-4 prose-block text-base leading-relaxed">
        {stageNeedsCopy(stageSlug)}
      </p>

      <section className="section-gap">
        <h2>Ranked list</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-[0.9375rem] text-[var(--color-muted)]">
          {ranked.map((g) => (
            <li key={g.slug} className="pl-1">
              <Link
                href={`/groups/${g.slug}/`}
                className="font-semibold text-[var(--color-ink)] link-quiet"
              >
                {g.name}
              </Link>
              <span className="text-[var(--color-gray)]"> · </span>
              {reasons[g.slug]}
              {showFnLink && g.slug === "foundernexus" && (
                <>
                  {" "}
                  <a href={fnUrl("/", "best", stage)} className="link-quiet">
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
          <RankingTable groups={ranked} reasons={reasons} />
        </div>
      </section>

      <section className="section-gap prose-block">
        <h2>What to ask before joining</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[0.9375rem] text-[var(--color-muted)]">
          {stageAskQuestions(stageSlug).map((q) => (
            <li key={q} className="pl-1">
              {q}
            </li>
          ))}
        </ol>
      </section>

      <SourcesList groups={ranked} />
    </article>
  );
}
