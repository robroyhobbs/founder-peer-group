#!/usr/bin/env node
/**
 * Build-time fetch of foundernexus/fn-content data/groups.yaml (main).
 * Requires FN_CONTENT_TOKEN: a read-only fine-grained GitHub token
 * created by a foundernexus org member, scoped to fn-content, contents: read.
 * Exits non-zero on any failure.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const token = process.env.FN_CONTENT_TOKEN;
if (!token) {
  console.error(
    "FN_CONTENT_TOKEN is required. Create a fine-grained GitHub token as a foundernexus org member, resource owner foundernexus, repository fn-content only, permission contents: read."
  );
  process.exit(1);
}

const url =
  "https://api.github.com/repos/foundernexus/fn-content/contents/data/groups.yaml?ref=main";

let res;
try {
  res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.raw",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "founderpeergroups-build",
    },
  });
} catch (err) {
  console.error("fetch groups.yaml network error:", err.message);
  process.exit(1);
}

if (!res.ok) {
  const body = await res.text();
  console.error(`fetch groups.yaml failed: ${res.status} ${body.slice(0, 500)}`);
  process.exit(1);
}

const text = await res.text();
if (!text.trim()) {
  console.error("fetched groups.yaml was empty");
  process.exit(1);
}

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "data", ".fetched-groups.yaml");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, text);
console.log(`wrote ${out} (${text.length} bytes)`);
