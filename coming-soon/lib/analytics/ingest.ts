import { createHash } from 'node:crypto'
import { anExecute, anQueryOne, sqlUtcToMs, toSqlUtc } from './db'
import {
  classifyPage, classifyTraffic, parseReferrer, parseUserAgent,
  cleanQuery, type TrafficInfo, type UaHints, type UaInfo,
} from './classify'
import { EVENTS, SESSION_MAX_MS, SESSION_TIMEOUT_MS, type EventMeta, type PageType } from './types'
import { LruCache } from './collector-cache'
import { DURATION_SQL, ENGAGED_SQL, EXTEND_LAST_SEEN_SQL, flagSql } from './collector-sql'
import { analyticsWritable, flushFilteredCounts, handleAnalyticsDbError } from './collector-state'
import type { CollectorGeo } from './collector-request'
import type { CleanBatch, CleanEngagement, CleanEvent, CleanHit, CleanPageview, CleanVital } from './collector-validate'
import { maybeRunMaintenance } from './maintenance'

/* ═══════════════════════════════════════════════════════════════════════════
   Collector write path: turns validated pulse batches into an_visitors /
   an_sessions / an_pageviews / an_events rows (rules: SPEC §1-§2).

   Runs inside after(), i.e. once the browser already has its response.
   Protecting the site comes first:
   - analytics pool only (3 connections, lib/analytics/db.ts), so tracking
     can never starve page renders of database connections;
   - one batch at a time per visitor (a promise chain per vid), so two tabs
     or a pageview racing its own heartbeat can't open two sessions or
     assign the same seq twice;
   - in-memory caches for visitors, sessions, pageviews and user tokens, so
     a typical pageview costs four short writes and no reads;
   - a global cap on queued batches (isCollectorOverloaded) - when the
     database falls behind, new hits are dropped instead of queueing memory;
   - nothing here ever throws to the caller.

   Every timestamp written is UTC (toSqlUtc), never NOW().
   ═══════════════════════════════════════════════════════════════════════════ */

export interface CollectorContext {
  vid: string
  receivedMs: number
  ua: string
  hints: Omit<UaHints, 'touch'>
  geo: CollectorGeo
  userToken: string | null
  /** The request Host, treated as our own site when classifying referrers. */
  host: string | null
}

/* ── State + caches ─────────────────────────────────────────────────────── */

interface VisitorState { id: number; sessions: number }

interface SessionState {
  id: number
  startedMs: number
  lastSeenMs: number
  pageviews: number
  exitPath: string
  source: string
  campaign: string | null
}

interface PageviewState {
  id: number
  sessionId: number
  visitorId: number
  path: string
  eng: number
  scroll: number
}

const HOUR = 3_600_000
const visitors = new LruCache<VisitorState>(50_000, 6 * HOUR)
/* keyed by visitor id; null = "this visitor has no session yet" */
const sessions = new LruCache<SessionState | null>(50_000, 2 * HOUR)
const pageviews = new LruCache<PageviewState>(60_000, 3 * HOUR)
/* sha256(user token) -> business user id (null = invalid/expired token) */
const users = new LruCache<number | null>(10_000, 10 * 60_000)
const USER_MISS_TTL_MS = 2 * 60_000
const uaInfo = new LruCache<UaInfo>(2_000, HOUR)
/* `${session}|${name}|${target}` -> last click time (2 s dedupe) */
const recentClicks = new LruCache<number>(20_000, 10_000)
/* `${session}|${message}` -> js_error count (cap per session) */
const jsErrorCounts = new LruCache<number>(20_000, 13 * HOUR)

const CLICK_DEDUPE_MS = 2_000
const JS_ERRORS_PER_MESSAGE = 5
const MAX_PENDING_BATCHES = 1_000
const MAX_HIT_AGE_MS = HOUR

const chains = new Map<string, Promise<void>>()
let pendingBatches = 0

/** True when the database is falling behind and new batches should be
    dropped (counted as 'overloaded') instead of queued. */
