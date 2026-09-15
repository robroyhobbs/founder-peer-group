import type { Group, StageSlug, SituationSlug } from "./types";
import { STAGES, SITUATIONS } from "./types";
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

function fieldBlob(g: Group): string {
  return [
    g.best_for,
    g.not_for,
    g.other_requirements.text,
    g.revenue_floor.text,
  ].join(" ");
}

export function situationNeedsCopy(situation: SituationSlug): string {
  switch (situation) {
    case "first-time-founder":
      return `A first-time founder usually needs peers who still remember the messy early chapters: first hires, first raise, and the gap between advice from operators who have shipped and advice from people who have not. Stage purity matters more than brand. A room mixed with late-stage CEOs can be inspiring and still useless for this week's decision. Cost has to be survivable before the company has durable revenue. Application models that publish floors help you self-select. Venture-specific communities and early-stage rooms are the usual fit when the company is venture-paced. Broad CEO forums with high revenue or headcount bars are usually later. The dataset ranks groups by early stage_fit, venture_specific flags, and published requirements rather than reputation.`;
    case "solo-founder":
      return `A solo founder needs peer accountability that does not assume a co-founder or a deep bench. The useful group is one where confidentiality is real, the cadence is sustainable alone, and the membership bar does not hinge on headcount you do not have. Peer-led forums and curated rooms often fit better than networks built around large executive teams. Venture-specific early-stage options help when the company is institutional-backed. High headcount or multi-executive requirements in the dataset push a group down the list. Wealth clubs and UHNW forums solve a different problem. Rankings here weight early stage_fit, facilitation style, and whether other_requirements imply a large organization.`;
    case "just-raised":
      return `After a raise, the job shifts from convincing capital to deploying it: hiring plan, GTM install, board rhythm, and burn discipline. Peers who have just lived that transition are more useful than general networking. Venture-specific groups and rooms that list Series A or growth stage_fit are the primary filter in this dataset. Facilitated or curated formats help when the questions are operational and time-bound. Groups with empty stage_fit or a wealth-only mandate are usually a mismatch unless the raise also created a personal capital problem. The fit is a stage-aware room that matches post-raise pace, not the largest brand.`;
    case "considering-exit":
      return `A founder considering an exit needs peers who can talk about process, timing, governance, and life after the transaction without turning the room into a deal market. Late-stage and growth stage_fit matter. So do groups whose best_for or not_for language points at liquidity, legacy, wealth, or succession. Venture-stage rooms remain useful when the company is still operating at venture pace through a sale or IPO path. UHNW wealth networks appear when personal capital allocation is the main topic after or during liquidity. The dataset does not invent exit advice; it ranks on stage tags and verbatim fit fields only.`;
    case "venture-backed":
      return `Venture-backed founders operate under institutional expectations: board governance, growth targets, and a financing calendar that lifestyle businesses do not share. The dataset marks some groups venture_specific. Those rise first. Stage_fit across pre-seed through late stage then separates rooms that stay useful as the company scales from communities that stop at the first chapter. Broader CEO forums can still help for facilitation craft or local chapter density, but they are secondary when the primary need is a venture-scale peer mix. Prices stay verbatim from sources; unpublished cost is never estimated.`;
    case "women-founders-leaders":
      return `Women founders and senior leaders often compare peer advisory networks that name women leaders explicitly with broader executive forums that are open on title and stage. This page is Chief-aware because Chief's dataset row states a focus on senior women leaders, including Guide-led Core advisory. It stays neutral: other groups appear when stage_fit, facilitation, and requirements support founder or executive peer work, including rows that note women-specific application exceptions. Early-career communities and pitch-oriented spaces fall away via not_for and requirements fields. The ranking does not claim every listed group is women-only. It shows where the public data points for this search.`;
  }
}

