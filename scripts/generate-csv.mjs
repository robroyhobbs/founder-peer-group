import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const raw = fs.readFileSync(path.join(root, "data", "groups.yaml"), "utf8");
const { groups } = yaml.load(raw);

const headers = [
  "slug",
  "name",
  "founded",
  "format",
  "structure",
  "facilitation",
  "group_size",
  "stage_fit",
  "revenue_floor",
  "other_requirements",
  "annual_cost",
  "annual_cost_date",
  "time_commitment",
  "geography",
  "application_model",
  "venture_specific",
  "best_for",
  "not_for",
  "last_verified",
];

function escape(v) {
  const s = v === null || v === undefined ? "" : String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const rows = groups.map((g) =>
  [
    g.slug,
    g.name,
    g.founded,
    g.format,
    g.structure,
    g.facilitation,
    g.group_size,
    (g.stage_fit || []).join("; "),
    g.revenue_floor?.text,
    g.other_requirements?.text,
    g.annual_cost?.text,
    g.annual_cost?.date,
    g.time_commitment,
    g.geography,
    g.application_model,
    g.venture_specific,
    g.best_for,
    g.not_for,
    g.last_verified,
  ]
    .map(escape)
    .join(",")
);

const out = path.join(root, "public", "groups.csv");
fs.writeFileSync(out, [headers.join(","), ...rows].join("\n") + "\n");
console.log(`Wrote ${out} (${groups.length} rows)`);
