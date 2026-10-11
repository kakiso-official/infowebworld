import type { CSSProperties, ReactNode } from 'react'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { formatCompact, formatNumber } from '@/lib/developers/format'

/* ═══════════════════════════════════════════════════════════════════════
   Stat strip (spec 4.9): one bordered box of 3-6 cells split by hairlines;
   big number, small uppercase label, optional icon and sub-line. Each
   cell is a labelled group ("Repositories: 6,912") so the full number is
   read even when the compact one is shown. Static numbers, no count-up.

   Cells whose number is 0 are left out (3.0 zero rule) unless keepZero.
   Layout: one row on desktop, 3 (or 2x2) columns <= 768, 2 <= 480.
   ═══════════════════════════════════════════════════════════════════════ */

export interface DvStat {
  label: string
  value: number
  /** 'compact' prints 44.1k (stars); default prints 6,912. */
  format?: 'number' | 'compact'
  /** Text instead of the formatted number (e.g. a date). */
  display?: string
  icon?: IconDefinition
  sub?: ReactNode
  /** Makes the whole cell a link. */
  href?: string
  keepZero?: boolean
}

export interface DvStatStripProps {
  items: readonly DvStat[]
  className?: string
}

export default function DvStatStrip({ items, className }: DvStatStripProps) {
  const cells = items.filter(s => s.keepZero || s.display !== undefined || s.value !== 0)
  if (!cells.length) return null
  const n = cells.length
  const style = {
    '--dv-stats-n': n,
    '--dv-stats-md': n <= 3 ? n : n === 4 ? 2 : 3,
    '--dv-stats-sm': n === 1 ? 1 : 2,
  } as CSSProperties

  return (
    <div className={`dv-stats${className ? ` ${className}` : ''}`} style={style} data-odd={n > 1 && n % 2 === 1 ? '' : undefined}>
      {cells.map(s => {
        const shown = s.display ?? (s.format === 'compact' ? formatCompact(s.value) : formatNumber(s.value))
        const full = s.display ?? formatNumber(s.value)
        const body = (
          <>
            {/* The group's name already reads "label: number". */}
            <span className="dv-stat-head" aria-hidden="true">
              {s.icon && <FontAwesomeIcon icon={s.icon} />}
              <span className="dv-label">{s.label}</span>
            </span>
            <span className="dv-stat-n" aria-hidden="true">{shown}</span>
            {s.sub && <span className="dv-stat-sub">{s.sub}</span>}
          </>
        )
        const aria = `${s.label}: ${full}`
        return s.href ? (
          <a key={s.label} className="dv-stat" href={s.href} aria-label={aria}>{body}</a>
        ) : (
          <div key={s.label} className="dv-stat" role="group" aria-label={aria}>{body}</div>
        )
      })}
    </div>
  )
}
