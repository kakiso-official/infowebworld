import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { formatNumber } from '@/lib/developers/format'
import { langStyle } from './LanguageDot'
import DvFlag from './DvFlag'

/* ═══════════════════════════════════════════════════════════════════════
   Crawlable link chips (spec 4.8): a <nav> of plain <a> pills with an
   optional leading dot, flag or icon and a trailing count bubble. The
   chip for the current page is filled and carries aria-current="page".
   On phones the row scrolls sideways (fade edges) instead of wrapping.
   ═══════════════════════════════════════════════════════════════════════ */

export interface FacetChip {
  label: string
  href: string
  count?: number
  current?: boolean
  /** Language colour for a leading dot. */
  dot?: string | null
  /** ISO-2 code for a leading flag. */
  flag?: string | null
  icon?: IconDefinition
}

export interface DvFacetChipsProps {
  items: readonly FacetChip[]
  /** Accessible name of the chip nav ('Languages'). */
  label: string
  /** Trailing "All languages" style link. */
  more?: { label: string; href: string }
  /** Scroll sideways on phones (default true). */
  scroll?: boolean
  size?: 'md' | 'sm'
  className?: string
}

export default function DvFacetChips({
  items, label, more, scroll = true, size = 'md', className,
}: DvFacetChipsProps) {
  if (!items.length && !more) return null
  const chipCls = size === 'sm' ? 'dv-chip dv-chip--sm' : 'dv-chip'

  return (
    <nav
      aria-label={label}
      className={`dv-chips${scroll ? ' dv-chips--scroll' : ''}${className ? ` ${className}` : ''}`}
    >
      <ul className="dv-chips-list">
        {items.map(item => (
          <li key={item.href}>
            <a className={chipCls} href={item.href} aria-current={item.current ? 'page' : undefined}>
              {item.dot !== undefined && <span className="dv-lang-dot" style={langStyle(item.dot)} aria-hidden="true" />}
              {item.flag && <DvFlag code={item.flag} />}
              {item.icon && <FontAwesomeIcon icon={item.icon} aria-hidden="true" />}
              <span>{item.label}</span>
              {typeof item.count === 'number' && item.count > 0 && (
                <span className="dv-chip-count">
                  <span className="sr-only">(</span>{formatNumber(item.count)}<span className="sr-only">)</span>
                </span>
              )}
            </a>
          </li>
        ))}
        {more && (
          <li>
            <a className={`${chipCls} dv-chip--more`} href={more.href}>
              <span>{more.label}</span>
              <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
            </a>
          </li>
        )}
      </ul>
    </nav>
  )
}
