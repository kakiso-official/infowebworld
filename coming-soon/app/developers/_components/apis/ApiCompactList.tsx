import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { apiAuthType, apiHref, officialSdks } from '@/lib/developers/apis'
import { apiDetailExists } from '@/lib/developers/indexing'
import { formatNumber } from '@/lib/developers/format'
import { apiCategoryPath } from '@/lib/developers/paths'
import { apiCategoryIcon } from '@/lib/developers/taxonomy'
import type { FreeApi } from '@/lib/developers/types'
import { authLabel } from '../ui/Badges'

/* ═══════════════════════════════════════════════════════════════════════
   Compact API list for the collection pages (spec 3.16): hundreds of APIs
   grouped by category, each group a <section id="{category}"> (the anchor
   the category pages link to: /no-auth#weather) with its own heading.

   A row is the name (our page for a reviewed API, else the API itself in
   a new tab), a one-line description and its facts as one line of plain
   words. Facts every row of the list shares are left out (`hide`): a list
   of no-key APIs does not say "No key" 800 times. No icon per row, so a page of
   ~850 APIs stays light; the external-link mark is the shared CSS
   .dv-ext-mark.

   Rows carry the data-* values ApiFilterBar reads (data-auth, data-https,
   data-cors, data-sdk); the text filter reads the row's own text. A group
   whose rows are all filtered out hides itself ([data-row-group]).
   ═══════════════════════════════════════════════════════════════════════ */

export interface ApiGroup {
  category: { slug: string; name: string }
  apis: readonly FreeApi[]
}

export interface ApiCompactListProps {
  groups: readonly ApiGroup[]
  /** id of the wrapper (the ApiFilterBar target). */
  targetId: string
  /** Facts shared by every row, left out of the rows. */
  hide?: { auth?: boolean; https?: boolean; cors?: boolean }
  className?: string
}

function corsWord(cors: FreeApi['cors']): string {
  return cors === 'yes' ? 'CORS' : cors === 'no' ? 'No CORS' : 'CORS unknown'
}

export default function ApiCompactList({ groups, targetId, hide = {}, className }: ApiCompactListProps) {
  if (!groups.length) return null
  return (
    <div id={targetId} className={`dv-apigroups${className ? ` ${className}` : ''}`}>
      {groups.map(g => {
        const headingId = `${g.category.slug}-title`
        return (
          <section key={g.category.slug} id={g.category.slug} className="dv-apigroup" data-row-group="" aria-labelledby={headingId}>
            <h2 id={headingId} className="dv-apigroup-title">
              <span className="dv-icon-tile" aria-hidden="true"><FontAwesomeIcon icon={apiCategoryIcon(g.category.slug)} /></span>
              <a href={apiCategoryPath(g.category.slug)}>{g.category.name}</a>
              <span className="dv-apigroup-count">{formatNumber(g.apis.length)}</span>
            </h2>
            <ul className="dv-apilist">
              {g.apis.map(api => {
                const { href, external } = apiHref(api)
                const auth = apiAuthType(api)
                const sdks = officialSdks(api).length
                const desc = api.details?.summary || api.description
                return (
                  <li
                    key={api.id}
                    className="dv-apilist-row"
                    data-row=""
                    data-auth={auth}
                    data-https={api.https ? '1' : '0'}
                    data-cors={api.cors}
                    data-sdk={sdks > 0 ? '1' : '0'}
                  >
                    <div className="dv-apilist-main">
                      {external ? (
                        <a className="dv-apilist-name" href={href} target="_blank" rel="noopener noreferrer">
                          {api.name}
                          <span className="dv-ext-mark" aria-hidden="true" />
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ) : (
                        <a className="dv-apilist-name" href={href}>{api.name}</a>
                      )}
                      {apiDetailExists(api) && <span className="dv-apilist-tag">Reviewed</span>}
                      {desc && <p className="dv-apilist-desc">{desc}</p>}
                    </div>
                    <p className="dv-apilist-facts">
                      {[
                        !hide.auth && authLabel(auth, api.authRaw),
                        !hide.https && (api.https ? 'HTTPS' : 'HTTP only'),
                        !hide.cors && corsWord(api.cors),
                        sdks > 0 && `${formatNumber(sdks)} official ${sdks === 1 ? 'SDK' : 'SDKs'}`,
                      ].filter(Boolean).map(f => `${f} \u00B7 `).join('')}
                      <span className={api.status === 'alive' ? 'dv-apilist-ok' : 'dv-apilist-warn'}>
                        {api.status === 'alive' ? 'Link OK' : 'Could not auto-check'}
                      </span>
                    </p>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
