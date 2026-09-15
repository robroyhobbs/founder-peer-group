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
  time_commitment: string;
  geography: string;
  application_model: ApplicationModel | string;
  venture_specific: boolean;
  best_for: string;
  not_for: string;
  sources: SourceRef[];
  last_verified: string;
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
