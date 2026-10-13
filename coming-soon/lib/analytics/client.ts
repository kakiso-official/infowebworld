/* ═══════════════════════════════════════════════════════════════════════════
   InfoWebWorld Analytics - browser tracker (one per tab, a module singleton).

   Driven by app/components/analytics/AnalyticsTracker.tsx, which calls
   routeChanged() on the first render and on every App Router navigation,
   and feeds Core Web Vitals into reportVital(). Everything else (engaged
   time, scroll depth, clicks, JS errors, the transport) lives here.

   Wire protocol: PulseBatch in ./types, POST AN_ENDPOINT (/api/pulse).

   Rules this file keeps:
   - Never throws into the page: every entry point is wrapped in try/catch.
   - Never touches window/document at import time (it is evaluated during
     SSR of the client component).
   - Records nothing for automated browsers, for browsers excluded from
     Analytics settings, or on UNTRACKED_PATH_PREFIXES (the admin console).
   - Every hit carries a client timestamp; the collector re-bases it onto
     the server clock with batch.now, so queued hits keep their real order.

   Two ordering problems and how they are avoided:
   - A brand-new visitor has no iww_vid cookie until the first pageview's
     response sets it, and hits sent before that response would each get a
     random id on the server. So the tracker mints the id itself (a UUID in
     localStorage, sent as batch.vid): the collector uses it when there is
     no cookie, and the cookie it sets carries the same id.
   - Events reference their pageview by pvid. A pageview is sent 300 ms
     after the navigation (the title may still be streaming in), so hits
     that belong to it are held until it is queued, then sent together
     (see ready()).
   ═══════════════════════════════════════════════════════════════════════════ */

import {
  AN_ENDPOINT, AN_LS_IGNORE, AN_LS_VID, CUSTOM_EVENT_NAME_RE, KEPT_QUERY_KEYS, UNTRACKED_PATH_PREFIXES,
} from './types'
import type {
  ClientEventName, EngagementHit, EventHit, PageviewHit, PulseBatch, PulseHit, ServerEventName, VitalHit,
} from './types'

type Nav = PageviewHit['nav']

export interface TrackData {
  target?: string
  label?: string
  value?: number
  props?: EventHit['props']
}

declare global {
  interface Window { iwwTrack?: typeof track }
}

/* Conversions only route handlers may record - the collector rejects them
   from a browser. Typed as exactly the contract's server-only names, so a
   new one in EVENTS fails the type check here until it is listed. (Not
   importing EVENTS keeps its descriptions out of every page's bundle.)
   Every other name - the known client events included - just has to match
   CUSTOM_EVENT_NAME_RE. */
const SERVER_ONLY: Record<ServerEventName, 1> = {
  signup_completed: 1, login: 1, listing_submitted: 1, claim_submitted: 1,
  review_submitted: 1, lead_sent: 1, contact_submitted: 1, purchase: 1,
}

const DEBOUNCE_MS = 300            // wait after a navigation before reading the title
const TITLE_WAIT_MS = 700          // one extra wait when the title has not changed yet
const BATCH_MS = 1000              // non-pageview hits are batched for up to 1 s
const HEARTBEAT_MS = 60_000
const MAX_BEATS = 30               // heartbeats per pageview (30 min of activity)
const IDLE_MS = 5 * 60_000         // no input for 5 min = not engaged any more
const MAX_HITS = 50                // collector limit per batch
const MAX_BODY = 12_000            // stay well under the collector's 16 KB body limit
const MAX_ERRORS = 3               // js_error events per pageview
const VITALS = ['LCP', 'INP', 'CLS', 'FCP', 'TTFB']
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const FILE_RE = /\.(pdf|docx?|xlsx?|pptx?|odt|ods|odp|rtf|csv|txt|json|xml|zip|rar|7z|gz|tar|dmg|exe|msi|apk|epub|mp3|mp4|mov)$/i

interface Page {
  pvid: string
  ts: number          // when the navigation happened (the pageview hit's time)
  nav: Nav
  ref: string
  sent: boolean       // pageview hit queued (false while debouncing / prerendering)
  waited: boolean     // already gave a stale-looking title extra time
  eng: number         // engaged ms so far
  scroll: number      // max scroll depth %
  sentEng: number     // values in the last engagement hit
  sentScroll: number
  finalSent: boolean  // a final engagement hit already went out
  beats: number
  errors: string[]    // js_error messages already reported on this pageview
}

