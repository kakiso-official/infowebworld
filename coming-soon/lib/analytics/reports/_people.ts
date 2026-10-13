import { anQuery, mysqlServerOffsetMinutes, sqlUtcToIso, sqlUtcToMs } from '../db'
import { num } from '../query'
import {
  ACTIVE_NOW_MS, CHANNELS, CHANNEL_META, EVENTS, PAGE_TYPES,
  type Channel, type DeviceType, type EventCategory, type EventOrigin, type PageType,
  type SessionSummary, type TimelineItem, type VisitorSummary, type VisitorUser,
} from '../types'

/* ═══════════════════════════════════════════════════════════════════════════
   Private helpers for the "people" reports (sessions, visitor, signups,
   funnels, flow): row -> response mappers, label helpers and the
   business_users lookup. Report modules of the other half (overview, pages,
   ...) keep their own helpers in _shared.ts; the two sets are independent on
   purpose so both could be written at the same time.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Errors ─────────────────────────────────────────────────────────────── */

/** Thrown when ?id= is missing/invalid or points at nothing. */
export class ReportNotFoundError extends Error {
  constructor(what: string) {
    super(`${what} not found`)
    this.name = 'ReportNotFoundError'
  }
}

/** Positive integer id from ?id= (BIGINT ids stay well inside 2^53). */
export function parseId(raw: string | null, what: string): number {
  const s = (raw ?? '').trim()
  if (!/^\d{1,15}$/.test(s) || Number(s) <= 0) throw new ReportNotFoundError(what)
  return Number(s)
}

/* ── Labels and safe casts ──────────────────────────────────────────────── */

const CHANNEL_SET = new Set<string>(CHANNELS)
const PAGE_TYPE_SET = new Set<string>(PAGE_TYPES)

export function asChannel(v: unknown): Channel {
  return typeof v === 'string' && CHANNEL_SET.has(v) ? (v as Channel) : 'direct'
}
export function asChannelOrNull(v: unknown): Channel | null {
  return typeof v === 'string' && CHANNEL_SET.has(v) ? (v as Channel) : null
}
export function isChannel(v: unknown): v is Channel {
  return typeof v === 'string' && CHANNEL_SET.has(v)
}
export function asPageType(v: unknown): PageType {
  return typeof v === 'string' && PAGE_TYPE_SET.has(v) ? (v as PageType) : 'other'
}
export function isPageType(v: unknown): v is PageType {
  return typeof v === 'string' && PAGE_TYPE_SET.has(v)
}
export function asDevice(v: unknown): DeviceType {
  return v === 'mobile' || v === 'tablet' ? v : 'desktop'
}
export function asDeviceOrNull(v: unknown): DeviceType | null {
  return v === 'mobile' || v === 'tablet' || v === 'desktop' ? v : null
}

export function channelLabel(c: string): string {
  return isChannel(c) ? CHANNEL_META[c].label : c
}

/** "file_download" -> "File download" (for custom event names). */
export function humanize(name: string): string {
  const s = name.replace(/[_-]+/g, ' ').trim()
  return s ? s[0].toUpperCase() + s.slice(1) : name
}

export function eventLabel(name: string): string {
  return (EVENTS as Record<string, { label: string } | undefined>)[name]?.label ?? humanize(name)
}

const str = (v: unknown): string | null => (v == null || v === '' ? null : String(v))
const bool = (v: unknown): boolean => num(v) === 1 || v === true

/** JSON column -> object. mysql2 usually parses JSON already; strings are parsed defensively. */
export function parseProps(v: unknown): Record<string, unknown> | null {
  if (v == null) return null
  if (typeof v === 'object' && !Array.isArray(v)) return v as Record<string, unknown>
  if (typeof v === 'string') {
    try {
      const o = JSON.parse(v)
      return o && typeof o === 'object' && !Array.isArray(o) ? o : null
    } catch {
      return null
    }
  }
  return null
}

/* ── Sessions ───────────────────────────────────────────────────────────── */

