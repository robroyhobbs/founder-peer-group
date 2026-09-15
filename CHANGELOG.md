# CHANGELOG

## 2026-09-15

- SEO: site-wide + per-page Open Graph / Twitter cards, canonical URLs (trailing slash) via `src/lib/seo.ts`; layout `metadataBase`, robots index/follow, googleBot-friendly defaults; tightened home OG.
- AEO: added `public/llms.txt` (purpose, key URLs, verified-sources note). Skipped `humans.txt`.
- JsonLd audit: Organization (profiles), ItemList (best), Dataset (data), FAQPage (compare) retained; no schema breakage.
- Security: `vercel.json` security headers (HSTS, nosniff, DENY frames, referrer, permissions-policy, CSP for self + optional GA4; next/font self-hosts).
- Ops: README Search Console + GA4 checklist, deploy loop, HTTPS/custom-domain notes; `docs/UPDATE-CADENCE.md` for Peer Groups bot daily/weekly/monthly.
- Confirmed no secrets in repo (`.env.example` only).


## 2026-09-15

- Added six best-for-situation pages under `/best/{situation-slug}` (shared route with stage pages): first-time-founder, solo-founder, just-raised, considering-exit, venture-backed, women-founders-leaders. Rankings and reasons grounded in groups.yaml fields only.
- Home links situations; sitemap includes situation URLs; methodology expanded with best-for ranking rules.
- Renamed dynamic segment `best/[stage]` to `best/[slug]` so stage and situation share one template.

## 2026-09-15

- Local Next.js scaffold created at `site/` (not a git clone). Static export, App Router, TypeScript, Tailwind, js-yaml.
- Copied `data/groups.yaml` and `OPERATING-PLAN.md` into the site root / data tree.
- Generated page types: home, profiles, all pairwise compares, alternatives, best-for-stage (4), methodology, data (+ CSV), sitemap, robots.
- GA4 env placeholder (`NEXT_PUBLIC_GA4_MEASUREMENT_ID`). UTM helper for FN links.
- Note: push to https://github.com/robroyhobbs/founder-peer-group when ready.

## Prior (parent repo)

- Working tree seeded from OPERATING-PLAN.md v1.0.
- Draft `groups.yaml` rows for core groups (see parent CHANGELOG).

- Visual polish: Plus Jakarta Sans (400–700), Brand Book M2 color tokens (navy #01052A, action #0072BA), research-desk tables, sentence-case UI. Independent reference look (no FN logo lockup).

- QA polish: readable source labels, sticky field column, core fit-snapshot table on profiles, denser ranking cost cells (2026-09-15).
