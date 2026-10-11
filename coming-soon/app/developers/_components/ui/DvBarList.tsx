import type { ReactNode } from 'react'
import { formatNumber } from '@/lib/developers/format'

/* ═══════════════════════════════════════════════════════════════════════
   Ranked bar list (spec 4.9): [#] [label] [track with a fill at
   value/max] [value]. Rows with an `href` are fully clickable (stretched
   link) and crawlable. Pure CSS, server-rendered, an ordered list so the
   rank is in the semantics, not only the visuals.
   ═══════════════════════════════════════════════════════════════════════ */

export interface BarListItem {
  /** Row text (a language, topic, country or industry name). */
  label: string
  href?: string
  value: number
  /** Text shown instead of the grouped value ('44.1k'). */
  display?: string
  /** Small text after the label ('12 companies'). */
  sub?: string
  /** Leading visual: a language dot, flag or icon (decorative). */
  lead?: ReactNode
  /** Muted row ("Smaller groups" below a gate). */
  muted?: boolean
}

export interface DvBarListProps {
  items: readonly BarListItem[]
  /** Accessible name of the list ('Top languages by repositories'). */
  label: string
  /** Show the rank column (default true). */
  ranked?: boolean
  /** Unit after each value ('repos'), visually small. */
  unit?: string
  /** Scale; defaults to the largest value in `items`. */
  max?: number
  /** First rank number (pagination or a "smaller groups" continuation). */
  start?: number
  className?: string
}

export default function DvBarList({
  items, label, ranked = true, unit, max, start = 1, className,
}: DvBarListProps) {
  if (!items.length) return null
  const scale = max ?? Math.max(...items.map(i => i.value), 1)

  return (
    <ol
      className={`dv-barlist${ranked ? '' : ' dv-barlist--plain'}${className ? ` ${className}` : ''}`}
      aria-label={label}
      start={ranked ? start : undefined}
    >
      {items.map((item, i) => {
        const width = scale > 0 ? Math.max(0, Math.min(100, (item.value / scale) * 100)) : 0
        const content = (
          <>
            {item.lead}
            <span className="dv-barlist-label-text">{item.label}</span>
            {item.sub && <span className="dv-barlist-label-sub">{item.sub}</span>}
          </>
        )
        return (
          <li key={`${item.label}-${i}`} className={`dv-barlist-row${item.muted ? ' dv-barlist-row--muted' : ''}`}>
            {ranked && <span className="dv-barlist-rank" aria-hidden="true">{start + i}</span>}
            {item.href
              ? <a className="dv-barlist-label" href={item.href}>{content}</a>
              : <span className="dv-barlist-label">{content}</span>}
            <span className="dv-barlist-track" aria-hidden="true">
              <span className="dv-barlist-fill" style={{ width: `${width}%` }} />
            </span>
            <span className="dv-barlist-value">
              {item.display ?? formatNumber(item.value)}
              {unit && <small>{unit}</small>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
