import type { Metadata } from 'next'
import { faBuilding, faCodeBranch, faCubes, faSeedling, faStar } from '@fortawesome/free-solid-svg-icons'
import { countLabel, formatDate, formatNumber } from '@/lib/developers/format'
import {
  companyAvatar, facetCompanies, facetRepos, pageSlice, relatedFacets, type OssStore,
} from '@/lib/developers/oss'
import type { ApisStore } from '@/lib/developers/apis'
import {
  PAGE_SIZE, gfiPath, lastPage, ossCompanyPath, ossFacetIndexPath, ossFacetPath, resolvePageParam, sdkPath,
  type OssFacetKind,
} from '@/lib/developers/paths'
import { devCrumbs, faqGraphNode, listNode } from '@/lib/developers/jsonld'
import { devNotFoundMetadata, devPageMetadata, devUnavailableMetadata, facetPageSeo, noDash } from '@/lib/developers/seo'
import { getIwwLinks, getOss, tryGetApis } from '@/lib/developers/store'
import { industryIcon, industrySector } from '@/lib/developers/taxonomy'
import { facetFaqs } from '@/lib/developers/copy/faqs'
import type { FacetValue } from '@/lib/developers/types'
import { countryHubPath, countryInPhrase, countrySlug } from '@/lib/country-paths'
import { sectorLandingPath } from '@/lib/sector-paths'
import { canonicalSlug, resolveSafely, type Resolved } from '../../../_lib/resolve'
import DvPageHeader from '../../shell/DvPageHeader'
import DvStatStrip from '../../shell/DvStatStrip'
import DvDataLine from '../../shell/DvDataLine'
import DvBand from '../../shell/DvBand'
import DvPagination from '../../shell/DvPagination'
import DvFaq from '../../shell/DvFaq'
import DvSourceNote from '../../shell/DvSourceNote'
import DvJsonLd from '../../shell/DvJsonLd'
import DvFacetChips from '../../ui/DvFacetChips'
import DvFlag from '../../ui/DvFlag'
import DvLinkRows, { type DvLinkRow } from '../../ui/DvLinkRows'
import RepoRankTable, { repoRankRow } from '../RepoRankTable'
import RepoFilterBar from '../RepoFilterBar'
import CompanyTable, { companyTableRow } from '../CompanyTable'
import CompanyFilterBar from '../CompanyFilterBar'
import CompanyChips from '../CompanyChips'
import { countryOptions, industryOptions, languageOptions } from './options'

/* ═══════════════════════════════════════════════════════════════════════
   Facet pages (spec 3.11), one template for four kinds:

     /developers/open-source/languages/{language}[/page/{n}]   48 repos a page
     /developers/open-source/topics/{topic}[/page/{n}]         48 repos a page
     /developers/open-source/countries/{country}               every company + top 48 repos
     /developers/open-source/industries/{industry}             every company + top 48 repos

   An unknown slug is a real 404; a non-canonical one ('TypeScript',
   'C%2B%2B') 308s to its canonical slug when that exists; /page/1 308s
   to the clean URL and a page past the end 404s. Indexed by the facet
   gate (lib/developers/indexing.ts); /page/{n} pages share it.
   ═══════════════════════════════════════════════════════════════════════ */

export interface FacetPage {
  store: OssStore
  kind: OssFacetKind
  facet: FacetValue
  page: number
  last: number
  /** Free-APIs store for the language page's SDK bridge (null otherwise). */
  apis: ApisStore | null
  /** Verified InfoWebWorld country hubs (country pages only). */
  countryHubs: readonly string[]
}

function isPaginated(kind: OssFacetKind): boolean {
  return kind === 'language' || kind === 'topic'
}

