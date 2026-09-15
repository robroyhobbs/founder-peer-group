import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { LastVerified } from "@/components/LastVerified";
import { latestVerified } from "@/lib/data";

export const metadata: Metadata = pageMetadata({
  title: "Methodology",
  description:
    "How founderpeergroups.com evaluates peer groups, sources published data, ranks best-for pages, and discloses FounderNexus involvement.",
  path: "/methodology/",
});

export default function MethodologyPage() {
  return (
    <article className="prose-block space-y-8">
      <LastVerified date={latestVerified()} />
      <h1 className="mt-2">Methodology</h1>

      <section>
        <h2>What this site is</h2>
        <p className="mt-3 leading-relaxed">
          founderpeergroups.com is an independent factual comparison site for
          founder and CEO peer groups. Every claim traces to a documented
          evaluation field. If a fact is not documented, it does not appear.
        </p>
      </section>

      <section>
        <h2>How groups are evaluated</h2>
        <p className="mt-3 leading-relaxed">
          Groups use the same fields: format, structure, facilitation, size,
          stage fit, revenue or capital floor, other requirements, annual cost,
          time commitment, geography, application model, and whether the group
          focuses on venture-backed companies. Fit statements (best for / not
          for) are short and tied to those fields.
        </p>
        <p className="mt-3 leading-relaxed">
          Stage pages use ARR bands labeled in search language: pre-seed and
          seed (under $2M), Series A ($2M to $10M), growth ($10M to $50M), late
          stage ($50M+). If a group has no stage-fit tags, pages say the
          group is not framed by VC stage.
        </p>
      </section>

      <section>
        <h2>Best-for stage and situation pages</h2>
        <p className="mt-3 leading-relaxed">
          <Link href="/best/series-a/" className="link-quiet">
            Best-for-stage
          </Link>{" "}
          pages rank groups whose stage fit includes that band,
          with mild tie-breaks for venture focus on earlier stages and for
          published cost transparency. Situation pages (first-time founder,
          solo founder, just raised, considering an exit, venture-backed, women
          founders and leaders) use the same documented fields. Scores read only
          those fields: stage fit, venture focus, facilitation, structure, and
          the published best-for and not-for statements, revenue floor, and
          other requirements. Reasons on the page cite those fields. Rankings
          are deterministic templates, not editorial reviews.
        </p>
        <p className="mt-3 leading-relaxed">
          Each best-for page includes a short needs statement, a ranked list of
          five to seven groups, a comparison table, five questions to ask before
          joining, and sources. Voice stays restrained: prefer &quot;the fit
          is&quot; over &quot;we recommend.&quot;
        </p>
      </section>

      <section>
        <h2>Sourcing and prices</h2>
        <p className="mt-3 leading-relaxed">
          Cost and requirement fields come from the group&apos;s own site or an
          official document linked in sources. Prices are rendered verbatim.
          When the official site does not publish a number, the field is{" "}
          <strong className="font-semibold text-[var(--color-ink)]">
            Not published
          </strong>
          . Nothing is estimated.
        </p>
        <p className="mt-3 leading-relaxed">
          Each group shows a verification date near the top of content pages.
          The target cadence is re-verification every 30 days. Stale data past
          45 days is treated as an operating defect.
        </p>
      </section>

      <section>
        <h2>FounderNexus disclosure</h2>
        <p className="mt-3 leading-relaxed">
          This site is maintained by the team at FounderNexus. FounderNexus is
          one row in the comparison set, written in the same voice and structure
          as every other group. Where the data supports FounderNexus as a fit,
          the page says so. Where it does not, the page points elsewhere. There
          are no banners, popups, or sitewide FounderNexus CTAs. At most one
          contextual outbound FounderNexus link appears per page outside the
          FounderNexus profile.
        </p>
      </section>


      <section>
        <h2>FAQ</h2>
        <dl className="mt-4 space-y-5">
          <div>
            <dt className="font-semibold text-[var(--color-ink)]">
              Do YC or Techstars alumni networks substitute for a peer group?
            </dt>
            <dd className="mt-1.5 leading-relaxed text-[var(--color-muted)]">
              Alumni networks from accelerators such as Y Combinator and
              Techstars are useful. They are not structured, confidential peer
              advisory forums with a recurring room, clear membership bar, and
              an explicit advisory cadence. This site compares peer groups that
              publish that kind of product. Accelerator alumni networks are
              excluded from the comparison tables for that reason.
            </dd>
          </div>
        </dl>
      </section>

      <section>
        <h2>Corrections</h2>
        <p className="mt-3 leading-relaxed">
          Listed groups can request corrections. Verified updates are applied
          and recorded. We do not argue with a group about their own published
          pricing; we update and note the change.
        </p>
      </section>
    </article>
  );
}
