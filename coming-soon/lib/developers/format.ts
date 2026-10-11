/* ═══════════════════════════════════════════════════════════════════════
   InfoWebWorld for Developers - number, date, size and percentage
   formatting.

   One en-US style everywhere (3.0): counts grouped ('6,912'), stars
   compact ('44.1k'), dates 'Oct 11, 2026' in body copy and 'October 2026'
   in titles, <time datetime> as an ISO date.

   Dates are read and printed in UTC so the server render and the browser
   hydration always agree, whatever the visitor's time zone. Ages ('3 days
   ago') are measured against the dataset's snapshot date, never the
   server clock, so a cached page never drifts from the data it shows.

   Pure and isomorphic (no React, no Node APIs).
   ═══════════════════════════════════════════════════════════════════════ */

const DAY_MS = 86400000

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const MONTHS_SHORT = MONTHS.map(m => m.slice(0, 3))

const GROUPED = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })

/* ── Numbers ─────────────────────────────────────────────────────────── */

/** Whole number with en-US grouping: 6912 -> '6,912'. Decimals are rounded. */
export function formatNumber(n: number): string {
  return Number.isFinite(n) ? GROUPED.format(n) : '0'
}

/* Truncate (never round up) to one decimal: 1,999 stars must not read
   '2k'. Trailing '.0' is dropped. */
function oneDecimalDown(value: number): string {
  const v = Math.floor(value * 10) / 10
  return Number.isInteger(v) ? String(v) : v.toFixed(1)
}

/** Compact count for stars and forks, never overstated (truncated, not
 *  rounded): 812 -> '812', 44112 -> '44.1k', 1999 -> '1.9k',
 *  232400 -> '232k', 1250000 -> '1.2M'. */
export function formatCompact(n: number): string {
  if (!Number.isFinite(n)) return '0'
  const sign = n < 0 ? '-' : ''
  const a = Math.abs(n)
  if (a < 1000) return sign + formatNumber(a)
  const units: Array<[number, string]> = [[1e9, 'B'], [1e6, 'M'], [1e3, 'k']]
  for (const [size, suffix] of units) {
    if (a >= size) {
      const v = a / size
      return sign + (v >= 100 ? String(Math.floor(v)) : oneDecimalDown(v)) + suffix
    }
  }
  return sign + formatNumber(a)
}

/** '1 API', '6,912 APIs': a grouped count with the right noun. */
export function countLabel(n: number, singular: string, plural = `${singular}s`): string {
  return `${formatNumber(n)} ${n === 1 ? singular : plural}`
}

/** Plain-English list: ['a'] -> 'a', ['a','b'] -> 'a and b',
 *  ['a','b','c'] -> 'a, b and c'. */
export function joinList(items: readonly string[]): string {
  if (items.length <= 1) return items[0] ?? ''
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

/* ── Dates ───────────────────────────────────────────────────────────── */

/** Parse an ISO date ('2026-10-11') or date-time ('2026-10-11T15:31:00Z');
 *  null when missing or invalid. A bare date is midnight UTC. */
export function parseIsoDate(iso: string | null | undefined): Date | null {
  if (!iso) return null
  const t = Date.parse(iso)
  return Number.isNaN(t) ? null : new Date(t)
}

/** 'Oct 11, 2026' (body copy, data lines, badges). '' when invalid. */
export function formatDate(iso: string | null | undefined): string {
  const d = parseIsoDate(iso)
  return d ? `${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}` : ''
}

/** 'October 2026' (titles, "as of" lines). '' when invalid. */
export function formatMonthYear(iso: string | null | undefined): string {
  const d = parseIsoDate(iso)
  return d ? `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}` : ''
}

/** 'Oct 2026' (meta descriptions: "Checked Oct 2026."). '' when invalid. */
export function formatMonthShortYear(iso: string | null | undefined): string {
  const d = parseIsoDate(iso)
  return d ? `${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCFullYear()}` : ''
}

/** '2026' (titles with a year). '' when invalid. */
export function formatYear(iso: string | null | undefined): string {
  const d = parseIsoDate(iso)
  return d ? String(d.getUTCFullYear()) : ''
}

/** '2026-10-11' for <time datetime>, sitemaps and JSON-LD. '' when invalid. */
export function isoDate(iso: string | null | undefined): string {
  const d = parseIsoDate(iso)
  return d ? d.toISOString().slice(0, 10) : ''
}

/* Days since 1970-01-01 of the UTC calendar date. */
function utcDay(d: Date): number {
  return Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / DAY_MS)
}

