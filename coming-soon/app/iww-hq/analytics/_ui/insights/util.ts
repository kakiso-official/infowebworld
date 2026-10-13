import { VITAL_THRESHOLDS, type ResolvedRange, type VitalsSummary } from '@/lib/analytics/types'

/* ═══════════════════════════════════════════════════════════════════════════
   Small helpers shared by the insight pages (Traffic sources, Pages, Audience,
   Performance, Errors, Events). Pure functions - no React, no DOM.
   ═══════════════════════════════════════════════════════════════════════════ */

/** "the previous period" / "the same period last year" - the tooltip wording for deltas. */
export function comparisonLabel(range: Pick<ResolvedRange, 'compare' | 'prev'> | null | undefined): string {
  return range?.compare === 'year' ? 'the same period last year' : 'the previous period'
}

/** "1 visit" / "3 visits". */
export function plural(n: number, one: string, many = `${one}s`): string {
  return n === 1 ? one : many
}

export function sum(values: number[]): number {
  let s = 0
  for (const v of values) s += Number.isFinite(v) ? v : 0
  return s
}

/** True when any row carries a comparison value (so a "Change" column is worth showing). */
export function hasComparison<T>(rows: T[], prev: (row: T) => number | null | undefined): boolean {
  return rows.some(r => prev(r) != null)
}

/** A link that leaves the site, opened in a new tab (referrers, outbound targets). */
export function isHttpUrl(s: string | null | undefined): s is string {
  return !!s && /^https?:\/\//i.test(s)
}

/* ── Web Vitals ─────────────────────────────────────────────────────────── */

export type VitalKey = keyof typeof VITAL_THRESHOLDS
export type VitalRating = 'good' | 'ni' | 'poor'

/** The three Core Web Vitals Google scores a page on, then the two diagnostics. */
export const CORE_VITALS: VitalKey[] = ['lcp', 'inp', 'cls']
export const ALL_VITALS: VitalKey[] = ['lcp', 'inp', 'cls', 'fcp', 'ttfb']

/** Google's rating of one value: good <= good line, poor > poor line (same rule as the report). */
export function vitalRating(key: VitalKey, v: number): VitalRating {
  const t = VITAL_THRESHOLDS[key]
  return v <= t.good ? 'good' : v > t.poor ? 'poor' : 'ni'
}

export const RATING_LABEL: Record<VitalRating, string> = {
  good: 'Good',
  ni: 'Needs improvement',
  poor: 'Poor',
}

/** "820 ms", "2.4 s", "0.05" (CLS has no unit). */
export function fmtVital(key: VitalKey, v: number | null | undefined): string {
  if (v == null || !Number.isFinite(v)) return '–'
  if (key === 'cls') return v === 0 ? '0' : String(Math.round(v * 1000) / 1000)
  if (v < 1000) return `${Math.round(v)} ms`
  const s = v / 1000
  // 1.25 s / 2.4 s / 12 s - trailing zeros dropped ("2 s", not "2.0 s").
  return `${s >= 10 ? s.toFixed(0) : s.toFixed(s >= 2 ? 1 : 2).replace(/\.?0+$/, '')} s`
}

/** Short axis tick text for a vital: "0", "500 ms", "2 s", "0.1". */
export function fmtVitalAxis(key: VitalKey, v: number): string {
  if (key === 'cls') return v === 0 ? '0' : String(Math.round(v * 1000) / 1000)
  if (v === 0) return '0'
  if (v < 1000) return `${Math.round(v)} ms`
  const s = v / 1000
  return `${Number.isInteger(s) ? s : s.toFixed(1)} s`
}

/** "Good under 2.5 s · poor over 4 s". */
export function vitalThresholdText(key: VitalKey): string {
  const t = VITAL_THRESHOLDS[key]
  return `Good ≤ ${fmtVital(key, t.good)} · poor > ${fmtVital(key, t.poor)}`
}

/**
 * Google's page-level verdict: a page (or the site) passes Core Web Vitals
 * when LCP, INP and CLS are all "good" at the 75th percentile. Metrics with
 * no samples are skipped (INP needs an interaction, so it is often missing).
 */
export function coreVerdict(v: VitalsSummary): { rating: VitalRating | null; measured: VitalKey[]; failing: VitalKey[] } {
  const measured = CORE_VITALS.filter(k => v[k] != null)
  if (!measured.length) return { rating: null, measured, failing: [] }
  const ratings = measured.map(k => ({ k, r: vitalRating(k, v[k]!.p75) }))
  const failing = ratings.filter(x => x.r !== 'good').map(x => x.k)
  const rating: VitalRating = ratings.some(x => x.r === 'poor') ? 'poor' : failing.length ? 'ni' : 'good'
  return { rating, measured, failing }
}
