import type { Group, StageSlug } from "./types";
import { STAGES } from "./types";
import { stageFitSummary, stageLabel } from "./data";

export function profileSummary(g: Group): string {
  const founded = g.founded ? ` Founded ${g.founded}.` : "";
  return `${g.name} is a ${g.format} ${g.structure} with ${g.facilitation}.${founded} ${g.best_for}`;
}

export function pairFraming(a: Group, b: Group): string {
  return `${a.name} and ${b.name} are both founder or CEO peer options. This page compares cost, requirements, format, and stage fit using verified public data.`;
}

export function stageVerdict(stage: StageSlug, a: Group, b: Group): string {
  const aFit = a.stage_fit.includes(stage);
  const bFit = b.stage_fit.includes(stage);
  const label = stageLabel(stage);

  if (aFit && bFit) {
    if (a.venture_specific && !b.venture_specific) {
      return `At ${label}, both list this stage. ${a.name} is venture-specific. ${b.name} is broader. The fit is ${a.name} when you want a venture-scale room; ${b.name} when you want a wider peer mix.`;
    }
    if (b.venture_specific && !a.venture_specific) {
      return `At ${label}, both list this stage. ${b.name} is venture-specific. ${a.name} is broader. The fit is ${b.name} when you want a venture-scale room; ${a.name} when you want a wider peer mix.`;
    }
    return `At ${label}, both ${a.name} and ${b.name} list this stage. Compare revenue floor (${a.revenue_floor.text} vs ${b.revenue_floor.text}) and format (${a.format} vs ${b.format}) to decide.`;
  }
  if (aFit && !bFit) {
    return `At ${label}, ${a.name} lists this stage. ${b.name} does not. The fit is ${a.name} for this stage band.`;
  }
  if (!aFit && bFit) {
    return `At ${label}, ${b.name} lists this stage. ${a.name} does not. The fit is ${b.name} for this stage band.`;
  }
  const aNote =
    !a.stage_fit.length
      ? `${a.name} is not framed by VC stage.`
      : `${a.name} targets ${stageFitSummary(a)}.`;
  const bNote =
    !b.stage_fit.length
      ? `${b.name} is not framed by VC stage.`
      : `${b.name} targets ${stageFitSummary(b)}.`;
  return `At ${label}, neither group lists this stage as a primary fit. ${aNote} ${bNote}`;
}

export function alternativesIntro(g: Group): string {
  return `Founders look past ${g.name} when they miss the bar, want a different format, or need a different stage mix. ${g.not_for}`;
}

export function alternativeReason(from: Group, alt: Group): string {
  const parts: string[] = [];
  if (alt.venture_specific !== from.venture_specific) {
    parts.push(
      alt.venture_specific
        ? "venture-specific focus"
        : "broader (not venture-only) membership"
    );
  }
  if (alt.format !== from.format) {
    parts.push(`${alt.format} format vs ${from.format}`);
  }
  if (alt.facilitation !== from.facilitation) {
    parts.push(`${alt.facilitation} vs ${from.facilitation}`);
  }
  if (!alt.stage_fit.length) {
    parts.push("not framed by VC stage");
  } else if (
    alt.stage_fit.some((s) => !from.stage_fit.includes(s)) ||
    from.stage_fit.some((s) => !alt.stage_fit.includes(s))
  ) {
    parts.push(`stage fit: ${stageFitSummary(alt)}`);
  }
  if (parts.length === 0) {
    return `${alt.best_for}`;
  }
  return parts.slice(0, 3).join("; ") + ".";
}

export function scoreAlternative(from: Group, alt: Group): number {
  let score = 0;
  const shared = alt.stage_fit.filter((s) => from.stage_fit.includes(s));
  score += shared.length * 3;
  if (alt.venture_specific === from.venture_specific) score += 2;
  if (alt.format === from.format) score += 1;
  if (alt.structure === from.structure) score += 1;
  // Prefer published cost transparency as a mild signal of comparability
  if (alt.annual_cost.text !== "Not published") score += 1;
  return score;
}

export function rankAlternatives(from: Group, all: Group[], limit = 7): Group[] {
  return all
    .filter((g) => g.slug !== from.slug)
    .map((g) => ({ g, score: scoreAlternative(from, g) }))
    .sort((a, b) => b.score - a.score || a.g.slug.localeCompare(b.g.slug))
    .slice(0, limit)
    .map((x) => x.g);
}

