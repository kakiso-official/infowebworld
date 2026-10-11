import type { CSSProperties } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { apiAuthType, apiHref, officialSdks } from '@/lib/developers/apis'
import { apiCategoryIcon, languageIcon } from '@/lib/developers/taxonomy'
import type { FreeApi } from '@/lib/developers/types'
import { AuthBadge, CorsBadge, HttpsBadge, StatusBadge, VerifiedBadge } from '../ui/Badges'
import DvExternalLink from '../ui/DvExternalLink'

/* ═══════════════════════════════════════════════════════════════════════
   ApiCard (spec 4.5) - the card used across the Free APIs section: the
   hub's "tryable" and "popular with SDKs" bands, a category's top picks
   and an API detail page's alternatives.

   A reviewed (enriched) API links to our own detail page; an unreviewed
   one links out to the API itself (new tab, external icon) - apiHref()
   from lib/developers/apis.ts decides which. Either way the card uses the
   shared stretched-link pattern (4.5): the title <a> covers the whole
   card, so the card itself needs no onClick and no extra wrapper link.

   variant="onDark" is the same white card shown on a navy band (4.5):
   nothing here changes, the band around it supplies the contrast.
   ═══════════════════════════════════════════════════════════════════════ */

export interface ApiCardProps {
  api: FreeApi
  variant?: 'onDark'
  /** Heading level of the card title (default h3). */
  headingLevel?: 2 | 3 | 4
  className?: string
}

const ICON_TILE_STYLE = { '--dv-tile': '40px' } as CSSProperties

export default function ApiCard({ api, variant, headingLevel = 3, className }: ApiCardProps) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4'
  const { href, external } = apiHref(api)
  const d = api.details
  const auth = apiAuthType(api)

  const description = d?.summary || api.description
  const freeTierLine = d
    ? d.freeTier.summary ?? (d.freeTier.available === true ? 'Has a free tier.' : null)
    : null

  const sdks = officialSdks(api)
  const seenLangs = new Set<string>()
  const sdkLangs: Array<{ slug: string; name: string }> = []
  for (const s of sdks) {
    if (seenLangs.has(s.languageSlug)) continue
    seenLangs.add(s.languageSlug)
    sdkLangs.push({ slug: s.languageSlug, name: s.language })
  }
  const shownLangs = sdkLangs.slice(0, 5)
  const moreLangs = sdkLangs.length - shownLangs.length

  return (
    <article className={`dv-card dv-card--link dv-api-card${variant === 'onDark' ? ' dv-api-card--onDark' : ''}${className ? ` ${className}` : ''}`}>
      <div className="dv-api-card-head">
        <span className="dv-icon-tile" style={ICON_TILE_STYLE} aria-hidden="true">
          <FontAwesomeIcon icon={apiCategoryIcon(api.category.slug)} />
        </span>
        <div className="dv-api-card-body">
          <Heading className="dv-api-card-name">
            {external ? (
              <DvExternalLink href={href} className="dv-card-stretch">{api.name}</DvExternalLink>
            ) : (
              <a className="dv-card-stretch" href={href}>{api.name}</a>
            )}
          </Heading>
          {api.enriched && d?.provider.name && <span className="dv-api-card-provider">by {d.provider.name}</span>}
        </div>
      </div>

      {description && <p className="dv-api-card-desc">{description}</p>}

      <div className="dv-badge-row">
        <AuthBadge auth={auth} raw={api.authRaw} />
        <HttpsBadge https={api.https} />
        <CorsBadge cors={api.cors} />
      </div>

      {freeTierLine && <p className="dv-api-card-freetier">{freeTierLine}</p>}

      {shownLangs.length > 0 && (
        <div className="dv-api-card-sdks" aria-label="Official SDKs">
          {shownLangs.map(l => (
            <span key={l.slug} className="dv-sdk-ico" title={`${l.name} SDK`} aria-label={`${l.name} SDK`}>
              <FontAwesomeIcon icon={languageIcon(l.slug)} aria-hidden="true" />
            </span>
          ))}
          {moreLangs > 0 && <span className="dv-sdk-ico dv-sdk-ico--more" aria-label={`${moreLangs} more languages`}>+{moreLangs}</span>}
        </div>
      )}

      <div className="dv-api-card-foot">
        {api.enriched && d?.check?.ok && d.lastVerified ? (
          <VerifiedBadge date={d.lastVerified} />
        ) : (
          <StatusBadge status={api.status} checkedAt={api.linkCheckedAt} />
        )}
      </div>
    </article>
  )
}
