# Update cadence (Peer Groups bot)

Short summary of `OPERATING-PLAN.md` section 10 for day-to-day operation of founderpeergroups.com.

## Deploy loop

1. Edit `data/groups.yaml` (verify from primary sources; never invent prices).
2. Update `CHANGELOG.md` for every content or code change.
3. Commit and push to `origin/main`.
4. Vercel auto-deploys the static export from this repo (personal Vercel project).

Preview today: https://founder-peer-group.vercel.app/  
Production domain (when DNS attached): https://founderpeergroups.com/

## Daily (15–30 min)

1. Search Console: new queries with impressions and no dedicated page → append to `queries.md`.
2. Correction requests → escalate same day; apply verified fixes; log CHANGELOG.
3. GA4: outbound FN clicks by page (yesterday) → `daily-log.md`.
4. Generate or regenerate up to 3 pages from the publish queue → PR / push.
5. If the weekly distribution slot is open, draft one LinkedIn or Reddit item in `drafts/` for human review.

## Weekly (Monday)

1. Run the 10 tracked LLM prompts; log citations.
2. Search Console: impressions, clicks, CTR, top queries, pages stuck past position 20.
3. GA4: FN clicks by page and CTR by page type.
4. Weekly readout to Grumpy and Tobi.
5. Propose next week's publish queue (10–15 pages) by query volume.

## Monthly

1. Re-verify every group's cost and requirements; bump `last_verified`.
2. Regenerate affected pages; push main.
3. Review 30-day gate metrics; recommend continue / adjust / hold.
4. Correction-invitation notes to newly added groups.

## Always escalate to a human

Correction from a listed group; legal/trademark notice; ambiguous FN-favoring verdict; new page type not in the operating plan; any distribution post; any change to the FounderNexus row.

## Analytics separation

Keep GA4 and Search Console properties separate from FounderNexus. Do not merge GTM containers. Sitemap: `https://founderpeergroups.com/sitemap.xml`.
