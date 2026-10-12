import type { GhLanguage, OssCompany } from '@/lib/developers/types'
import { formatCompact, formatNumber } from '@/lib/developers/format'
import { companyAvatar, companyIwwLink, type OssStore } from '@/lib/developers/oss'
import { ossCompanyPath, ossFacetPath } from '@/lib/developers/paths'
import OrgAvatar from '../ui/OrgAvatar'
import DvFlag from '../ui/DvFlag'
import LanguageDot from '../ui/LanguageDot'

/* ═══════════════════════════════════════════════════════════════════════
   Ranked company table (spec 3.9, 3.11, 4.6): the companies index and the
   company lists of country and industry pages.

     #  Company (avatar, name, one line, Listed)  Industry  Country
        Repos  Stars  Top language  Good first issues

   Industry and country cells link to their facet pages (only when that
   page exists). A country page hides the country column, an industry
   page the industry column. Rows carry the data-* values CompanyFilterBar
   reads: data-industry, data-country, data-listed, data-stars,
   data-repos, data-gfi and data-name (the text filter reads the row's own
   text). No icons per row (a country table can have 275 rows); stars
   print compact with the exact number in the tooltip and accessible text.
   ═══════════════════════════════════════════════════════════════════════ */

export interface CompanyTableRow {
  slug: string
  name: string
  href: string
  avatarUrl: string | null
  oneLiner: string | null
  industry: string
  industryHref: string | null
  industrySlug: string
  countryName: string | null
  countryHref: string | null
  countrySlug: string | null
  hqCountry: string | null
  trackedRepos: number
  stars: number
  topLanguage: GhLanguage | null
  goodFirstIssues: number
  listed: boolean
}

/** The row for one company of the open-source store. Facet links are set
 *  only for facet pages that exist (store.facetBySlug). */
export function companyTableRow(store: OssStore, company: OssCompany): CompanyTableRow {
  const stats = store.statsBySlug.get(company.slug)
  const top = stats?.topLanguages[0]
  return {
    slug: company.slug,
    name: company.name,
    href: ossCompanyPath(company.slug),
    avatarUrl: companyAvatar(company) || null,
    oneLiner: company.oneLiner,
    industry: company.industry,
    industryHref: store.facetBySlug.industry.has(company.industrySlug) ? ossFacetPath('industry', company.industrySlug) : null,
    industrySlug: company.industrySlug,
    countryName: company.countryName,
    countryHref: company.countrySlug && store.facetBySlug.country.has(company.countrySlug)
      ? ossFacetPath('country', company.countrySlug)
      : null,
    countrySlug: company.countrySlug,
    hqCountry: company.hqCountry,
    trackedRepos: stats?.trackedRepos ?? 0,
    stars: stats?.stars ?? 0,
    topLanguage: top ? { name: top.name, color: top.color } : null,
    goodFirstIssues: stats?.goodFirstIssues ?? 0,
    listed: companyIwwLink(company) !== null,
  }
}

export interface CompanyTableProps {
  rows: readonly CompanyTableRow[]
  rankStart?: number
  showIndustry?: boolean
  showCountry?: boolean
  caption: string
  bodyId?: string
  className?: string
}

export default function CompanyTable({
  rows, rankStart = 1, showIndustry = true, showCountry = true, caption, bodyId, className,
}: CompanyTableProps) {
  if (!rows.length) return null
  return (
    <div className={`dv-table-wrap${className ? ` ${className}` : ''}`}>
      <table className="dv-table dv-cotable" role="table">
        <caption className="dv-table-caption">{caption}</caption>
        <thead role="rowgroup">
          <tr role="row">
            <th scope="col" role="columnheader" className="dv-td-rank"><span aria-hidden="true">#</span><span className="sr-only">Rank</span></th>
            <th scope="col" role="columnheader">Company</th>
            {showIndustry && <th scope="col" role="columnheader" className="dv-col-low">Industry</th>}
            {showCountry && <th scope="col" role="columnheader">Country</th>}
            <th scope="col" role="columnheader" className="dv-td-num">Repos</th>
            <th scope="col" role="columnheader" className="dv-td-num">Stars</th>
            <th scope="col" role="columnheader" className="dv-col-low">Top language</th>
            <th scope="col" role="columnheader" className="dv-td-num dv-col-low">Good first issues</th>
          </tr>
        </thead>
        <tbody role="rowgroup" id={bodyId}>
          {rows.map((c, i) => {
            const rank = rankStart + i
            const starsExact = `${formatNumber(c.stars)} GitHub ${c.stars === 1 ? 'star' : 'stars'}`
            return (
              <tr
                role="row"
                key={c.slug}
                data-row=""
                data-industry={c.industrySlug}
                data-country={c.countrySlug ?? ''}
                data-listed={c.listed ? '1' : '0'}
                data-stars={c.stars}
                data-repos={c.trackedRepos}
                data-gfi={c.goodFirstIssues}
                data-name={c.name.toLowerCase()}
              >
                <td role="cell" className="dv-td-rank">
                  <span className={`dv-rank${rank <= 3 ? ' dv-rank--top' : ''}`}>{rank}</span>
                </td>
                <td role="cell" className="dv-td-name dv-cotable-name">
                  <span className="dv-cotable-co">
                    <OrgAvatar src={c.avatarUrl} name={c.name} size={28} />
                    <span className="dv-cotable-text">
                      <a href={c.href}>{c.name}</a>
                      {c.listed && <span className="dv-cotable-listed">Listed on InfoWebWorld</span>}
                      {c.oneLiner && <span className="dv-td-desc">{c.oneLiner}</span>}
                    </span>
                  </span>
                </td>
                {showIndustry && (
                  <td role="cell" className="dv-td-meta dv-col-low">
                    {c.industryHref ? <a className="dv-td-link" href={c.industryHref}>{c.industry}</a> : c.industry}
                  </td>
                )}
                {showCountry && (
                  <td role="cell" className="dv-td-meta">
                    {c.countryName && (
                      <span className="dv-country">
                        {c.hqCountry && <DvFlag code={c.hqCountry} />}
                        {c.countryHref ? <a className="dv-td-link" href={c.countryHref}>{c.countryName}</a> : <span>{c.countryName}</span>}
                      </span>
                    )}
                  </td>
                )}
                <td role="cell" className="dv-td-meta dv-td-num" data-label="Repos">{formatNumber(c.trackedRepos)}</td>
                <td role="cell" className="dv-td-metric dv-td-num">
                  <span title={starsExact} aria-hidden="true">{formatCompact(c.stars)}</span>
                  <span className="sr-only">{starsExact}</span>
                </td>
                <td role="cell" className="dv-td-meta dv-col-low">
                  {c.topLanguage && <LanguageDot name={c.topLanguage.name} color={c.topLanguage.color} />}
                </td>
                <td role="cell" className="dv-td-meta dv-td-num dv-col-low dv-td-hide-sm" data-label="Good first issues">
                  {c.goodFirstIssues > 0 ? formatNumber(c.goodFirstIssues) : <span className="dv-td-dim">0</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
