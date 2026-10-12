import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { officialSdks } from '@/lib/developers/apis'
import { apiPath } from '@/lib/developers/paths'
import { apiBaseName } from '@/lib/developers/seo'
import { languageIcon } from '@/lib/developers/taxonomy'
import type { FreeApi } from '@/lib/developers/types'
import DvExternalLink from '../ui/DvExternalLink'

/* ═══════════════════════════════════════════════════════════════════════
   The AI and LLM comparison (spec 3.16): one row per reviewed API.

     API (provider)  Free tier [source]  Card required  Rate limits
     Official SDKs   Docs

   Only verified fields: every free-tier cell links its source, a fact the
   provider does not publish reads "Not published". The order comes from
   the store (no card needed first, then name): we do not rank by opinion.
   On phones each row stacks into a card (tables.css).
   ═══════════════════════════════════════════════════════════════════════ */

export interface DvCompareTableProps {
  apis: readonly FreeApi[]
  caption: string
  className?: string
}

const NOT_PUBLISHED = <span className="dv-td-dim">Not published</span>

export default function DvCompareTable({ apis, caption, className }: DvCompareTableProps) {
  const rows = apis.filter(a => a.details)
  if (!rows.length) return null
  return (
    <div className={`dv-table-wrap${className ? ` ${className}` : ''}`}>
      <table className="dv-table dv-comparetable" role="table">
        <caption className="dv-table-caption">{caption}</caption>
        <thead role="rowgroup">
          <tr role="row">
            <th scope="col" role="columnheader">API</th>
            <th scope="col" role="columnheader">Free tier</th>
            <th scope="col" role="columnheader">Card required</th>
            <th scope="col" role="columnheader">Rate limits</th>
            <th scope="col" role="columnheader">Official SDKs</th>
            <th scope="col" role="columnheader">Docs</th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {rows.map(api => {
            const d = api.details!
            const ft = d.freeTier
            const sdks = officialSdks(api)
            const langs = [...new Map(sdks.map(s => [s.languageSlug, s.language])).entries()]
            return (
              <tr role="row" key={api.id}>
                <td role="cell" className="dv-td-name">
                  <a href={apiPath(api.category.slug, api.slug)}>{apiBaseName(api.name)}</a>
                  <span className="dv-td-sub">by {d.provider.name}</span>
                </td>
                <td role="cell" className="dv-td-meta dv-td-block" data-label="Free tier">
                  {ft.summary ? ft.summary : ft.available === true ? 'Free tier available.' : NOT_PUBLISHED}
                  {ft.sourceUrl && (
                    <>
                      {' '}
                      <a className="dv-src" href={ft.sourceUrl} target="_blank" rel="nofollow noopener noreferrer">
                        source<span className="sr-only"> for the {apiBaseName(api.name)} free tier (opens in a new tab)</span>
                      </a>
                    </>
                  )}
                </td>
                <td role="cell" className="dv-td-meta" data-label="Card required">
                  {ft.requiresCard === true ? 'Yes' : ft.requiresCard === false ? 'No' : NOT_PUBLISHED}
                </td>
                <td role="cell" className="dv-td-meta dv-td-block" data-label="Rate limits">
                  {d.rateLimits ?? NOT_PUBLISHED}
                </td>
                <td role="cell" className="dv-td-meta" data-label="Official SDKs">
                  {langs.length > 0 ? (
                    <span className="dv-compare-sdks">
                      {langs.map(([slug, name]) => (
                        <span key={slug} className="dv-compare-sdk">
                          <FontAwesomeIcon icon={languageIcon(slug)} aria-hidden="true" />{name}
                        </span>
                      ))}
                    </span>
                  ) : <span className="dv-td-dim">None found</span>}
                </td>
                <td role="cell" className="dv-td-meta" data-label="Docs">
                  {d.docsUrl ? <DvExternalLink href={d.docsUrl}>Docs</DvExternalLink> : NOT_PUBLISHED}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