export function isCollectorOverloaded(): boolean {
  return pendingBatches >= MAX_PENDING_BATCHES
}

const VITAL_COLUMNS: Record<CleanVital['name'], string> = {
  LCP: 'lcp_ms', INP: 'inp_ms', CLS: 'cls', FCP: 'fcp_ms', TTFB: 'ttfb_ms',
}

/* ── Entry point ────────────────────────────────────────────────────────── */

/** Process one validated batch for one visitor. Batches of the same visitor
    run strictly one after another. Resolves when done; never rejects. */
export function processBatch(ctx: CollectorContext, batch: CleanBatch): Promise<void> {
  pendingBatches++
  const prev = chains.get(ctx.vid) ?? Promise.resolve()
  const run: Promise<void> = prev
    .then(() => runBatch(ctx, batch))
    .catch(err => handleAnalyticsDbError('ingest', err))
    .finally(() => {
      pendingBatches--
      if (chains.get(ctx.vid) === run) chains.delete(ctx.vid)
    })
  chains.set(ctx.vid, run)
  return run.then(housekeeping)
}

async function housekeeping(): Promise<void> {
  try {
    await flushFilteredCounts()
    /* Not awaited: a cleanup run can take a while and must not hold this
       request's after() open. */
    void maybeRunMaintenance()
  } catch (err) {
    handleAnalyticsDbError('housekeeping', err)
  }
}

/** Server time of a hit: the client's clock offset removed (batch.now is
    the client's clock when it sent the batch), never in the future and at
    most an hour old. */
function hitTime(receivedMs: number, batchNow: number, ts: number): number {
  const t = receivedMs - (batchNow - ts)
  return Math.min(receivedMs, Math.max(receivedMs - MAX_HIT_AGE_MS, Math.round(t)))
}

async function runBatch(ctx: CollectorContext, batch: CleanBatch): Promise<void> {
  if (!analyticsWritable()) return
  const hits = batch.hits
    .map((hit, i) => ({ hit, i, ms: hitTime(ctx.receivedMs, batch.now, hit.ts) }))
    .sort((a, b) => a.ms - b.ms || a.i - b.i)

  /* A hit whose pageview/visitor doesn't exist yet (e.g. an error logged a
     moment before the pageview in the same batch) gets a second try after
     the batch's pageviews have been written. */
  const lastPvIndex = hits.reduce((last, h, idx) => (h.hit.t === 'pv' ? idx : last), -1)
  const retry: typeof hits = []

  for (let idx = 0; idx < hits.length; idx++) {
    if (!analyticsWritable()) return
    const { hit, ms } = hits[idx]
    const canRetry = idx < lastPvIndex
    try {
      const done = await processHit(ctx, hit, ms, canRetry)
      if (!done) retry.push(hits[idx])
    } catch (err) {
      handleAnalyticsDbError(`hit ${hit.t}`, err)
    }
  }
  for (const { hit, ms } of retry) {
    if (!analyticsWritable()) return
    try {
      await processHit(ctx, hit, ms, false)
    } catch (err) {
      handleAnalyticsDbError(`hit ${hit.t}`, err)
    }
  }
}

/** false = could not be resolved yet and `canDefer` was set. */
async function processHit(ctx: CollectorContext, hit: CleanHit, hitMs: number, canDefer: boolean): Promise<boolean> {
  switch (hit.t) {
    case 'pv': await handlePageview(ctx, hit, hitMs); return true
    case 'pe': return handleEngagement(ctx, hit, hitMs, canDefer)
    case 'ev': return handleEvent(ctx, hit, hitMs, canDefer)
    case 'wv': return handleVital(ctx, hit, canDefer)
  }
}

/* ── Lookups ────────────────────────────────────────────────────────────── */

async function findVisitor(vid: string): Promise<VisitorState | null> {
  const cached = visitors.get(vid)
  if (cached) return cached
  const row = await anQueryOne<{ id: number; sessions: number }>(
    'SELECT id, sessions FROM an_visitors WHERE vid = ? LIMIT 1', [vid],
  )
  if (!row) return null
  const v = { id: Number(row.id), sessions: Number(row.sessions) }
  visitors.set(vid, v)
  return v
}

