import { anQuery, sqlUtcToMs, toSqlUtc } from '../db'
import { likeEscape, num, safeDiv, sessionConditions, windowOf, type ReportParams } from '../query'
import {
  CHANNEL_META, CUSTOM_EVENT_NAME_RE, PAGE_TYPE_META, SESSION_MAX_MS,
  type Channel, type FunnelPreset, type FunnelReport, type FunnelStepDef, type FunnelStepResult,
} from '../types'
import { matchFunnel, median, normalizePath } from './_journey'
import { eventLabel, isChannel, isPageType } from './_people'

/* ═══════════════════════════════════════════════════════════════════════════
   Funnels report.

   ?preset=<id>  or  ?steps=<JSON FunnelStepDef[]> (2-8 steps)
   &scope=session (default: all steps in the same visit)
        | visitor (steps may happen across visits of the same browser)

   Who counts: visits started in the date range that match the filters
   (visitor scope: the browsers behind those visits, using only those visits).
   A step matches a pageview (page = exact path, page_prefix = path starts
   with the value, page_type) or an event (event = name). An entity must hit
   the steps in order: step 1 at its earliest match, each next step at its
   earliest match STRICTLY after the previous step's matched time.

   SQL fetches (entity, timestamp) rows per step - newest first, capped at
   CAP_ROWS per step (sampled: true when a cap is hit) - and the matching
   runs in JS (./_journey.ts).
   ═══════════════════════════════════════════════════════════════════════════ */

const CAP_ROWS = 200_000
const MIN_STEPS = 2
const MAX_STEPS = 8

/* Server events (signups, listings...) attach to the visitor's latest visit
   when it was active in the last 24 hours, so they can land up to a day
   after that visit's last pageview. */
const SERVER_EVENT_GRACE_MS = 24 * 60 * 60 * 1000

export const FUNNEL_PRESETS: FunnelPreset[] = [
  {
    id: 'business_signup',
    name: 'Business signup to listing',
    description: 'From the For Businesses pages to a submitted listing: opened signup, created an account, started a listing, submitted it.',
    steps: [
      { kind: 'page_prefix', value: '/business', label: 'Visited For Businesses' },
      { kind: 'event', value: 'signup_started', label: 'Opened signup' },
      { kind: 'event', value: 'signup_completed', label: 'Signed up' },
      { kind: 'page_prefix', value: '/dashboard/new', label: 'Started a listing' },
      { kind: 'event', value: 'listing_submitted', label: 'Submitted a listing' },
    ],
  },
  {
    id: 'company_discovery',
    name: 'Company discovery',
    description: 'Category page, then a company profile, then a click through to that company\'s website.',
    steps: [
      { kind: 'page_type', value: 'category', label: 'Viewed a category' },
      { kind: 'page_type', value: 'profile', label: 'Opened a company profile' },
      { kind: 'event', value: 'website_click', label: 'Visited the company\'s website' },
    ],
  },
  {
    id: 'product_discovery',
    name: 'Product discovery',
    description: 'Category page, then a product page, then a click through to the product\'s website.',
    steps: [
      { kind: 'page_type', value: 'category', label: 'Viewed a category' },
      { kind: 'page_type', value: 'listing', label: 'Opened a product page' },
      { kind: 'event', value: 'website_click', label: 'Visited the product\'s website' },
    ],
  },
  {
    id: 'compare_to_click',
    name: 'Comparison to website visit',
    description: 'Visitors who used a comparison page and then clicked through to a listed business.',
    steps: [
      { kind: 'page_type', value: 'compare', label: 'Viewed a comparison' },
      { kind: 'event', value: 'website_click', label: 'Visited a business website' },
    ],
  },
  {
    id: 'blog_to_signup',
    name: 'Blog to signup',
    description: 'Readers of a blog post who went on to the For Businesses pages and created an account.',
    steps: [
      { kind: 'page_type', value: 'blog_post', label: 'Read a blog post' },
      { kind: 'page_prefix', value: '/business', label: 'Visited For Businesses' },
      { kind: 'event', value: 'signup_completed', label: 'Signed up' },
    ],
  },
  {
    id: 'search_to_click',
    name: 'Site search to website visit',
    description: 'Visitors who searched the site and then clicked through to a listed business.',
    steps: [
      { kind: 'event', value: 'search', label: 'Searched the site' },
      { kind: 'event', value: 'website_click', label: 'Visited a business website' },
    ],
  },
]

