import type { Metadata } from 'next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { formatCompact, formatDate, formatNumber, countLabel } from '@/lib/developers/format'
import type { OssStore } from '@/lib/developers/oss'
import { ossFacetIndexPath, ossFacetPath, type OssFacetKind } from '@/lib/developers/paths'
import { GATES } from '@/lib/developers/indexing'
import { devCrumbs, listNode } from '@/lib/developers/jsonld'
import { devNotFoundMetadata, devPageMetadata, devUnavailableMetadata, facetIndexSeo } from '@/lib/developers/seo'
import { getOss } from '@/lib/developers/store'
import { industryIcon } from '@/lib/developers/taxonomy'
import type { FacetValue } from '@/lib/developers/types'
import { resolveSafely, type Resolved } from '../../../_lib/resolve'
import DvPageHeader from '../../shell/DvPageHeader'
import DvDataLine from '../../shell/DvDataLine'
import DvBand from '../../shell/DvBand'
import DvSourceNote from '../../shell/DvSourceNote'
import DvJsonLd from '../../shell/DvJsonLd'
import DvBarList, { type BarListItem } from '../../ui/DvBarList'
import DvFlag from '../../ui/DvFlag'
import LanguageDot from '../../ui/LanguageDot'

/* ═══════════════════════════════════════════════════════════════════════
   Facet index pages (spec 3.10), one template for four URLs:
     /developers/open-source/languages | topics | countries | industries

   A ranked bar list of every value whose page is indexed (repos for
   languages and topics, companies for countries and industries). Values
   below their gate still have a page (noindex, follow): they are listed in
   a muted "smaller" block. Topics are the exception (about 1,500 small
   ones): the index only counts them, and each one is linked from the
   repository pages that carry it.
   ═══════════════════════════════════════════════════════════════════════ */

export function resolveFacetIndex(): Promise<Resolved<OssStore>> {
  return resolveSafely<OssStore>(async () => ({ kind: 'ok', value: await getOss() }))
}

/* How many values the index lists as its main ranked list. */
function mainValues(store: OssStore, kind: OssFacetKind): readonly FacetValue[] {
  return store.facets[kind].filter(f => f.indexable)
}

export function facetIndexMetadata(kind: OssFacetKind, res: Resolved<OssStore>): Metadata {
  const path = ossFacetIndexPath(kind)
  if (res.kind === 'unavailable') return devUnavailableMetadata(path, facetIndexSeo(kind, 0))
  if (res.kind !== 'ok') return devNotFoundMetadata()
  return devPageMetadata(path, facetIndexSeo(kind, res.value.facets[kind].length), true)
}

const COPY: Readonly<Record<OssFacetKind, { lead: (store: OssStore, n: number) => string; listLabel: string; smaller: string; gate: string; unit: string }>> = {
  language: {
    lead: (s, n) => `The main programming language of ${formatNumber(s.totals.repos)} public repositories from ${formatNumber(s.totals.companies)} companies, as GitHub detects it. ${formatNumber(n)} languages have enough projects for their own ranked page.`,
    listLabel: 'Languages by number of repositories',
    smaller: 'Smaller languages',
    gate: `Languages with fewer than ${GATES.facetMinRepos} projects from ${GATES.facetMinCompanies} companies.`,
    unit: 'repos',
  },
  topic: {
    lead: (s, n) => `The GitHub topics companies put on their public repositories. ${formatNumber(n)} topics have at least ${GATES.facetMinRepos} projects from ${GATES.facetMinCompanies} different companies, each with its own ranked page.`,
    listLabel: 'Topics by number of repositories',
    smaller: 'Smaller topics',
    gate: `Topics with fewer than ${GATES.facetMinRepos} projects from ${GATES.facetMinCompanies} companies.`,
    unit: 'repos',
  },
  country: {
    lead: (s, n) => `Where the ${formatNumber(s.totals.companies)} companies that publish open source on GitHub have their headquarters. ${formatNumber(n)} countries have at least ${GATES.groupMinCompanies} companies.`,
    listLabel: 'Countries by number of companies',
    smaller: 'Countries with fewer companies',
    gate: `Countries with fewer than ${GATES.groupMinCompanies} companies so far.`,
    unit: 'companies',
  },
  industry: {
    lead: (s, n) => `The industries of the ${formatNumber(s.totals.companies)} companies that publish open source on GitHub, from developer tools to fintech. ${formatNumber(n)} industries have at least ${GATES.groupMinCompanies} companies.`,
    listLabel: 'Industries by number of companies',
    smaller: 'Smaller industries',
    gate: `Industries with fewer than ${GATES.groupMinCompanies} companies so far.`,
    unit: 'companies',
  },
}

