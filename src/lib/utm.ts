const FN_BASE = "https://foundernexus.com";

export type PageType =
  | "home"
  | "profile"
  | "compare"
  | "alternatives"
  | "best"
  | "methodology"
  | "data"
  | "footer";

/**
 * UTM helper for FounderNexus outbound links.
 * ?utm_source=founderpeergroups&utm_medium=referral&utm_campaign={page-type}&utm_content={page-slug}
 */
export function fnUrl(
  path: string,
  pageType: PageType,
  pageSlug: string
): string {
  const base = path.startsWith("http") ? path : `${FN_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const url = new URL(base);
  url.searchParams.set("utm_source", "founderpeergroups");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", pageType);
  url.searchParams.set("utm_content", pageSlug);
  return url.toString();
}
