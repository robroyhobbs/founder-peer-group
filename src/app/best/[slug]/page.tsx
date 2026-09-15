import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RankingTable } from "@/components/ComparisonTable";
import { JsonLd } from "@/components/JsonLd";
import { LastVerified } from "@/components/LastVerified";
import { SourcesList } from "@/components/SourcesList";
import { getGroups, getSituation, getStage, getStageAlias } from "@/lib/data";
import {
  rankForSituation,
  rankForStage,
  situationAskQuestions,
  situationNeedsCopy,
  situationReason,
  situationShowsFnLink,
  stageAskQuestions,
  stageNeedsCopy,
} from "@/lib/copy";
import {
  SITUATIONS,
  STAGE_ALIASES,
  STAGES,
  type SituationSlug,
  type StageSlug,
} from "@/lib/types";
import { FnLink } from "@/components/FnLink";
import { fnUrl } from "@/lib/utm";

export function generateStaticParams() {
  return [
    ...STAGES.map((s) => ({ slug: s.slug })),
    ...STAGE_ALIASES.map((s) => ({ slug: s.slug })),
    ...SITUATIONS.map((s) => ({ slug: s.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const stage = getStage(slug);
  if (stage) {
    return pageMetadata({
      title: `Best peer group for ${stage.label.toLowerCase()} founders (2026)`,
      description: `Ranked founder peer groups for ${stage.label} (${stage.arrBand}), from verified public data.`,
      path: `/best/${stage.slug}/`,
    });
  }
  const alias = getStageAlias(slug);
  if (alias) {
    return pageMetadata({
      title: `Best peer groups for ${alias.label} founders (2026)`,
      description: `Ranked founder peer groups for ${alias.label} founders. Uses the ${alias.arrBand} evaluation band from verified public data.`,
      path: `/best/${alias.slug}/`,
    });
  }
  const situation = getSituation(slug);
  if (situation) {
    return pageMetadata({
      title: `Best peer group for ${situation.titlePhrase} (2026)`,
      description: `Ranked founder peer groups for ${situation.titlePhrase}, from verified public data.`,
      path: `/best/${situation.slug}/`,
    });
  }
  return { title: "Best peer groups" };
}

function StageRanking({
  stageSlug,
  headingLabel,
  arrBand,
  intro,
  rankingNote,
  pageSlug,
  listName,
}: {
  stageSlug: StageSlug;
  headingLabel: string;
  arrBand: string;
  intro: string;
  rankingNote?: string;
  pageSlug: string;
  listName: string;
}) {
  const groups = getGroups();
  const ranked = rankForStage(stageSlug, groups, 7);
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
    name: listName,
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
      <h1 className="mt-2">Best peer groups for {headingLabel} founders</h1>
      <p className="mt-2">
        <span className="chip">{arrBand}</span>
      </p>
      <p className="mt-4 prose-block text-base leading-relaxed">{intro}</p>
      {rankingNote ? (
        <p className="mt-3 text-sm text-[var(--color-muted)]">{rankingNote}</p>
      ) : null}

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
                  <FnLink
                    href={fnUrl("/", "best", pageSlug)}
                    slug={pageSlug}
                    className="link-quiet"
                  >
                    FounderNexus site
                  </FnLink>
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

export default async function BestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stageMeta = getStage(slug);
  const aliasMeta = getStageAlias(slug);
  const situationMeta = getSituation(slug);
  if (!stageMeta && !aliasMeta && !situationMeta) notFound();

  if (stageMeta) {
    const stageSlug = stageMeta.slug as StageSlug;
    return (
      <StageRanking
        stageSlug={stageSlug}
        headingLabel={stageMeta.label.toLowerCase()}
        arrBand={stageMeta.arrBand}
        intro={stageNeedsCopy(stageSlug)}
        pageSlug={slug}
        listName={`Best peer groups for ${stageMeta.label} founders`}
      />
    );
  }

  if (aliasMeta) {
    const stageSlug = aliasMeta.canonical;
    return (
      <StageRanking
        stageSlug={stageSlug}
        headingLabel={aliasMeta.label}
        arrBand={aliasMeta.arrBand}
        intro={aliasMeta.blurb}
        rankingNote={`Ranking reuses the ${aliasMeta.arrBand} evaluation band (same scoring as the matching ARR-stage page).`}
        pageSlug={slug}
        listName={`Best peer groups for ${aliasMeta.label} founders`}
      />
    );
  }

  const groups = getGroups();
  const situation = situationMeta!;
  const situationSlug = situation.slug as SituationSlug;
  const ranked = rankForSituation(situationSlug, groups, 7);
  const reasons: Record<string, string> = {};
  for (const g of ranked) {
    reasons[g.slug] = situationReason(situationSlug, g);
  }

  const lastVerified =
    ranked
      .map((g) => g.last_verified)
      .sort()
      .reverse()[0] ?? "2026-09-15";

  const showFnLink = ranked.some((g) =>
    situationShowsFnLink(situationSlug, g)
  );

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Best peer groups for ${situation.titlePhrase}`,
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
        Best peer groups for {situation.titlePhrase}
      </h1>
      <p className="mt-2">
        <span className="chip">{situation.label}</span>
      </p>
      <p className="mt-4 prose-block text-base leading-relaxed">
        {situationNeedsCopy(situationSlug)}
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
                  <FnLink href={fnUrl("/", "best", slug)} slug={slug} className="link-quiet">
                    FounderNexus site
                  </FnLink>
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
          {situationAskQuestions(situationSlug).map((q) => (
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
