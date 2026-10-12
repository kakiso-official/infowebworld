import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/app/styles/developers/hub.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons'
import { formatDate, formatNumber } from '@/lib/developers/format'
import { GATES, METHODOLOGY_UPDATED } from '@/lib/developers/indexing'
import { devCrumbs } from '@/lib/developers/jsonld'
import { freeApisPath, methodologyPath, ossHubPath } from '@/lib/developers/paths'
import { devPageMetadata, methodologySeo } from '@/lib/developers/seo'
import { tryGetApis, tryGetOss } from '@/lib/developers/store'
import DvPageHeader from '../_components/shell/DvPageHeader'
import DvBand from '../_components/shell/DvBand'
import DvJsonLd from '../_components/shell/DvJsonLd'
import DvExternalLink from '../_components/ui/DvExternalLink'
import DvTime from '../_components/ui/DvTime'

/* ═══════════════════════════════════════════════════════════════════════
   How We Collect and Check This Data - /developers/methodology (3.2).

   The page every "How we check" link points at. Each statement describes
   what the snapshot scripts in scripts/developers/ actually do; numbers
   and dates come from the snapshots and lib/developers/indexing.ts, so
   the copy cannot drift from the data. Freshness wording depends on the
   optional runtime refresh (lib/developers/refresh.ts): "every 24 hours"
   only while it is live. Bump METHODOLOGY_UPDATED when this copy changes.
   ═══════════════════════════════════════════════════════════════════════ */

export const revalidate = 86400

const PATH = methodologyPath()

export function generateMetadata(): Metadata {
  return devPageMetadata(PATH, methodologySeo(), true)
}