const KINDS = new Set<FunnelStepDef['kind']>(['page', 'page_prefix', 'page_type', 'event'])

/** Validate one step from the ?steps= JSON; null when unusable. */
function cleanStep(raw: unknown): FunnelStepDef | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  const kind = r.kind as FunnelStepDef['kind']
  if (!KINDS.has(kind) || typeof r.value !== 'string') return null
  let value = r.value.trim().slice(0, 500)
  if (!value) return null
  if (kind === 'page') value = normalizePath(value)
  else if (kind === 'page_prefix' && !value.startsWith('/')) value = '/' + value
  else if (kind === 'page_type' && !isPageType(value)) return null
  else if (kind === 'event' && !CUSTOM_EVENT_NAME_RE.test(value)) return null
  const label = typeof r.label === 'string' && r.label.trim() ? r.label.trim().slice(0, 100) : undefined
  return label ? { kind, value, label } : { kind, value }
}

/** Steps from ?steps= (when valid), else ?preset=, else the first preset. */
export function resolveFunnelSteps(sp: URLSearchParams): FunnelStepDef[] {
  const json = sp.get('steps')
  if (json) {
    try {
      const arr = JSON.parse(json)
      if (Array.isArray(arr)) {
        const steps = arr.slice(0, MAX_STEPS).map(cleanStep)
        if (steps.length >= MIN_STEPS && steps.every(Boolean)) return steps as FunnelStepDef[]
      }
    } catch { /* fall through to the preset */ }
  }
  const preset = FUNNEL_PRESETS.find(f => f.id === sp.get('preset')) ?? FUNNEL_PRESETS[0]
  return preset.steps
}

export function stepLabel(def: FunnelStepDef): string {
  if (def.label) return def.label
  switch (def.kind) {
    case 'page': return `Viewed ${def.value}`
    case 'page_prefix': return `Viewed ${def.value}…`
    case 'page_type': return `Viewed: ${isPageType(def.value) ? PAGE_TYPE_META[def.value].label : def.value}`
    case 'event': return eventLabel(def.value)
  }
}

interface StepRows {
  /** entity -> matched timestamps (epoch ms), ascending */
  times: Map<number, number[]>
  /** entity -> channel (only filled for step 1) */
  channels: Map<number, string>
  capped: boolean
}

