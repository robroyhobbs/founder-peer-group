"use client";

import { useMemo, useState } from "react";

export type DataRow = {
  slug: string;
  name: string;
  format: string;
  stageFit: string;
  revenueFloor: string;
  annualCost: string;
  ventureSpecific: string;
  lastVerified: string;
};

type Col = keyof Omit<DataRow, "slug">;

const COLS: { key: Col; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "format", label: "Format" },
  { key: "stageFit", label: "Stage fit" },
  { key: "revenueFloor", label: "Revenue / capital floor" },
  { key: "annualCost", label: "Annual cost" },
  { key: "ventureSpecific", label: "Venture-specific" },
  { key: "lastVerified", label: "Last verified" },
];

export function SortableDataTable({ rows }: { rows: DataRow[] }) {
  const [sortKey, setSortKey] = useState<Col>("name");
  const [asc, setAsc] = useState(true);

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      const cmp = String(av).localeCompare(String(bv), undefined, {
        sensitivity: "base",
      });
      return asc ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortKey, asc]);

  function onHeader(key: Col) {
    if (sortKey === key) setAsc(!asc);
    else {
      setSortKey(key);
      setAsc(true);
    }
  }

  return (
    <div className="overflow-x-auto rounded-[var(--radius-card)] border border-[var(--color-border)]">
      <table className="data-table min-w-[56rem]">
        <thead>
          <tr>
            {COLS.map((c) => (
              <th key={c.key} scope="col">
                <button
                  type="button"
                  onClick={() => onHeader(c.key)}
                  className="inline-flex items-center gap-1 font-semibold text-[var(--color-ink)] hover:text-[var(--color-action)]"
                >
                  {c.label}
                  <span className="text-[var(--color-gray)] font-normal">
                    {sortKey === c.key ? (asc ? "↑" : "↓") : ""}
                  </span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((g) => (
            <tr key={g.slug}>
              <td>
                <a href={`/groups/${g.slug}/`} className="font-medium link-quiet">
                  {g.name}
                </a>
              </td>
              <td>{g.format}</td>
              <td>{g.stageFit}</td>
              <td>{g.revenueFloor}</td>
              <td>{g.annualCost}</td>
              <td>{g.ventureSpecific}</td>
              <td>{g.lastVerified}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