/** Whole calendar days from `fromIso` to `toIso` (negative when `toIso`
 *  is earlier); null when either date is invalid. */
export function daysBetween(fromIso: string | null | undefined, toIso: string | null | undefined): number | null {
  const a = parseIsoDate(fromIso)
  const b = parseIsoDate(toIso)
  return a && b ? utcDay(b) - utcDay(a) : null
}

/** Age of `iso` in whole days at the snapshot date (0 for a date on or
 *  after the snapshot); null when either date is invalid. */
export function ageInDays(iso: string | null | undefined, snapshotIso: string | null | undefined): number | null {
  const days = daysBetween(iso, snapshotIso)
  return days === null ? null : Math.max(0, days)
}

/** True when `iso` is at most `days` days older than the snapshot date
 *  (a date after the snapshot counts as within). False when invalid. */
export function isWithinDays(iso: string | null | undefined, snapshotIso: string | null | undefined, days: number): boolean {
  const age = ageInDays(iso, snapshotIso)
  return age !== null && age <= days
}

/** How old `iso` was at the snapshot date: 'today', 'yesterday',
 *  '5 days ago', '3 weeks ago', '4 months ago', '2 years ago'.
 *  '' when either date is invalid. */
export function formatAge(iso: string | null | undefined, snapshotIso: string | null | undefined): string {
  const days = ageInDays(iso, snapshotIso)
  if (days === null) return ''
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 31) {
    const weeks = Math.floor(days / 7)
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
  }
  const from = parseIsoDate(iso) as Date
  const to = parseIsoDate(snapshotIso) as Date
  let months = (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + (to.getUTCMonth() - from.getUTCMonth())
  if (to.getUTCDate() < from.getUTCDate()) months -= 1
  months = Math.max(1, months)
  if (months < 12) return months === 1 ? '1 month ago' : `${months} months ago`
  const years = Math.floor(months / 12)
  return years === 1 ? '1 year ago' : `${years} years ago`
}

/* ── Sizes, durations, percentages ───────────────────────────────────── */

/** Byte size in binary units: 312 -> '312 B', 4198 -> '4.1 KB',
 *  65536 -> '64 KB', 3500000 -> '3.3 MB'. */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B'
  if (bytes < 1024) return `${Math.round(bytes)} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let v = bytes / 1024
  let i = 0
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i++
  }
  const rounded = Math.round(v * 10) / 10
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)} ${units[i]}`
}

/** Request time for the Try it panel: 312 -> '312 ms', 1450 -> '1.5 s'. */
export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return '0 ms'
  if (ms < 1000) return `${Math.round(ms)} ms`
  return `${(Math.round(ms / 100) / 10).toFixed(1)} s`
}

/** Share of a total as 0-100 (0 when the total is 0). */
export function percentOf(part: number, total: number): number {
  return total > 0 && Number.isFinite(part) ? (part / total) * 100 : 0
}

/** A 0-100 value as text: 62.43 -> '62.4%', with decimals 0 -> '62%'.
 *  A non-zero share too small to show reads '<0.1%' (or '<1%'), never 0. */
export function formatPercent(pct: number, decimals = 1): string {
  if (!Number.isFinite(pct) || pct <= 0) return `${(0).toFixed(decimals)}%`
  const step = Math.pow(10, -decimals)
  if (pct < step) return `<${step.toFixed(decimals)}%`
  return `${(Math.round(pct * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals)}%`
}
