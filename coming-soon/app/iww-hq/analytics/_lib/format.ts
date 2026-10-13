import type { MetricFormat } from '@/lib/analytics/types'

/* ═══════════════════════════════════════════════════════════════════════════
   Formatters for the analytics UI. One place decides how a number, a rate,
   a duration or a timestamp reads, so every page says "1,234", "42.1%",
   "1m 23s" and "13 Oct, 10:42" the same way.

   Timestamps from the API are ISO strings in UTC; they are shown in the
   viewer's analytics timezone (useViewerTimeZone), never the server's.
   ═══════════════════════════════════════════════════════════════════════════ */

const nf0 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const nfCompact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

const isNum = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n)

/** 1,234 (rounded to a whole number). `–` for null/NaN. */
export function fmtNumber(n: number | null | undefined): string {
  return isNum(n) ? nf0.format(n) : '–'
}

/** 9,876 below 10K, then 12.4K / 1.2M - short enough for a KPI tile. */
export function fmtCompact(n: number | null | undefined): string {
  if (!isNum(n)) return '–'
  return Math.abs(n) < 10_000 ? nf0.format(n) : nfCompact.format(n)
}

/** 2.31 - for ratios such as pages per visit. */
export function fmtDecimal(n: number | null | undefined, digits = 2): string {
  if (!isNum(n)) return '–'
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: digits })
}

/** 0..1 -> "42.1%". Exact 0 and 100 drop the decimal ("0%", "100%"). */
export function fmtPercent(r: number | null | undefined, digits = 1): string {
  if (!isNum(r)) return '–'
  const p = r * 100
  if (p === 0 || p === 100) return `${p}%`
  // Never round a non-zero share down to "0.0%" or a partial one up to "100.0%".
  if (p > 0 && p < 0.05) return '< 0.1%'
  if (p > 99.95 && p < 100) return '> 99.9%'
  return `${p.toFixed(digits)}%`
}

/** Milliseconds -> "0s", "< 1s", "45s", "1m 23s", "2h 05m". */
export function fmtDuration(ms: number | null | undefined): string {
  if (!isNum(ms)) return '–'
  if (ms <= 0) return '0s'
  if (ms < 1000) return '< 1s'
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s}s`
  if (s < 3600) {
    const m = Math.floor(s / 60)
    const r = s % 60
    return r ? `${m}m ${String(r).padStart(2, '0')}s` : `${m}m`
  }
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return `${h}h ${String(m).padStart(2, '0')}m`
}

/** Format a value by its METRICS format. `compact` shortens big numbers (KPI tiles). */
export function fmtMetric(v: number | null | undefined, format: MetricFormat, opts: { compact?: boolean } = {}): string {
  switch (format) {
    case 'percent': return fmtPercent(v)
    case 'duration': return fmtDuration(v)
    case 'decimal': return fmtDecimal(v)
    default: return opts.compact ? fmtCompact(v) : fmtNumber(v)
  }
}

/** Short axis-tick text: "12K", "40%", "1m 30s", "2.5". */
export function fmtAxis(v: number, format: MetricFormat): string {
  switch (format) {
    case 'percent': {
      const p = v * 100
      return `${Number.isInteger(p) ? p : p.toFixed(1)}%`
    }
    case 'duration': {
      if (v <= 0) return '0'
      const s = Math.round(v / 1000)
      if (s < 60) return `${s}s`
      if (s < 3600) return s % 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s / 60}m`
      const h = Math.floor(s / 3600)
      const m = Math.round((s % 3600) / 60)
      return m ? `${h}h ${m}m` : `${h}h`
    }
    case 'decimal': return fmtDecimal(v, 1)
    default: return fmtCompact(v)
  }
}

/* ── Change vs the comparison period ────────────────────────────────────── */

export interface DeltaInfo {
  /** Direction of the raw change. */
  dir: 'up' | 'down' | 'flat'
  /** Whether the change is good news given METRICS[k].better. */
  tone: 'good' | 'bad' | 'neutral'
  /** "+12%", "-3.4 pts", "New", "0%". */
  text: string
  /** Long form for a title/tooltip: "Up 12% from 1,034". */
  long: string
}

