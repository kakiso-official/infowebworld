import type { IsoDateTime, RefreshState } from '@/lib/developers/types'
import { ageInDays, formatDate, isoDate } from '@/lib/developers/format'
import { methodologyPath } from '@/lib/developers/paths'

/* ═══════════════════════════════════════════════════════════════════════
   Data line under every H1 (spec 3.0, 4.13):

     * GitHub data from Oct 11, 2026      (open source)
     * GitHub data updated Oct 12, 2026   (runtime refresh live)
     * Links checked Oct 11, 2026         (free APIs)

   The dot is green, or amber once the data is more than `staleDays`
   (14) days old, so a freshness claim is only made while it is true.

   Every data line ends with "- How we check", a link to
   /developers/methodology (pass methodLink={false} to leave it out).
   ═══════════════════════════════════════════════════════════════════════ */

export interface DvDataLineProps {
  source: 'github' | 'links'
  /** Snapshot date (meta.generatedAt / meta.linksCheckedAt). */
  date: IsoDateTime
  /** In-memory refresh state (6.5); when live, the refresh date is shown. */
  refresh?: RefreshState | null
  staleDays?: number
  /** Show the "How we check" link (default true). */
  methodLink?: boolean
  className?: string
}

/* Age against the server clock: the page is re-rendered at least daily
   (ISR), so this is how old the data is for the reader. */
function isStale(iso: string, days: number): boolean {
  const age = ageInDays(iso, new Date().toISOString())
  return age !== null && age > days
}

export default function DvDataLine({
  source, date, refresh, staleDays = 14, methodLink = true, className,
}: DvDataLineProps) {
  const refreshed = source === 'github' && refresh?.live && refresh.lastOkAt ? refresh.lastOkAt : null
  const shown = refreshed ?? date
  if (!isoDate(shown)) return null

  const lead = source === 'github'
    ? (refreshed ? 'GitHub data updated' : 'GitHub data from')
    : 'Links checked'
  const stale = isStale(shown, staleDays)

  return (
    <p className={`dv-dataline${stale ? ' dv-dataline--stale' : ''}${className ? ` ${className}` : ''}`}>
      <span className="dv-dataline-dot" aria-hidden="true" />
      <span className="dv-dataline-text">
        {lead} <time dateTime={isoDate(shown)}>{formatDate(shown)}</time>
      </span>
      {methodLink && (
        <>
          <span className="dv-dataline-sep" aria-hidden="true">-</span>
          <a href={methodologyPath()}>How we check</a>
        </>
      )}
    </p>
  )
}