let started = false
let booted = false              // the document's first pageview has been sent or dropped
let routeKey: string | null = null
let page: Page | null = null
let pvTimer: ReturnType<typeof setTimeout> | undefined
let lastUrl = ''                // previous page's full URL = the next in-app pageview's ref
let lastTitle = ''              // previous page's title (stale-title check)
let vitalsPage: Page | null = null
let queue: PulseHit[] = []
let flushTimer: ReturnType<typeof setTimeout> | undefined
let beaconSoon = false
let vid = ''                    // visitor id hint (see the header)
let lastActivity = 0
let engagedSince: number | null = null
let scrollRaf = 0
let lastPopAt = 0
let lastPopHref = ''            // location right after the last popstate (Back/Forward)
let lastWebsiteClickAt = 0

/* ── Small helpers ──────────────────────────────────────────────────────── */

const now = () => Date.now()
const cap = (s: string, n: number) => (s.length > n ? s.slice(0, n) : s)
const bareHost = (h: string) => h.toLowerCase().replace(/^www\./, '')

function uuid(): string {
  try { if (typeof crypto.randomUUID === 'function') return crypto.randomUUID() } catch { /* insecure context */ }
  const b = new Uint8Array(16)
  try { crypto.getRandomValues(b) } catch { for (let i = 0; i < 16; i++) b[i] = Math.floor(Math.random() * 256) }
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  const h = Array.from(b, x => x.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

/* localStorage can throw (blocked storage, some private modes). */
function store(key: string, value?: string): string | null {
  try {
    if (value === undefined) return localStorage.getItem(key)
    localStorage.setItem(key, value)
  } catch { /* storage unavailable */ }
  return null
}

const isPrerendering = () => (document as Document & { prerendering?: boolean }).prerendering === true

/* Checked per hit (not once), so "Exclude this browser" works without a reload. */
function allowed(): boolean {
  return typeof window !== 'undefined' && !navigator.webdriver && store(AN_LS_IGNORE) !== '1'
}
function enabled(): boolean {
  if (!allowed()) return false
  const path = location.pathname
  return !UNTRACKED_PATH_PREFIXES.some(p => path.startsWith(p))
}

function allowedName(name: string): boolean {
  return CUSTOM_EVENT_NAME_RE.test(name) && !Object.prototype.hasOwnProperty.call(SERVER_ONLY, name)
}

/* A pageview is identified by its path plus the query keys the collector
   keeps. UI-state params (?find=, ?company=, stripped ?plan=, utm tags) are
   dropped server-side anyway, so changing only those is not a new page. */
function routeKeyOf(path: string, search: string): string {
  const src = new URLSearchParams(search)
  const kept = new URLSearchParams()
  for (const k of KEPT_QUERY_KEYS) for (const v of src.getAll(k)) kept.append(k, v)
  const qs = kept.toString()
  return qs ? `${path}?${qs}` : path
}

function hardNavType(): Nav {
  const e = performance.getEntriesByType?.('navigation')[0] as
    (PerformanceNavigationTiming & { activationStart?: number }) | undefined
  if (isPrerendering() || (e?.activationStart ?? 0) > 0) return 'prerender'
  const t = e?.type
  return t === 'reload' || t === 'back_forward' || t === 'prerender' ? t : 'navigate'
}

function timeZone(): string {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || '' } catch { return '' }
}

/* ── Transport ──────────────────────────────────────────────────────────── */

/* Hits may go out only once the document's first pageview has been sent
   (or dropped) and no pageview is waiting for its debounce: every hit that
   references a pageview then reaches the collector with or after it. */
function ready(): boolean {
  return booted && !(page && !page.sent)
}

function enqueue(hit: PulseHit): void {
  queue.push(hit)
  if (document.visibilityState === 'hidden' && ready()) {
    /* The tab may never come back: send now. Coalesced in a microtask, so the
       several vitals web-vitals reports from one hide go out in one beacon. */
    if (!beaconSoon) {
      beaconSoon = true
      Promise.resolve().then(() => { beaconSoon = false; flush(true) })
    }
  } else if (flushTimer === undefined) {
    flushTimer = setTimeout(() => { flushTimer = undefined; flush(false) }, BATCH_MS)
  }
}

/* beacon = the page is being hidden or unloaded: send everything now, even
   past the ready() gate (a hit that might arrive early beats no hit). */
function flush(beacon: boolean): void {
  try {
    // A prerender that is never shown sends nothing.
    if (!queue.length || isPrerendering()) return
    if (!beacon && !ready()) return   // sendPageview() flushes again
    const hits = queue.sort((a, b) => a.ts - b.ts)
    queue = []
    while (hits.length) {
      const chunk: PulseHit[] = []
      let size = 0
      while (hits.length && chunk.length < MAX_HITS) {
        const len = JSON.stringify(hits[0]).length + 1
        if (chunk.length && size + len > MAX_BODY) break
        chunk.push(hits.shift() as PulseHit)
        size += len
      }
      const body = JSON.stringify({ v: 1, vid, now: now(), hits: chunk } satisfies PulseBatch)
      // Pageviews always go by fetch (keepalive survives unload too) so the
      // response's vid can be read; the rest prefer sendBeacon on the way out.
      if (beacon && !chunk.some(h => h.t === 'pv') && beaconSend(body)) continue
      post(body)
    }
  } catch { /* never break the page */ }
}

function beaconSend(body: string): boolean {
  try {
    return typeof navigator.sendBeacon === 'function'
      && navigator.sendBeacon(AN_ENDPOINT, new Blob([body], { type: 'text/plain' }))
  } catch { return false }
}

/* text/plain body = a "simple" request (no preflight); same-origin cookies
   carry iww_vid and the session token the collector links to accounts.
   A pageview answers with the id the server settled on (the cookie's, when
   the browser already had one) - adopt it. */
function post(body: string): void {
  try {
    fetch(AN_ENDPOINT, { method: 'POST', body, keepalive: true, credentials: 'same-origin' })
      .then(r => (r.status === 200 ? r.json() : null))
      .then((d: { vid?: unknown } | null) => {
        if (d && typeof d.vid === 'string' && UUID_RE.test(d.vid) && d.vid !== vid) {
          vid = d.vid
          store(AN_LS_VID, vid)
        }
      })
      .catch(() => { /* offline or blocked - drop */ })
  } catch { /* fetch unavailable */ }
}

/* ── Engaged time + scroll depth ────────────────────────────────────────── */

/* Engaged = tab visible AND window focused AND some input in the last 5 min.
   settle() books the engaged stretch since the last call into the current
   page (capped at lastActivity + IDLE_MS, so idle time never counts) and
   decides whether a new stretch starts now. */
function isActive(t: number): boolean {
  return document.visibilityState === 'visible' && document.hasFocus() && t - lastActivity < IDLE_MS
}
function settle(t: number): void {
  if (engagedSince !== null && page) {
    const end = Math.min(t, lastActivity + IDLE_MS)
    if (end > engagedSince) page.eng += end - engagedSince
  }
  engagedSince = isActive(t) ? t : null
}
function attention(): void {
  const t = now()
  settle(t)          // book the stretch with the OLD last-activity time
  lastActivity = t
  settle(t)          // then restart it if the page is now in use
}
function onActivity(): void {
  try {
    // 1 s throttle: idle (5 min), blur and hide are handled by their own events.
    if (now() - lastActivity >= 1000) attention()
  } catch { /* never break the page */ }
}
function onScroll(): void {
  onActivity()
  if (!scrollRaf) scrollRaf = requestAnimationFrame(() => { scrollRaf = 0; measureScroll() })
}
function measureScroll(): void {
  try {
    if (!page?.sent) return    // while debouncing, the old page may still be on screen
    const h = Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight || 0)
    if (h <= 0) return
    const pct = Math.min(100, Math.round(((window.scrollY + window.innerHeight) / h) * 100))
    if (pct > page.scroll) page.scroll = pct
  } catch { /* never break the page */ }
}

