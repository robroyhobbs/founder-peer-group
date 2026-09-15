import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ComparisonTable } from "@/components/ComparisonTable";
import { JsonLd } from "@/components/JsonLd";
import { LastVerified } from "@/components/LastVerified";
import { SourcesList } from "@/components/SourcesList";
import {
  definitiveSentence,
  getAllPairs,
  getGroup,
  getGroups,
  stageFitSummary,
} from "@/lib/data";
import { profileSummary } from "@/lib/copy";
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
  if (!g) return { title: "Group not found" };
  const title = `${g.name}: cost, requirements, and fit (2026)`;
  const description = profileSummary(g).slice(0, 160);
  return pageMetadata({
    title,
    description,
    path: `/groups/${g.slug}/`,
  });
}

export default async function GroupProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = getGroup(slug);
  if (!g) notFound();

  const pairs = getAllPairs()
    .filter((p) => p.a.slug === slug || p.b.slug === slug)
    .slice(0, 3);

  const isFn = g.slug === "foundernexus";
  const applyUrl = isFn ? fnUrl("/", "profile", slug) : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: g.name,
    description: g.best_for,
    foundingDate: g.founded ? String(g.founded) : undefined,
    url: `https://founderpeergroups.com/groups/${g.slug}/`,
  };

  return (
    <article>
      <JsonLd data={jsonLd} />
      <LastVerified date={g.last_verified} />
      <h1 className="mt-2">{g.name}</h1>
      <p className="mt-4 prose-block text-base leading-relaxed">
        {profileSummary(g)}
      </p>
      <p className="mt-3 prose-block text-sm text-[var(--color-muted)]">
        {definitiveSentence(g)}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="chip">{g.format}</span>
        <span className="chip">{g.structure}</span>
        <span className="chip">{g.application_model}</span>
        {g.venture_specific && <span className="chip">Venture-specific</span>}
      </div>

      <section className="section-gap">
        <h2>Fit snapshot</h2>
        <div className="mt-4">
          <ComparisonTable groups={[g]} linkNames={false} density="core" />
        </div>
      </section>

      <section className="section-gap prose-block">
        <h2>Who it is for</h2>
        <p className="mt-3">{g.best_for}</p>
        <p className="mt-2 text-sm">
          Stage fit: {stageFitSummary(g)}
        </p>
      </section>

      <section className="section-gap prose-block">
        <h2>Who it is not for</h2>
        <p className="mt-3">{g.not_for}</p>
      </section>

      <section className="section-gap prose-block">
        <h2>How to apply</h2>
        <p className="mt-3">
          Application model: {g.application_model}. {g.other_requirements.text}
        </p>
        {applyUrl && (
          <p className="mt-4">
            <a href={applyUrl} className="btn-primary">
              Apply on FounderNexus
            </a>
          </p>
        )}
      </section>

      <section className="section-gap">
        <h2>Related</h2>
        <ul className="mt-3 space-y-2 text-[0.9375rem]">
          <li>
            <Link href={`/alternatives/${g.slug}/`} className="link-quiet">
              Alternatives to {g.name}
            </Link>
          </li>
          {pairs.map((p) => (
            <li key={p.pairSlug}>
              <Link href={`/compare/${p.pairSlug}/`} className="link-quiet">
                {p.a.name} vs {p.b.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <SourcesList groups={[g]} />
    </article>
  );
}
