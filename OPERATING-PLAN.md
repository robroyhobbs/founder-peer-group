# founderpeergroups.com: Operating Plan

Owner: FounderNexus marketing (Grumpy). Day-to-day operator: grokbot. Version 1.0, 2026-09-15.

This document is the complete instruction set for building and running founderpeergroups.com, the third FounderNexus traffic site (after founderdecisions.com and founderratio.com). It covers strategy, site design, content rules, distribution, the handoff to foundernexus.com, the daily cadence, and the hard rules. If an instruction here conflicts with the FounderNexus content standards or engagement guardrails in `foundernexus-content`, those files win and the conflict gets escalated.

---

## 1. TL;DR

| Item | Answer |
|---|---|
| What it is | An independent, factual comparison site for founder and CEO peer groups (Vistage, YPO, EO, Hampton, Pavilion, Chief, Tiger 21, FounderNexus, and others) |
| Why it exists | A founder searching "Vistage alternatives" or "best peer group for Series A founders" is at the exact moment FounderNexus wants to be seen. That query is rare, high-value, and nobody serves it honestly |
| How it wins traffic | Programmatic pages built from one structured dataset (pairwise comparisons, alternatives pages, best-for-stage pages, group profiles), plus AEO so LLMs cite the tables |
| How it drives clicks to FN | FounderNexus appears as a row in every table and as the recommended fit only where the data supports it. One contextual link per page, UTM-tagged. No banners, no sponsorship framing |
| Success in 30 days | 100+ indexed pages, first impressions in Search Console, first UTM-tracked clicks to foundernexus.com, at least one LLM citation observed |
| Success in 90 days | 5,000+ monthly impressions, 3%+ CTR to FN from comparison pages, 3+ applications attributed to the site |

---

## 2. Strategy

### 2.1 Thesis

FounderNexus's Growth Doctrine says: qualify, don't volume. Broad reference content fails the narrow-TAM test; comparison and alternatives pages pass it. A founder comparing peer groups has already decided they want peers. The only questions left are which group and whether they qualify. That is a buyer-moment query, and it is the one FounderNexus can be the single best answer to.

### 2.2 What this site is and is not

| Is | Is not |
|---|---|
| A neutral reference that a founder would bookmark even if FounderNexus did not exist | A FounderNexus microsite with a thin comparison veneer |
| Data-first: every claim traces to a field in the dataset with a source URL and a date | Editorial opinion about competitors |
| Stage-aware: pages are organized by founder stage (ARR band), because that is how founders actually shop | Geography-first or industry-first |
| A citation target for LLMs answering "which founder peer group should I join" | A blog, newsletter, or podcast (the Doctrine parks those) |

### 2.3 Why a separate domain

Comparison content on foundernexus.com reads as self-serving and gets discounted by readers and by search. A separate domain with real utility earns links and citations that a vendor page cannot. The cost is that the site must be independently useful or Google will treat it as a doorway. Section 9 covers the rules that keep it on the right side of that line.

### 2.4 Position of FounderNexus on the site

FounderNexus is one row in the dataset, described with the same fields and the same tone as every other group. Where FounderNexus is a genuine fit (venture-scale, Stage 1 to 4 by ARR, wants stage-pure peer rooms around live decisions), the page says so plainly. Where it is not a fit (lifestyle businesses, sub-$1M ARR services firms, founders who want a paid facilitator), the page recommends someone else. This is the whole credibility model. If the site ever recommends FounderNexus where the data does not support it, the site stops working.

---

## 3. Goals and metrics

| Metric | Source | 30-day target | 90-day target |
|---|---|---|---|
| Indexed pages | Search Console | 100 | 250 |
| Search impressions / month | Search Console | 500 | 5,000 |
| Search clicks / month | Search Console | 25 | 300 |
| Clicks to foundernexus.com | GA4 on FN, utm_source=founderpeergroups | 10 | 150 |
| CTR to FN from comparison pages | Site analytics (outbound click / pageview) | 2% | 3% |
| LLM citations observed | Weekly manual check (ChatGPT, Claude, Perplexity, Gemini, Grok) | 1 | 5 prompts consistently citing |
| Applications attributed | Attio, source field | 0 | 3 |
| Referring domains | Search Console links report | 3 | 15 |