function barItem(kind: OssFacetKind, f: FacetValue, muted = false): BarListItem {
  const byCompanies = kind === 'country' || kind === 'industry'
  const lead = kind === 'language'
    ? <LanguageDot name={f.name} color={f.color ?? null} dotOnly />
    : kind === 'country' && f.iso2
      ? <DvFlag code={f.iso2} />
      : kind === 'industry'
        ? <FontAwesomeIcon icon={industryIcon(f.slug)} className="dv-barlist-icon" aria-hidden="true" />
        : undefined
  return {
    label: f.name,
    href: ossFacetPath(kind, f.slug),
    value: byCompanies ? f.companies : f.repos,
    sub: byCompanies
      ? `${countLabel(f.repos, 'repo')} - ${formatCompact(f.stars)} stars`
      : `${countLabel(f.companies, 'company', 'companies')} - ${formatCompact(f.stars)} stars`,
    lead,
    muted,
  }
}

export default function FacetIndexView({ kind, store }: { kind: OssFacetKind; store: OssStore }) {
  const main = mainValues(store, kind)
  const smaller = store.facets[kind].filter(f => !f.indexable)
  /* The title counts every value with a page, smaller ones too. */
  const seo = facetIndexSeo(kind, store.facets[kind].length)
  const path = ossFacetIndexPath(kind)
  const crumbs = devCrumbs.facetIndex(kind)
  const copy = COPY[kind]
  const byCompanies = kind === 'country' || kind === 'industry'

  return (
    <>
      <DvJsonLd
        path={path}
        name={seo.h1}
        description={seo.description}
        crumbs={crumbs}
        dateModified={store.dataAt}
        nodes={[listNode(path, seo.h1, main.map(f => ({ name: f.name, url: ossFacetPath(kind, f.slug) })))]}
      />

      <DvPageHeader
        crumbs={crumbs}
        title={seo.h1}
        lead={copy.lead(store, main.length)}
        dataLine={<DvDataLine source="github" date={store.snapshotAt} refresh={store.meta.refresh} />}
      />

      <DvBand tone="white" id="dv-facet-index" label={copy.listLabel} tight>
        <DvBarList items={main.map(f => barItem(kind, f))} label={copy.listLabel} unit={copy.unit} />
      </DvBand>

      {smaller.length > 0 && (
        <DvBand tone="wash" id="dv-facet-smaller" title={copy.smaller} sub={copy.gate}>
          {kind === 'topic' ? (
            <p className="dv-lead">
              {formatNumber(smaller.length)} smaller topics have their own page too. Each one is linked from the
              projects that use it.
            </p>
          ) : (
            <DvBarList
              items={smaller.map(f => barItem(kind, f, true))}
              label={copy.smaller}
              unit={copy.unit}
              start={main.length + 1}
              max={byCompanies ? main[0]?.companies : main[0]?.repos}
            />
          )}
        </DvBand>
      )}

      <DvSourceNote>
        GitHub data as of {formatDate(store.dataAt)}, from the GitHub GraphQL API.{' '}
        {byCompanies
          ? 'Countries and industries come from each company\'s own details.'
          : kind === 'language'
            ? 'A repository counts once, under the main language GitHub detects for it.'
            : 'Topics are the labels each repository\'s owners chose on GitHub.'}
      </DvSourceNote>
    </>
  )
}
