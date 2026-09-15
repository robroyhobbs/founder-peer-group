import Link from "next/link";
import type { Group } from "@/lib/types";
import { stageFitSummary } from "@/lib/data";

const CORE_FIELDS: { key: string; label: string; render: (g: Group) => string }[] = [
  { key: "format", label: "Format", render: (g) => g.format },
  { key: "structure", label: "Structure", render: (g) => g.structure },
  { key: "facilitation", label: "Facilitation", render: (g) => g.facilitation },
  { key: "group_size", label: "Group size", render: (g) => g.group_size },
  { key: "stage_fit", label: "Stage fit", render: (g) => stageFitSummary(g) },
  {
    key: "revenue_floor",
    label: "Revenue / capital floor",
    render: (g) => g.revenue_floor.text,
  },
  {
    key: "annual_cost",
    label: "Annual cost",
    render: (g) => g.annual_cost.text,
  },
  {
    key: "application_model",
    label: "Application model",
    render: (g) => g.application_model,
  },
  {
    key: "venture_specific",
    label: "Venture-specific",
    render: (g) => (g.venture_specific ? "Yes" : "No"),
  },
];

const EXTRA_FIELDS: { key: string; label: string; render: (g: Group) => string }[] = [
  {
    key: "other_requirements",
    label: "Other requirements",
    render: (g) => g.other_requirements.text,
  },
  {
    key: "time_commitment",
    label: "Time commitment",
    render: (g) => g.time_commitment,
  },
  { key: "geography", label: "Geography", render: (g) => g.geography },
  { key: "best_for", label: "Best for", render: (g) => g.best_for },
  { key: "not_for", label: "Not for", render: (g) => g.not_for },
  {
    key: "last_verified",
    label: "Last verified",
    render: (g) => g.last_verified,
  },
];

function shortCost(text: string): string {
  if (text.length <= 72) return text;
  return `${text.slice(0, 69)}…`;
}

export function ComparisonTable({
  groups,
  linkNames = true,
  density = "full",
}: {
  groups: Group[];
  linkNames?: boolean;
  density?: "core" | "full";
}) {
  const fields = density === "core" ? CORE_FIELDS : [...CORE_FIELDS, ...EXTRA_FIELDS];
  return (
    <div className="overflow-x-auto rounded-[var(--radius-card)] border border-[var(--color-border)]">
      <table className="cmp-table min-w-[36rem]">
        <thead>
          <tr>
            <th scope="col" className="sticky-col">
              Field
            </th>
            {groups.map((g) => (
              <th key={g.slug} scope="col">
                {linkNames ? (
                  <Link href={`/groups/${g.slug}/`} className="link-quiet">
                    {g.name}
                  </Link>
                ) : (
                  g.name
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fields.map((f) => (
            <tr key={f.key}>
              <th scope="row" className="sticky-col">
                {f.label}
              </th>
              {groups.map((g) => (
                <td key={g.slug}>{f.render(g)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RankingTable({
  groups,
  reasons,
}: {
  groups: Group[];
  reasons: Record<string, string>;
}) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius-card)] border border-[var(--color-border)]">
      <table className="data-table min-w-[36rem]">
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Group</th>
            <th scope="col">Cost</th>
            <th scope="col">Stage fit</th>
            <th scope="col">Why listed</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g, i) => (
            <tr key={g.slug}>
              <td className="tabular-nums text-[var(--color-muted)]">{i + 1}</td>
              <td>
                <Link href={`/groups/${g.slug}/`} className="font-medium link-quiet">
                  {g.name}
                </Link>
              </td>
              <td title={g.annual_cost.text}>{shortCost(g.annual_cost.text)}</td>
              <td>{stageFitSummary(g)}</td>
              <td>{reasons[g.slug] ?? g.best_for}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
