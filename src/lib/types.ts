export type StageSlug =
  | "pre-seed-seed"
  | "series-a"
  | "growth"
  | "late-stage";

export type Format = "in-person" | "virtual" | "hybrid";
export type Structure =
  | "facilitated forum"
  | "peer-led forum"
  | "curated rooms"
  | "community platform"
  | "mastermind";
export type Facilitation =
  | "paid facilitator"
  | "peer-led"
  | "staff-convened";
export type ApplicationModel =
  | "open enrollment"
  | "application"
  | "invite-only"
  | "referral";

export interface SourcedText {
  text: string;
  source: string;
}

export interface SourcedCost {
  text: string;
  source: string;
  date: string;
}

export interface SourceRef {
  url: string;
  retrieved: string;
}

export type FnStage = "S1" | "S2" | "S3" | "S4";

export interface Group {
  slug: string;
  name: string;
  founded: number | null;
  format: Format | string;
  structure: Structure | string;
  facilitation: Facilitation | string;
  group_size: string;
  stage_fit: StageSlug[];
  revenue_floor: SourcedText;
  other_requirements: SourcedText;
  annual_cost: SourcedCost;
  one_time_cost: string | null;
  headcount_requirement: string | null;
  age_requirement: string | null;
  /** Optional map: counterpart slug -> { S1..S4: verdict string }. */
  verdict_override: Partial<Record<string, Partial<Record<FnStage, string>>>> | null;
  time_commitment: string;
  geography: string;
  application_model: ApplicationModel | string;
  venture_specific: boolean;
  best_for: string;
  not_for: string;
  sources: SourceRef[];
  last_verified: string;
  status?: string;
  notes?: string;
}

export interface GroupsFile {
  groups: Group[];
}

export const STAGES: {
  slug: StageSlug;
  label: string;
  arrBand: string;
  description: string;
}[] = [
  {
    slug: "pre-seed-seed",
    label: "Pre-seed and seed",
    arrBand: "Under $2M ARR",
    description:
      "Early-stage founders building toward product-market fit or first meaningful revenue.",
  },
  {
    slug: "series-a",
    label: "Series A",
    arrBand: "$2M to $10M ARR",
    description:
      "Founders scaling past early traction into a repeatable growth engine.",
  },
  {
    slug: "growth",
    label: "Growth",
    arrBand: "$10M to $50M ARR",
    description:
      "Scaleup CEOs managing team, GTM, and capital complexity at once.",
  },
  {
    slug: "late-stage",
    label: "Late stage",
    arrBand: "$50M+ ARR",
    description:
      "Late-stage and pre-IPO operators focused on scale, governance, and exit options.",
  },
];

export type StageAliasSlug = "series-b" | "series-c" | "series-d";

/** Raise-round URL aliases that reuse an ARR-band ranking (no separate stage_fit). */
export const STAGE_ALIASES: {
  slug: StageAliasSlug;
  canonical: StageSlug;
  label: string;
  arrBand: string;
  blurb: string;
}[] = [
  {
    slug: "series-b",
    canonical: "growth",
    label: "Series B",
    arrBand: "$10M to $50M ARR",
    blurb:
      "Series B founders are usually scaling org design, GTM, and capital strategy in the same band as growth-stage companies. This page ranks groups using the $10M to $50M ARR evaluation band.",
  },
  {
    slug: "series-c",
    canonical: "growth",
    label: "Series C",
    arrBand: "$10M to $50M ARR",
    blurb:
      "Series C founders typically sit in the same operating band as growth-stage companies: multi-team complexity, board rhythm, and capital strategy. This page ranks groups using the $10M to $50M ARR evaluation band.",
  },
  {
    slug: "series-d",
    canonical: "late-stage",
    label: "Series D",
    arrBand: "$50M+ ARR",
    blurb:
      "Series D and later founders often face governance, liquidity, and succession questions shared with late-stage operators. This page ranks groups using the $50M+ ARR evaluation band.",
  },
];

export type SituationSlug =
  | "first-time-founder"
  | "solo-founder"
  | "just-raised"
  | "considering-exit"
  | "venture-backed"
  | "women-founders-leaders";

export const SITUATIONS: {
  slug: SituationSlug;
  label: string;
  titlePhrase: string;
  description: string;
}[] = [
  {
    slug: "first-time-founder",
    label: "First-time founder",
    titlePhrase: "a first-time founder",
    description:
      "First company, usually still proving product-market fit or early revenue.",
  },
  {
    slug: "solo-founder",
    label: "Solo founder",
    titlePhrase: "a solo founder",
    description:
      "Founders without a co-founder, who need peer accountability without a large org bar.",
  },
  {
    slug: "just-raised",
    label: "Just raised",
    titlePhrase: "a founder who just raised",
    description:
      "Post-raise operators installing process, hiring, and board rhythm under new capital.",
  },
  {
    slug: "considering-exit",
    label: "Considering an exit",
    titlePhrase: "a founder considering an exit",
    description:
      "Founders weighing liquidity, succession, or sale while still running the company.",
  },
  {
    slug: "venture-backed",
    label: "Venture-backed",
    titlePhrase: "a venture-backed founder",
    description:
      "Companies with institutional venture capital and venture-paced expectations.",
  },
  {
    slug: "women-founders-leaders",
    label: "Women founders and leaders",
    titlePhrase: "women founders and leaders",
    description:
      "Women founders and senior leaders comparing peer advisory and executive networks.",
  },
];