export function stageNeedsCopy(stage: StageSlug): string {
  const meta = STAGES.find((s) => s.slug === stage)!;
  switch (stage) {
    case "pre-seed-seed":
      return `At ${meta.label} (${meta.arrBand}), founders need peers who are still building the first version of the company. The useful peer group is stage-pure enough that advice matches fundraising and hiring reality. Cost must be survivable. Format can be virtual or hybrid. Heavy revenue gates usually exclude this band.`;
    case "series-a":
      return `At ${meta.label} (${meta.arrBand}), founders are installing process without losing speed. Peer rooms help with GTM, first leadership hires, and board dynamics. Groups with a meaningful revenue or funding floor start to fit. Venture-specific rooms matter more here than general CEO forums.`;
    case "growth":
      return `At ${meta.label} (${meta.arrBand}), the job is scaling org design, capital strategy, and executive bench. Peer groups with senior operators and clear confidentiality norms are the fit. Chapter-based global networks become reachable for some. UHNW wealth clubs are usually a different need.`;
    case "late-stage":
      return `At ${meta.label} (${meta.arrBand}), founders face governance, liquidity, and succession questions. Peer fit skews toward high-bar executive networks and wealth-oriented forums when capital, not ops, is the main topic. Venture-stage rooms still help if the company remains venture-paced.`;
  }
}

export function rankForStage(stage: StageSlug, all: Group[], limit = 7): Group[] {
  const withFit = all.filter((g) => g.stage_fit.includes(stage));
  const without = all.filter((g) => !g.stage_fit.includes(stage));
  const sortFit = (list: Group[]) =>
    [...list].sort((a, b) => {
      // Prefer venture-specific for earlier stages; prefer published cost as tiebreak
      let sa = 0;
      let sb = 0;
      if (stage === "pre-seed-seed" || stage === "series-a") {
        if (a.venture_specific) sa += 2;
        if (b.venture_specific) sb += 2;
      }
      if (a.annual_cost.text !== "Not published") sa += 1;
      if (b.annual_cost.text !== "Not published") sb += 1;
      if (sa !== sb) return sb - sa;
      return a.slug.localeCompare(b.slug);
    });
  const ranked = [...sortFit(withFit)];
  // Fill with groups not framed by stage only if we need more context (not as "best")
  if (ranked.length < 5) {
    const fillers = without.filter((g) => !g.stage_fit.length);
    ranked.push(...sortFit(fillers).slice(0, 5 - ranked.length));
  }
  return ranked.slice(0, limit);
}

export function compareFaqs(a: Group, b: Group): { q: string; a: string }[] {
  return [
    {
      q: `How much do ${a.name} and ${b.name} cost?`,
      a: `${a.name}: ${a.annual_cost.text} (verified ${a.annual_cost.date}). ${b.name}: ${b.annual_cost.text} (verified ${b.annual_cost.date}). Prices are shown verbatim from public sources; nothing is estimated.`,
    },
    {
      q: `What are the requirements for ${a.name} vs ${b.name}?`,
      a: `${a.name}: ${a.revenue_floor.text} ${a.other_requirements.text} ${b.name}: ${b.revenue_floor.text} ${b.other_requirements.text}`,
    },
    {
      q: `Which is better for venture-backed founders?`,
      a:
        a.venture_specific && b.venture_specific
          ? `Both ${a.name} and ${b.name} are venture-specific. Compare stage fit (${stageFitSummary(a)} vs ${stageFitSummary(b)}) and format.`
          : a.venture_specific && !b.venture_specific
            ? `${a.name} is venture-specific. ${b.name} is not. The fit is ${a.name} when you want a venture-scale room.`
            : !a.venture_specific && b.venture_specific
              ? `${b.name} is venture-specific. ${a.name} is not. The fit is ${b.name} when you want a venture-scale room.`
              : `Neither ${a.name} nor ${b.name} is marked venture-specific in the dataset. Compare revenue floors and stage fit instead.`,
    },
  ];
}

export function stageAskQuestions(stage: StageSlug): string[] {
  return [
    "What is the real revenue or funding floor, and is it enforced?",
    "Are rooms stage-pure, or mixed across ARR bands?",
    "Is facilitation paid, peer-led, or staff-convened?",
    `Does the time commitment work at ${stageLabel(stage)} pace?`,
    "Is annual cost published before you apply?",
  ];
}