Vanity metrics that do not count: total pageviews without a source, social impressions that do not produce site visits, pages published that are not indexed.

---

## 4. Site architecture

### 4.1 Page types

| Page type | URL pattern | Count at launch | Purpose | Primary query shape |
|---|---|---|---|---|
| Group profile | /groups/{slug} | 15 to 20 | One page per group: all dataset fields, who it fits, who it does not, verified pricing, application process | "{group} review", "{group} cost", "{group} requirements" |
| Pairwise comparison | /compare/{a}-vs-{b} | ~100 (all pairs of 15 groups) | Side-by-side table plus a 300-word verdict by founder stage | "{a} vs {b}" |
| Alternatives | /alternatives/{slug} | 15 to 20 | "Alternatives to {group}" ranked by fit for the reader's stage | "{group} alternatives", "groups like {group}" |
| Best for stage | /best/{stage-slug} | 6 to 10 | "Best peer group for pre-seed founders", "for Series A founders", "for $10M ARR founders" | "best founder peer group for {stage}" |
| Best for situation | /best/{situation-slug} | 10 to 15 | "Best peer group for a first-time founder", "for a solo founder", "for a founder who just raised", "for a founder considering an exit" | "founder peer group for {situation}" |
| Methodology | /methodology | 1 | How groups are evaluated, how data is sourced, how FounderNexus's involvement is disclosed | Trust page, also for LLM grounding |
| Data | /data | 1 | The full dataset as a sortable table plus CSV download | Link magnet |
| Home | / | 1 | Stage selector that routes to the right best-for page, plus the top comparisons | Navigation |

### 4.2 Stage taxonomy

Use FounderNexus's ARR bands as the spine, but label pages in the language founders search for.

| Site label | FN stage | ARR band | Common search terms |
|---|---|---|---|
| Pre-seed and seed | Stage 1 | Under $2M ARR | "early stage founder", "seed founder", "pre-revenue" |
| Series A | Stage 2 | $2M to $10M ARR | "Series A founder", "scaling startup CEO" |
| Growth | Stage 3 | $10M to $50M ARR | "growth stage CEO", "scaleup founder" |
| Late stage | Stage 4 | $50M+ ARR | "late stage CEO", "pre-IPO founder" |

### 4.3 Tech

| Layer | Choice | Note |
|---|---|---|
| Framework | Next.js static export, same pattern as the other two traffic sites | One `groups.yaml` file drives every page |
| Hosting | Vercel | Domain purchase there is $11.25/yr |
| Analytics | GA4 plus Search Console; outbound click events on every FN link | Do not add the FN GTM container here; keep properties separate |
| Sitemap and robots | Auto-generated sitemap; all pages indexable | No noindex anywhere except /admin if one exists |
| Schema | `ItemList` on best-for pages, `Organization` on profiles, `FAQPage` where an FAQ block exists, `Dataset` on /data | This is what earns LLM citations |

---

## 5. Dataset

### 5.1 Schema (`groups.yaml`)

Every page is a rendering of this file. If a fact is not in this file, it does not appear on the site.

| Field | Type | Rule |
|---|---|---|
| slug | string | URL-safe |
| name | string | Official name |
| founded | year | From the group's own site or a reputable profile |
| format | enum | in-person, virtual, hybrid |
| structure | enum | facilitated forum, peer-led forum, curated rooms, community platform, mastermind |
| facilitation | enum | paid facilitator, peer-led, staff-convened |
| group_size | string | e.g. "8 to 12" |
| stage_fit | list of stage slugs | Which of the four stages the group actually serves |
| revenue_floor | string plus source URL | Stated minimum revenue or funding, verbatim from the source |
| other_requirements | string plus source | Age caps, title requirements, referral requirements |
| annual_cost | string plus source plus date | Verbatim public pricing. If not public, write "Not published" and never estimate |
| time_commitment | string | Meetings per month, retreats per year |
| geography | string | Chapters, cities, or "global virtual" |
| application_model | enum | open enrollment, application, invite-only, referral |
| venture_specific | bool | Does the group specialize in venture-backed companies |
| best_for | string, 1 sentence | The honest fit statement |
| not_for | string, 1 sentence | The honest non-fit statement |
| sources | list of URLs with retrieval dates | Every field with a source tag points here |
| last_verified | date | grokbot updates this on each verification pass |

