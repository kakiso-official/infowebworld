import { normalizePath } from './classify'
import { CUSTOM_EVENT_NAME_RE, EVENTS, type EventMeta, type PulseBatch } from './types'

/* ═══════════════════════════════════════════════════════════════════════════
   Wire validation for POST /api/pulse.

   Everything from the browser is untrusted. A batch is rejected as a whole
   only when its envelope is broken (not JSON, v !== 1, no hits array, more
   than 50 hits); a single malformed hit is skipped and counted 'invalid'
   while the rest of the batch is kept. Free-text fields (title, referrer,
   link target/label) are truncated to their column sizes rather than
   rejected, so one long referrer never costs a pageview.

   Output values are clean and typed: paths normalized, ids lower-cased,
   numbers clamped to their column ranges, control characters removed.
   ═══════════════════════════════════════════════════════════════════════════ */

export const MAX_HITS_PER_BATCH = 50
const MAX_PROPS_JSON = 2048
const MAX_ENGAGED_MS = 6 * 60 * 60 * 1000

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isUuid(v: unknown): v is string {
  return typeof v === 'string' && UUID_RE.test(v)
}

export type NavType = 'navigate' | 'reload' | 'back_forward' | 'prerender' | 'push' | 'traverse'
const NAV_TYPES: ReadonlySet<string> = new Set(['navigate', 'reload', 'back_forward', 'prerender', 'push', 'traverse'])

export type VitalName = 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB'
const VITAL_NAMES: ReadonlySet<string> = new Set(['LCP', 'INP', 'CLS', 'FCP', 'TTFB'])

export interface CleanPageview {
  t: 'pv'
  ts: number
  pvid: string
  path: string            // normalizePath()
  search: string          // raw location.search (attribution + kept keys only)
  title: string | null
  ref: string
  nav: NavType | null
  status: number
  sw: number | null
  sh: number | null
  touch: number
  lang: string | null
  tz: string | null
  results: number | null
}
export interface CleanEngagement { t: 'pe'; ts: number; pvid: string; eng: number; scroll: number; final: boolean }
export interface CleanEvent {
  t: 'ev'
  ts: number
  pvid: string | null
  name: string
  meta: Pick<EventMeta, 'category' | 'isKey' | 'sessionFlag'>
  target: string | null
  label: string | null
  value: number | null
  props: string | null    // JSON text, <= 2 KB
}
export interface CleanVital { t: 'wv'; ts: number; pvid: string; name: VitalName; value: number }
export type CleanHit = CleanPageview | CleanEngagement | CleanEvent | CleanVital

export interface CleanBatch {
  /** visitor id hint from localStorage (lower-cased UUID) */
  vid: string | null
  now: number
  hits: CleanHit[]
}

/* ── Field helpers ──────────────────────────────────────────────────────── */

const CONTROL_RE = /[\u0000-\u001f\u007f]/g

/** String field: trimmed, control characters removed, truncated; null when
    missing or empty. Non-strings are null. */
function text(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null
  const s = v.replace(CONTROL_RE, ' ').trim()
  return s ? s.slice(0, max) : null
}

function finite(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null
}

function clampInt(v: unknown, min: number, max: number): number | null {
  const n = finite(v)
  return n === null ? null : Math.min(max, Math.max(min, Math.round(n)))
}

/** Known client event -> its meta; valid custom name -> engagement, not key;
    server-only or malformed -> null (a browser can't claim a signup). */
function eventMeta(name: string): CleanEvent['meta'] | null {
  if (Object.prototype.hasOwnProperty.call(EVENTS, name)) {
    const m = EVENTS[name as keyof typeof EVENTS] as EventMeta
    if (m.serverOnly) return null
    return { category: m.category, isKey: m.isKey, sessionFlag: m.sessionFlag }
  }
  return CUSTOM_EVENT_NAME_RE.test(name) ? { category: 'engagement', isKey: false } : null
}

/* Unpaired UTF-16 surrogates (sent as-is, or left by a slice through an
   emoji): JSON.stringify writes them as "\ud83d", which MySQL's JSON type
   rejects ("surrogate pair in string is invalid"), failing the insert. */
const LONE_SURROGATE_RE = /[\ud800-\udbff](?![\udc00-\udfff])|(?<![\ud800-\udbff])[\udc00-\udfff]/g
const wellFormed = (s: string) => s.replace(LONE_SURROGATE_RE, '�')

/** props: flat object of primitives, <= 20 keys, JSON <= 2 KB (else dropped). */
function cleanProps(v: unknown): string | null {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null
  const out: Record<string, string | number | boolean | null> = {}
  let n = 0
  for (const [k, raw] of Object.entries(v as Record<string, unknown>)) {
    if (n >= 20) break
    const key = wellFormed(k.replace(CONTROL_RE, '').slice(0, 40))
    if (!key) continue
    if (raw === null || typeof raw === 'boolean') out[key] = raw
    else if (typeof raw === 'number') { if (Number.isFinite(raw)) out[key] = raw; else continue }
    else if (typeof raw === 'string') out[key] = wellFormed(raw.replace(CONTROL_RE, ' ').slice(0, 300))
    else continue
    n++
  }
  if (!n) return null
  const json = JSON.stringify(out)
  return json.length <= MAX_PROPS_JSON ? json : null
}

