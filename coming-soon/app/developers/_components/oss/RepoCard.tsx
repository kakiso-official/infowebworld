import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCodeFork } from '@fortawesome/free-solid-svg-icons'
import type { GhLanguage } from '@/lib/developers/types'
import { humanizeTopic } from '@/lib/developers/taxonomy'
import { GfiBadge, LicenseBadge, StarCount } from '../ui/Badges'
import LanguageDot from '../ui/LanguageDot'
import OrgAvatar from '../ui/OrgAvatar'
import DvTime from '../ui/DvTime'
import DvExternalLink from '../ui/DvExternalLink'

/* ═══════════════════════════════════════════════════════════════════════
   Repository card (spec 4.5): avatar + owner/name + stars, a 2-line
   description, language/forks/license/updated meta, up to 3 topic chips
   and a good-first-issues badge. `variant="onDark"` for navy bands.

   There is no internal repository detail page in this build, so `href`
   is always the repository's real GitHub URL (opened in a new tab).
   ═══════════════════════════════════════════════════════════════════════ */

export interface RepoCardProps {
  nameWithOwner: string
  /** The repository's real GitHub URL. */
  href: string
  description: string | null
  stars: number
  forks: number
  primaryLanguage: GhLanguage | null
  license: string | null
  pushedAt: string | null
  dataAt: string
  goodFirstIssues: number
  topics: readonly string[]
  companyName: string
  companyAvatarUrl: string | null
  isArchived?: boolean
  variant?: 'light' | 'onDark'
  className?: string
}

export default function RepoCard({
  nameWithOwner, href, description, stars, forks, primaryLanguage, license, pushedAt, dataAt,
  goodFirstIssues, topics, companyName, companyAvatarUrl, isArchived = false, variant = 'light', className,
}: RepoCardProps) {
  const [owner, name] = nameWithOwner.split('/')
  return (
    <article
      className={`dv-card dv-card--link dv-repocard${variant === 'onDark' ? ' dv-repocard--dark' : ''}${isArchived ? ' dv-repocard--archived' : ''}${className ? ` ${className}` : ''}`}
    >
      <div className="dv-repocard-head">
        <OrgAvatar src={companyAvatarUrl} name={companyName} size={24} />
        <span className="dv-repocard-name">
          <code>
            {owner}/<b><DvExternalLink href={href} icon={false} className="dv-card-stretch">{name ?? owner}</DvExternalLink></b>
          </code>
        </span>
        <StarCount count={stars} />
      </div>
      {description && <p className="dv-repocard-desc">{description}</p>}
      <div className="dv-repocard-meta">
        {primaryLanguage && <LanguageDot name={primaryLanguage.name} color={primaryLanguage.color} />}
        {forks > 0 && (
          <span className="dv-repocard-fork">
            <FontAwesomeIcon icon={faCodeFork} aria-hidden="true" /> {forks.toLocaleString('en-US')}
          </span>
        )}
        <LicenseBadge spdx={license} />
        {pushedAt && (
          <span className="dv-repocard-updated">
            Updated <DvTime iso={pushedAt} format="age" snapshot={dataAt} />
          </span>
        )}
      </div>
      {(topics.length > 0 || goodFirstIssues > 0) && (
        <div className="dv-repocard-foot">
          {topics.slice(0, 3).map(t => (
            <span key={t} className="dv-chip dv-chip--static dv-chip--sm dv-card-raise">{humanizeTopic(t)}</span>
          ))}
          <GfiBadge count={goodFirstIssues} />
        </div>
      )}
    </article>
  )
}
