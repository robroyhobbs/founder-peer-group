import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ComparisonTable } from "@/components/ComparisonTable";
import { JsonLd } from "@/components/JsonLd";
import { LastVerified } from "@/components/LastVerified";
import { SourcesList } from "@/components/SourcesList";
import { getAllPairs, getGroup, parsePairSlug } from "@/lib/data";
import { compareFaqs, pairFraming, stageVerdict } from "@/lib/copy";
import { STAGES } from "@/lib/types";
import { fnUrl } from "@/lib/utm";

export function generateStaticParams() {
  return getAllPairs().map((p) => ({ pair: p.pairSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>;
}): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parsePairSlug(pair);
  if (!parsed) return { title: "Comparison" };
  const a = getGroup(parsed.aSlug);
  const b = getGroup(parsed.bSlug);
  if (!a || !b) return { title: "Comparison" };
  return pageMetadata({
    title: `${a.name} vs ${b.name}: cost, requirements, and fit by stage (2026)`,
    description: pairFraming(a, b).slice(0, 160),
    path: `/compare/${pair}/`,
  });
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ pair: string }>;
}) {
  const { pair } = await params;
  const parsed = parsePairSlug(pair);
  if (!parsed) notFound();
  const a = getGroup(parsed.aSlug);
  const b = getGroup(parsed.bSlug);
  if (!a || !b) notFound();

  const lastVerified =
    a.last_verified > b.last_verified ? a.last_verified : b.last_verified;
  const faqs = compareFaqs(a, b);

  const fn =
    a.slug === "foundernexus" ? a : b.slug === "foundernexus" ? b : null;
  const fnLinkStage = fn?.stage_fit[0] ?? null;
  const fnOutbound = fn && fnLinkStage ? fnUrl("/", "compare", pair) : null;

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <article>
      <JsonLd data={faqLd} />
      <LastVerified date={lastVerified} />
      <h1 className="mt-2">
        {a.name} vs {b.name}
      </h1>
      <p className="mt-4 prose-block text-base leading-relaxed">
        {pairFraming(a, b)}
      </p>

      <section className="section-gap">
        <h2>Side-by-side</h2>
        <div className="mt-4">
          <ComparisonTable groups={[a, b]} />
        </div>
      </section>

      <section className="section-gap">
        <h2>Verdict by stage</h2>
        <div className="mt-4 space-y-5">
          {STAGES.map((s) => (
            <div key={s.slug} className="prose-block">
              <h3>{s.label}</h3>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed">
                {stageVerdict(s.slug, a, b)}
                {fnOutbound && fnLinkStage === s.slug && (
                  <>
                    {" "}
                    <a href={fnOutbound} className="link-quiet">
                      FounderNexus site
                    </a>
                    .
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-gap">
        <h2>FAQ</h2>
        <dl className="mt-4 space-y-5">
          {faqs.map((f) => (
            <div key={f.q} className="prose-block">
              <dt className="font-semibold text-[var(--color-ink)]">{f.q}</dt>
              <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-[var(--color-muted)]">
                {f.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="section-gap text-sm text-[var(--color-muted)]">
        <Link href={`/groups/${a.slug}/`} className="link-quiet">
          {a.name} profile
        </Link>
        <span className="mx-2 text-[var(--color-gray)]">·</span>
        <Link href={`/groups/${b.slug}/`} className="link-quiet">
          {b.name} profile
        </Link>
      </section>

      <SourcesList groups={[a, b]} />
    </article>
  );
}
