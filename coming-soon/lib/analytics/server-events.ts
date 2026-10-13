import { after } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAME } from '@/lib/auth'
import { anExecute, anQueryOne, toSqlUtc } from './db'
import {
  AN_IGNORE_COOKIE, AN_VID_COOKIE, EVENTS,
  type EventMeta, type ServerEventName, type ServerEventOptions,
} from './types'
import { analyticsWritable, handleAnalyticsDbError } from './collector-state'
import { DURATION_SQL, ENGAGED_SQL, EXTEND_LAST_SEEN_SQL, flagSql } from './collector-sql'
import { isUuid } from './collector-validate'

/* ═══════════════════════════════════════════════════════════════════════════
   Conversions recorded by the server (signups, logins, listings, leads,
   purchases...). The browser can never send these event names, so they
   can't be faked from the console.

   Usage, right where a route handler produces its success response:

     trackServerEvent('signup_completed', { userId, props: { method: 'email' } })

   Synchronous and fire-and-forget: it returns immediately, never throws,
   and does all its work in after(), once the response has been sent. It
   links the event to the visitor through the iww_vid cookie (read inside
   after(), which route handlers and server functions allow) and to the
   visitor's current visit when that visit was active in the last 24 h.
   Without the cookie the event is still stored, with the user id only.

   Skipped (silently) outside production, while the an_* tables are
   missing, and for browsers excluded from analytics (admin console session
   or the "Exclude this browser" cookie) - the same rules as the collector,
   so test signups by the team don't count as conversions.
   ═══════════════════════════════════════════════════════════════════════════ */

const SESSION_LINK_WINDOW_MS = 24 * 60 * 60 * 1000
const MAX_PROPS_JSON = 2048

export function trackServerEvent(name: ServerEventName, opts: ServerEventOptions = {}): void {
  try {
    if (!analyticsWritable()) return
    const meta = EVENTS[name] as EventMeta | undefined
    if (!meta) return
    const tsMs = Date.now()
    after(async () => {
      try {
        let vid: string | null = null
        try {
          const jar = await cookies()
          if (jar.get(AN_IGNORE_COOKIE)?.value || jar.get(ADMIN_COOKIE_NAME)?.value) return
          const raw = jar.get(AN_VID_COOKIE)?.value
          vid = isUuid(raw) ? raw.toLowerCase() : null
        } catch {
          /* No request cookies here: record the event without a visitor. */
        }
        await recordServerEvent(name, meta, opts, vid, tsMs)
      } catch (err) {
        handleAnalyticsDbError(`server event ${name}`, err)
      }
    })
  } catch {
    /* after() throws outside a request scope (scripts, build): skip. */
  }
}

function cleanText(v: string | null | undefined, max: number): string | null {
  if (v == null) return null
  const s = String(v).replace(/[\u0000-\u001f\u007f]/g, ' ').trim()
  return s ? s.slice(0, max) : null
}

function cleanValue(v: number | null | undefined): number | null {
  if (typeof v !== 'number' || !Number.isFinite(v)) return null
  return Math.round(Math.min(9_999_999_999.99, Math.max(-9_999_999_999.99, v)) * 100) / 100
}

/* Unpaired UTF-16 surrogates (e.g. a request field cut with slice() through
   an emoji) would be written as "\ud83d", which MySQL's JSON type rejects -
   the whole event insert would fail. */
const LONE_SURROGATE_RE = /[\ud800-\udbff](?![\udc00-\udfff])|(?<![\ud800-\udbff])[\udc00-\udfff]/g

function cleanProps(props: ServerEventOptions['props']): string | null {
  if (!props) return null
  try {
    const json = JSON.stringify(props, (_k, v: unknown) => (typeof v === 'string' ? v.replace(LONE_SURROGATE_RE, '�') : v))
    return json && json !== '{}' && json.length <= MAX_PROPS_JSON ? json : null
  } catch {
    return null
  }
}

async function recordServerEvent(
  name: ServerEventName, meta: EventMeta, opts: ServerEventOptions, vid: string | null, tsMs: number,
): Promise<void> {
  const userId = typeof opts.userId === 'number' && Number.isInteger(opts.userId) && opts.userId > 0 ? opts.userId : null
  const ts = toSqlUtc(tsMs)

  let visitorId: number | null = null
  let sessionId: number | null = null
  let path: string | null = null
  if (vid) {
    const v = await anQueryOne<{ id: number }>('SELECT id FROM an_visitors WHERE vid = ? LIMIT 1', [vid])
    if (v) {
      visitorId = Number(v.id)
      /* The visit this happened in: the latest one, if it was active in the
         last 24 h (an OAuth round trip or a long form can outlast the
         30-minute visit timeout). */
      const s = await anQueryOne<{ id: number; exit_path: string }>(
        `SELECT id, exit_path FROM an_sessions
          WHERE visitor_id = ? AND last_seen_at >= ?
          ORDER BY started_at DESC, id DESC LIMIT 1`,
        [visitorId, toSqlUtc(tsMs - SESSION_LINK_WINDOW_MS)],
      )
      if (s) { sessionId = Number(s.id); path = s.exit_path }
    }
  }

  await anExecute(
    `INSERT INTO an_events
       (ts, name, category, is_key, origin, session_id, visitor_id, user_id, path, target, label, value, props)
     VALUES (?, ?, ?, ?, 'server', ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ts, name, meta.category, meta.isKey ? 1 : 0, sessionId, visitorId, userId, path,
      cleanText(opts.target, 1000), cleanText(opts.label, 300), cleanValue(opts.value), cleanProps(opts.props),
    ],
  )

  if (sessionId !== null) {
    await anExecute(
      `UPDATE an_sessions SET
         events = LEAST(events + 1, 65535),
         key_events = LEAST(key_events + ?, 65535),
         ${EXTEND_LAST_SEEN_SQL},
         ${DURATION_SQL},
         ${ENGAGED_SQL},
         user_id = COALESCE(user_id, ?)${flagSql(meta.sessionFlag)}
       WHERE id = ?`,
      [meta.isKey ? 1 : 0, ts, ts, ts, userId, sessionId],
    )
  }
  if (visitorId !== null) {
    const signup = name === 'signup_completed'
    await anExecute(
      `UPDATE an_visitors SET
         events = events + 1,
         user_id = COALESCE(user_id, ?)${signup ? ', signed_up_at = COALESCE(signed_up_at, ?)' : ''}
       WHERE id = ?`,
      signup ? [userId, ts, visitorId] : [userId, visitorId],
    )
  }
}