/**
 * Change from `previous` to `value`. Rates (percent format) change in
 * percentage points - "bounce rate 42% -> 45%" is "+3 pts", not "+7%" -
 * everything else in relative percent. Returns null when there is no
 * comparison (previous === null).
 */
export function deltaInfo(
  value: number,
  previous: number | null | undefined,
  format: MetricFormat = 'number',
  better: 'up' | 'down' = 'up',
): DeltaInfo | null {
  if (!isNum(previous) || !isNum(value)) return null
  const prevText = fmtMetric(previous, format)
  const toneOf = (dir: 'up' | 'down' | 'flat'): DeltaInfo['tone'] =>
    dir === 'flat' ? 'neutral' : (dir === better ? 'good' : 'bad')

  if (format === 'percent') {
    const pts = (value - previous) * 100
    const dir = Math.abs(pts) < 0.05 ? 'flat' : pts > 0 ? 'up' : 'down'
    const text = dir === 'flat' ? '0 pts' : `${pts > 0 ? '+' : '−'}${Math.abs(pts).toFixed(1)} pts`
    return { dir, tone: toneOf(dir), text, long: dir === 'flat' ? `Same as before (${prevText})` : `${dir === 'up' ? 'Up' : 'Down'} ${Math.abs(pts).toFixed(1)} percentage points from ${prevText}` }
  }
  if (previous === 0) {
    if (value === 0) return { dir: 'flat', tone: 'neutral', text: '0%', long: 'None in either period' }
    return { dir: 'up', tone: toneOf('up'), text: 'New', long: `Up from 0` }
  }
  const ch = (value - previous) / Math.abs(previous)
  const pct = ch * 100
  const dir = Math.abs(pct) < 0.5 ? 'flat' : pct > 0 ? 'up' : 'down'
  const abs = Math.abs(pct)
  const shown = abs >= 100 ? nf0.format(abs) : abs.toFixed(abs >= 10 ? 0 : 1)
  const text = dir === 'flat' ? '0%' : `${pct > 0 ? '+' : '−'}${shown}%`
  return { dir, tone: toneOf(dir), text, long: dir === 'flat' ? `About the same as before (${prevText})` : `${dir === 'up' ? 'Up' : 'Down'} ${shown}% from ${prevText}` }
}

/** "+12.3%" style signed percent for a 0..1 ratio change. */
export function fmtSignedPercent(r: number): string {
  if (!isNum(r)) return '–'
  const p = r * 100
  return `${p > 0 ? '+' : p < 0 ? '−' : ''}${Math.abs(p).toFixed(1)}%`
}

/* ── Dates and times (always in an explicit IANA timezone) ──────────────── */

const dtfCache = new Map<string, Intl.DateTimeFormat>()
function dtf(tz: string, key: string, opts: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const k = `${tz}|${key}`
  let f = dtfCache.get(k)
  if (!f) {
    try {
      f = new Intl.DateTimeFormat('en-GB', { ...opts, timeZone: tz })
    } catch {
      f = new Intl.DateTimeFormat('en-GB', { ...opts, timeZone: 'UTC' })
    }
    dtfCache.set(k, f)
  }
  return f
}

/** Parse an ISO string, or a bare 'YYYY-MM-DD' (as that calendar day). */
function toDate(v: string | number | Date): Date {
  if (v instanceof Date) return v
  if (typeof v === 'number') return new Date(v)
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return new Date(v + 'T12:00:00Z')
  return new Date(v)
}
const isDay = (v: unknown): boolean => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)

