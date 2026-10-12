import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import type { OssCompany } from '@/lib/developers/types'
import { countLabel } from '@/lib/developers/format'
import type { IwwListingLink } from '@/lib/developers/oss'
import OrgAvatar from '../ui/OrgAvatar'
import DvFlag from '../ui/DvFlag'

/* ═══════════════════════════════════════════════════════════════════════
   The company behind a repository (spec 3.7 aside): avatar, name, industry
   and country (each linked to its page when that page exists), a link to
   the company's other projects and, when the company is listed, its
   InfoWebWorld profile or listing.
   ═══════════════════════════════════════════════════════════════════════ */

export interface CompanyMiniCardProps {
  company: Pick<OssCompany, 'name' | 'industry' | 'countryName' | 'hqCountry'>
  href: string
  avatarUrl: string | null
  industryHref: string | null
  countryHref: string | null
  /** Tracked repos other than the current one. */
  moreRepos: number
  iwwLink: IwwListingLink | null
  className?: string
}

export default function CompanyMiniCard({
  company, href, avatarUrl, industryHref, countryHref, moreRepos, iwwLink, className,
}: CompanyMiniCardProps) {
  return (
    <div className={`dv-card dv-cominicard${className ? ` ${className}` : ''}`}>
      <p className="dv-label">Maintained by</p>
      <div className="dv-cominicard-head">
        <OrgAvatar src={avatarUrl} name={company.name} size={40} />
        <div className="dv-cominicard-text">
          <a className="dv-cominicard-name" href={href}>{company.name}</a>
          <span className="dv-cominicard-meta">
            {industryHref ? <a href={industryHref}>{company.industry}</a> : company.industry}
            {company.countryName && (
              <>
                <span aria-hidden="true"> - </span>
                {company.hqCountry && <DvFlag code={company.hqCountry} />}
                {countryHref ? <a href={countryHref}>{company.countryName}</a> : company.countryName}
              </>
            )}
          </span>
        </div>
      </div>
      {moreRepos > 0 && (
        <a className="dv-more" href={href}>
          {countLabel(moreRepos, 'more project', 'more projects')} from {company.name}
          <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
        </a>
      )}
      {iwwLink && (
        <a className="dv-cominicard-iww" href={iwwLink.path}>
          <FontAwesomeIcon icon={faCircleCheck} aria-hidden="true" />
          <span>{iwwLink.label}<span className="dv-cominicard-iww-cta"> - {iwwLink.cta}</span></span>
        </a>
      )}
    </div>
  )
}
