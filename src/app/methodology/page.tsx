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
          evaluation field. We leave out any fact we cannot document.
        </p>
      </section>

      <section>
        <h2>How groups are evaluated</h2>
        <p className="mt-3 leading-relaxed">
          We evaluate each group on the same fields: format, structure,
          facilitation, size, stage fit, revenue or capital floor, other
          requirements, annual cost, time commitment, geography, application
          model, and whether the group focuses on venture-backed companies. Fit
          statements (best for, not for) are short and tie back to those fields.
        </p>
        <p className="mt-3 leading-relaxed">
          Stage pages use ARR bands named the way founders search for them:
          pre-seed and seed (under $2M), Series A ($2M to $10M), growth ($10M
          to $50M), and late stage ($50M+). When a group has no stage-fit tags,
          the page says the group is not framed by VC stage.
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
          other requirements. Reasons on the page cite those fields. We generate
          rankings with deterministic templates and write no editorial reviews.
        </p>
        <p className="mt-3 leading-relaxed">
          Each best-for page includes a short needs statement, a ranked list of
          five to seven groups, a comparison table, five questions to ask before
          joining, and sources. Pages say &quot;the fit is&quot; and avoid
          &quot;we recommend.&quot;
        </p>
      </section>

      <section>
        <h2>Sourcing and prices</h2>
        <p className="mt-3 leading-relaxed">
          Cost and requirement fields come from the group&apos;s own site or an
          official document linked in sources. We show prices verbatim. When
          the official site does not publish a number, the field reads{" "}
          <strong className="font-semibold text-[var(--color-ink)]">
            Not published
          </strong>
          . We do not estimate.
        </p>
        <p className="mt-3 leading-relaxed">
          Each content page shows its verification date near the top. We aim to
          re-verify each group every 30 days and treat data older than 45 days
          as an operating defect.
        </p>
      </section>

      <section>
        <h2>FounderNexus disclosure</h2>
        <p className="mt-3 leading-relaxed">
          The FounderNexus team maintains this site. FounderNexus is one row in
          the comparison set, written in the same voice and structure as every
          other group. Where the data supports FounderNexus as a fit,
          the page says so. Where it does not, the page points elsewhere. There
          are no banners, popups, or sitewide FounderNexus CTAs. Outside the
          FounderNexus profile, a page carries at most one contextual outbound
          FounderNexus link.
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
              Techstars are useful. They lack the structure of a confidential
              peer advisory forum: a recurring group, a clear membership bar,
              and an explicit advisory cadence. This site compares peer groups
              that offer that format, so we leave accelerator alumni networks
              out of the comparison tables.
            </dd>
          </div>
        </dl>
      </section>

      <section>
        <h2>Corrections</h2>
        <p className="mt-3 leading-relaxed">
          Listed groups can request corrections. We apply and record each
          verified update. When a group corrects its own published pricing, we
          update the page and note the change without debate.
        </p>
      </section>
    </article>
  );
}