### 5.2 Initial group list

Populate these first. Every cost and requirement field must be verified from the group's own site before publishing; nothing below is to be published from memory.

| Group | Why included |
|---|---|
| FounderNexus | The row that matters |
| Vistage | Largest CEO peer group brand; highest query volume |
| YPO | Global, age and revenue gated; heavy comparison traffic with EO and Vistage |
| EO (Entrepreneurs' Organization) | Most common "YPO vs EO" pairing |
| Hampton | Closest venture-scale competitor; strong search interest |
| Pavilion | GTM-leader community that founders compare against |
| Chief | Executive women's network; frequently compared |
| Tiger 21 | High net worth peer group; useful for late-stage comparison |
| Founders Network | Tech founder peer group; direct overlap |
| On Deck (ODF) | Founder fellowship; residual search volume |
| South Park Commons | Pre-idea and early-stage community |
| Techstars and YC alumni networks | Founders ask whether accelerator alumni networks substitute for a peer group |
| Enterprise Sales Forum / SaaStr community | Included only if the data supports classifying them as peer groups; otherwise drop |
| Local groups (Seattle, SF, NYC, LA, Austin) | Add one per city where a credible local peer group exists |

Add a group when it appears in three or more comparison queries in Search Console or when a founder asks about it. Remove nothing; mark defunct groups as inactive.

---

## 6. Content generation rules

### 6.1 Templates

Each page type has one template. grokbot fills templates from `groups.yaml`; it does not write freehand pages.

| Page type | Required blocks, in order |
|---|---|
| Group profile | Summary line; fit table (stage_fit, revenue_floor, cost, format); "Who it is for"; "Who it is not for"; how to apply; last verified date; sources |
| Pairwise | One-sentence framing of the two groups; side-by-side table of all fields; verdict by stage (four short paragraphs, one per stage); FAQ (3 questions); sources |
| Alternatives | Why someone leaves or does not qualify for {group}; ranked list of 5 to 7 alternatives with a one-line reason each; comparison table; sources |
| Best for stage | What this stage needs from a peer group (150 words); ranked list of 5 to 7 with reasons; table; "What to ask before joining" (5 questions); sources |
| Best for situation | Same as stage, framed around the situation |

### 6.2 Voice

Straight, restrained, specific. The FounderNexus content standards apply. No superlatives that are not backed by a dataset field. No adjectives about competitors. Write like a reference desk, not a reviewer. Sentences short. No em dashes. No emojis. Second person is fine ("if you are at $3M ARR"). Never "we recommend"; write "the fit is" or "the data points to".

### 6.3 Freshness

| Cadence | Action |
|---|---|
| Every 30 days | Re-verify cost and requirements for every group; update `last_verified` |
| On any change | Regenerate all pages that reference the changed group |
| Every page | Shows the `last_verified` date visibly near the top |

### 6.4 Volume rules

Publish in batches of 10 to 20 pages, not all at once. Launch order: methodology, data, 15 profiles, the 10 highest-volume pairwise pages, 4 stage pages. Then 10 to 15 pages per week until the matrix is complete. After that, growth comes from adding groups and situations, not from thinner variants of existing pages.

---

## 7. How impressions and clicks get generated

### 7.1 Search (primary)

| Lever | What grokbot does |
|---|---|
| Query targeting | Each page targets one head query and 3 to 5 variants, listed in the page's frontmatter. Pull candidates from Search Console every week once data exists; before that, from the query shapes in section 4.1 |
| Title and meta | Title is the query, plainly. "Vistage vs YPO: cost, requirements, and fit by stage (2026)". Meta description states the verdict in one sentence |
| Internal linking | Every profile links to its alternatives page and its 3 most-searched pairwise pages. Every pairwise page links to both profiles and to the stage pages. Every stage page links to every profile it ranks |
| Year in title | Add the current year to comparison titles and update it in January |
| Cannibalization check | One query, one page. If two pages target the same head query, merge them |

### 7.2 AEO (LLM citation)

| Lever | What grokbot does |
|---|---|
| Structured tables | Every comparison is a real HTML table, not a div grid. LLMs extract tables |
| Definitive sentences | Each page has one sentence per group of the form "{Group} requires {X} and costs {Y} per year (verified {date})" |
| Schema markup | As in section 4.3 |
| Methodology page | States sourcing, disclosure, and update cadence; LLMs use it to decide whether to trust the site |
| /data CSV | A downloadable dataset is the single most-cited asset type in this category |
| Weekly citation check | Run the 10 tracked prompts in section 11 across five LLMs; log which sites are cited; adjust pages that lose |

### 7.3 Distribution (secondary, human-gated)

The FounderNexus engagement guardrails apply. grokbot drafts; a person posts.

| Channel | Play | Gate |
|---|---|---|
| LinkedIn (Karin, FN team account) | One post per week: a single comparison finding, stated as a fact, linking to the page. Not from Court's account | Human posts |
| Reddit (r/startups, r/Entrepreneur, r/SaaS) | Answer existing "which peer group" threads with the data and a link to the relevant page. Never start threads. Never more than 2 per week | Human posts |
| Hacker News | Only if the /data page is worth a Show HN once the dataset is complete. One attempt | Human decides |
| Newsletters and communities | Pitch the dataset to 10 founder newsletters as a resource. Not the site, the dataset | Human sends |
| VC platform teams | Fast-Pass partners (Ascend, Unlock) get the stage pages as a resource for portfolio founders | Karin or Grumpy sends |
| Outreach for links | Each group profiled gets a short note: "We listed you, here is the page, tell us if anything is wrong." Corrections are welcome; some will link | grokbot drafts, human sends |

### 7.4 What not to do for traffic

No paid ads. No programmatic pages for cities or industries the dataset does not support. No AI-generated "guides" to pad page count. No link exchanges with the other two traffic sites beyond a single footer mention. No fake reviews, quotes, or testimonials. No scraping member lists.

---

## 8. Handoff to foundernexus.com

### 8.1 Link placement

| Location | Rule |
|---|---|
| FounderNexus row in any table | Name links to /groups/foundernexus on this site, not to foundernexus.com |
| /groups/foundernexus profile | "How to apply" links to foundernexus.com/apply (or the current application URL) with UTM |
| Verdict paragraphs | Where FounderNexus is the stated fit for that stage, one contextual link to foundernexus.com with UTM. Never more than one FN link per page outside the profile |
| Best-for pages | FN ranked where the data puts it. If ranked, one link. If not ranked, no link |
| Footer | "Maintained by the team at FounderNexus" with a plain link. This is the disclosure; it is required |
| Header, sidebar, popups, banners | No FounderNexus promotion anywhere here |

### 8.2 UTM convention

`?utm_source=founderpeergroups&utm_medium=referral&utm_campaign={page-type}&utm_content={page-slug}`

### 8.3 Landing side

Traffic lands on the FounderNexus page that matches the reader's stage when one exists (Membership or the stage-specific section), otherwise Home. Do not send comparison traffic to a Fast-Pass page or any private URL. Fast-Pass pricing never appears on this site.

### 8.4 Attribution

Tobi adds `founderpeergroups` as a source value in Attio. Any application whose first touch carries the UTM is tagged. grokbot reads GA4 weekly and reports clicks by page; Tobi reports applications by source in the weekly readout.

---

## 9. Do and do not

| Do | Do not |
|---|---|
| Verify every price and requirement from the primary source before publishing | Estimate, infer, or carry forward unverified numbers |
| Disclose FounderNexus ownership in the footer and on /methodology | Hide the relationship or pose as a third-party review site |
| Recommend competitors where they are the better fit | Tilt verdicts toward FounderNexus |
| Keep one contextual FN link per page | Add banners, popups, or sitewide CTAs |
| Publish in batches, from the dataset, through templates | Write freehand pages or padding content |
| Show `last_verified` on every page | Leave stale data live past 45 days |
| Answer existing threads with data | Start promotional threads or post from Court's account |
| Escalate corrections from any group within 24 hours | Argue with a group about their own pricing; update and note the change |
| Keep this domain's analytics separate | Merge GTM containers with FounderNexus |
| Log every change in `CHANGELOG.md` | Make silent edits |

---

## 10. grokbot operating cadence

### 10.1 Daily (15 to 30 minutes)

| Step | Action | Output |
|---|---|---|
| 1 | Check Search Console for new queries with impressions and no dedicated page | Candidate list appended to `queries.md` |
| 2 | Check inbox and site contact form for correction requests | Escalate to Grumpy same day; apply verified corrections; log |
| 3 | Check GA4 for outbound FN clicks by page (yesterday) | Append to `daily-log.md` |
| 4 | Generate or regenerate up to 3 pages from the publish queue | PR opened; human merges |
| 5 | Draft one distribution item if the weekly slot is open (LinkedIn post or Reddit reply) | Draft in `drafts/` for human review |

### 10.2 Weekly (Monday)

| Step | Action |
|---|---|
| 1 | Run the 10 tracked LLM prompts across ChatGPT, Claude, Perplexity, Gemini, Grok; log citations |
| 2 | Pull Search Console: impressions, clicks, CTR, top 20 queries, pages with impressions but position over 20 |
| 3 | Pull GA4: FN clicks by page, CTR to FN per page type |
| 4 | Produce the weekly readout in the `weekly-readout-format.md` structure from `foundernexus-content`; send to Grumpy and Tobi |
| 5 | Propose next week's publish queue (10 to 15 pages) ranked by query volume |

### 10.3 Monthly

| Step | Action |
|---|---|
| 1 | Re-verify every group's cost and requirements from primary sources; update `last_verified` |
| 2 | Regenerate all affected pages |
| 3 | Review the 30-day gate metrics (section 12) and recommend continue, adjust, or hold |
| 4 | Send correction-invitation notes to any newly added groups |

### 10.4 Escalate to a human, always

Any correction request from a listed group. Any legal or trademark notice. Any page where the verdict would favor FounderNexus and the data is ambiguous. Any proposal to add a page type not in section 4.1. Any distribution post. Any change to the FounderNexus row.

---

## 11. Tracked LLM prompts

Run weekly, record which domains are cited.

1. What are the best peer groups for startup founders?
2. Vistage vs YPO: which is better for a tech founder?
3. What are alternatives to Hampton for founders?
4. Which founder peer group is best for a Series A CEO?
5. How much does Vistage cost and what are the requirements?
6. Is YPO worth it for a venture-backed founder?
7. Best CEO peer group for a company doing $10M ARR
8. Founder communities for pre-seed founders
9. What is FounderNexus and how does it compare to Hampton?
10. Peer group options for a founder considering selling the company

---

## 12. 30-day gate

At day 30, grokbot produces a one-page readout against section 3. Decision rules:

| Result | Decision |
|---|---|
| 100+ pages indexed and first FN clicks recorded | Continue; expand groups and situations |
| Pages indexed but no impressions | Hold publishing; fix titles and internal links; re-check at day 45 |
| Impressions but no FN clicks | Audit link placement and verdict copy; do not add more links |
| Google deindexes or manual action | Stop; escalate; do not create a fourth domain |
| Site works | Fourth domain candidate is founderstagecheck.com (stage calculator), decided by Grumpy, not grokbot |

---

## 13. Launch checklist

| # | Item | Owner |
|---|---|---|
| 1 | Buy founderpeergroups.com on Vercel | Grumpy |
| 2 | Scaffold Next.js static site from the founderdecisions/founderratio pattern; one `groups.yaml` drives all pages | Codex |
| 3 | Populate `groups.yaml` for the 15 initial groups with sources and dates | grokbot, verified by Grumpy |
| 4 | Write /methodology and /data | grokbot drafts, Grumpy edits |
| 5 | Generate 15 profiles, 10 pairwise, 4 stage pages | grokbot |
| 6 | Human review of the FounderNexus row and every verdict that names FounderNexus | Grumpy |
| 7 | GA4 property, Search Console, sitemap submitted, outbound click events verified | Tobi or Grumpy |
| 8 | Attio source value added | Tobi |
| 9 | Publish batch one; start the daily cadence | grokbot |
| 10 | Send "we listed you" notes to the 14 other groups | Grumpy or Karin |

---

## Appendix: file layout

```
founderpeergroups/
  data/groups.yaml
  data/queries.md
  templates/{profile,pairwise,alternatives,best}.md
  drafts/
  logs/daily-log.md
  logs/weekly-readout-YYYY-WW.md
  CHANGELOG.md
  OPERATING-PLAN.md   (this file)
```
