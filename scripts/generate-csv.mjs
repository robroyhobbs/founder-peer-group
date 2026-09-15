import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const fetched = path.join(root, "data", ".fetched-groups.yaml");
if (!fs.existsSync(fetched)) {
  console.error(
    "data/.fetched-groups.yaml missing. Run `node scripts/fetch-groups.mjs` first."
  );
  process.exit(1);
}

const raw = yaml.load(fs.readFileSync(fetched, "utf8"));
const groups = Array.isArray(raw) ? raw : raw?.groups;
if (!Array.isArray(groups) || groups.length === 0) {
  console.error("fetched groups.yaml is not a non-empty list");
  process.exit(1);
}

function fieldText(v) {
  if (v === null || v === undefined || v === "") return "Not published";
  if (typeof v === "object" && v && "text" in v) return v.text ?? "Not published";
  return String(v);
}

function costDate(g) {
  if (g.annual_cost && typeof g.annual_cost === "object") {
    return g.annual_cost.date ?? g.last_verified ?? "";
  }
  return g.last_verified ?? "";
}

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
  "one_time_cost",
  "headcount_requirement",
  "age_requirement",
  "time_commitment",
  "geography",
  "application_model",
  "venture_specific",
  "best_for",
  "not_for",
  "last_verified",
  "status",
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
    fieldText(g.revenue_floor),
    fieldText(g.other_requirements),
    fieldText(g.annual_cost),
    costDate(g),
    g.one_time_cost ?? "",
    g.headcount_requirement ?? "",
    g.age_requirement ?? "",
    g.time_commitment,
    g.geography,
    g.application_model,
    g.venture_specific,
    g.best_for,
    g.not_for,
    g.last_verified,
    g.status ?? "",
  ]
    .map(escape)
    .join(",")
);

const out = path.join(root, "public", "groups.csv");
fs.writeFileSync(out, [headers.join(","), ...rows].join("\n") + "\n");
console.log(`Wrote ${out} (${groups.length} rows)`);