/* Totals, not deltas: the collector keeps the max, so a repeated or late
   engagement hit can never double count. */
function sendEngagement(final: boolean): void {
  const p = page
  if (!p?.sent) return
  measureScroll()
  const eng = Math.round(p.eng)
  if (eng === p.sentEng && p.scroll === p.sentScroll) return
  /* visibilitychange(hidden) and pagehide both close the page: skip a second
     final hit that only adds a few ms. */
  if (final && p.finalSent && eng - p.sentEng < 1000 && p.scroll === p.sentScroll) return
  if (final) p.finalSent = true
  p.sentEng = eng
  p.sentScroll = p.scroll
  const hit: EngagementHit = { t: 'pe', ts: now(), pvid: p.pvid, eng, scroll: p.scroll }
  if (final) hit.final = true
  enqueue(hit)
}

function heartbeat(): void {
  try {
    const p = page
    if (!p?.sent || p.beats >= MAX_BEATS || document.visibilityState !== 'visible') return
    settle(now())
    if (Math.round(p.eng) > p.sentEng) {
      p.beats++
      sendEngagement(false)
    }
  } catch { /* never break the page */ }
}

/* ── Pageviews ──────────────────────────────────────────────────────────── */

/* Called by AnalyticsTracker on mount and whenever pathname/search change. */
export function routeChanged(path: string, search: string): void {
  try {
    if (typeof window === 'undefined') return
    start()
    const key = routeKeyOf(path, search)
    if (key === routeKey) return   // StrictMode re-run, or only UI-state params changed
    const first = routeKey === null
    routeKey = key
    if (first) beginPage(hardNavType(), document.referrer)
    else {
      /* Back/Forward: popstate already moved location to the page now being
         shown. Compare URLs instead of a short time window - in-app
         navigations can take seconds to render on slow connections. */
      const back = lastPopHref === window.location.href && now() - lastPopAt < 60_000
      lastPopHref = ''
      beginPage(back ? 'traverse' : 'push', lastUrl)
    }
  } catch { /* never break the page */ }
}