export default async function MethodologyPage() {
  const [oss, apis] = await Promise.all([tryGetOss(), tryGetApis()])
  const seo = methodologySeo()
  const crumbs = devCrumbs.methodology()
  const refreshLive = oss?.meta.refresh?.live === true
  const perOrg = oss?.meta.reposPerOrgLimit ?? 30

  return (
    <>
      <DvJsonLd
        path={PATH}
        name={seo.h1}
        description={seo.description}
        crumbs={crumbs}
        type="AboutPage"
        dateModified={METHODOLOGY_UPDATED}
      />

      <DvPageHeader
        crumbs={crumbs}
        icon={faClipboardCheck}
        title={seo.h1}
        lead="Every number in InfoWebWorld for Developers comes from a source you can open yourself: GitHub, the provider's own docs or a package registry. This page explains where each fact comes from, how we check it and what we leave out."
      />

      <DvBand tone="white" width="read" id="dv-method" label="Methodology">
        <div className="dv-prose">
          <h2>Where the data comes from</h2>
          <p>
            <strong>Open source.</strong> Repository facts (stars, forks, languages, topics, licenses, pushes, releases
            and open issues) come from the GitHub GraphQL API. We track up to {formatNumber(perOrg)} of the most-starred
            public repositories of each company&apos;s GitHub organization and leave forks out.
          </p>
          <p>
            <strong>Good first issues.</strong> Open issues labelled &quot;good first issue&quot; in those repositories, up
            to 10 per organization, opened in the 180 days before the snapshot. Each one links to the real issue.
          </p>
          <p>
            <strong>Free APIs.</strong> The base list is{' '}
            <DvExternalLink href="https://github.com/public-apis/public-apis">public-apis/public-apis</DvExternalLink> on
            GitHub (MIT License, Copyright (c) 2022 public-apis): each API&apos;s name, description, category, auth type,
            HTTPS and CORS support as listed there.
          </p>
          <p>
            <strong>Reviewed APIs.</strong> For the most useful APIs we went further: the free tier, rate limits, a
            sample request, the docs links and the SDKs were researched from the provider&apos;s own docs and pricing
            pages, then checked as described below. Each reviewed API page lists its sources.
          </p>

          <h2>What &quot;checked&quot; means</h2>
          <ul>
            <li>
              <strong>Links.</strong> Our checker requested every API link the way a normal browser does. A working
              link is marked <em>Link OK</em>. A site that turned the checker away (many sites do this to all
              automated traffic) is marked <em>Could not auto-check</em>: it is usually fine, so open it to confirm. Dead links,
              and links we still could not reach on a second try, were removed.
            </li>
            <li>
              <strong>Sample requests.</strong> For reviewed APIs we sent the documented sample request (GET requests
              only), read at most 64 KB of the answer and recorded the status code and content type. When the API
              answered and allows calls from other websites (CORS), its page offers a live <em>Try it</em> that runs
              in your own browser, straight to the API, with no proxy.
            </li>
            <li>
              <strong>SDKs.</strong> Every package was looked up on its registry (npm, PyPI, Go, Maven Central, NuGet,
              RubyGems, Packagist, crates.io, pub.dev or CocoaPods). Packages the registry did not know were removed;
              versions and publish dates come from the registry. <em>Official</em> means the API provider publishes it.
            </li>
            <li>
              <strong>Verified.</strong> An API shows the <em>Verified</em> badge when its sample request passed and its
              facts were checked within the last 30 days of the data date.
            </li>
          </ul>

          <h2>How companies are matched to GitHub</h2>
          <p>A GitHub organization is shown under a company only when at least one of these is true:</p>
          <ul>
            <li>GitHub shows the organization&apos;s domain as verified for that company.</li>
            <li>The organization&apos;s website is on the company&apos;s own domain.</li>
            <li>The company&apos;s homepage links to the organization.</li>
            <li>The organization matches the company&apos;s InfoWebWorld listing by domain or exact name.</li>
          </ul>
          <p>
            Organizations that pass none of these are left out until someone checks them by hand. Companies that are
            also listed on InfoWebWorld link to their profile or listing there.
          </p>

          <h2>How often</h2>
          <p>
            {refreshLive
              ? 'Stars, forks, pushes and good first issues refresh from the GitHub API every 24 hours.'
              : oss
                ? <>The GitHub data is a snapshot from <DvTime iso={oss.snapshotAt} />.</>
                : 'The GitHub data is a dated snapshot.'}{' '}
            {apis && <>API links were last checked on <DvTime iso={apis.meta.linksCheckedAt} />.</>}{' '}
            Every page shows the date of its data under the title; the dot next to it turns amber once that date is
            more than 14 days old.
          </p>

          <h2>What gets its own page</h2>
          <p>
            A page is only offered to search engines when it has enough real data. A project needs a description
            and a sign of real use: {formatNumber(GATES.repoMinStars)} or more stars, a good first issue,{' '}
            {GATES.repoActiveMinStars} stars and a push in the last year, or a release in the last year. A language or
            topic needs {GATES.facetMinRepos} projects from {GATES.facetMinCompanies} different companies, and a
            country or industry needs {GATES.groupMinCompanies} companies. Smaller pages stay available to visitors.
          </p>

          <h2>What we never do</h2>
          <ul>
            <li>We never invent a number. A fact we could not verify is left out or marked <em>Not published</em>.</li>
            <li>Nothing in this section is paid placement.</li>
            <li>Lists are ordered by a fact you can check (GitHub stars, dates, names), never by opinion.</li>
          </ul>

          <h2>Corrections</h2>
          <p>
            Spotted a mistake? <Link href="/contact" prefetch={false}>Tell us</Link> with the page address and what is wrong. We check it
            against the source and fix it.
          </p>

          <h2>Snapshot dates</h2>
          <dl className="dv-facts dv-method-dates">
            {oss && (
              <div className="dv-facts-row">
                <dt className="dv-facts-label">Open source data</dt>
                <dd className="dv-facts-value"><DvTime iso={oss.snapshotAt} /> <a href={ossHubPath()}>Open source</a></dd>
              </div>
            )}
            {apis && (
              <div className="dv-facts-row">
                <dt className="dv-facts-label">API links checked</dt>
                <dd className="dv-facts-value"><DvTime iso={apis.meta.linksCheckedAt} /> <a href={freeApisPath()}>Free APIs</a></dd>
              </div>
            )}
            <div className="dv-facts-row">
              <dt className="dv-facts-label">This page updated</dt>
              <dd className="dv-facts-value">{formatDate(METHODOLOGY_UPDATED)}</dd>
            </div>
          </dl>
        </div>
      </DvBand>
    </>
  )
}