/* INSERT IGNORE + re-read (not ON DUPLICATE KEY ... LAST_INSERT_ID): mysql2
   sets CLIENT_FOUND_ROWS, which makes an ODKU no-op report 1 affected row
   just like a real insert, so a lost race would look like a new visitor
   with 0 sessions. INSERT IGNORE reports 0 on the duplicate. */
async function ensureVisitor(vid: string, hitMs: number): Promise<VisitorState> {
  const found = await findVisitor(vid)
  if (found) return found
  const ts = toSqlUtc(hitMs)
  const res = await anExecute(
    'INSERT IGNORE INTO an_visitors (vid, first_seen_at, last_seen_at) VALUES (?, ?, ?)',
    [vid, ts, ts],
  )
  if (res.affectedRows === 1 && res.insertId) {
    const v = { id: res.insertId, sessions: 0 }
    visitors.set(vid, v)
    sessions.set(String(v.id), null)    // brand new: no visits to look up
    return v
  }
  const again = await findVisitor(vid)
  if (!again) throw new Error('visitor row missing after insert')
  return again
}

async function latestSession(visitorId: number): Promise<SessionState | null> {
  const key = String(visitorId)
  const cached = sessions.get(key)
  if (cached !== undefined) return cached
  const row = await anQueryOne<{
    id: number; started_at: string; last_seen_at: string; pageviews: number
    exit_path: string; source: string; campaign: string | null
  }>(
    `SELECT id, started_at, last_seen_at, pageviews, exit_path, source, campaign
       FROM an_sessions WHERE visitor_id = ?
      ORDER BY started_at DESC, id DESC LIMIT 1`,
    [visitorId],
  )
  const s: SessionState | null = row ? {
    id: Number(row.id),
    startedMs: sqlUtcToMs(row.started_at) ?? 0,
    lastSeenMs: sqlUtcToMs(row.last_seen_at) ?? 0,
    pageviews: Number(row.pageviews),
    exitPath: row.exit_path,
    source: row.source,
    campaign: row.campaign,
  } : null
  sessions.set(key, s)
  return s
}

function isOpen(s: SessionState, hitMs: number): boolean {
  return hitMs - s.lastSeenMs < SESSION_TIMEOUT_MS && hitMs - s.startedMs < SESSION_MAX_MS
}

/** A pageview of this visitor by pvid (null if unknown or someone else's:
    a pvid can't be used to write into another visitor's data). */
async function findPageview(pvid: string, visitorId: number): Promise<PageviewState | null> {
  let pv = pageviews.get(pvid)
  if (!pv) {
    const row = await anQueryOne<{
      id: number; session_id: number; visitor_id: number; path: string; engaged_ms: number; scroll_pct: number
    }>(
      'SELECT id, session_id, visitor_id, path, engaged_ms, scroll_pct FROM an_pageviews WHERE pvid = ? LIMIT 1',
      [pvid],
    )
    if (!row) return null
    pv = {
      id: Number(row.id),
      sessionId: Number(row.session_id),
      visitorId: Number(row.visitor_id),
      path: row.path,
      eng: Number(row.engaged_ms),
      scroll: Number(row.scroll_pct),
    }
    pageviews.set(pvid, pv)
  }
  return pv.visitorId === visitorId ? pv : null
}

/** Business user behind the iww_user_token cookie (cached; the token is
    kept in memory only as a hash). Errors -> null: a problem with the
    business tables must never pause analytics. */
async function resolveUserId(token: string | null): Promise<number | null> {
  if (!token || token.length > 512) return null
  const key = createHash('sha256').update(token).digest('base64url')
  const cached = users.get(key)
  if (cached !== undefined) return cached
  let id: number | null = null
  try {
    const row = await anQueryOne<{ id: number }>(
      `SELECT u.id FROM business_sessions s
         JOIN business_users u ON u.id = s.user_id
        WHERE s.token = ? AND s.expires_at > NOW() LIMIT 1`,
      [token],
    )
    id = row ? Number(row.id) : null
  } catch {
    return null
  }
  users.set(key, id, id ? undefined : USER_MISS_TTL_MS)
  return id
}

