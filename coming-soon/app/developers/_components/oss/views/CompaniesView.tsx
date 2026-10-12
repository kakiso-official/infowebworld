import type { Metadata } from 'next'
import { faBuilding, faCircleCheck, faEarthAmericas, faIndustry } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { formatDate, formatNumber } from '@/lib/developers/format'
import { pageSlice, type OssStore } from '@/lib/developers/oss'
import {
  PAGE_SIZE, lastPage, methodologyPath, ossCompaniesPath, ossFacetIndexPath, ossFacetPath, resolvePageParam,
} from '@/lib/developers/paths'
import { isCompaniesPageIndexable } from '@/lib/developers/indexing'
import { devCrumbs, listNode } from '@/lib/developers/jsonld'
import { companiesIndexSeo, devNotFoundMetadata, devPageMetadata, devUnavailableMetadata } from '@/lib/developers/seo'
import { getOss } from '@/lib/developers/store'
import { industryIcon } from '@/lib/developers/taxonomy'
import { resolveSafely, type Resolved } from '../../../_lib/resolve'
import DvPageHeader from '../../shell/DvPageHeader'
import DvStatStrip from '../../shell/DvStatStrip'
import DvDataLine from '../../shell/DvDataLine'
import DvBand from '../../shell/DvBand'
import DvPagination from '../../shell/DvPagination'
import DvCtaBand from '../../shell/DvCtaBand'
import DvSourceNote from '../../shell/DvSourceNote'
import DvJsonLd from '../../shell/DvJsonLd'
import DvFacetChips from '../../ui/DvFacetChips'
import CompanyTable, { companyTableRow } from '../CompanyTable'
import CompanyFilterBar from '../CompanyFilterBar'
import { countryOptions, industryOptions } from './options'

/* ═══════════════════════════════════════════════════════════════════════
   Companies with open source (spec 3.9):
     /developers/open-source/companies            page 1
     /developers/open-source/companies/page/{n}   60 per page, all indexed
   Ranked by the GitHub stars of each company's tracked repositories.
   ═══════════════════════════════════════════════════════════════════════ */

export interface CompaniesPage {
  store: OssStore
  page: number
  last: number
}

export function resolveCompaniesPage(rawPage?: string): Promise<Resolved<CompaniesPage>> {
  return resolveSafely<CompaniesPage>(async () => {
    const store = await getOss()
    const last = lastPage(store.companies.length, PAGE_SIZE.companies)
    if (rawPage === undefined) return { kind: 'ok', value: { store, page: 1, last } }
    const r = resolvePageParam(rawPage, last)
    if (r.kind === 'not-found') return { kind: 'not-found' }
    if (r.kind === 'redirect-first') return { kind: 'redirect', path: ossCompaniesPath() }
    return { kind: 'ok', value: { store, page: r.page, last } }
  })
}

export function companiesMetadata(res: Resolved<CompaniesPage>): Metadata {
  if (res.kind === 'unavailable') return devUnavailableMetadata(ossCompaniesPath(), companiesIndexSeo({ companies: 0 }))
  if (res.kind !== 'ok') return devNotFoundMetadata()
  const { store, page } = res.value
  const seo = companiesIndexSeo({ companies: store.totals.companies, page })
  return devPageMetadata(ossCompaniesPath(page), seo, isCompaniesPageIndexable(page))
}

const BODY_ID = 'dv-companies-rows'

export default function CompaniesView({ store, page, last }: CompaniesPage) {
  const seo = companiesIndexSeo({ companies: store.totals.companies, page })
  const path = ossCompaniesPath(page)
  const crumbs = devCrumbs.companies()
  const companies = pageSlice(store.companies, page, PAGE_SIZE.companies)
  const rows = companies.map(c => companyTableRow(store, c))
  const start = (page - 1) * PAGE_SIZE.companies + 1
  const end = start + rows.length - 1
  const countries = store.facets.country.filter(f => f.indexable)
  const industries = store.facets.industry.filter(f => f.indexable)

  return (
    <>
      <DvJsonLd
        path={path}
        name={seo.h1}
        description={seo.description}
        crumbs={crumbs}
        dateModified={store.dataAt}
        nodes={[listNode(path, `Companies with open source projects, ${formatNumber(start)} to ${formatNumber(end)}`, rows.map(r => ({ name: r.name, url: r.href })))]}
      />

      <DvPageHeader
        crumbs={crumbs}
        title={seo.h1}
        width="wide"
        lead="Every company here has at least one public, non-fork repository on GitHub. Ranked by the GitHub stars of its tracked projects."
        dataLine={<DvDataLine source="github" date={store.snapshotAt} refresh={store.meta.refresh} />}
        below={(
          <DvStatStrip
            items={[
              { label: 'Companies', value: store.totals.companies, icon: faBuilding },
              { label: 'Countries', value: store.totals.countries, icon: faEarthAmericas },
              { label: 'Industries', value: store.totals.industries, icon: faIndustry },
              { label: 'Listed on InfoWebWorld', value: store.totals.listedOnIww, icon: faCircleCheck },
            ]}
          />
        )}
      />

      <DvBand tone="white" width="wide" id="dv-companies-list" label="Companies ranked by GitHub stars" tight>
        <CompanyFilterBar
          target={BODY_ID}
          industries={industryOptions(companies)}
          countries={countryOptions(companies)}
          label="Filter the companies on this page"
        />
        <CompanyTable
          rows={rows}
          rankStart={start}
          bodyId={BODY_ID}
          caption={`Showing ${formatNumber(start)}-${formatNumber(end)} of ${formatNumber(store.totals.companies)} companies, ranked by GitHub stars`}
        />
        <DvPagination page={page} last={last} hrefFor={p => ossCompaniesPath(p)} label="Company pages" />
      </DvBand>

      <DvBand tone="wash" id="dv-companies-groups" title="Browse companies by country and industry">
        <div className="dv-stack">
          {countries.length > 0 && (
            <DvFacetChips
              label="Countries"
              items={countries.map(f => ({ label: f.name, href: ossFacetPath('country', f.slug), count: f.companies, flag: f.iso2 ?? null }))}
              more={{ label: 'All countries', href: ossFacetIndexPath('country') }}
              scroll={false}
            />
          )}
          {industries.length > 0 && (
            <DvFacetChips
              label="Industries"
              items={industries.map(f => ({ label: f.name, href: ossFacetPath('industry', f.slug), count: f.companies, icon: industryIcon(f.slug) }))}
              more={{ label: 'All industries', href: ossFacetIndexPath('industry') }}
              scroll={false}
            />
          )}
        </div>
      </DvBand>

      <DvCtaBand
        title="Is your company on GitHub? Put its open source on InfoWebWorld."
        sub="List your company free, tell us your GitHub organization, and reach the developers who use your code."
        action={{ href: '/business', label: 'List your company' }}
        icon={faGithub}
        id="dv-companies-cta"
      />

      <DvSourceNote>
        GitHub data as of {formatDate(store.dataAt)}, from the GitHub GraphQL API. A company is listed once we have
        matched its GitHub organization to the company; <a href={methodologyPath()}>how we check</a> explains the rules.
      </DvSourceNote>
    </>
  )
}
