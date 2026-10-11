import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { formatCompact, formatNumber } from '@/lib/developers/format'

/* ═══════════════════════════════════════════════════════════════════════
   Hero stat pills (spec 4.9): "(plug) 1,703 free APIs  (cubes) 612
   official SDKs ...". White .86 pills, icon in the accent colour, the
   number in bold. A badge whose count is 0 is left out (3.0 zero rule);
   with nothing to show the list is not rendered at all.
   ═══════════════════════════════════════════════════════════════════════ */

export interface DvHeroBadge {
  icon: IconDefinition
  value: number
  /** Plural noun after the number ('free APIs'). */
  label: string
  /** Noun when the value is 1 ('free API'); defaults to `label`. */
  singular?: string
  /** 'compact' prints 44.1k (stars); default prints 6,912. */
  format?: 'number' | 'compact'
  /** Makes the pill a link (a section page). */
  href?: string
}

export interface DvHeroBadgesProps {
  items: readonly DvHeroBadge[]
  /** Accessible name of the list ('At a glance'). */
  label?: string
  className?: string
}

export default function DvHeroBadges({ items, label = 'At a glance', className }: DvHeroBadgesProps) {
  const shown = items.filter(b => Number.isFinite(b.value) && b.value > 0)
  if (!shown.length) return null
  return (
    <ul className={`dv-hero-badges${className ? ` ${className}` : ''}`} aria-label={label}>
      {shown.map(b => {
        const body = (
          <>
            <FontAwesomeIcon icon={b.icon} aria-hidden="true" />
            <span>
              <strong>{b.format === 'compact' ? formatCompact(b.value) : formatNumber(b.value)}</strong>
              {' '}{b.value === 1 ? b.singular ?? b.label : b.label}
            </span>
          </>
        )
        return (
          <li key={b.label}>
            {b.href ? <a className="dv-hero-badge" href={b.href}>{body}</a> : <span className="dv-hero-badge">{body}</span>}
          </li>
        )
      })}
    </ul>
  )
}