function beginPage(nav: Nav, ref: string): void {
  /* Navigated again before the pending pageview went out (a redirect, or a
     double click): keep that pageview - its time, nav type and referrer
     describe how the visitor really arrived - and read the URL later. */
  if (page && !page.sent) {
    clearTimeout(pvTimer)
    pvTimer = setTimeout(sendPageview, DEBOUNCE_MS)
    return
  }
  closePage()
  const t = now()
  const p: Page = {
    pvid: uuid(), ts: t, nav, ref, sent: false, waited: false,
    eng: 0, scroll: 0, sentEng: 0, sentScroll: 0, finalSent: false, beats: 0, errors: [],
  }
  page = p
  // The hard-loaded document (or a bfcache restore) owns the Web Vitals.
  if (!vitalsPage) vitalsPage = p
  lastActivity = t
  engagedSince = null
  settle(t)
  pvTimer = setTimeout(sendPageview, DEBOUNCE_MS)
}

function closePage(): void {
  if (!page?.sent) return
  settle(now())
  sendEngagement(true)
  page = null
}

function sendPageview(): void {
  try {
    pvTimer = undefined
    const p = page
    if (!p || p.sent) return
    if (isPrerendering()) {
      // A speculative prerender is not a view; count it when it is shown.
      document.addEventListener('prerenderingchange', () => {
        p.ts = now()
        lastActivity = p.ts
        sendPageview()
      }, { once: true })
      return
    }
    /* In-app navigation still showing the previous title: metadata may be
       streaming in after the new page committed. Give it one more moment
       (the 404 marker and search result count come from the same render). */
    const title = document.title || ''
    if (!p.waited && (p.nav === 'push' || p.nav === 'traverse') && title === lastTitle && document.visibilityState === 'visible') {
      p.waited = true
      pvTimer = setTimeout(sendPageview, TITLE_WAIT_MS)
      return
    }
    booted = true
    const href = location.href
    const ref = p.ref
    lastUrl = href
    lastTitle = title
    if (!enabled()) {
      page = null
      queue = queue.filter(h => h.pvid !== p.pvid)
      flush(false)
      return
    }
    p.sent = true
    measureScroll()
    const scr = window.screen
    const hit: PageviewHit = {
      t: 'pv',
      ts: p.ts,
      pvid: p.pvid,
      path: cap(location.pathname, 500),
      search: cap(location.search, 1000),
      title: cap(title, 300),
      ref: cap(ref, 1000),
      nav: p.nav,
      status: document.querySelector('[data-iww-status="404"]') ? 404 : 200,
      sw: scr?.width || 0,
      sh: scr?.height || 0,
      vw: window.innerWidth || 0,
      vh: window.innerHeight || 0,
      touch: navigator.maxTouchPoints || 0,
      lang: cap(navigator.language || '', 16),
      tz: cap(timeZone(), 64),
    }
    const results = document.querySelector('[data-iww-results]')?.getAttribute('data-iww-results')
    if (results && Number.isFinite(Number(results))) hit.results = Math.max(0, Math.round(Number(results)))
    queue.push(hit)
    flush(false)
  } catch { /* never break the page */ }
}

