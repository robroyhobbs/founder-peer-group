# founderpeergroups.com

Independent, factual comparison site for founder and CEO peer groups. Driven by `data/groups.yaml`.

## Stack

- Next.js App Router + TypeScript + Tailwind
- Static export (`output: 'export'`)
- `js-yaml` at build time

## Setup

```bash
cd site
npm install
cp .env.example .env.local   # optional: set NEXT_PUBLIC_GA4_MEASUREMENT_ID
npm run build                # also generates public/groups.csv
npm run dev                  # local preview
```

Preview the static export:

```bash
npm run build
npx serve out
```

## Content rules

- Never invent prices; render YAML cost text verbatim.
- Voice: straight, restrained, short sentences. No em dashes. No emojis.
- Prefer "the fit is" over "we recommend".
- If `stage_fit` is empty, say the group is not framed by VC stage.
- Max one contextual FounderNexus outbound link per page (outside the FN profile).
- Footer discloses: Maintained by the team at FounderNexus.

See `OPERATING-PLAN.md` for full strategy and cadence.

## Deploy / git

This scaffold is local-only. When ready, push to:

https://github.com/robroyhobbs/founder-peer-group

## Page types

| Route | Source |
|---|---|
| `/` | Home + stage selector |
| `/groups/[slug]` | Profile per group |
| `/compare/[a]-vs-[b]` | All unordered pairs (slug order) |
| `/alternatives/[slug]` | Alternatives ranked by fit overlap |
| `/best/[stage]` | pre-seed-seed, series-a, growth, late-stage |
| `/methodology` | Sourcing + FN disclosure |
| `/data` | Sortable table + `/groups.csv` |
