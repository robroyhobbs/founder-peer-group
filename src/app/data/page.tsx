import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { LastVerified } from "@/components/LastVerified";
import { SortableDataTable } from "@/components/SortableDataTable";
import { getGroups, stageFitSummary } from "@/lib/data";

export const metadata: Metadata = {
  title: "Dataset",
  description:
    "Full founder peer group dataset as a sortable table, with CSV download.",
};

export default function DataPage() {
  const groups = [...getGroups()].sort((a, b) => a.slug.localeCompare(b.slug));
  const lastVerified = groups
    .map((g) => g.last_verified)
    .sort()
    .reverse()[0];

  const rows = groups.map((g) => ({
    slug: g.slug,
    name: g.name,
    format: g.format,
    stageFit: stageFitSummary(g),
    revenueFloor: g.revenue_floor.text,
    annualCost: g.annual_cost.text,
    ventureSpecific: g.venture_specific ? "Yes" : "No",
    lastVerified: g.last_verified,
  }));

  const datasetLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Founder peer groups comparison dataset",
    description:
      "Structured fields for founder and CEO peer groups: cost, requirements, stage fit, and format.",
    url: "https://founderpeergroups.com/data/",
    license: "https://founderpeergroups.com/methodology/",
    creator: {
      "@type": "Organization",
      name: "Founder Peer Groups / FounderNexus",
    },
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "text/csv",
        contentUrl: "https://founderpeergroups.com/groups.csv",
      },
    ],
  };

  return (
    <article>
      <JsonLd data={datasetLd} />
      <LastVerified date={lastVerified} />
      <h1 className="mt-2">Dataset</h1>
      <p className="mt-4 prose-block text-base leading-relaxed">
        Full comparison dataset ({groups.length} groups). Prices and floors are
        verbatim from sources.
      </p>
      <p className="mt-5">
        <a href="/groups.csv" className="btn-primary">
          Download groups.csv
        </a>
      </p>

      <div className="mt-10">
        <SortableDataTable rows={rows} />
      </div>
    </article>
  );
}
