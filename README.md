# founderpeergroups.com

Independent, factual comparison site for founder and CEO peer groups. Group data is fetched at build from `foundernexus/fn-content` (`data/groups.yaml`). This repo holds no group data of its own.

Live preview (personal Vercel): https://founder-peer-group.vercel.app/  
Production domain (when attached): https://founderpeergroups.com/

## Stack

- Next.js App Router + TypeScript + Tailwind
- Static export (`output: 'export'`, `trailingSlash: true`)
- `js-yaml` at build time
- Plus Jakarta Sans + Brand Book M2 tokens (independent site; no FounderNexus header CTA)

## Setup

```bash
npm install
cp .env.example .env.local   # FN_CONTENT_TOKEN required; GA4 optional
export FN_CONTENT_TOKEN=...  # fine-grained PAT, contents:read on foundernexus/fn-content
npm run build                # fetches groups.yaml, then generates public/groups.csv
npm run dev                  # local preview (also fetches)
```

Preview the static export:

```bash
npm run build
npx serve out
```

## Daily updates (ops)

1. Edit `data/groups.yaml` in `foundernexus/fn-content` (verify from primary sources; never invent prices).
2. Merge to `fn-content` `main`. The deploy hook rebuilds this site.
3. Update `CHANGELOG.md` here only for renderer changes.
4. Commit and push renderer changes to `origin/main`.

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

## Domains

Canonical host: apex `https://founderpeergroups.com` (prefer apex over www).

In the personal Vercel project **founder-peer-group**, add `www.founderpeergroups.com` and redirect it to the apex `https://founderpeergroups.com` (or the reverse if you choose www as canonical; apex is preferred). Domain redirects cannot be set via API from this workspace; configure them in the Vercel dashboard (Project → Settings → Domains).
