# founderpeergroups.com

Independent, factual comparison site for founder and CEO peer groups. Driven by `data/groups.yaml`.

Live preview (personal Vercel): https://founder-peer-group.vercel.app/  
Production domain (when attached): https://founderpeergroups.com/

## Stack

- Next.js App Router + TypeScript + Tailwind
- Static export (`output: 'export'`, `trailingSlash: true`)
- `js-yaml` at build time
- Plus Jakarta Sans + Brand Book M2 tokens (independent site; no FounderNexus header CTA)

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

## Daily updates (ops)

1. Edit `data/groups.yaml` (verify from primary sources; never invent prices).
2. Update `CHANGELOG.md` (required for every change).
3. Commit and push to `origin/main`.
4. Vercel auto-deploys from this repo.

See `docs/UPDATE-CADENCE.md` for daily / weekly / monthly Peer Groups bot steps (summary of `OPERATING-PLAN.md`).

## Search Console + GA4 checklist

Keep properties **separate from FounderNexus** (do not merge GTM).

1. Create a GA4 property for founderpeergroups.com only.
2. Set `NEXT_PUBLIC_GA4_MEASUREMENT_ID` in Vercel env (and optionally `.env.local`).
3. Redeploy so `GaPlaceholder` injects gtag.
4. Create a Search Console property for `https://founderpeergroups.com` (and the Vercel preview host if useful).
5. Submit sitemap: `https://founderpeergroups.com/sitemap.xml` (after custom domain is live; until then use the preview host sitemap if indexed).
6. Verify outbound FN click events / landing UTMs (`utm_source=founderpeergroups`) in FN GA4 separately.

## Security / hosting

- HTTPS is provided by Vercel on the preview and on any custom domain attached later.
- `vercel.json` sets HSTS, nosniff, frame deny, referrer policy, permissions policy, and a strict static-site CSP (`next/font` self-hosts Plus Jakarta; GA allowed when the measurement ID is set).
- Secrets: only `.env.example` is committed. Real `.env*` files are gitignored.

## Content rules

- Never invent prices; render YAML cost text verbatim.
- Voice: straight, restrained, short sentences. No em dashes. No emojis.
- Prefer "the fit is" over "we recommend".
- If `stage_fit` is empty, say the group is not framed by VC stage.
- Max one contextual FounderNexus outbound link per page (outside the FN profile).
- Footer discloses: Maintained by the team at FounderNexus.

See `OPERATING-PLAN.md` for full strategy and cadence.

## Deploy / git

Repo: https://github.com/robroyhobbs/founder-peer-group  
Branch: `main` → personal Vercel project auto-deploy. Do not deploy from FounderNexus infra.

## Page types

| Route | Source |
|---|---|
| `/` | Home + stage / situation selector |
| `/groups/[slug]` | Profile per group |
| `/compare/[a]-vs-[b]` | All unordered pairs (slug order) |
| `/alternatives/[slug]` | Alternatives ranked by fit overlap |
| `/best/[slug]` | Stage + situation best-for pages |
| `/methodology` | Sourcing + FN disclosure |
| `/data` | Sortable table + `/groups.csv` |
| `/llms.txt` | Short AEO description for LLM crawlers |