function parseUa(ctx: CollectorContext, touch: number): UaInfo {
  const key = `${ctx.ua}|${ctx.hints.secChUa ?? ''}|${ctx.hints.secChUaMobile ?? ''}|${ctx.hints.secChUaPlatform ?? ''}|${touch > 1 ? 1 : 0}`
  let info = uaInfo.get(key)
  if (!info) {
    info = parseUserAgent(ctx.ua, { ...ctx.hints, touch })
    uaInfo.set(key, info)
  }
  return info
}

/* ── Pageviews ──────────────────────────────────────────────────────────── */

const CAMPAIGN_PARAMS = ['utm_source', 'gclid', 'gbraid', 'wbraid', 'msclkid', 'dclid', 'ttclid', 'li_fat_id', 'twclid', 'fbclid']

function hasCampaignParams(search: string): boolean {
  if (!search) return false
  try {
    const sp = new URLSearchParams(search)
    return CAMPAIGN_PARAMS.some(k => !!sp.get(k)?.trim())
  } catch {
    return false
  }
}

async function handlePageview(ctx: CollectorContext, hit: CleanPageview, hitMs: number): Promise<void> {
  /* Same pvid again = a retried beacon: already counted. */
  if (pageviews.get(hit.pvid)) return

  const visitor = await ensureVisitor(ctx.vid, hitMs)
  let session = await latestSession(visitor.id)
  const userId = await resolveUserId(ctx.userToken)
  const page = classifyPage(hit.path, hit.status)
  const trafficFor = () => classifyTraffic({ search: hit.search, ref: hit.ref, navType: hit.nav, ownHosts: ctx.host ? [ctx.host] : [] })

  let traffic: TrafficInfo | null = null
  let startNew = !session || !isOpen(session, hitMs)
  /* A fresh arrival from a new campaign is a new visit (as in GA). Only
     for real arrivals: a reload, Back or in-app navigation onto a tagged
     URL continues the visit it belongs to. */
  if (!startNew && session && hasCampaignParams(hit.search) && (!hit.nav || hit.nav === 'navigate' || hit.nav === 'prerender')) {
    traffic = trafficFor()
    if (traffic.source !== session.source || (traffic.campaign ?? null) !== (session.campaign ?? null)) startNew = true
  }

  /* Set when this pageview opens a visit: its attribution, and whether it
     is the visitor's very first visit (first-touch fields). */
  let opened: { traffic: TrafficInfo; isFirst: boolean } | null = null
  if (startNew || !session) {
    /* A retried beacon arriving after its visit timed out must not open
       an empty visit. The check costs a query, so it runs only here, and
       only when the visitor has had visits (else it has no pageviews). */
    if (session) {
      const dup = await anQueryOne('SELECT 1 AS x FROM an_pageviews WHERE pvid = ? LIMIT 1', [hit.pvid])
      if (dup) return
    }
    const t = traffic ?? trafficFor()
    const isFirst = visitor.sessions === 0
    session = await createSession(ctx, hit, hitMs, visitor.id, t, page.pageType, userId, isFirst)
    visitor.sessions++
    opened = { traffic: t, isFirst }
  }
  const isNewSession = opened !== null

  const seq = Math.min(session.pageviews + (isNewSession ? 0 : 1), 65535)
  const prevPath = seq > 1 ? session.exitPath : null
  const res = await anExecute(
    `INSERT IGNORE INTO an_pageviews
       (pvid, session_id, visitor_id, seq, ts, path, query, title, page_type, entity, prev_path, status, nav_type)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      hit.pvid, session.id, visitor.id, seq, toSqlUtc(hitMs), hit.path, cleanQuery(hit.search),
      hit.title, page.pageType, page.entity, prevPath, hit.status, hit.nav,
    ],
  )
  if (res.affectedRows !== 1) return     // duplicate pvid (retried beacon)
  const pv: PageviewState = { id: res.insertId, sessionId: session.id, visitorId: visitor.id, path: hit.path, eng: 0, scroll: 0 }
  pageviews.set(hit.pvid, pv)

  const hitSql = toSqlUtc(hitMs)
  if (!isNewSession) {
    if (seq > 1) {
      await anExecute('UPDATE an_pageviews SET is_exit = 0 WHERE session_id = ? AND seq = ?', [session.id, seq - 1])
    }
    await anExecute(
      `UPDATE an_sessions SET
         pageviews = LEAST(pageviews + 1, 65535),
         last_seen_at = GREATEST(last_seen_at, ?),
         ${DURATION_SQL},
         exit_path = ?,
         exit_type = ?,
         ${ENGAGED_SQL},
         user_id = COALESCE(user_id, ?)
       WHERE id = ?`,
      [hitSql, hit.path, page.pageType, userId, session.id],
    )
    session.pageviews = seq
    session.lastSeenMs = Math.max(session.lastSeenMs, hitMs)
    session.exitPath = hit.path
  }

  /* Visitor totals; on the first visit also how this visitor first found
     us. The first_* columns are assigned before first_session_id, so their
     IS NULL guard still sees the old value (SET runs left to right) and a
     racing duplicate can never overwrite the real first touch. */
  const ua = parseUa(ctx, hit.touch)
  const ft = opened?.isFirst ? opened.traffic : null
  await anExecute(
    `UPDATE an_visitors SET
       last_seen_at = GREATEST(last_seen_at, ?),
       pageviews = pageviews + 1,
       sessions = sessions + ?,
       country = COALESCE(?, country),
       device_type = ?,
       user_id = COALESCE(user_id, ?)${ft ? `,
       first_channel  = IF(first_session_id IS NULL, ?, first_channel),
       first_source   = IF(first_session_id IS NULL, ?, first_source),
       first_medium   = IF(first_session_id IS NULL, ?, first_medium),
       first_campaign = IF(first_session_id IS NULL, ?, first_campaign),
       first_referrer = IF(first_session_id IS NULL, ?, first_referrer),
       first_landing  = IF(first_session_id IS NULL, ?, first_landing),
       first_session_id = COALESCE(first_session_id, ?)` : ''}
     WHERE id = ?`,
    [
      hitSql, isNewSession ? 1 : 0, ctx.geo.country, ua.deviceType, userId,
      ...(ft ? [ft.channel, ft.source, ft.medium, ft.campaign, ft.referrer, hit.path, session.id] : []),
      visitor.id,
    ],
  )

  /* Events implied by the pageview itself. */
  if (hit.path === '/search') {
    const q = new URLSearchParams(hit.search || '').get('q')?.trim().toLowerCase().slice(0, 200)
    if (q) {
      await insertEvent({
        name: 'search', meta: EVENTS.search, tsMs: hitMs, sessionId: session.id, visitorId: visitor.id,
        userId, pageviewId: pv.id, path: hit.path, target: q, label: null, value: hit.results,
        props: hit.results === null ? null : JSON.stringify({ results: hit.results }),
      })
    }
  }
  if (hit.status === 404) {
    await insertEvent({
      name: 'not_found', meta: EVENTS.not_found, tsMs: hitMs, sessionId: session.id, visitorId: visitor.id,
      userId, pageviewId: pv.id, path: hit.path, target: hit.path,
      label: parseReferrer(hit.ref)?.url.slice(0, 300) ?? null, value: null, props: null,
    })
  }
}

/** Insert the visit row a pageview opens (pageviews = 1, entry = exit =
    this page). Visitor counters are updated by the caller. */
async function createSession(
  ctx: CollectorContext, hit: CleanPageview, hitMs: number, visitorId: number,
  t: TrafficInfo, pageType: PageType, userId: number | null, isFirst: boolean,
): Promise<SessionState> {
  const ua = parseUa(ctx, hit.touch)
  const ts = toSqlUtc(hitMs)
  const res = await anExecute(
    `INSERT INTO an_sessions
       (visitor_id, user_id, started_at, last_seen_at, pageviews, is_new,
        entry_path, entry_type, exit_path, exit_type,
        referrer, referrer_host, channel, source, medium, campaign, term, content, click_id,
        country, region, city, timezone, language,
        device_type, os, os_version, browser, browser_version, screen_w, screen_h)
     VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      visitorId, userId, ts, ts, isFirst ? 1 : 0,
      hit.path, pageType, hit.path, pageType,
      t.referrer, t.referrerHost, t.channel, t.source, t.medium, t.campaign, t.term, t.content, t.clickId,
      ctx.geo.country, ctx.geo.region, ctx.geo.city, hit.tz ?? ctx.geo.timezone, hit.lang,
      ua.deviceType, ua.os, ua.osVersion, ua.browser, ua.browserVersion, hit.sw, hit.sh,
    ],
  )
  const session: SessionState = {
    id: res.insertId,
    startedMs: hitMs,
    lastSeenMs: hitMs,
    pageviews: 1,
    exitPath: hit.path,
    source: t.source,
    campaign: t.campaign,
  }
  sessions.set(String(visitorId), session)
  return session
}

