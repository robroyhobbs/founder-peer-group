import type { MetadataRoute } from "next";
import { getAllPairs, getGroups } from "@/lib/data";
import { SITUATIONS, STAGES } from "@/lib/types";

const BASE = "https://founderpeergroups.com";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const groups = getGroups();
  const pairs = getAllPairs();
  const now = new Date("2026-09-15");

  const entries: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${BASE}/methodology/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE}/data/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  for (const g of groups) {
    entries.push({
      url: `${BASE}/groups/${g.slug}/`,
      lastModified: new Date(g.last_verified),
      changeFrequency: "monthly",
      priority: 0.8,
    });
    entries.push({
      url: `${BASE}/alternatives/${g.slug}/`,
      lastModified: new Date(g.last_verified),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const p of pairs) {
    entries.push({
      url: `${BASE}/compare/${p.pairSlug}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const s of STAGES) {
    entries.push({
      url: `${BASE}/best/${s.slug}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }

  for (const s of SITUATIONS) {
    entries.push({
      url: `${BASE}/best/${s.slug}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }

  return entries;
}
