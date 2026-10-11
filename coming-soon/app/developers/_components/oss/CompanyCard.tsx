import { formatCompact, countLabel } from '@/lib/developers/format'
import { industryIcon } from '@/lib/developers/taxonomy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { GhLanguage } from '@/lib/developers/types'
import OrgAvatar from '../ui/OrgAvatar'
import DvFlag from '../ui/DvFlag'
import LanguageDot from '../ui/LanguageDot'

/* ═══════════════════════════════════════════════════════════════════════
   Company card (spec 4.5): avatar 56, name, industry chip, flag + country,
   repo/star summary, up to 3 top-language dots and a "Listed" mini badge.
   Used on the open-source hub (industry-filterable grid) and on a
   company page's "Similar companies" section.
   ═══════════════════════════════════════════════════════════════════════ */

export interface CompanyCardProps {
  name: string
  href: string
  industry: string
  industrySlug: string
  countryName: string | null
  hqCountry: string | null
  avatarUrl: string | null
  trackedRepos: number
  stars: number
  topLanguages: readonly (GhLanguage & { pct: number })[]
  listed: boolean
  /** data-* attributes for the client filter bar (RowFilter). */
  rowAttrs?: Record<string, string>
  className?: string
}

export default function CompanyCard({
  name, href, industry, industrySlug, countryName, hqCountry, avatarUrl, trackedRepos, stars,
  topLanguages, listed, rowAttrs, className,
}: CompanyCardProps) {
  return (
    <article className={`dv-card dv-card--link dv-companycard${className ? ` ${className}` : ''}`} {...rowAttrs}>
      <div className="dv-companycard-head">
        <OrgAvatar src={avatarUrl} name={name} size={56} />
        <div className="dv-companycard-head-text">
          <h3 className="dv-companycard-name">
            <a href={href} className="dv-card-stretch">{name}</a>
          </h3>
          <span className="dv-chip dv-chip--static dv-chip--sm dv-card-raise">
            <FontAwesomeIcon icon={industryIcon(industrySlug)} aria-hidden="true" />
            {industry}
          </span>
        </div>
      </div>
      {countryName && (
        <p className="dv-companycard-country">
          {hqCountry && <DvFlag code={hqCountry} />}
          {countryName}
        </p>
      )}
      <p className="dv-companycard-stats">
        {countLabel(trackedRepos, 'repository', 'repositories')} - {formatCompact(stars)} stars
      </p>
      {topLanguages.length > 0 && (
        <div className="dv-companycard-langs" aria-label="Top languages">
          {topLanguages.slice(0, 3).map(l => <LanguageDot key={l.name} name={l.name} color={l.color} />)}
        </div>
      )}
      {listed && <span className="dv-companycard-listed dv-card-raise">Listed on InfoWebWorld</span>}
    </article>
  )
}