/* ── Engagement (heartbeats; totals, not deltas) ────────────────────────── */

async function handleEngagement(ctx: CollectorContext, hit: CleanEngagement, hitMs: number, canDefer: boolean): Promise<boolean> {
  const visitor = await findVisitor(ctx.vid)
  const pv = visitor ? await findPageview(hit.pvid, visitor.id) : null
  if (!visitor || !pv) return !canDefer
  /* Nothing new (a duplicate or out-of-order heartbeat): skip the writes. */
  if (hit.eng <= pv.eng && hit.scroll <= pv.scroll) return true

  const hitSql = toSqlUtc(hitMs)
  await anExecute(
    'UPDATE an_pageviews SET engaged_ms = GREATEST(engaged_ms, ?), scroll_pct = GREATEST(scroll_pct, ?) WHERE id = ?',
    [hit.eng, hit.scroll, pv.id],
  )
  await anExecute(
    `UPDATE an_sessions SET
       engaged_ms = LEAST((SELECT COALESCE(SUM(p.engaged_ms), 0) FROM an_pageviews p WHERE p.session_id = ?), 4294967295),
       ${EXTEND_LAST_SEEN_SQL},
       ${DURATION_SQL},
       ${ENGAGED_SQL}
     WHERE id = ?`,
    [pv.sessionId, hitSql, hitSql, hitSql, pv.sessionId],
  )
  noteActivity(visitor.id, pv.sessionId, hitMs)

  /* Visitor total is best effort (reports compute exact numbers from
     sessions): add only what this heartbeat added. */
  const delta = Math.max(0, hit.eng - pv.eng)
  pv.eng = Math.max(pv.eng, hit.eng)
  pv.scroll = Math.max(pv.scroll, hit.scroll)
  if (delta > 0) {
    await anExecute(
      'UPDATE an_visitors SET engaged_ms = engaged_ms + ?, last_seen_at = GREATEST(last_seen_at, ?) WHERE id = ?',
      [delta, hitSql, visitor.id],
    )
  }
  return true
}

