import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

/* ═══════════════════════════════════════════════════════════════════════
   Link rows ("Keep exploring", "More ways to find a free API"): an icon
   tile, a label, an optional sub-line and an arrow, two columns on wide
   screens. The same look as the section 404's "Start from a section"
   rows (the dv-nf-* classes in shell.css).
   ═══════════════════════════════════════════════════════════════════════ */

export interface DvLinkRow {
  href: string
  label: string
  sub?: string
  icon: IconDefinition
}

export interface DvLinkRowsProps {
  items: readonly DvLinkRow[]
  /** Accessible name of the list. */
  label?: string
  className?: string
}

export default function DvLinkRows({ items, label, className }: DvLinkRowsProps) {
  if (!items.length) return null
  return (
    <ul className={`dv-nf-links dv-nf-links--sections${className ? ` ${className}` : ''}`} aria-label={label}>
      {items.map(l => (
        <li key={l.href}>
          <a className="dv-nf-link" href={l.href}>
            <span className="dv-nf-link-icon" aria-hidden="true"><FontAwesomeIcon icon={l.icon} /></span>
            <span className="dv-nf-link-text">
              {l.label}
              {l.sub && <span className="dv-nf-link-sub">{l.sub}</span>}
            </span>
            <FontAwesomeIcon icon={faArrowRight} className="dv-nf-link-arrow" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  )
}