/** Columns behind a SessionSummary (alias s = an_sessions, u = business_users). */
export const SESSION_SUMMARY_COLS = `
  s.id, s.visitor_id, s.user_id, u.email AS user_email, s.started_at, s.last_seen_at,
  s.duration_ms, s.engaged_ms, s.pageviews, s.events, s.key_events, s.is_new, s.is_engaged,
  s.entry_path, s.exit_path, s.channel, s.source, s.campaign, s.referrer,
  s.country, s.region, s.city, s.device_type, s.browser, s.os,
  s.did_signup, s.did_login, s.did_listing, s.did_lead, s.did_outbound`

/** Extra columns for the session detail header. */
export const SESSION_DETAIL_COLS = `${SESSION_SUMMARY_COLS},
  s.referrer_host, s.medium, s.term, s.content, s.click_id, s.screen_w, s.screen_h,
  s.language, s.timezone, s.os_version, s.browser_version`

/* business_users is joined by id only (no collation concerns); LEFT so a
   deleted account never hides a visit. */
export const SESSION_USER_JOIN = 'LEFT JOIN business_users u ON u.id = s.user_id'

export type SessionRowData = Record<string, unknown>

/** an_sessions row (SESSION_SUMMARY_COLS) -> SessionSummary. */
export function toSessionSummary(r: SessionRowData, nowMs: number = Date.now()): SessionSummary {
  const lastMs = sqlUtcToMs(r.last_seen_at as string) ?? 0
  return {
    id: num(r.id),
    visitorId: num(r.visitor_id),
    userId: r.user_id == null ? null : num(r.user_id),
    userEmail: str(r.user_email),
    startedAt: sqlUtcToIso(r.started_at as string) ?? '',
    lastSeenAt: sqlUtcToIso(r.last_seen_at as string) ?? '',
    durationMs: num(r.duration_ms),
    engagedMs: num(r.engaged_ms),
    pageviews: num(r.pageviews),
    events: num(r.events),
    keyEvents: num(r.key_events),
    isNew: bool(r.is_new),
    isEngaged: bool(r.is_engaged),
    isLive: nowMs - lastMs < ACTIVE_NOW_MS,
    entryPath: String(r.entry_path ?? ''),
    exitPath: String(r.exit_path ?? ''),
    channel: asChannel(r.channel),
    source: String(r.source ?? ''),
    campaign: str(r.campaign),
    referrer: str(r.referrer),
    country: str(r.country),
    region: str(r.region),
    city: str(r.city),
    deviceType: asDevice(r.device_type),
    browser: str(r.browser),
    os: str(r.os),
    flags: {
      signup: bool(r.did_signup),
      login: bool(r.did_login),
      listing: bool(r.did_listing),
      lead: bool(r.did_lead),
      outbound: bool(r.did_outbound),
    },
  }
}

/* ── Visitors ───────────────────────────────────────────────────────────── */

export const VISITOR_COLS = `
  v.id, v.vid, v.user_id, v.first_seen_at, v.last_seen_at, v.sessions, v.pageviews, v.events,
  v.engaged_ms, v.first_session_id, v.first_channel, v.first_source, v.first_medium,
  v.first_campaign, v.first_referrer, v.first_landing, v.country, v.device_type, v.signed_up_at`

export function firstTouchOf(r: SessionRowData): VisitorSummary['firstTouch'] {
  return {
    channel: asChannelOrNull(r.first_channel),
    source: str(r.first_source),
    medium: str(r.first_medium),
    campaign: str(r.first_campaign),
    referrer: str(r.first_referrer),
    landing: str(r.first_landing),
  }
}

/** Exact per-visitor totals, summed from the visitor's sessions. */
export interface VisitorTotals { sessions: number; pageviews: number; events: number; engagedMs: number; lastSeen: string | null }

export async function visitorTotals(visitorId: number): Promise<VisitorTotals> {
  const rows = await anQuery(
    `SELECT COUNT(*) AS sessions, COALESCE(SUM(pageviews), 0) AS pageviews,
            COALESCE(SUM(events), 0) AS events, COALESCE(SUM(engaged_ms), 0) AS engaged_ms,
            MAX(last_seen_at) AS last_seen
       FROM an_sessions WHERE visitor_id = ?`,
    [visitorId],
  )
  const r = rows[0] ?? {}
  return {
    sessions: num(r.sessions),
    pageviews: num(r.pageviews),
    events: num(r.events),
    engagedMs: num(r.engaged_ms),
    lastSeen: (r.last_seen as string | null) ?? null,
  }
}