export function resolveFacetPage(kind: OssFacetKind, rawSlug: string, rawPage?: string): Promise<Resolved<FacetPage>> {
  return resolveSafely<FacetPage>(async () => {
    const store = await getOss()
    const slug = canonicalSlug(rawSlug)
    const facet = store.facetBySlug[kind].get(slug)
    if (!facet) return { kind: 'not-found' }

    const last = isPaginated(kind) ? lastPage(facet.repos, PAGE_SIZE.facetRepos) : 1
    let page = 1
    if (rawPage !== undefined) {
      if (!isPaginated(kind)) return { kind: 'not-found' }
      const r = resolvePageParam(rawPage, last)
      if (r.kind === 'not-found') return { kind: 'not-found' }
      if (r.kind === 'redirect-first') return { kind: 'redirect', path: ossFacetPath(kind, slug) }
      page = r.page
    }
    if (slug !== rawSlug) return { kind: 'redirect', path: ossFacetPath(kind, slug, page) }

    const apis = kind === 'language' ? await tryGetApis() : null
    const countryHubs = kind === 'country' ? (await getIwwLinks()).countryHubs : []
    return { kind: 'ok', value: { store, kind, facet, page, last, apis, countryHubs } }
  })
}

/** Metadata for a resolved facet page; `rawSlug` is the requested slug
 *  (the canonical of a page that could not be loaded). */
export function facetPageMetadata(kind: OssFacetKind, res: Resolved<FacetPage>, rawSlug: string): Metadata {
  if (res.kind === 'unavailable') {
    return devUnavailableMetadata(ossFacetPath(kind, canonicalSlug(rawSlug)), facetPageSeo({ kind, name: canonicalSlug(rawSlug), repos: 0, companies: 0 }))
  }
  if (res.kind !== 'ok') return devNotFoundMetadata()
  const { facet, page } = res.value
  return devPageMetadata(ossFacetPath(kind, facet.slug, page), facetPageSeo(facet, page), facet.indexable)
}

/* The sub-heading under the H1 (3.11), each with real counts. */
function leadFor(kind: OssFacetKind, facet: FacetValue): string {
  const name = noDash(facet.name)
  const repos = countLabel(facet.repos, 'public repository', 'public repositories')
  const companies = countLabel(facet.companies, 'company', 'companies')
  switch (kind) {
    case 'language':
      return `${repos} whose main language is ${name}, published by ${companies} on GitHub. Pick one to see its company, license and how to contribute.`
    case 'topic':
      return `${repos} tagged ${name} on GitHub, published by ${companies}. Pick one to see its company, license and how to contribute.`
    case 'country':
      return `${companies} headquartered in ${countryInPhrase(name)} publish ${repos} on GitHub. See who they are and their most-starred projects.`
    default:
      return `${countLabel(facet.companies, `${name} company`, `${name} companies`)} publish ${repos} on GitHub. See who they are and their most-starred projects.`
  }
}

const RELATED_LABEL: Readonly<Record<OssFacetKind, (name: string) => string>> = {
  language: name => `Popular topics in ${name}`,
  topic: name => `Languages used for ${name}`,
  country: name => `Industries in ${countryInPhrase(name)}`,
  industry: name => `Where ${name} companies are based`,
}

const BODY_REPOS = 'dv-facet-repo-rows'
const BODY_COMPANIES = 'dv-facet-company-rows'

