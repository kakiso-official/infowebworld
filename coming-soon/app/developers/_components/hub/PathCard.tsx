import type { CSSProperties, ReactNode } from 'react'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

/* ═══════════════════════════════════════════════════════════════════════
   Path card (spec 4.5 DvPathCard): one of the two "ways to start" on the
   section hub. Radius 16, 64px icon tile, a short pitch, a few mini
   stats and a primary button. The card itself is not a link (only the
   button is), so it is safe to use even when there is nothing else to
   click inside it.
   ═══════════════════════════════════════════════════════════════════════ */

const TILE_STYLE = { '--dv-tile': '64px' } as CSSProperties

export interface PathCardProps {
  icon: IconDefinition
  title: string
  text: ReactNode
  /** Short stat phrases, e.g. '560 companies'. */
  stats: readonly string[]
  action: { href: string; label: string }
  className?: string
}

export default function PathCard({ icon, title, text, stats, action, className }: PathCardProps) {
  return (
    <div className={`dv-card dv-pathcard${className ? ` ${className}` : ''}`}>
      <span className="dv-icon-tile dv-pathcard-icon" style={TILE_STYLE} aria-hidden="true">
        <FontAwesomeIcon icon={icon} />
      </span>
      <h3 className="dv-pathcard-title">{title}</h3>
      <p className="dv-pathcard-text">{text}</p>
      {stats.length > 0 && (
        <ul className="dv-pathcard-stats">
          {stats.map(s => <li key={s}>{s}</li>)}
        </ul>
      )}
      <a className="dv-btn dv-btn--primary" href={action.href}>
        {action.label}
        <FontAwesomeIcon icon={faArrowRight} className="dv-btn-arrow" aria-hidden="true" />
      </a>
    </div>
  )
}
