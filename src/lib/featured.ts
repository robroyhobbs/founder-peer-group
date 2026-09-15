/**
 * Compare pair slugs featured on the home page / publish queue.
 * Keep in sync with data/queries.md (`status: featured-on-home`) and home topComparisons.
 * Pair slugs use alphabetical a-vs-b order from getAllPairs().
 */
export const FEATURED_COMPARE_SLUGS = [
  "eo-vs-vistage",
  "hampton-vs-ypo",
  "foundernexus-vs-ypo",
  "eo-vs-foundernexus",
  "hampton-vs-pavilion",
  "hampton-vs-vistage",
  "eo-vs-ypo",
  "foundernexus-vs-hampton",
] as const;

export type FeaturedCompareSlug = (typeof FEATURED_COMPARE_SLUGS)[number];

/** First five queue priorities — marked featured-on-home in data/queries.md. */
export const QUEUE_FEATURED_COMPARE_SLUGS = FEATURED_COMPARE_SLUGS.slice(
  0,
  5
) as FeaturedCompareSlug[];

export function featuredRank(pairSlug: string): number {
  const i = (FEATURED_COMPARE_SLUGS as readonly string[]).indexOf(pairSlug);
  return i === -1 ? Number.POSITIVE_INFINITY : i;
}