/** Mirror EXTEND_LAST_SEEN_SQL in the cached session. */
function noteActivity(visitorId: number, sessionId: number, hitMs: number): void {
  const s = sessions.get(String(visitorId))
  if (s && s.id === sessionId && hitMs > s.lastSeenMs && isOpen(s, hitMs)) s.lastSeenMs = hitMs
}

/* ── Client events ──────────────────────────────────────────────────────── */

async function handleEvent(ctx: CollectorContext, hit: CleanEvent, hitMs: number, canDefer: boolean): Promise<boolean> {
  const visitor = await findVisitor(ctx.vid)
  if (!visitor) return !canDefer     // no pageview ever recorded for this browser: nothing to attach to

  let sessionId: number | null = null
  let pageviewId: number | null = null
  let path: string | null = null
  if (hit.pvid) {
    const pv = await findPageview(hit.pvid, visitor.id)
    if (pv) { sessionId = pv.sessionId; pageviewId = pv.id; path = pv.path }
    else if (canDefer) return false
  }
  if (sessionId === null) {
    const s = await latestSession(visitor.id)
    if (s && isOpen(s, hitMs)) { sessionId = s.id; path = s.exitPath }
  }

  const scope = sessionId !== null ? `s${sessionId}` : `v${visitor.id}`
  if (hit.name === 'website_click' || hit.name === 'outbound_click') {
    const key = `${scope}|${hit.name}|${hit.target ?? ''}`
    const last = recentClicks.get(key)
    recentClicks.set(key, hitMs)
    if (last !== undefined && Math.abs(hitMs - last) < CLICK_DEDUPE_MS) return true
  } else if (hit.name === 'js_error') {
    const key = `${scope}|${hit.label ?? ''}`
    const n = jsErrorCounts.get(key) ?? 0
    if (n >= JS_ERRORS_PER_MESSAGE) return true
    jsErrorCounts.set(key, n + 1)
  }

  const userId = await resolveUserId(ctx.userToken)
  await insertEvent({
    name: hit.name, meta: hit.meta, tsMs: hitMs, sessionId, visitorId: visitor.id, userId,
    pageviewId, path, target: hit.target, label: hit.label, value: hit.value, props: hit.props,
  })
  if (sessionId !== null) noteActivity(visitor.id, sessionId, hitMs)
  return true
}