/* an_events.value is DECIMAL(12,2). */
function cleanValue(v: unknown): number | null {
  const n = finite(v)
  if (n === null) return null
  return Math.round(Math.min(9_999_999_999.99, Math.max(-9_999_999_999.99, n)) * 100) / 100
}

/* ── Hits ───────────────────────────────────────────────────────────────── */

function cleanHit(raw: unknown): CleanHit | null {
  if (!raw || typeof raw !== 'object') return null
  const h = raw as Record<string, unknown>
  const ts = finite(h.ts)
  if (ts === null || ts <= 0) return null

  switch (h.t) {
    case 'pv': {
      if (!isUuid(h.pvid)) return null
      if (typeof h.path !== 'string' || !h.path.startsWith('/') || h.path.length > 2048) return null
      let path = h.path
      let search = typeof h.search === 'string' && h.search.length <= 2048 ? h.search : ''
      let status = clampInt(h.status, 100, 599)
      /* Garbage URLs 307 to /url-removed?from=<original path> (a true 404,
         app/[...segments]/page.tsx): record the URL the visitor asked for. */
      if (path === '/url-removed' && search) {
        const from = new URLSearchParams(search).get('from')
        if (from && from.startsWith('/') && !from.startsWith('//') && from.length <= 2048) {
          path = from
          search = ''
          status = 404
        }
      }
      const sw = clampInt(h.sw, 0, 65535)
      const sh = clampInt(h.sh, 0, 65535)
      const lang = text(h.lang, 16)
      const tz = text(h.tz, 64)
      return {
        t: 'pv',
        ts,
        pvid: h.pvid.toLowerCase(),
        path: normalizePath(path),
        search,
        title: text(h.title, 300),
        /* Long referrers are parsed, then stored without their query
           string; anything absurdly long is ignored. */
        ref: typeof h.ref === 'string' && h.ref.length <= 4096 ? h.ref.trim() : '',
        nav: typeof h.nav === 'string' && NAV_TYPES.has(h.nav) ? h.nav as NavType : null,
        status: status ?? 200,
        sw: sw || null,
        sh: sh || null,
        touch: clampInt(h.touch, 0, 100) ?? 0,
        lang: lang && /^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{1,8})*$/.test(lang) ? lang : null,
        tz: tz && /^[A-Za-z0-9_+\-/]+$/.test(tz) ? tz : null,
        results: h.results === undefined || h.results === null ? null : clampInt(h.results, 0, 10_000_000),
      }
    }
    case 'pe': {
      if (!isUuid(h.pvid)) return null
      const eng = clampInt(h.eng, 0, MAX_ENGAGED_MS)
      const scroll = clampInt(h.scroll, 0, 100)
      if (eng === null || scroll === null) return null
      return { t: 'pe', ts, pvid: h.pvid.toLowerCase(), eng, scroll, final: h.final === true }
    }
    case 'ev': {
      if (typeof h.name !== 'string') return null
      const meta = eventMeta(h.name)
      if (!meta) return null
      if (h.pvid !== undefined && h.pvid !== null && !isUuid(h.pvid)) return null
      return {
        t: 'ev',
        ts,
        pvid: isUuid(h.pvid) ? h.pvid.toLowerCase() : null,
        name: h.name,
        meta,
        target: text(h.target, 1000),
        label: text(h.label, 300),
        value: cleanValue(h.value),
        props: cleanProps(h.props),
      }
    }
    case 'wv': {
      if (!isUuid(h.pvid) || typeof h.name !== 'string' || !VITAL_NAMES.has(h.name)) return null
      const v = finite(h.value)
      if (v === null || v < 0) return null
      /* CLS is unitless (0-10, 4 decimals); the rest are ms (0-120 s). */
      const value = h.name === 'CLS'
        ? Math.round(Math.min(v, 10) * 10_000) / 10_000
        : Math.round(Math.min(v, 120_000))
      return { t: 'wv', ts, pvid: h.pvid.toLowerCase(), name: h.name as VitalName, value }
    }
    default:
      return null
  }
}

/** Parse + validate a request body. `batch` is null when the envelope is
    unusable; `invalid` counts the individual hits that were skipped. */
export function parseBatch(body: string): { batch: CleanBatch | null; invalid: number } {
  let data: unknown
  try { data = JSON.parse(body) } catch { return { batch: null, invalid: 0 } }
  if (!data || typeof data !== 'object') return { batch: null, invalid: 0 }
  const b = data as Partial<PulseBatch> & Record<string, unknown>
  if (b.v !== 1 || !Array.isArray(b.hits) || b.hits.length > MAX_HITS_PER_BATCH) return { batch: null, invalid: 0 }
  const now = finite(b.now)
  if (now === null || now <= 0) return { batch: null, invalid: 0 }

  const hits: CleanHit[] = []
  let invalid = 0
  for (const raw of b.hits) {
    const hit = cleanHit(raw)
    if (hit) hits.push(hit)
    else invalid++
  }
  return {
    batch: { vid: isUuid(b.vid) ? b.vid.toLowerCase() : null, now, hits },
    invalid,
  }
}
