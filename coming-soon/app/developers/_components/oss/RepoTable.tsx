import type { GhLanguage } from '@/lib/developers/types'
import { formatNumber, parseIsoDate } from '@/lib/developers/format'
import { ArchivedBadge, GfiBadge, LicenseBadge, StarCount } from '../ui/Badges'
import LanguageDot from '../ui/LanguageDot'
import DvTime from '../ui/DvTime'

/* ═══════════════════════════════════════════════════════════════════════
   Project list for a company page (spec 4.6 table contract): name in
   <code>, description when present, language and license only when
   present (missing fields render an empty cell, hidden on phones by
   tables.css), stars always shown (a real count, never a guessed one).

   Each name links to our repository page. Rows carry the data-* values
   RepoFilterBar reads (data-lang, data-gfi, data-archived, data-stars,
   data-forks, data-pushed, data-search); without JS every row shows in
   stars order, archived ones dimmed.
   ═══════════════════════════════════════════════════════════════════════ */

export interface RepoTableRow {
  slug: string
  /** Our repository page. */
  href: string
  name: string
  description: string | null
  stars: number
  forks?: number
  primaryLanguage: GhLanguage | null
  /** Language slug for the filter (data-lang). */
  langSlug?: string | null
  license: string | null
  pushedAt: string | null
  goodFirstIssues: number
  isArchived: boolean
  topics?: readonly string[]
}

export interface RepoTableProps {
  rows: readonly RepoTableRow[]
  dataAt: string
  caption: string
  /** id of the <tbody> (the RepoFilterBar target). */
  bodyId?: string
  className?: string
}

export default function RepoTable({ rows, dataAt, caption, bodyId, className }: RepoTableProps) {
  if (!rows.length) return null
  return (
    <div className={`dv-table-wrap${className ? ` ${className}` : ''}`}>
      <table className="dv-table" role="table">
        <caption className="dv-table-caption">{caption}</caption>
        <thead role="rowgroup">
          <tr role="row">
            <th scope="col" role="columnheader">Project</th>
            <th scope="col" role="columnheader" className="dv-col-low">Language</th>
            <th scope="col" role="columnheader" className="dv-col-low">License</th>
            <th scope="col" role="columnheader" className="dv-td-num">Stars</th>
          </tr>
        </thead>
        <tbody role="rowgroup" id={bodyId}>
          {rows.map(r => (
            <tr
              role="row"
              key={r.slug}
              data-row=""
              data-lang={r.langSlug ?? ''}
              data-gfi={r.goodFirstIssues > 0 ? '1' : '0'}
              data-archived={r.isArchived ? '1' : '0'}
              data-stars={r.stars}
              data-forks={r.forks ?? 0}
              data-pushed={parseIsoDate(r.pushedAt)?.getTime() ?? 0}
              data-search={`${r.name} ${r.description ?? ''} ${(r.topics ?? []).join(' ')}`.toLowerCase()}
            >
              <td role="cell" className="dv-td-name">
                <a href={r.href}><code>{r.name}</code></a>
                {r.description && <p className="dv-td-desc">{r.description}</p>}
                <span className="dv-td-sub">
                  {r.isArchived && <ArchivedBadge />}
                  <GfiBadge count={r.goodFirstIssues} />
                  {r.pushedAt && !r.isArchived && <>Updated <DvTime iso={r.pushedAt} format="age" snapshot={dataAt} /></>}
                </span>
              </td>
              <td role="cell" className="dv-td-meta dv-col-low" data-label="Language">
                {r.primaryLanguage && <LanguageDot name={r.primaryLanguage.name} color={r.primaryLanguage.color} />}
              </td>
              <td role="cell" className="dv-td-meta dv-col-low" data-label="License">
                {r.license && <LicenseBadge spdx={r.license} />}
              </td>
              <td role="cell" className="dv-td-metric dv-td-num" data-label="Stars">
                <StarCount count={r.stars} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="sr-only">{formatNumber(rows.length)} projects listed.</p>
    </div>
  )
}
