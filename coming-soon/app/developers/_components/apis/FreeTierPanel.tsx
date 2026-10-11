import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import type { ApiDetails, IsoDateTime } from '@/lib/developers/types'
import DvTime from '../ui/DvTime'
import DvExternalLink from '../ui/DvExternalLink'
import { CardBadge } from '../ui/Badges'

/* ═══════════════════════════════════════════════════════════════════════
   FreeTierPanel (spec 3.15, 4.5) - the API detail page's main panel:
   whether a free tier is documented, whether it needs a card, the
   provider's own wording, rate limits and the source we checked. Every
   fact that is null reads "Not published by the provider" in muted text
   rather than being left blank, so the panel never looks broken.
   ═══════════════════════════════════════════════════════════════════════ */

export interface FreeTierPanelProps {
  freeTier: ApiDetails['freeTier']
  rateLimits: string | null
  lastVerified?: IsoDateTime | null
  className?: string
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export default function FreeTierPanel({ freeTier, rateLimits, lastVerified, className }: FreeTierPanelProps) {
  const { available, summary, requiresCard, sourceUrl } = freeTier
  const availableLabel = available === true ? 'Free tier available' : available === false ? 'No free tier' : 'Free tier not documented'

  return (
    <div className={className}>
      <div className="dv-freetier-top">
        <span className={`dv-freetier-stat${available === true ? ' dv-freetier-stat--ok' : ' dv-freetier-stat--unknown'}`}>
          <FontAwesomeIcon icon={available === true ? faCircleCheck : faCircleQuestion} aria-hidden="true" />
          {availableLabel}
        </span>
        <CardBadge requiresCard={requiresCard} />
      </div>

      <p className={`dv-freetier-summary${summary ? '' : ' dv-freetier-summary--muted'}`}>
        {summary ?? 'Not published by the provider.'}
      </p>

      <div className="dv-freetier-meta">
        <div>
          <strong>Rate limits: </strong>
          {rateLimits ?? <span className="dv-muted">Not published by the provider</span>}
        </div>
      </div>

      {sourceUrl && (
        <p className="dv-freetier-source">
          Source: <DvExternalLink href={sourceUrl} nofollow>{hostOf(sourceUrl)}</DvExternalLink>
          {lastVerified && <> (as of <DvTime iso={lastVerified} />)</>}
        </p>
      )}
    </div>
  )
}