/* ── Page lifecycle ─────────────────────────────────────────────────────── */

function onHide(): void {
  try {
    // Leaving during the debounce: the pageview must still count.
    if (page && !page.sent && pvTimer !== undefined) {
      clearTimeout(pvTimer)
      sendPageview()
    }
    settle(now())
    sendEngagement(true)
    flush(true)
  } catch { /* never break the page */ }
}

function onVisibility(): void {
  if (document.visibilityState === 'hidden') onHide()
  else onFocus()
}

function onFocus(): void {
  try { attention() } catch { /* never break the page */ }
}

function onBlur(): void {
  try { settle(now()) } catch { /* never break the page */ }
}

/* Back/forward cache restore: the page was frozen (its final engagement went
   out on pagehide) and is shown again without any React re-render. */
function onPageShow(e: PageTransitionEvent): void {
  try {
    if (!e.persisted || !page?.sent) return
    page = null
    vitalsPage = null   // web-vitals reports fresh metrics for the restored page
    beginPage('back_forward', '')
  } catch { /* never break the page */ }
}

/* ── Auto events ────────────────────────────────────────────────────────── */

function labelOf(el: Element): string {
  const text = (el.textContent || '').replace(/\s+/g, ' ').trim()
  return cap(
    text || el.getAttribute('aria-label') || el.getAttribute('title')
      || el.querySelector('img')?.getAttribute('alt') || '',
    100,
  )
}

function decode(s: string): string {
  try { return decodeURIComponent(s) } catch { return s }
}

/* Document-level bubble listener: React's own handlers (e.g. the website
   click tracker on "Visit website" buttons) have already run. */
function onClick(e: MouseEvent): void {
  try {
    if (e.type === 'auxclick' && e.button !== 1) return   // middle click only
    const el = e.target instanceof Element ? e.target : null
    if (!el || !enabled()) return

    const tagged = el.closest('[data-track]')
    if (tagged) {
      const raw = (tagged.getAttribute('data-track') || '').trim()
      const name = raw && raw !== 'cta_click' && allowedName(raw) ? raw : 'cta_click'
      track(name, {
        label: tagged.getAttribute('data-track-label') || labelOf(tagged),
        target: tagged.getAttribute('data-track-target') || tagged.getAttribute('href') || undefined,
        // keep an unusable name visible instead of silently renaming it
        props: name === 'cta_click' && raw && raw !== 'cta_click' ? { name: cap(raw, 100) } : undefined,
      })
    }

    const a = el.closest('a[href]')
    if (!(a instanceof HTMLAnchorElement)) return
    const proto = a.protocol
    if (proto === 'mailto:') {
      track('email_click', { target: decode(a.href.replace(/^mailto:/i, '').split('?')[0]), label: labelOf(a) })
    } else if (proto === 'tel:') {
      track('phone_click', { target: decode(a.href.replace(/^tel:/i, '')), label: labelOf(a) })
    } else if (proto === 'http:' || proto === 'https:') {
      // A file link is reported as a download wherever it is hosted.
      if (FILE_RE.test(a.pathname)) track('file_download', { target: a.href, label: labelOf(a) })
      else if (bareHost(a.hostname) !== bareHost(location.hostname) && now() - lastWebsiteClickAt >= 1000) {
        track('outbound_click', { target: a.href, label: labelOf(a) })
      }
    }
  } catch { /* never break the page */ }
}

function reportError(message: string, at: string): void {
  try {
    const p = page
    if (!p || !message) return
    const label = cap(message, 300)
    if (p.errors.length >= MAX_ERRORS || p.errors.includes(label)) return
    p.errors.push(label)
    track('js_error', { label, target: cap(at.split(location.origin).join(''), 300) || undefined })
  } catch { /* never break the page */ }
}

/* An exception thrown here would itself land in onError, so both handlers
   are fully wrapped. */
function onError(e: ErrorEvent): void {
  try {
    const file = e.filename || ''
    // Cross-origin scripts report only "Script error." - nothing to act on;
    // extension scripts are not our code.
    if (!e.message || (!file && /^script error\.?$/i.test(e.message))) return
    if (/^(chrome|moz|safari|safari-web)-extension:/i.test(file)) return
    reportError(e.message, file ? `${file}:${e.lineno}:${e.colno}` : '')
  } catch { /* never break the page */ }
}