export function scoreForSituation(situation: SituationSlug, g: Group): number {
  const blob = fieldBlob(g);
  switch (situation) {
    case "first-time-founder": {
      let s = 0;
      if (g.stage_fit.includes("pre-seed-seed")) s += 5;
      if (g.stage_fit.includes("series-a")) s += 3;
      if (g.venture_specific) s += 2;
      if (
        g.stage_fit.includes("late-stage") &&
        !g.stage_fit.includes("pre-seed-seed") &&
        !g.stage_fit.includes("series-a")
      ) {
        s -= 2;
      }
      if (!g.stage_fit.length && /UHNW|wealth/i.test(blob)) s -= 5;
      if (/headcount/i.test(blob) && !g.stage_fit.includes("pre-seed-seed"))
        s -= 2;
      if (g.annual_cost.text !== "Not published") s += 1;
      return s;
    }
    case "solo-founder": {
      let s = 0;
      if (g.stage_fit.includes("pre-seed-seed")) s += 4;
      if (g.stage_fit.includes("series-a")) s += 3;
      if (
        g.facilitation === "peer-led" ||
        g.structure === "curated rooms" ||
        g.structure === "peer-led forum"
      ) {
        s += 2;
      }
      if (g.venture_specific) s += 1;
      if (/headcount|employees/i.test(blob)) s -= 3;
      if (!g.stage_fit.length && /UHNW|wealth/i.test(blob)) s -= 4;
      if (g.annual_cost.text !== "Not published") s += 1;
      return s;
    }
    case "just-raised": {
      let s = 0;
      if (g.venture_specific) s += 5;
      if (g.stage_fit.includes("series-a")) s += 4;
      if (g.stage_fit.includes("growth")) s += 3;
      if (g.stage_fit.includes("pre-seed-seed")) s += 2;
      if (
        g.structure === "curated rooms" ||
        g.structure === "facilitated forum"
      ) {
        s += 1;
      }
      if (!g.stage_fit.length && /UHNW|wealth/i.test(blob)) s -= 3;
      if (g.annual_cost.text !== "Not published") s += 1;
      return s;
    }
    case "considering-exit": {
      let s = 0;
      if (g.stage_fit.includes("late-stage")) s += 5;
      if (g.stage_fit.includes("growth")) s += 3;
      if (/exit|legacy|wealth|liquidity|succession|UHNW/i.test(blob)) s += 4;
      if (g.venture_specific && g.stage_fit.includes("late-stage")) s += 2;
      if (!g.stage_fit.length && /UHNW|wealth|legacy/i.test(blob)) s += 4;
      if (g.stage_fit.includes("pre-seed-seed") && !g.stage_fit.includes("late-stage"))
        s -= 2;
      if (g.annual_cost.text !== "Not published") s += 1;
      return s;
    }
    case "venture-backed": {
      let s = 0;
      if (g.venture_specific) s += 8;
      s += g.stage_fit.length;
      if (!g.venture_specific) s -= 2;
      if (g.annual_cost.text !== "Not published") s += 1;
      return s;
    }
    case "women-founders-leaders": {
      let s = 0;
      if (/women/i.test(g.best_for)) s += 14;
      else if (/women/i.test(g.other_requirements.text)) s += 6;
      if (
        g.structure === "facilitated forum" ||
        g.structure === "peer-led forum" ||
        g.structure === "curated rooms"
      ) {
        s += 2;
      }
      if (g.stage_fit.includes("growth") || g.stage_fit.includes("late-stage"))
        s += 2;
      if (g.stage_fit.includes("series-a")) s += 1;
      if (g.venture_specific) s += 1;
      if (!g.stage_fit.length && /UHNW|wealth/i.test(blob) && !/women/i.test(blob))
        s -= 2;
      if (g.annual_cost.text !== "Not published") s += 1;
      return s;
    }
  }
}

export function rankForSituation(
  situation: SituationSlug,
  all: Group[],
  limit = 7
): Group[] {
  return [...all]
    .map((g) => ({ g, score: scoreForSituation(situation, g) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.g.slug.localeCompare(b.g.slug))
    .slice(0, limit)
    .map((x) => x.g);
}

export function situationReason(situation: SituationSlug, g: Group): string {
  const parts: string[] = [];
  switch (situation) {
    case "first-time-founder":
      if (g.stage_fit.includes("pre-seed-seed") || g.stage_fit.includes("series-a")) {
        parts.push(`stage_fit includes ${stageFitSummary(g)}`);
      }
      if (g.venture_specific) parts.push("venture-specific");
      break;
    case "solo-founder":
      parts.push(`${g.facilitation}; ${g.structure}`);
      if (/headcount|employees/i.test(fieldBlob(g))) {
        parts.push("check headcount language in requirements");
      }
      break;
    case "just-raised":
      if (g.venture_specific) parts.push("venture-specific");
      if (g.stage_fit.length) parts.push(`stage_fit: ${stageFitSummary(g)}`);
      break;
    case "considering-exit":
      if (g.stage_fit.includes("late-stage") || g.stage_fit.includes("growth")) {
        parts.push(`stage_fit: ${stageFitSummary(g)}`);
      }
      if (/exit|legacy|wealth|liquidity|succession|UHNW/i.test(fieldBlob(g))) {
        parts.push("fit fields mention capital, legacy, or related themes");
      }
      break;
    case "venture-backed":
      parts.push(
        g.venture_specific
          ? "venture_specific is true"
          : "venture_specific is false; listed for contrast on format or stage"
      );
      if (g.stage_fit.length) parts.push(`stage_fit: ${stageFitSummary(g)}`);
      break;
    case "women-founders-leaders":
      if (/women/i.test(g.best_for)) {
        parts.push("best_for names women leaders");
      } else if (/women/i.test(g.other_requirements.text)) {
        parts.push("other_requirements mention women");
      } else {
        parts.push(`${g.structure}; ${g.facilitation}`);
      }
      break;
  }
  const grounded = parts.length ? parts.join("; ") + ". " : "";
  return `${grounded}${g.best_for}`;
}

export function situationAskQuestions(situation: SituationSlug): string[] {
  const label =
    SITUATIONS.find((s) => s.slug === situation)?.label.toLowerCase() ??
    "this situation";
  return [
    "What is the real revenue, funding, or title floor, and is it enforced?",
    "Are rooms stage-pure, mixed, or not framed by VC stage at all?",
    "Is facilitation paid, peer-led, or staff-convened?",
    `Does the membership bar assume a team shape that does not match ${label}?`,
    "Is annual cost published before you apply?",
  ];
}

export function situationShowsFnLink(
  situation: SituationSlug,
  g: Group
): boolean {
  if (g.slug !== "foundernexus") return false;
  switch (situation) {
    case "venture-backed":
    case "just-raised":
    case "first-time-founder":
    case "solo-founder":
    case "considering-exit":
      return g.venture_specific;
    case "women-founders-leaders":
      return g.venture_specific;
  }
}
