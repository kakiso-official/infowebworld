import type { GhLanguage, OssRepo } from '@/lib/developers/types'
import { formatCompact, formatNumber, parseIsoDate } from '@/lib/developers/format'
import { repoLanguageSlug, type OssStore } from '@/lib/developers/oss'
import { ossCompanyPath, ossRepoPath } from '@/lib/developers/paths'
import { ArchivedBadge, StarCount } from '../ui/Badges'
import LanguageDot from '../ui/LanguageDot'
import DvTime from '../ui/DvTime'

/* ═══════════════════════════════════════════════════════════════════════
   Ranked repository table (spec 3.8, 3.11, 4.6): the most-starred list,
   language and topic pages, and the top repos of a country or industry.

     #  Repository (owner/name + description)  Company  Language
        Stars  Forks  Good first issues  Last push

   Each name links to our repository page. Rows carry the data-* values
   RepoFilterBar (ui/RowFilter) filters and sorts by: data-lang, data-gfi,
   data-archived, data-stars, data-forks, data-pushed, data-search. Without
   JS the table is complete and in rank order.
   ═══════════════════════════════════════════════════════════════════════ */

export interface RepoRankRow {
  /** nameWithOwner: unique across companies. */
  key: string
  /** Our repository page. */
  href: string
  nameWithOwner: string
  description: string | null
  companyName: string
  companyHref: string
  stars: number
  forks: number
  primaryLanguage: GhLanguage | null
  langSlug: string | null
  goodFirstIssues: number
  pushedAt: string
  isArchived: boolean
  topics: readonly string[]
}

/** The row for one repo of the open-source store. */
export function repoRankRow(store: OssStore, repo: OssRepo): RepoRankRow {
  const company = store.companyBySlug.get(repo.companySlug)
  return {
    key: repo.id,
    href: ossRepoPath(repo.companySlug, repo.slug),
    nameWithOwner: repo.nameWithOwner,
    description: repo.description,
    companyName: company?.name ?? repo.owner,
    companyHref: ossCompanyPath(repo.companySlug),
    stars: repo.stars,
    forks: repo.forks,
    primaryLanguage: repo.primaryLanguage,
    langSlug: repoLanguageSlug(repo),
    goodFirstIssues: repo.goodFirstIssues,
    pushedAt: repo.pushedAt,
    isArchived: repo.isArchived,
    topics: repo.topics,
  }
}

export interface RepoRankTableProps {
  rows: readonly RepoRankRow[]
  /** Rank of the first row (page 2 of 48-row pages starts at 49). */
  rankStart?: number
  /** Show the rank column (default true). */
  ranked?: boolean
  /** Show the company column (default true). */
  showCompany?: boolean
  dataAt: string
  caption: string
  /** id of the <tbody> (the RepoFilterBar target). */
  bodyId?: string
  className?: string
}

export default function RepoRankTable({
  rows, rankStart = 1, ranked = true, showCompany = true, dataAt, caption, bodyId, className,
}: RepoRankTableProps) {
  if (!rows.length) return null
  return (
    <div className={`dv-table-wrap${className ? ` ${className}` : ''}`}>
      <table className="dv-table dv-repotable" role="table">
        <caption className="dv-table-caption">{caption}</caption>
        <thead role="rowgroup">
          <tr role="row">
            {ranked && <th scope="col" role="columnheader" className="dv-td-rank"><span aria-hidden="true">#</span><span className="sr-only">Rank</span></th>}
            <th scope="col" role="columnheader">Repository</th>
            {showCompany && <th scope="col" role="columnheader">Company</th>}
            <th scope="col" role="columnheader">Language</th>
            <th scope="col" role="columnheader" className="dv-td-num">Stars</th>
            <th scope="col" role="columnheader" className="dv-td-num dv-col-low">Forks</th>
            <th scope="col" role="columnheader" className="dv-td-num dv-col-low">Good first issues</th>
            <th scope="col" role="columnheader" className="dv-col-low">Last push</th>
          </tr>
        </thead>
        <tbody role="rowgroup" id={bodyId}>
          {rows.map((r, i) => {
            const rank = rankStart + i
            const [owner, name] = r.nameWithOwner.split('/')
            const pushed = parseIsoDate(r.pushedAt)?.getTime() ?? 0
            const search = `${r.nameWithOwner} ${r.description ?? ''} ${r.companyName} ${r.topics.join(' ')}`.toLowerCase()
            return (
              <tr
                role="row"
                key={r.key}
                data-row=""
                data-lang={r.langSlug ?? ''}
                data-gfi={r.goodFirstIssues > 0 ? '1' : '0'}
                data-archived={r.isArchived ? '1' : '0'}
                data-stars={r.stars}
                data-forks={r.forks}
                data-pushed={pushed}
                data-search={search}
              >
                {ranked && (
                  <td role="cell" className="dv-td-rank">
                    <span className={`dv-rank${rank <= 3 ? ' dv-rank--top' : ''}`}>{rank}</span>
                  </td>
                )}
                <td role="cell" className="dv-td-name">
                  <a href={r.href}><code>{owner}/<b>{name ?? owner}</b></code></a>
                  {r.isArchived && <> <ArchivedBadge /></>}
                  {r.description && <p className="dv-td-desc">{r.description}</p>}
                </td>
                {showCompany && (
                  <td role="cell" className="dv-td-meta" data-label="by">
                    <a className="dv-td-link" href={r.companyHref}>{r.companyName}</a>
                  </td>
                )}
                <td role="cell" className="dv-td-meta">
                  {r.primaryLanguage && <LanguageDot name={r.primaryLanguage.name} color={r.primaryLanguage.color} />}
                </td>
                <td role="cell" className="dv-td-metric dv-td-num">
                  <StarCount count={r.stars} />
                </td>
                <td role="cell" className="dv-td-meta dv-td-num dv-col-low dv-td-hide-sm" data-label="Forks">
                  <span title={`${formatNumber(r.forks)} forks`}>{formatCompact(r.forks)}</span>
                </td>
                <td role="cell" className="dv-td-meta dv-td-num dv-col-low dv-td-hide-sm" data-label="Good first issues">
                  {r.goodFirstIssues > 0 ? formatNumber(r.goodFirstIssues) : <span className="dv-td-dim">0</span>}
                </td>
                <td role="cell" className="dv-td-meta dv-col-low" data-label="Pushed">
                  <DvTime iso={r.pushedAt} format="age" snapshot={dataAt} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