function onRejection(e: PromiseRejectionEvent): void {
  try {
    const r: unknown = e.reason
    if (r instanceof Error) {
      if (r.name === 'AbortError') return   // cancelled fetches on navigation, not bugs
      reportError(`${r.name}: ${r.message}`, r.stack?.match(/(https?:\/\/[^\s)]+:\d+:\d+)/)?.[1] || '')
      return
    }
    let text = ''
    try { text = typeof r === 'string' ? r : JSON.stringify(r) ?? String(r) } catch { text = String(r) }
    reportError(`Unhandled rejection: ${text}`, '')
  } catch { /* never break the page */ }
}

/* ── Web Vitals ─────────────────────────────────────────────────────────── */

/* Stable function reference on purpose: useReportWebVitals re-registers
   (and re-reports) when its callback changes. */
export function reportVital(metric: { name: string; value: number }): void {
  try {
    const p = vitalsPage
    if (!p || !VITALS.includes(metric.name) || !allowed()) return
    // Only for a pageview that was (or is about to be) recorded.
    if (!p.sent && p !== page) return
    const v = Number(metric.value)
    if (!Number.isFinite(v)) return
    enqueue({
      t: 'wv',
      ts: now(),
      pvid: p.pvid,
      name: metric.name as VitalHit['name'],
      value: metric.name === 'CLS' ? Math.round(v * 10000) / 10000 : Math.round(v),
    })
  } catch { /* never break the page */ }
}

/* ── Public API ─────────────────────────────────────────────────────────── */

/**
 * Record a browser event: a known client event (EVENTS with serverOnly
 * false) or a custom snake_case name. Server-only conversions are ignored -
 * route handlers record those (lib/analytics/server-events.ts).
 * Safe anywhere: a no-op on the server, when tracking is off, or on admin pages.
 */
export function track(name: ClientEventName | (string & Record<never, never>), data?: TrackData): void {
  try {
    if (typeof window === 'undefined' || !enabled() || !allowedName(name)) return
    const hit: EventHit = { t: 'ev', ts: now(), name }
    if (page) hit.pvid = page.pvid
    if (data?.target) hit.target = cap(String(data.target), 1000)
    if (data?.label) hit.label = cap(String(data.label), 300)
    if (typeof data?.value === 'number' && Number.isFinite(data.value)) hit.value = data.value
    if (data?.props && JSON.stringify(data.props).length <= 2000) hit.props = data.props
    if (name === 'website_click') lastWebsiteClickAt = hit.ts
    enqueue(hit)
  } catch { /* never break the page */ }
}

/* ── Start (once per document) ──────────────────────────────────────────── */

function start(): void {
  if (started) return
  started = true
  window.iwwTrack = track
  // Automated browsers (QA scripts, headless crawlers) never count.
  if (navigator.webdriver) return

  const known = store(AN_LS_VID)
  if (known && UUID_RE.test(known)) vid = known
  else {
    vid = uuid()
    store(AN_LS_VID, vid)
  }
  lastActivity = now()

  const activity = { passive: true, capture: true }
  for (const type of ['pointerdown', 'keydown', 'touchstart', 'mousemove', 'wheel']) {
    window.addEventListener(type, onActivity, activity)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('focus', onFocus)
  window.addEventListener('blur', onBlur)
  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('pagehide', onHide)
  window.addEventListener('pageshow', onPageShow)
  /* Back/Forward detection. The App Router re-renders (and calls
     routeChanged) from its own popstate listener, which is registered before
     ours, so a popstate listener here fires too late. The Navigation API's
     'navigate' event fires before popstate; popstate is only the fallback for
     browsers without it (there, Back is recorded as an ordinary navigation). */
  const navApi = (window as unknown as { navigation?: EventTarget }).navigation
  if (navApi && typeof navApi.addEventListener === 'function') {
    navApi.addEventListener('navigate', (e: Event) => {
      const ev = e as Event & { navigationType?: string; destination?: { url?: string } }
      if (ev.navigationType === 'traverse' && ev.destination?.url) {
        lastPopAt = now()
        lastPopHref = ev.destination.url
      }
    })
  } else {
    window.addEventListener('popstate', () => { lastPopAt = now(); lastPopHref = window.location.href })
  }
  document.addEventListener('click', onClick)
  document.addEventListener('auxclick', onClick)
  window.addEventListener('error', onError)
  window.addEventListener('unhandledrejection', onRejection)
  setInterval(heartbeat, HEARTBEAT_MS)
}
