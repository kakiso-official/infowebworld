import { apiAuthType, apiHref, officialSdks } from '@/lib/developers/apis'
import { countLabel } from '@/lib/developers/format'
import type { FreeApi } from '@/lib/developers/types'
import { AuthBadge, CorsBadge, HttpsBadge, StatusBadge } from '../ui/Badges'
import DvExternalLink from '../ui/DvExternalLink'

/* ═══════════════════════════════════════════════════════════════════════
   ApiTable (spec 4.6, 4.8) - every API of a category or collection, in one
   table: Name, Auth, HTTPS, CORS, SDKs, Free tier, Status. A reviewed
   (enriched) row links to our detail page; any other row links out to the
   API itself (new tab, external icon) - the same apiHref() rule as
   ApiCard, so a filtered list and a card grid never disagree about where
   a row goes.

   Each row carries the data-* attributes ApiFilterBar (built on
   ui/RowFilter) reads: data-auth, data-https, data-cors, data-sdk and
   data-search. The table is complete and sorted (3.14 order: enriched,
   then alive A-Z, then blocked A-Z) without JS; the filter bar only hides
   rows and re-announces the count.
   ═══════════════════════════════════════════════════════════════════════ */

export interface ApiTableProps {
  apis: readonly FreeApi[]
  /** id placed on the <tbody> - the target ui/RowFilter reads rows from. */
  bodyId: string
  caption: string
  className?: string
}

function freeTierText(api: FreeApi): { text: string; muted: boolean } {
  const available = api.details?.freeTier.available
  if (available === true) return { text: 'Yes', muted: false }
  if (available === false) return { text: 'No', muted: true }
  return { text: 'Not published', muted: true }
}

export default function ApiTable({ apis, bodyId, caption, className }: ApiTableProps) {
  if (!apis.length) return null
  return (
    <div className={`dv-table-wrap${className ? ` ${className}` : ''}`}>
      <table className="dv-table" role="table">
        <caption className="dv-table-caption sr-only">{caption}</caption>
        <thead role="rowgroup">
          <tr role="row">
            <th scope="col" role="columnheader">Name</th>
            <th scope="col" role="columnheader">Auth</th>
            <th scope="col" role="columnheader">HTTPS</th>
            <th scope="col" role="columnheader">CORS</th>
            <th scope="col" role="columnheader" className="dv-td-num">SDKs</th>
            <th scope="col" role="columnheader">Free tier</th>
            <th scope="col" role="columnheader">Status</th>
          </tr>
        </thead>
        <tbody role="rowgroup" id={bodyId}>
          {apis.map(api => {
            const { href, external } = apiHref(api)
            const auth = apiAuthType(api)
            const official = officialSdks(api).length
            const freeTier = freeTierText(api)
            const search = `${api.name} ${api.details?.summary ?? api.description}`.toLowerCase()
            return (
              <tr
                role="row"
                key={api.id}
                data-row
                data-auth={auth}
                data-https={api.https ? '1' : '0'}
                data-cors={api.cors}
                data-sdk={official > 0 ? '1' : '0'}
                data-search={search}
              >
                <td role="cell" className="dv-td-name">
                  {external ? (
                    <DvExternalLink href={href}>{api.name}</DvExternalLink>
                  ) : (
                    <a href={href}>{api.name}</a>
                  )}
                  <p className="dv-td-desc">{api.details?.summary ?? api.description}</p>
                </td>
                <td role="cell"><AuthBadge auth={auth} raw={api.authRaw} /></td>
                <td role="cell" data-label="HTTPS"><HttpsBadge https={api.https} /></td>
                <td role="cell" data-label="CORS"><CorsBadge cors={api.cors} /></td>
                <td role="cell" className="dv-td-num" data-label="SDKs">
                  {official > 0 ? countLabel(official, 'SDK') : <span className="dv-td-dim">-</span>}
                </td>
                <td role="cell" data-label="Free tier">
                  <span className={freeTier.muted ? 'dv-td-dim' : undefined}>{freeTier.text}</span>
                </td>
                <td role="cell" data-label="Status">
                  <StatusBadge status={api.status} checkedAt={api.linkCheckedAt} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
