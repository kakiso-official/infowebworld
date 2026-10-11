import { apiCategoryPath } from '@/lib/developers/paths'
import type { AuthType, Tri } from '@/lib/developers/types'
import { AuthBadge, CorsBadge, HttpsBadge } from '../ui/Badges'
import CopyButton from '../ui/CopyButton'
import DvExternalLink from '../ui/DvExternalLink'

/* ═══════════════════════════════════════════════════════════════════════
   ApiFactsCard (spec 3.15, 4.5) - the API detail page's "At a glance" <dl>:
   auth, HTTPS, CORS, base URL, docs, OpenAPI spec and status page. A
   field the provider does not document reads "Not published"/"None
   found" in muted text rather than being left out, so the shape of the
   card never changes between a well-documented and a thin API.
   ═══════════════════════════════════════════════════════════════════════ */

export interface ApiFactsCardProps {
  auth: AuthType
  authRaw?: string | null
  https: boolean
  cors: Tri
  baseUrl: string | null
  docsUrl: string | null
  openapiUrl: string | null
  statusUrl: string | null
  category: { slug: string; name: string }
  className?: string
}

export default function ApiFactsCard({
  auth, authRaw, https, cors, baseUrl, docsUrl, openapiUrl, statusUrl, category, className,
}: ApiFactsCardProps) {
  return (
    <dl className={`dv-facts${className ? ` ${className}` : ''}`}>
      <div className="dv-facts-row">
        <dt className="dv-facts-label">Auth</dt>
        <dd className="dv-facts-value"><AuthBadge auth={auth} raw={authRaw} /></dd>
      </div>
      <div className="dv-facts-row">
        <dt className="dv-facts-label">HTTPS</dt>
        <dd className="dv-facts-value"><HttpsBadge https={https} /></dd>
      </div>
      <div className="dv-facts-row">
        <dt className="dv-facts-label">CORS</dt>
        <dd className="dv-facts-value"><CorsBadge cors={cors} /></dd>
      </div>
      <div className="dv-facts-row">
        <dt className="dv-facts-label">Base URL</dt>
        <dd className="dv-facts-value">
          {baseUrl ? (
            <span className="dv-copyline">
              <code>{baseUrl}</code>
              <CopyButton text={baseUrl} iconOnly tone="light" srLabel="Copy the base URL" />
            </span>
          ) : (
            <span className="dv-facts-value--muted">Not published</span>
          )}
        </dd>
      </div>
      <div className="dv-facts-row">
        <dt className="dv-facts-label">Docs</dt>
        <dd className="dv-facts-value">
          {docsUrl ? <DvExternalLink href={docsUrl}>Documentation</DvExternalLink> : <span className="dv-facts-value--muted">Not published</span>}
        </dd>
      </div>
      <div className="dv-facts-row">
        <dt className="dv-facts-label">OpenAPI</dt>
        <dd className="dv-facts-value">
          {openapiUrl ? <DvExternalLink href={openapiUrl}>OpenAPI spec</DvExternalLink> : <span className="dv-facts-value--muted">Not published</span>}
        </dd>
      </div>
      <div className="dv-facts-row">
        <dt className="dv-facts-label">Status page</dt>
        <dd className="dv-facts-value">
          {statusUrl ? <DvExternalLink href={statusUrl}>Status page</DvExternalLink> : <span className="dv-facts-value--muted">None found</span>}
        </dd>
      </div>
      <div className="dv-facts-row">
        <dt className="dv-facts-label">Category</dt>
        <dd className="dv-facts-value"><a href={apiCategoryPath(category.slug)}>{category.name}</a></dd>
      </div>
    </dl>
  )
}
