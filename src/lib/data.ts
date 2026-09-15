import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import type { Group, GroupsFile, StageSlug } from "./types";
import { STAGES, SITUATIONS } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "groups.yaml");

let cached: Group[] | null = null;

export function getGroups(): Group[] {
  if (cached) return cached;
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  const parsed = yaml.load(raw) as GroupsFile;
  cached = parsed.groups ?? [];
  return cached;
}

export function getGroup(slug: string): Group | undefined {
  return getGroups().find((g) => g.slug === slug);
}

export function getStage(slug: string) {
  return STAGES.find((s) => s.slug === slug);
}

export function groupsForStage(stage: StageSlug): Group[] {
  return getGroups().filter((g) => g.stage_fit.includes(stage));
}

/** All unordered pairs, ordered a-vs-b alphabetical by slug. */
export function getAllPairs(): { a: Group; b: Group; pairSlug: string }[] {
  const groups = [...getGroups()].sort((x, y) => x.slug.localeCompare(y.slug));
  const pairs: { a: Group; b: Group; pairSlug: string }[] = [];
  for (let i = 0; i < groups.length; i++) {
    for (let j = i + 1; j < groups.length; j++) {
      const a = groups[i];
      const b = groups[j];
      pairs.push({ a, b, pairSlug: `${a.slug}-vs-${b.slug}` });
    }
  }
  return pairs;
}

export function parsePairSlug(
  pair: string
): { aSlug: string; bSlug: string } | null {
  const idx = pair.indexOf("-vs-");
  if (idx === -1) return null;
  const aSlug = pair.slice(0, idx);
  const bSlug = pair.slice(idx + 4);
  if (!aSlug || !bSlug) return null;
  // Normalize alphabetical order
  if (aSlug.localeCompare(bSlug) > 0) {
    return { aSlug: bSlug, bSlug: aSlug };
  }
  return { aSlug, bSlug };
}

export function costText(g: Group): string {
  return g.annual_cost.text;
}

export function stageLabel(slug: StageSlug | string): string {
  return STAGES.find((s) => s.slug === slug)?.label ?? slug;
}

export function stageFitSummary(g: Group): string {
  if (!g.stage_fit || g.stage_fit.length === 0) {
    return "This group is not framed by VC stage.";
  }
  return g.stage_fit.map(stageLabel).join(", ");
}

export function definitiveSentence(g: Group): string {
  return `${g.name} requires ${g.revenue_floor.text} and costs ${g.annual_cost.text} per year (verified ${g.last_verified}).`;
}

export function toCsv(groups: Group[]): string {
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
  const escape = (v: string | number | boolean | null | undefined) => {
    const s = v === null || v === undefined ? "" : String(v);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const rows = groups.map((g) =>
    [
      g.slug,
      g.name,
      g.founded,
      g.format,
      g.structure,
      g.facilitation,
      g.group_size,
      g.stage_fit.join("; "),
      g.revenue_floor.text,
      g.other_requirements.text,
      g.annual_cost.text,
      g.annual_cost.date,
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
  return [headers.join(","), ...rows].join("\n") + "\n";
}

export function getSituation(slug: string) {
  return SITUATIONS.find((s) => s.slug === slug);
}
