import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare, faBuilding, faFileLines } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import type { ApiDetails } from '@/lib/developers/types'

/* ═══════════════════════════════════════════════════════════════════════
   ProviderCard (spec 3.15, 4.5) - who runs the API: its own site, GitHub
   organization when known, and its live InfoWebWorld listing when WP2
   matched one (details.provider.iwwPath). Any link the provider does not
   have is simply left out; the card never shows a placeholder link.
   ═══════════════════════════════════════════════════════════════════════ */

export interface ProviderCardProps {
  provider: ApiDetails['provider']
  pricingUrl?: string | null
  className?: string
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export default function ProviderCard({ provider, pricingUrl, className }: ProviderCardProps) {
  return (
    <div className={`dv-provider${className ? ` ${className}` : ''}`}>
      <div className="dv-provider-head">
        <span className="dv-icon-tile" aria-hidden="true"><FontAwesomeIcon icon={faBuilding} /></span>
        <div>
          <span className="dv-label">Provider</span>
          <span className="dv-provider-name">{provider.name}</span>
          {provider.website && <span className="dv-provider-host">{hostOf(provider.website)}</span>}
        </div>
      </div>
      <div className="dv-provider-links">
        {provider.website && (
          <a className="dv-provider-link" href={provider.website} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" />
            Provider website
          </a>
        )}
        {pricingUrl && (
          <a className="dv-provider-link" href={pricingUrl} target="_blank" rel="nofollow noopener noreferrer">
            <FontAwesomeIcon icon={faFileLines} aria-hidden="true" />
            Pricing
          </a>
        )}
        {provider.githubOrg && (
          <a className="dv-provider-link" href={`https://github.com/${provider.githubOrg}`} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} aria-hidden="true" />
            {provider.githubOrg} on GitHub
          </a>
        )}
        {provider.iwwPath && (
          <a className="dv-provider-link" href={provider.iwwPath}>
            <FontAwesomeIcon icon={faBuilding} aria-hidden="true" />
            View on InfoWebWorld
          </a>
        )}
      </div>
    </div>
  )
}
