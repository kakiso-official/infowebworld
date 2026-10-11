import {
  formatAge, formatDate, formatMonthShortYear, formatMonthYear, formatYear, isoDate,
} from '@/lib/developers/format'

/* ═══════════════════════════════════════════════════════════════════════
   A date as <time datetime="2026-10-11">. Every visible format comes from
   lib/developers/format.ts (UTC, so server and browser always agree).

     date        Oct 11, 2026   (default; body copy, badges)
     month       October 2026
     monthShort  Oct 2026
     year        2026
     age         3 weeks ago    (measured against `snapshot`, never the
                                 server clock; full date in the tooltip)

   Renders nothing for a missing or invalid date.
   ═══════════════════════════════════════════════════════════════════════ */

export type DvTimeFormat = 'date' | 'month' | 'monthShort' | 'year' | 'age'

export interface DvTimeProps {
  iso: string | null | undefined
  format?: DvTimeFormat
  /** Snapshot date the 'age' format is measured against (meta.generatedAt). */
  snapshot?: string | null
  className?: string
}

export default function DvTime({ iso, format = 'date', snapshot, className }: DvTimeProps) {
  const dateTime = isoDate(iso)
  if (!dateTime) return null

  let text: string
  switch (format) {
    case 'month': text = formatMonthYear(iso); break
    case 'monthShort': text = formatMonthShortYear(iso); break
    case 'year': text = formatYear(iso); break
    case 'age': text = (snapshot ? formatAge(iso, snapshot) : '') || formatDate(iso); break
    default: text = formatDate(iso)
  }

  return (
    <time dateTime={dateTime} className={className} title={format === 'date' ? undefined : formatDate(iso)}>
      {text}
    </time>
  )
}
