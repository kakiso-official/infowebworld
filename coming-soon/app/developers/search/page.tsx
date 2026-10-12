import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/app/styles/developers/hub.css'
import type { Metadata } from 'next'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { topCategories } from '@/lib/developers/apis'
import { formatNumber } from '@/lib/developers/format'
import { devCrumbs } from '@/lib/developers/jsonld'
import { apiCategoryPath, devSearchPath, ossFacetPath } from '@/lib/developers/paths'
import { devMetadata, searchSeo } from '@/lib/developers/seo'
import { normalizeSearchQuery, searchDevhub, SEARCH_MAX_CHARS } from '@/lib/developers/search'
import { tryGetApis, tryGetOss } from '@/lib/developers/store'
import DvPageHeader from '../_components/shell/DvPageHeader'
import DvBand from '../_components/shell/DvBand'
import DvEmpty from '../_components/shell/DvEmpty'
import DvJsonLd from '../_components/shell/DvJsonLd'
import DvFacetChips from '../_components/ui/DvFacetChips'
import DvSearchBox from '../_components/search/DvSearchBox'
import SearchResults from '../_components/hub/SearchResults'

/* ═══════════════════════════════════════════════════════════════════════
   Search - /developers/search?q= (spec 3.3).

   The full-page results behind every search box in the section (a plain
   GET form, so it works without JS). Reads searchParams, so it renders
   per request; searchDevhub() runs in-process (no HTTP hop to the JSON
   route). Always 200, always noindex, follow, canonical without the
   query. No query or no match shows the biggest categories and
   languages instead, plus a link to the site-wide search.
   ═══════════════════════════════════════════════════════════════════════ */

const PER_GROUP = 30

interface SearchProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function queryOf(params: Record<string, string | string[] | undefined>): string {
  const raw = params.q
  const q = Array.isArray(raw) ? raw[0] : raw
  return (q ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, SEARCH_MAX_CHARS)
}

export async function generateMetadata({ searchParams }: SearchProps): Promise<Metadata> {
  const seo = searchSeo(queryOf(await searchParams))
  return devMetadata({ path: devSearchPath(), title: seo.title, description: seo.description, indexable: false })
}

export default async function DeveloperSearchPage({ searchParams }: SearchProps) {
  const q = queryOf(await searchParams)
  const seo = searchSeo(q)
  const crumbs = devCrumbs.search()
  const searchable = normalizeSearchQuery(q) !== ''
  const [results, oss, apis] = await Promise.all([
    searchable ? searchDevhub(q, { limit: PER_GROUP }) : Promise.resolve(null),
    tryGetOss(),
    tryGetApis(),
  ])
  const shown = results
    ? Object.values(results.groups).reduce((n, list) => n + list.length, 0)
    : 0

  const suggestions = [
    ...(apis ? topCategories(apis, 8).map(c => ({ label: c.name, href: apiCategoryPath(c.slug), count: c.apis })) : []),
    ...(oss ? oss.facets.language.filter(f => f.indexable).slice(0, 6).map(f => ({ label: f.name, href: ossFacetPath('language', f.slug), count: f.repos, dot: f.color ?? null })) : []),
  ]

  return (
    <>
      <DvJsonLd path={devSearchPath()} name={seo.h1} crumbs={crumbs} type="SearchResultsPage" />

      <DvPageHeader
        crumbs={crumbs}
        icon={faMagnifyingGlass}
        title={seo.h1}
        lead={results && shown > 0
          ? `${formatNumber(results.total)} ${results.total === 1 ? 'match' : 'matches'} across free APIs, SDKs, companies and open source repositories.`
          : 'Search free APIs, official SDKs, companies and open source repositories.'}
        below={<DvSearchBox size="hero" defaultValue={q} />}
      />

      <DvBand tone="white" id="dv-search-results" label="Search results" tight>
        {results && shown > 0 ? (
          <SearchResults results={results} />
        ) : (
          <DvEmpty
            icon={faMagnifyingGlass}
            title={q ? `No results for "${q}".` : 'What are you looking for?'}
            text={q ? 'Try a broader word like weather or payments, or one of these:' : 'Type a company, a repository, an API or a language, or start from one of these:'}
            action={q ? <a className="dv-btn dv-btn--secondary dv-btn--sm" href={`/search?q=${encodeURIComponent(q)}`}>Search all of InfoWebWorld</a> : undefined}
          />
        )}
        {(!results || shown === 0) && suggestions.length > 0 && (
          <DvFacetChips className="dv-search-suggest" label="Popular categories and languages" items={suggestions} scroll={false} />
        )}
      </DvBand>
    </>
  )
}