/**
 * an_visitors row (VISITOR_COLS) -> VisitorSummary. Totals come from
 * an_sessions (exact) rather than the visitor's running counters, which the
 * collector keeps best-effort. When old sessions were already pruned
 * (sessions live 760 days, visitors forever) the counters are larger, so
 * the larger of the two is shown.
 */
export function toVisitorSummary(v: SessionRowData, totals: VisitorTotals, user: VisitorUser | null): VisitorSummary {
  const lastA = sqlUtcToMs(v.last_seen_at as string) ?? 0
  const lastB = sqlUtcToMs(totals.lastSeen) ?? 0
  const pruned = totals.sessions < num(v.sessions)
  return {
    id: num(v.id),
    userId: v.user_id == null ? null : num(v.user_id),
    user,
    firstSeenAt: sqlUtcToIso(v.first_seen_at as string) ?? '',
    lastSeenAt: new Date(Math.max(lastA, lastB)).toISOString(),
    sessions: pruned ? num(v.sessions) : totals.sessions,
    pageviews: pruned ? Math.max(num(v.pageviews), totals.pageviews) : totals.pageviews,
    events: pruned ? Math.max(num(v.events), totals.events) : totals.events,
    engagedMs: pruned ? Math.max(num(v.engaged_ms), totals.engagedMs) : totals.engagedMs,
    firstTouch: firstTouchOf(v),
    country: str(v.country),
    deviceType: asDeviceOrNull(v.device_type),
    signedUpAt: sqlUtcToIso(v.signed_up_at as string),
  }
}

/* ── business_users (MySQL server clock, not UTC) ───────────────────────── */

/** Server-local 'YYYY-MM-DD HH:MM:SS' (business_users.created_at) -> UTC epoch ms. */
export function serverLocalToMs(s: unknown, offsetMinutes: number): number | null {
  if (s == null || s === '') return null
  const ms = sqlUtcToMs(String(s))
  return ms == null || Number.isNaN(ms) ? null : ms - offsetMinutes * 60_000
}

/** Business accounts by id, with their listing counts (submissions.user_id). */
export async function loadUsers(ids: number[]): Promise<Map<number, VisitorUser>> {
  const out = new Map<number, VisitorUser>()
  const unique = [...new Set(ids.filter(id => Number.isFinite(id) && id > 0))]
  if (unique.length === 0) return out
  const [rows, offset] = await Promise.all([
    anQuery(
      `SELECT u.id, u.email, u.name, u.created_at,
              (SELECT COUNT(*) FROM submissions sb WHERE sb.user_id = u.id) AS listings
         FROM business_users u WHERE u.id IN (?)`,
      [unique],
    ),
    mysqlServerOffsetMinutes(),
  ])
  for (const r of rows) {
    const created = serverLocalToMs(r.created_at, offset)
    out.set(num(r.id), {
      id: num(r.id),
      email: String(r.email ?? ''),
      name: str(r.name),
      createdAt: created == null ? null : new Date(created).toISOString(),
      listings: num(r.listings),
    })
  }
  return out
}

/* ── Timeline events ────────────────────────────────────────────────────── */

export const EVENT_ITEM_COLS = 'e.id, e.ts, e.name, e.category, e.is_key, e.origin, e.path, e.target, e.label, e.value, e.props, e.pageview_id'

const CATEGORIES = new Set<EventCategory>(['conversion', 'engagement', 'navigation', 'error'])

/** an_events row (EVENT_ITEM_COLS) -> timeline event item. */
export function toEventItem(r: SessionRowData): Extract<TimelineItem, { kind: 'event' }> {
  const name = String(r.name ?? '')
  const category = CATEGORIES.has(r.category as EventCategory) ? (r.category as EventCategory) : 'engagement'
  return {
    kind: 'event',
    id: num(r.id),
    ts: sqlUtcToIso(r.ts as string) ?? '',
    name,
    label: eventLabel(name),
    category,
    isKey: bool(r.is_key),
    origin: (r.origin === 'server' ? 'server' : 'client') as EventOrigin,
    path: str(r.path),
    target: str(r.target),
    text: str(r.label),
    value: r.value == null ? null : num(r.value),
    props: parseProps(r.props),
  }
}