/** "13 Oct 2026". A bare 'YYYY-MM-DD' is shown as that day regardless of tz. */
export function fmtDate(v: string | number | Date | null | undefined, tz = 'UTC'): string {
  if (v == null || v === '') return '–'
  const d = toDate(v)
  if (Number.isNaN(d.getTime())) return '–'
  return dtf(isDay(v) ? 'UTC' : tz, 'date', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}

/** "13 Oct" (no year). */
export function fmtDateShort(v: string | number | Date | null | undefined, tz = 'UTC'): string {
  if (v == null || v === '') return '–'
  const d = toDate(v)
  if (Number.isNaN(d.getTime())) return '–'
  return dtf(isDay(v) ? 'UTC' : tz, 'dshort', { day: 'numeric', month: 'short' }).format(d)
}

/** "10:42" (24 h). */
export function fmtTime(v: string | number | Date | null | undefined, tz = 'UTC'): string {
  if (v == null || v === '') return '–'
  const d = toDate(v)
  if (Number.isNaN(d.getTime())) return '–'
  return dtf(tz, 'time', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(d)
}

/** "10:42:07" (24 h, with seconds - live feeds). */
export function fmtTimeSec(v: string | number | Date | null | undefined, tz = 'UTC'): string {
  if (v == null || v === '') return '–'
  const d = toDate(v)
  if (Number.isNaN(d.getTime())) return '–'
  return dtf(tz, 'timesec', { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(d)
}

/** "13 Oct, 10:42" - adds the year when it is not the current year. */
export function fmtDateTime(v: string | number | Date | null | undefined, tz = 'UTC'): string {
  if (v == null || v === '') return '–'
  const d = toDate(v)
  if (Number.isNaN(d.getTime())) return '–'
  const sameYear = dtf(tz, 'y', { year: 'numeric' }).format(d) === dtf(tz, 'y', { year: 'numeric' }).format(new Date())
  return sameYear
    ? `${fmtDateShort(d, tz)}, ${fmtTime(d, tz)}`
    : `${fmtDate(d, tz)}, ${fmtTime(d, tz)}`
}

/** "just now", "42s ago", "3 min ago", "2 h ago", "yesterday", "5 days ago", else a date. */
export function fmtRelative(v: string | number | Date | null | undefined, nowMs: number = Date.now(), tz = 'UTC'): string {
  if (v == null || v === '') return '–'
  const d = toDate(v)
  const t = d.getTime()
  if (Number.isNaN(t)) return '–'
  const s = Math.round((nowMs - t) / 1000)
  if (s < 10) return 'just now'
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} h ago`
  const days = Math.floor(h / 24)
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  return fmtDate(d, tz)
}

/** Today's calendar date 'YYYY-MM-DD' in `tz` (the analytics day boundary). */
export function todayInTz(tz: string, nowMs: number = Date.now()): string {
  return dtf(tz, 'iso', { year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(new Date(nowMs))
    .reduce((acc, p) => {
      if (p.type === 'year') acc[0] = p.value
      if (p.type === 'month') acc[1] = p.value
      if (p.type === 'day') acc[2] = p.value
      return acc
    }, ['', '', ''])
    .join('-')
}

/** 'YYYY-MM-DD' plus n days. */
export function addDaysIso(date: string, n: number): string {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10)
}

/** "15 Sep – 13 Oct 2026" for an inclusive 'YYYY-MM-DD' range. */
export function fmtRange(from: string, to: string): string {
  if (from === to) return fmtDate(from)
  const sameYear = from.slice(0, 4) === to.slice(0, 4)
  return `${sameYear ? fmtDateShort(from) : fmtDate(from)} – ${fmtDate(to)}`
}

/* ── Names ──────────────────────────────────────────────────────────────── */

let regionNames: Intl.DisplayNames | null = null
let languageNames: Intl.DisplayNames | null = null

/** ISO-3166 alpha-2 -> "United States". Unknown/empty -> "Unknown". */
export function countryName(code: string | null | undefined): string {
  if (!code || code === '(none)') return 'Unknown'
  const cc = code.toUpperCase()
  try {
    regionNames ??= new Intl.DisplayNames(['en'], { type: 'region' })
    return regionNames.of(cc) ?? cc
  } catch {
    return cc
  }
}

/** "en-US" -> "English (United States)". */
export function languageName(code: string | null | undefined): string {
  if (!code || code === '(none)') return 'Unknown'
  try {
    languageNames ??= new Intl.DisplayNames(['en'], { type: 'language' })
    return languageNames.of(code) ?? code
  } catch {
    return code
  }
}