export async function funnelsReport(p: ReportParams): Promise<FunnelReport> {
  const scope: FunnelReport['scope'] = p.sp.get('scope') === 'visitor' ? 'visitor' : 'session'
  const defs = resolveFunnelSteps(p.sp)
  const win = windowOf(p.range, 'cur')!
  const cond = sessionConditions(p.filters, win)
  const startUtc = p.range.startUtc
  const endMs = sqlUtcToMs(p.range.endUtc) ?? Date.now()
  const pvEnd = toSqlUtc(endMs + SESSION_MAX_MS)
  const evEnd = toSqlUtc(endMs + SESSION_MAX_MS + SERVER_EVENT_GRACE_MS)

  const entityCol = scope === 'visitor' ? 's.visitor_id' : 's.id'

  async function fetchStep(def: FunnelStepDef, withChannel: boolean): Promise<StepRows> {
    /* Channel for the by-channel table: the visit's channel, or in visitor
       scope the browser's first-touch channel (falls back to the visit's
       when the first touch is unknown). */
    const channelSel = withChannel
      ? scope === 'visitor' ? ', COALESCE(v.first_channel, s.channel) AS ch' : ', s.channel AS ch'
      : ''
    const visitorJoin = withChannel && scope === 'visitor' ? 'LEFT JOIN an_visitors v ON v.id = s.visitor_id' : ''

    let sql: string
    let params: unknown[]
    if (def.kind === 'event') {
      sql = `SELECT ${entityCol} AS ent, e.ts${channelSel}
               FROM an_events e
               JOIN an_sessions s ON s.id = e.session_id
               ${visitorJoin}
              WHERE e.name = ? AND e.ts >= ? AND e.ts < ? AND ${cond.sql}
              ORDER BY e.ts DESC LIMIT ?`
      params = [def.value, startUtc, evEnd, ...cond.params, CAP_ROWS + 1]
    } else {
      let match: string
      let value: string
      if (def.kind === 'page') { match = 'p.path = ?'; value = def.value }
      else if (def.kind === 'page_type') { match = 'p.page_type = ?'; value = def.value }
      else { match = `p.path LIKE ? ESCAPE '\\\\'`; value = likeEscape(def.value) + '%' }
      sql = `SELECT ${entityCol} AS ent, p.ts${channelSel}
               FROM an_pageviews p
               JOIN an_sessions s ON s.id = p.session_id
               ${visitorJoin}
              WHERE ${match} AND p.ts >= ? AND p.ts < ? AND ${cond.sql}
              ORDER BY p.ts DESC LIMIT ?`
      params = [value, startUtc, pvEnd, ...cond.params, CAP_ROWS + 1]
    }

    const rows = await anQuery(sql, params)
    const capped = rows.length > CAP_ROWS
    const times = new Map<number, number[]>()
    const channels = new Map<number, string>()
    const n = Math.min(rows.length, CAP_ROWS)
    // Rows are newest first: walking backwards yields ascending times, and the
    // last channel written per entity is the one of its earliest match.
    for (let i = n - 1; i >= 0; i--) {
      const r = rows[i]
      const ent = num(r.ent)
      const t = sqlUtcToMs(r.ts as string)
      if (t == null) continue
      const list = times.get(ent)
      if (list) list.push(t)
      else {
        times.set(ent, [t])
        if (withChannel) channels.set(ent, String(r.ch ?? ''))
      }
    }
    return { times, channels, capped }
  }

  const stepRows = await Promise.all(defs.map((d, i) => fetchStep(d, i === 0)))
  const sampled = stepRows.some(s => s.capped)

  const counts = defs.map(() => 0)
  const deltas: number[][] = defs.map(() => [])
  const byChannel = new Map<Channel, number[]>()

  for (const [ent, firstTimes] of stepRows[0].times) {
    const m = matchFunnel([firstTimes, ...stepRows.slice(1).map(s => s.times.get(ent))])
    const chRaw = stepRows[0].channels.get(ent)
    const ch: Channel = isChannel(chRaw) ? chRaw : 'direct'
    let chCounts = byChannel.get(ch)
    if (!chCounts) { chCounts = defs.map(() => 0); byChannel.set(ch, chCounts) }
    for (let k = 0; k < m.reached; k++) {
      counts[k]++
      chCounts[k]++
      if (k > 0) deltas[k].push(m.deltas[k])
    }
  }

  const steps: FunnelStepResult[] = defs.map((def, k) => ({
    label: stepLabel(def),
    def,
    count: counts[k],
    rateFromStart: k === 0 ? (counts[0] > 0 ? 1 : 0) : safeDiv(counts[k], counts[0]),
    rateFromPrev: k === 0 ? (counts[0] > 0 ? 1 : 0) : safeDiv(counts[k], counts[k - 1]),
    dropoff: k === 0 ? 0 : counts[k - 1] - counts[k],
    medianMsFromPrev: k === 0 ? null : median(deltas[k]),
  }))

  return {
    range: p.range,
    scope,
    sampled,
    steps,
    presets: FUNNEL_PRESETS,
    byChannel: [...byChannel.entries()]
      .sort((a, b) => b[1][0] - a[1][0] || b[1][b[1].length - 1] - a[1][a[1].length - 1])
      .map(([key, c]) => ({ key, label: CHANNEL_META[key].label, counts: c })),
  }
}
