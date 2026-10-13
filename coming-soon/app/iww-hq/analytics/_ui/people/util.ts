import {
  CHANNEL_META, EVENTS, VITAL_THRESHOLDS,
  type Channel, type SessionSummary, type VisitorSummary,
} from '@/lib/analytics/types'
import { sourceLabel } from '@/lib/analytics/sources'
import { countryName, fmtDuration } from '../../_lib/format'

/* ═══════════════════════════════════════════════════════════════════════════
   Plain helpers for the people & journey pages (Journeys, Funnels, Visitors,
   one visit, one visitor, Signups, Settings). No React here - only text and
   numbers, so the sentences every page builds read the same way.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Event keys of the session flags, in the order the conversion icons show them. */
export const FLAG_EVENTS: { flag: keyof SessionSummary['flags']; event: keyof typeof EVENTS; label: string }[] = [
  { flag: 'signup', event: 'signup_completed', label: 'Signed up' },
  { flag: 'listing', event: 'listing_submitted', label: 'Submitted a listing' },
  { flag: 'lead', event: 'lead_sent', label: 'Contacted a business' },
  { flag: 'outbound', event: 'website_click', label: 'Visited a business website' },
  { flag: 'login', event: 'login', label: 'Logged in' },
]

/** "1st", "2nd", "3rd", "11th"... */
export function ordinal(n: number): string {
  const s = n % 100
  if (s >= 11 && s <= 13) return `${n}th`
  return `${n}${n % 10 === 1 ? 'st' : n % 10 === 2 ? 'nd' : n % 10 === 3 ? 'rd' : 'th'}`
}

/** "+42s" / "+3m 05s" between two moments (blank when not positive). */
export function fmtGap(ms: number | null | undefined): string {
  if (ms == null || !Number.isFinite(ms) || ms < 500) return ''
  return `+${fmtDuration(ms)}`
}

/**
 * Shorten text to `max` characters. Paths keep their start AND end
 * ("/saas-directory/…/crm-platforms") because the last segment is usually
 * the part that tells two pages apart; everything else is cut at the end.
 */
export function truncate(text: string, max: number, middle = false): string {
  if (text.length <= max) return text
  if (max < 8 || !middle) return text.slice(0, Math.max(1, max - 1)) + '…'
  const tail = Math.ceil((max - 1) * 0.55)
  const head = max - 1 - tail
  return text.slice(0, head) + '…' + text.slice(text.length - tail)
}

/** "Organic search · Google" style description of where a visit came from. */
export function sourceText(channel: string | null | undefined, source: string | null | undefined): string {
  const ch = channel && CHANNEL_META[channel as Channel] ? CHANNEL_META[channel as Channel].label : null
  const src = source ? sourceLabel(source) : null
  if (!src || src === ch || source === '(direct)') return ch ?? src ?? 'Unknown'
  return ch ? `${src} (${ch.toLowerCase()})` : src
}

/** "Mumbai, Maharashtra, India" from whatever parts are known. */
export function placeText(city: string | null | undefined, region: string | null | undefined, country: string | null | undefined): string {
  const parts = [city, region && region !== city ? region : null, country ? countryName(country) : null].filter(Boolean)
  return parts.length ? parts.join(', ') : 'Unknown location'
}

/** Short phrase for the first touch: "Google", "a link on example.com", "a direct visit". */
export function firstTouchPhrase(ft: VisitorSummary['firstTouch'] | null | undefined): string {
  if (!ft || (!ft.channel && !ft.source)) return 'an unknown source'
  if (ft.channel === 'direct' || ft.source === '(direct)') return 'a direct visit (typed address, bookmark or an app)'
  if (ft.channel === 'referral' && ft.source) return `a link on ${ft.source}`
  const name = ft.source ? sourceLabel(ft.source) : CHANNEL_META[ft.channel as Channel]?.label ?? 'an unknown source'
  if (ft.campaign) return `${name} (campaign "${ft.campaign}")`
  return name
}

/** Rating of a Web Vital value against Google's thresholds. */
export type VitalRating = 'good' | 'ni' | 'poor'
export function vitalRating(key: keyof typeof VITAL_THRESHOLDS, v: number): VitalRating {
  const t = VITAL_THRESHOLDS[key]
  return v <= t.good ? 'good' : v > t.poor ? 'poor' : 'ni'
}
export function fmtVital(key: keyof typeof VITAL_THRESHOLDS, v: number): string {
  if (key === 'cls') return v.toFixed(v < 0.01 ? 3 : 2)
  return v >= 1000 ? `${(v / 1000).toFixed(v >= 10_000 ? 0 : 1)} s` : `${Math.round(v)} ms`
}

/** True for a URL a link can safely point at (http/https only - never javascript:). */
export function isHttpUrl(s: string | null | undefined): s is string {
  return !!s && /^https?:\/\//i.test(s)
}

/** Median of numbers (null when empty). */
export function medianOf(values: number[]): number | null {
  if (!values.length) return null
  const s = [...values].sort((a, b) => a - b)
  const mid = s.length >> 1
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

/** "1 visit" / "3 visits". */
export function plural(n: number, one: string, many = `${one}s`): string {
  return `${n.toLocaleString('en-US')} ${n === 1 ? one : many}`
}
