import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faPlug, faCubes } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import type { AuthType, GhLanguage, Tri } from '@/lib/developers/types'
import { countLabel, formatCompact } from '@/lib/developers/format'
import { AuthBadge, CorsBadge, DvBadge, HttpsBadge, StarCount } from './Badges'
import LanguageDot from './LanguageDot'
import OrgAvatar from './OrgAvatar'

/* ═══════════════════════════════════════════════════════════════════════
   The bridge between the two halves of the section (spec 2.6):

   variant="api"  on a company page: "{Company}'s free API: {name}",
                  linking to our reviewed API page.
   variant="oss"  on an API page: the provider's open source on GitHub
                  (top repos), linking to the company page.

   Pages pass plain data; only shown when WP2 matched the provider's
   GitHub org to a company in the open-source set.
   ═══════════════════════════════════════════════════════════════════════ */

export interface ApiPromoApi {
  name: string
  /** Our API detail page. */
  href: string
  summary: string | null
  auth: AuthType
  authRaw?: string | null
  https?: boolean
  cors?: Tri
  /** Official SDK count (badge omitted at 0). */
  officialSdks?: number
}

export interface ApiPromoRepo {
  nameWithOwner: string
  /** Our repo page. */
  href: string
  stars: number
  language?: GhLanguage | null
}

export type ApiPromoProps =
  | { variant: 'api'; companyName: string; api: ApiPromoApi; headingLevel?: 2 | 3 }
  | {
      variant: 'oss'
      company: { name: string; href: string; avatarUrl: string | null; trackedRepos?: number; stars?: number }
      repos: readonly ApiPromoRepo[]
      headingLevel?: 2 | 3
    }

export default function ApiPromo(props: ApiPromoProps) {
  const Heading = props.headingLevel === 2 ? 'h2' : 'h3'

  if (props.variant === 'api') {
    const { companyName, api } = props
    return (
      <article className="dv-promo">
        <div className="dv-promo-head">
          <span className="dv-promo-icon" aria-hidden="true"><FontAwesomeIcon icon={faPlug} /></span>
          <div>
            <span className="dv-label dv-promo-kicker">Free API</span>
            <Heading className="dv-promo-title">
              <a href={api.href}>{companyName}&apos;s free API: {api.name}</a>
            </Heading>
          </div>
        </div>
        {api.summary && <p className="dv-promo-text">{api.summary}</p>}
        <div className="dv-badge-row">
          <AuthBadge auth={api.auth} raw={api.authRaw} />
          {api.https !== undefined && <HttpsBadge https={api.https} />}
          {api.cors && <CorsBadge cors={api.cors} />}
          {!!api.officialSdks && (
            <DvBadge tone="neutral" icon={faCubes}>{countLabel(api.officialSdks, 'official SDK')}</DvBadge>
          )}
        </div>
        <div className="dv-promo-foot">
          <a className="dv-more" href={api.href}>
            See the {api.name} API <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
          </a>
        </div>
      </article>
    )
  }

  const { company, repos } = props
  const stats = [
    company.trackedRepos ? countLabel(company.trackedRepos, 'repository', 'repositories') : null,
    company.stars ? `${formatCompact(company.stars)} stars` : null,
  ].filter(Boolean)

  return (
    <article className="dv-promo">
      <div className="dv-promo-head">
        <OrgAvatar src={company.avatarUrl} name={company.name} size={40} />
        <div>
          <span className="dv-label dv-promo-kicker">
            <FontAwesomeIcon icon={faGithub} aria-hidden="true" /> Open source on GitHub
          </span>
          <Heading className="dv-promo-title">
            <a href={company.href}>{company.name} open source projects</a>
          </Heading>
          {stats.length > 0 && <p className="dv-small dv-muted">{stats.join(' - ')}</p>}
        </div>
      </div>
      {repos.length > 0 && (
        <ul className="dv-promo-repos">
          {repos.slice(0, 3).map(r => (
            <li key={r.nameWithOwner}>
              <a className="dv-promo-repo" href={r.href}>
                <span className="dv-promo-repo-name">
                  <code>{r.nameWithOwner}</code>
                  {r.language && <LanguageDot name={r.language.name} color={r.language.color} />}
                </span>
                <StarCount count={r.stars} />
              </a>
            </li>
          ))}
        </ul>
      )}
      <div className="dv-promo-foot">
        <a className="dv-more" href={company.href}>
          All {company.name} open source <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
        </a>
      </div>
    </article>
  )
}