export default function FacetPageView({ store, kind, facet, page, last, apis, countryHubs }: FacetPage) {
  const name = noDash(facet.name)
  const seo = facetPageSeo(facet, page)
  const path = ossFacetPath(kind, facet.slug, page)
  const crumbs = devCrumbs.facet(kind, facet.slug, facet.name)
  const paginated = isPaginated(kind)

  const allRepos = facetRepos(store, kind, facet.slug)
  const repos = paginated ? pageSlice(allRepos, page, PAGE_SIZE.facetRepos) : allRepos.slice(0, PAGE_SIZE.facetRepos)
  const rows = repos.map(r => repoRankRow(store, r))
  const start = paginated ? (page - 1) * PAGE_SIZE.facetRepos + 1 : 1
  const end = start + rows.length - 1

  const companies = facetCompanies(store, kind, facet.slug)
  const related = relatedFacets(store, kind, facet.slug, 12)
  const faqs = page === 1 ? facetFaqs(store, kind, facet.slug) : []

  /* "Companies publishing {Language} projects": most repos in this facet first. */
  const perCompany = new Map<string, number>()
  if (paginated) for (const r of allRepos) perCompany.set(r.companySlug, (perCompany.get(r.companySlug) ?? 0) + 1)
  const companyChips = paginated
    ? [...perCompany.entries()]
      .sort((a, b) => b[1] - a[1] || (store.rankBySlug.get(a[0]) ?? 0) - (store.rankBySlug.get(b[0]) ?? 0))
      .slice(0, 24)
      .map(([slug, n]) => {
        const c = store.companyBySlug.get(slug)!
        return { name: c.name, href: ossCompanyPath(slug), avatarUrl: companyAvatar(c) || null, count: n, countLabel: countLabel(n, 'project') }
      })
    : []

  /* Bridges to other pages, each only when its target page is indexed. */
  const links: DvLinkRow[] = []
  if (kind === 'language') {
    const gfi = store.gfiLanguages.find(l => l.slug === facet.slug)
    if (gfi?.indexable) links.push({ href: gfiPath(facet.slug), label: `Good first issues in ${name}`, icon: faSeedling })
    const sdk = apis?.sdkLanguageStats.find(s => s.slug === facet.slug)
    if (sdk?.indexable) links.push({ href: sdkPath(facet.slug), label: `Official ${name} SDKs for free APIs`, icon: faCubes })
  }
  if (kind === 'country') {
    const hub = countryHubPath(countrySlug(facet.name))
    if (countryHubs.includes(hub)) links.push({ href: hub, label: `Find ${name} businesses on InfoWebWorld`, icon: faBuilding })
  }
  if (kind === 'industry') {
    const sector = industrySector(facet.slug)
    if (sector) links.push({ href: sectorLandingPath(sector), label: `Find ${name} companies on InfoWebWorld`, icon: faBuilding })
  }

  const about = kind === 'language'
    ? [{ '@type': 'ComputerLanguage', name }]
    : kind === 'country'
      ? [{ '@type': 'Country', name }]
      : undefined

  const relatedChips = related.filter(r => r.facet.slug !== facet.slug).map(r => ({
    label: r.facet.name,
    href: ossFacetPath(r.kind, r.facet.slug),
    count: r.count,
    ...(r.kind === 'language' ? { dot: r.facet.color ?? null } : {}),
    ...(r.kind === 'country' && r.facet.iso2 ? { flag: r.facet.iso2 } : {}),
    ...(r.kind === 'industry' ? { icon: industryIcon(r.facet.slug) } : {}),
  }))

  return (
    <>
      <DvJsonLd
        path={path}
        name={seo.h1}
        description={seo.description}
        crumbs={crumbs}
        dateModified={store.dataAt}
        about={about}
        nodes={[
          listNode(path, paginated ? `${seo.h1}, ${formatNumber(start)} to ${formatNumber(end)}` : seo.h1,
            paginated
              ? rows.map(r => ({ name: r.nameWithOwner, url: r.href }))
              : companies.map(c => ({ name: c.name, url: ossCompanyPath(c.slug) }))),
          faqGraphNode(path, faqs),
        ]}
      />

      <DvPageHeader
        crumbs={crumbs}
        title={seo.h1}
        width="wide"
        accent={kind === 'language' ? facet.color ?? null : null}
        media={kind === 'country' && facet.iso2 ? <span className="dv-ph-flag"><DvFlag code={facet.iso2} /></span> : undefined}
        icon={kind === 'industry' ? industryIcon(facet.slug) : undefined}
        lead={leadFor(kind, facet)}
        dataLine={<DvDataLine source="github" date={store.snapshotAt} refresh={store.meta.refresh} />}
        below={(
          <>
            <DvStatStrip
              items={[
                { label: 'Repositories', value: facet.repos, icon: faCodeBranch },
                { label: 'Companies', value: facet.companies, icon: faBuilding },
                { label: 'GitHub stars', value: facet.stars, icon: faStar, format: 'compact' },
                { label: 'Good first issues', value: facet.goodFirstIssues, icon: faSeedling },
              ]}
            />
            {relatedChips.length > 0 && (
              <div>
                <p className="dv-label dv-chiprow-label">{RELATED_LABEL[kind](name)}</p>
                <DvFacetChips label={RELATED_LABEL[kind](name)} items={relatedChips} />
              </div>
            )}
          </>
        )}
      />

      {!paginated && (
        <DvBand
          tone="white"
          width="wide"
          id="dv-facet-companies"
          title={kind === 'country' ? `Open source companies in ${countryInPhrase(name)}` : `${name} companies with open source`}
          sub="Ranked by the GitHub stars of their tracked projects."
          tight
        >
          <CompanyFilterBar
            target={BODY_COMPANIES}
            industries={kind === 'country' ? industryOptions(companies) : undefined}
            countries={kind === 'industry' ? countryOptions(companies) : undefined}
          />
          <CompanyTable
            rows={companies.map(c => companyTableRow(store, c))}
            showCountry={kind !== 'country'}
            showIndustry={kind !== 'industry'}
            bodyId={BODY_COMPANIES}
            caption={`${countLabel(companies.length, 'company', 'companies')}, ranked by GitHub stars`}
          />
        </DvBand>
      )}

      <DvBand
        tone={paginated ? 'white' : 'wash'}
        width="wide"
        id="dv-facet-repos"
        title={paginated ? `Most-starred ${name} projects` : `Most-starred projects from ${kind === 'country' ? `companies in ${countryInPhrase(name)}` : `${name} companies`}`}
        sub={paginated && page > 1 ? `Page ${page} of ${last}.` : undefined}
        tight={paginated}
      >
        <RepoFilterBar target={BODY_REPOS} languages={kind === 'language' ? undefined : languageOptions(repos)} />
        <RepoRankTable
          rows={rows}
          rankStart={start}
          dataAt={store.dataAt}
          bodyId={BODY_REPOS}
          caption={paginated
            ? `Showing ${formatNumber(start)}-${formatNumber(end)} of ${formatNumber(facet.repos)} repositories, ranked by GitHub stars`
            : `The ${formatNumber(rows.length)} most-starred of ${formatNumber(facet.repos)} repositories, ranked by GitHub stars`}
        />
        {paginated && <DvPagination page={page} last={last} hrefFor={p => ossFacetPath(kind, facet.slug, p)} label={`${name} project pages`} />}
      </DvBand>

      {companyChips.length > 0 && (
        <DvBand tone="wash" id="dv-facet-company-chips" title={`Companies publishing ${name} projects`} sub="Most projects first.">
          <CompanyChips items={companyChips} label={`Companies publishing ${name} projects`} />
        </DvBand>
      )}

      {links.length > 0 && (
        <DvBand tone="white" id="dv-facet-links" title="Keep exploring" tight>
          <DvLinkRows items={links} />
        </DvBand>
      )}

      <DvFaq heading={`${name} open source FAQs`} faqs={faqs} tone="wash" />

      <DvSourceNote>
        GitHub data as of {formatDate(store.dataAt)}, from the GitHub GraphQL API. Forks are excluded, and we track up
        to {store.meta.reposPerOrgLimit} most-starred repositories per GitHub organization. <a href={ossFacetIndexPath(kind)}>See all {kind === 'country' ? 'countries' : kind === 'industry' ? 'industries' : `${kind}s`}</a>.
      </DvSourceNote>

    </>
  )
}