interface EventRow {
  name: string
  meta: Pick<EventMeta, 'category' | 'isKey' | 'sessionFlag'>
  tsMs: number
  sessionId: number | null
  visitorId: number
  userId: number | null
  pageviewId: number | null
  path: string | null
  target: string | null
  label: string | null
  value: number | null
  props: string | null
}

/** Insert a client-origin event and bump its session + visitor counters. */
async function insertEvent(e: EventRow): Promise<void> {
  const ts = toSqlUtc(e.tsMs)
  await anExecute(
    `INSERT INTO an_events
       (ts, name, category, is_key, origin, session_id, visitor_id, user_id, pageview_id, path, target, label, value, props)
     VALUES (?, ?, ?, ?, 'client', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ts, e.name, e.meta.category, e.meta.isKey ? 1 : 0, e.sessionId, e.visitorId, e.userId,
      e.pageviewId, e.path, e.target, e.label, e.value, e.props,
    ],
  )
  if (e.sessionId !== null) {
    const flag = flagSql(e.meta.sessionFlag)
    await anExecute(
      `UPDATE an_sessions SET
         events = LEAST(events + 1, 65535),
         key_events = LEAST(key_events + ?, 65535),
         ${EXTEND_LAST_SEEN_SQL},
         ${DURATION_SQL},
         ${ENGAGED_SQL},
         user_id = COALESCE(user_id, ?)${flag}
       WHERE id = ?`,
      [e.meta.isKey ? 1 : 0, ts, ts, ts, e.userId, e.sessionId],
    )
  }
  await anExecute('UPDATE an_visitors SET events = events + 1 WHERE id = ?', [e.visitorId])
}

/* ── Web vitals ─────────────────────────────────────────────────────────── */

async function handleVital(ctx: CollectorContext, hit: CleanVital, canDefer: boolean): Promise<boolean> {
  const visitor = await findVisitor(ctx.vid)
  if (!visitor) return !canDefer
  const column = VITAL_COLUMNS[hit.name]
  /* visitor_id in the WHERE: a pvid alone can't write into someone else's row. */
  const res = await anExecute(
    `UPDATE an_pageviews SET ${column} = ? WHERE pvid = ? AND visitor_id = ?`,
    [hit.value, hit.pvid, visitor.id],
  )
  return res.affectedRows > 0 || !canDefer
}
