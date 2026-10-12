import type { SdkRow } from '@/lib/developers/apis'
import { parseIsoDate } from '@/lib/developers/format'
import { installCommand, registryPageUrl, REGISTRY_LABELS } from '@/lib/developers/snippets'
import { apiBaseName } from '@/lib/developers/seo'
import { OfficialBadge } from '../ui/Badges'
import CopyButton from '../ui/CopyButton'
import DvTime from '../ui/DvTime'

/* ═══════════════════════════════════════════════════════════════════════
   SDK packages across APIs (spec 3.17): the SDK index's "recently
   published" list and each SDK language page.

     API (-> our API page)  Package (-> registry)  Install [copy]
     Version  Published

   Rows carry data-official, data-category, data-published, data-name and
   data-search for SdkFilterBar. On phones the install command takes the
   full row width (dv-td-block).
   ═══════════════════════════════════════════════════════════════════════ */

export interface SdkRowsTableProps {
  rows: readonly SdkRow[]
  caption: string
  /** Show the language next to the package (the all-languages list). */
  showLanguage?: boolean
  bodyId?: string
  className?: string
}

export default function SdkRowsTable({ rows, caption, showLanguage = false, bodyId, className }: SdkRowsTableProps) {
  if (!rows.length) return null
  return (
    <div className={`dv-table-wrap${className ? ` ${className}` : ''}`}>
      <table className="dv-table dv-sdktable" role="table">
        <caption className="dv-table-caption">{caption}</caption>
        <thead role="rowgroup">
          <tr role="row">
            <th scope="col" role="columnheader">API</th>
            <th scope="col" role="columnheader">Package</th>
            <th scope="col" role="columnheader">Install</th>
            <th scope="col" role="columnheader" className="dv-col-low">Version</th>
            <th scope="col" role="columnheader">Published</th>
          </tr>
        </thead>
        <tbody role="rowgroup" id={bodyId}>
          {rows.map((r, i) => {
            const { sdk } = r
            const install = installCommand(sdk)
            const regUrl = sdk.registryUrl ?? registryPageUrl(sdk)
            const registry = REGISTRY_LABELS[sdk.registry]
            return (
              <tr
                role="row"
                key={`${r.apiSlug}-${sdk.registry}-${sdk.package}-${i}`}
                data-row=""
                data-official={sdk.official ? '1' : '0'}
                data-category={r.categorySlug}
                data-published={parseIsoDate(sdk.lastPublished)?.getTime() ?? 0}
                data-name={r.apiName.toLowerCase()}
                data-search={`${r.apiName} ${sdk.package} ${sdk.language} ${registry}`.toLowerCase()}
              >
                <td role="cell" className="dv-td-name">
                  <a href={r.href}>{apiBaseName(r.apiName)}</a>
                  <span className="dv-td-sub">{r.categoryName}</span>
                </td>
                <td role="cell" className="dv-td-meta" data-label="Package">
                  {regUrl ? (
                    <a className="dv-td-link" href={regUrl} target="_blank" rel="noopener noreferrer">
                      <code>{sdk.package}</code>
                      <span className="sr-only"> on {registry} (opens in a new tab)</span>
                    </a>
                  ) : <code>{sdk.package}</code>}
                  <span className="dv-td-sub">
                    {showLanguage ? `${sdk.language} - ${registry}` : registry} <OfficialBadge official={sdk.official} />
                  </span>
                </td>
                <td role="cell" className="dv-td-meta dv-td-block" data-label="Install">
                  {install ? (
                    <span className="dv-copyline">
                      <code>{install.code}</code>
                      <CopyButton text={install.code} iconOnly tone="light" srLabel={`Copy the install command for ${sdk.package}`} />
                    </span>
                  ) : <span className="dv-td-dim">See the registry</span>}
                </td>
                <td role="cell" className="dv-td-meta dv-col-low" data-label="Version">
                  {sdk.version ? <code>{sdk.version}</code> : <span className="dv-td-dim">-</span>}
                </td>
                <td role="cell" className="dv-td-meta" data-label="Published">
                  {sdk.lastPublished ? <DvTime iso={sdk.lastPublished} /> : <span className="dv-td-dim">-</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
