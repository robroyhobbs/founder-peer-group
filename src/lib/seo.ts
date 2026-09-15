import type { Metadata } from "next";

export const SITE_NAME = "Founder peer groups";
export const SITE_BASE = "https://founderpeergroups.com";

const DEFAULT_DESCRIPTION =
  "Independent, data-driven comparisons of founder and CEO peer groups. Costs, requirements, and stage fit from verified public sources.";

/** Absolute canonical path must include trailing slash (trailingSlash: true). */
export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return `${SITE_BASE}/`;
  return normalized.endsWith("/")
    ? `${SITE_BASE}${normalized}`
    : `${SITE_BASE}${normalized}/`;
}

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(path);
  const desc = description.slice(0, 160);
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: desc,
      url,
      type: "website",
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
    },
  };
}

export function homeMetadata(): Metadata {
  const title = "Founder peer groups - factual comparisons";
  const description = DEFAULT_DESCRIPTION;
  const url = absoluteUrl("/");
  return {
    title: {
      absolute: title,
    },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
