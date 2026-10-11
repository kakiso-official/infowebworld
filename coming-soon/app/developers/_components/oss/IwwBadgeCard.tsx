import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faBuilding, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import type { IwwListingLink } from '@/lib/developers/oss'

/* ═══════════════════════════════════════════════════════════════════════
   "Listed on InfoWebWorld" card (spec 2.6, 3.6 aside): three states.
     link.kind === 'product'  "{Product} is listed on InfoWebWorld" -> View listing
     link.kind === 'company'  "Listed on InfoWebWorld" -> View profile
     link === null            "Is this your company? List it free" -> /business
   ═══════════════════════════════════════════════════════════════════════ */

export interface IwwBadgeCardProps {
  link: IwwListingLink | null
  className?: string
}

export default function IwwBadgeCard({ link, className }: IwwBadgeCardProps) {
  if (link) {
    return (
      <div className={`dv-card dv-iwwcard dv-iwwcard--listed${className ? ` ${className}` : ''}`}>
        <span className="dv-iwwcard-icon" aria-hidden="true"><FontAwesomeIcon icon={faCircleCheck} /></span>
        <p className="dv-iwwcard-title">{link.label}</p>
        <p className="dv-iwwcard-text">
          {link.kind === 'product'
            ? 'See its free listing, reviews and alternatives on InfoWebWorld.'
            : "See this company's business profile, reviews and alternatives."}
        </p>
        <a className="dv-btn dv-btn--secondary dv-btn--sm" href={link.path}>
          {link.cta}
          <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
        </a>
      </div>
    )
  }
  return (
    <div className={`dv-card dv-iwwcard${className ? ` ${className}` : ''}`}>
      <span className="dv-iwwcard-icon" aria-hidden="true"><FontAwesomeIcon icon={faBuilding} /></span>
      <p className="dv-iwwcard-title">Is this your company?</p>
      <p className="dv-iwwcard-text">List it free on InfoWebWorld and reach the developers who use your code.</p>
      <a className="dv-btn dv-btn--primary dv-btn--sm" href="/business">
        List it free
        <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
      </a>
    </div>
  )
}
