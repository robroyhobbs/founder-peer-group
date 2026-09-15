import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import type {
  ApplicationModel,
  Facilitation,
  Group,
  SourceRef,
  SourcedCost,
  SourcedText,
  StageSlug,
  Structure,
} from "./types";
import { STAGES, STAGE_ALIASES, SITUATIONS } from "./types";

/** Written by scripts/fetch-groups.mjs at build. The repo holds no group data of its own. */
const DATA_PATH = path.join(process.cwd(), "data", ".fetched-groups.yaml");

const STAGE_FROM_FN: Record<string, StageSlug> = {
  S1: "pre-seed-seed",
  S2: "series-a",
  S3: "growth",
  S4: "late-stage",
  "pre-seed-seed": "pre-seed-seed",
  "series-a": "series-a",
  growth: "growth",
  "late-stage": "late-stage",
};

const STRUCTURE_FROM_FN: Record<string, Structure> = {
  "facilitated-forum": "facilitated forum",
  "peer-led-forum": "peer-led forum",
  "curated-rooms": "curated rooms",
  "community-platform": "community platform",
  mastermind: "mastermind",
  "facilitated forum": "facilitated forum",
  "peer-led forum": "peer-led forum",
  "curated rooms": "curated rooms",
  "community platform": "community platform",
};

const FACILITATION_FROM_FN: Record<string, Facilitation> = {
  "paid-facilitator": "paid facilitator",
  "peer-led": "peer-led",
  "staff-convened": "staff-convened",
  "paid facilitator": "paid facilitator",
};

const APPLICATION_FROM_FN: Record<string, ApplicationModel> = {
  open: "open enrollment",
  application: "application",
  "invite-only": "invite-only",
  referral: "referral",
  "open enrollment": "open enrollment",
};

function unpublished(v: unknown): string {
  if (v === null || v === undefined || v === "") return "Not published";
  return String(v);
}

function asSources(raw: unknown): SourceRef[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((s) => ({
      url: String(s?.url ?? ""),
      retrieved: String(s?.retrieved ?? ""),
    }))
    .filter((s) => s.url);
}

function asSourcedText(v: unknown, sources: SourceRef[]): SourcedText {
  if (v && typeof v === "object" && "text" in v) {
    const o = v as { text?: unknown; source?: unknown };
    return { text: unpublished(o.text), source: String(o.source ?? sources[0]?.url ?? "") };
  }
  return { text: unpublished(v), source: sources[0]?.url ?? "" };
}

function asSourcedCost(
  v: unknown,
  sources: SourceRef[],
  lastVerified: string
): SourcedCost {
  if (v && typeof v === "object" && "text" in v) {
    const o = v as { text?: unknown; source?: unknown; date?: unknown };
    return {
      text: unpublished(o.text),
      source: String(o.source ?? sources[0]?.url ?? ""),
      date: String(o.date ?? lastVerified),
    };
  }
  return {
    text: unpublished(v),
    source: sources[0]?.url ?? "",
    date: lastVerified,
  };
}

function asNullableString(v: unknown): string | null {
  if (v === null || v === undefined || v === "") return null;
  return String(v);
}

function normalizeGroup(raw: Record<string, unknown>): Group {
  const sources = asSources(raw.sources);
  const lastVerified = String(raw.last_verified ?? "");
  const stageFit = Array.isArray(raw.stage_fit)
    ? raw.stage_fit
        .map((s) => STAGE_FROM_FN[String(s)])
        .filter((s): s is StageSlug => Boolean(s))
    : [];
  return {
    slug: String(raw.slug ?? ""),
    name: String(raw.name ?? ""),
    founded:
      typeof raw.founded === "number"
        ? raw.founded
        : raw.founded
          ? Number(raw.founded)
          : null,
    format: String(raw.format ?? ""),
    structure: STRUCTURE_FROM_FN[String(raw.structure)] ?? String(raw.structure ?? ""),
    facilitation:
      FACILITATION_FROM_FN[String(raw.facilitation)] ?? String(raw.facilitation ?? ""),
    group_size: unpublished(raw.group_size),
    stage_fit: stageFit,
    revenue_floor: asSourcedText(raw.revenue_floor, sources),
    other_requirements: asSourcedText(raw.other_requirements, sources),
    annual_cost: asSourcedCost(raw.annual_cost, sources, lastVerified),
    one_time_cost: asNullableString(raw.one_time_cost),
    headcount_requirement: asNullableString(raw.headcount_requirement),
    age_requirement: asNullableString(raw.age_requirement),
    verdict_override:
      raw.verdict_override && typeof raw.verdict_override === "object"
        ? (raw.verdict_override as Group["verdict_override"])
        : null,
    time_commitment: unpublished(raw.time_commitment),
    geography: unpublished(raw.geography),
    application_model:
      APPLICATION_FROM_FN[String(raw.application_model)] ??
      String(raw.application_model ?? ""),
    venture_specific: Boolean(raw.venture_specific),
    best_for: unpublished(raw.best_for),
    not_for: unpublished(raw.not_for),
    sources,
    last_verified: lastVerified,
    status: asNullableString(raw.status) ?? undefined,
    notes: asNullableString(raw.notes) ?? undefined,
  };
}

let cached: Group[] | null = null;

export function getGroups(): Group[] {
  if (cached) return cached;
  if (!fs.existsSync(DATA_PATH)) {
    throw new Error(
      "data/.fetched-groups.yaml missing. Run `node scripts/fetch-groups.mjs` with FN_CONTENT_TOKEN set."
    );
  }
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  const parsed = yaml.load(raw);
  const list = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === "object" && Array.isArray((parsed as { groups?: unknown }).groups)
      ? ((parsed as { groups: unknown[] }).groups)
      : null;
  if (!list) {
    throw new Error("fetched groups.yaml is not a list of rows");
  }
  cached = list.map((row) => normalizeGroup(row as Record<string, unknown>));
  if (cached.length === 0) {
    throw new Error("fetched groups.yaml contained zero rows");
  }
  return cached;
}

export function getGroup(slug: string): Group | undefined {
  return getGroups().find((g) => g.slug === slug);
}

export function getStage(slug: string) {
  return STAGES.find((s) => s.slug === slug);
}

export function getStageAlias(slug: string) {
  return STAGE_ALIASES.find((s) => s.slug === slug);
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

export function latestVerified(groups: Group[] = getGroups()): string {
  const dates = groups.map((g) => g.last_verified).filter(Boolean).sort();
  return dates[dates.length - 1] ?? "";
}
