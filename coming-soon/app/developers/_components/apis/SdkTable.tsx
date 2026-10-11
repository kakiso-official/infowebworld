import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { installCommand, registryPageUrl, REGISTRY_LABELS } from '@/lib/developers/snippets'
import { languageIcon } from '@/lib/developers/taxonomy'
import type { ApiSdk } from '@/lib/developers/types'
import CopyButton from '../ui/CopyButton'
import DvTime from '../ui/DvTime'

/* ═══════════════════════════════════════════════════════════════════════
   SdkTable (spec 3.15, 4.6) - every SDK of one API in one table: Language,
   Package (linked to its registry page), Install command, Version,
   Published date and Repo. Used twice on an API detail page: the full
   table of official SDKs (always in the HTML, under SdkTabs) and, when
   there are any, a separate "Community libraries" table.
   ═══════════════════════════════════════════════════════════════════════ */

export interface SdkTableProps {
  sdks: readonly ApiSdk[]
  caption: string
  className?: string
}

export default function SdkTable({ sdks, caption, className }: SdkTableProps) {
  if (!sdks.length) return null
  return (
    <div className={`dv-table-wrap${className ? ` ${className}` : ''}`}>
      <table className="dv-table" role="table">
        <caption className="dv-table-caption sr-only">{caption}</caption>
        <thead role="rowgroup">
          <tr role="row">
            <th scope="col" role="columnheader">Language</th>
            <th scope="col" role="columnheader">Package</th>
            <th scope="col" role="columnheader">Install</th>
            <th scope="col" role="columnheader">Version</th>
            <th scope="col" role="columnheader">Published</th>
            <th scope="col" role="columnheader">Repo</th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {sdks.map((sdk, i) => {
            const install = installCommand(sdk)
            const regUrl = sdk.registryUrl ?? registryPageUrl(sdk)
            return (
              <tr role="row" key={`${sdk.registry}-${sdk.package}-${i}`}>
                <td role="cell" data-label="Language">
                  <FontAwesomeIcon icon={languageIcon(sdk.languageSlug)} aria-hidden="true" /> {sdk.language}
                </td>
                <td role="cell" data-label="Package">
                  {regUrl ? (
                    <a href={regUrl} target="_blank" rel="noopener noreferrer">
                      <code>{sdk.package}</code>
                      <span className="sr-only"> on {REGISTRY_LABELS[sdk.registry]} (opens in a new tab)</span>
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="dv-ext-icon" aria-hidden="true" />
                    </a>
                  ) : (
                    <code>{sdk.package}</code>
                  )}
                  <span className="dv-td-sub">{REGISTRY_LABELS[sdk.registry]}</span>
                </td>
                <td role="cell" className="dv-td-block" data-label="Install">
                  {install ? (
                    <span className="dv-copyline">
                      <code>{install.code}</code>
                      <CopyButton text={install.code} iconOnly tone="light" srLabel={`Copy the install command for ${sdk.package}`} />
                    </span>
                  ) : (
                    <span className="dv-td-dim">See registry</span>
                  )}
                </td>
                <td role="cell" data-label="Version">
                  {sdk.version ? <code>{sdk.version}</code> : <span className="dv-td-dim">-</span>}
                </td>
                <td role="cell" data-label="Published">
                  {sdk.lastPublished ? <DvTime iso={sdk.lastPublished} /> : <span className="dv-td-dim">-</span>}
                </td>
                <td role="cell" data-label="Repo">
                  {sdk.repoUrl ? (
                    <a href={sdk.repoUrl} target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faGithub} aria-hidden="true" />
                      <span className="sr-only"> repository (opens in a new tab)</span>
                    </a>
                  ) : (
                    <span className="dv-td-dim">-</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
