import { KEPT_QUERY_KEYS, type Channel, type DeviceType, type PageType } from './types'
import { isExcludedReferrerHost, normalizeHost, sourceForHost, sourceForUtm, type SourceDef } from './sources'
import { SECTOR_URL_SEGMENTS } from '../sector-paths'
import { isCountryDirectoryPath } from '../country-paths'

/* ═══════════════════════════════════════════════════════════════════════════
   Classification for the analytics collector - pure functions, no DB, no
   Next.js imports (only relative modules), so they can be unit-tested with
   plain Node and reused anywhere.

     classifyTraffic  - where a visit came from (channel / source / medium...)
     classifyPage     - what kind of page a path is (page type + entity slug)
     normalizePath    - the one canonical form of a path we store and group by
     cleanQuery       - the query-string keys worth keeping on a pageview
     parseUserAgent   - device / OS / browser from the UA + client hints
     isBotUserAgent   - crawlers, previewers, monitors and HTTP libraries
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Small helpers ──────────────────────────────────────────────────────── */

/** Trim + cap a string; empty becomes null. */
function cap(v: string | null | undefined, max: number): string | null {
  if (v == null) return null
  const s = String(v).trim()
  return s ? s.slice(0, max) : null
}

/* Column sizes in an_sessions (database/migration-analytics-v1.sql). */
const LEN = { source: 100, medium: 100, campaign: 150, term: 150, content: 150, referrer: 1000, referrerHost: 255 }

/* ── Paths ──────────────────────────────────────────────────────────────── */

/** Canonical stored form of a path: query/hash dropped, control characters
    removed, '//' collapsed, trailing slash stripped (except '/'), max 500.
    Every report groups by this exact string, so '/blog/' and '/blog' must
    end up the same. */
export function normalizePath(raw: string | null | undefined): string {
  let p = String(raw ?? '')
  const cut = p.search(/[?#]/)
  if (cut >= 0) p = p.slice(0, cut)
  p = p.replace(/[\u0000-\u001f\u007f]/g, '').trim()
  if (!p.startsWith('/')) p = '/' + p
  p = p.replace(/\/{2,}/g, '/')
  if (p.length > 1) p = p.replace(/\/+$/, '') || '/'
  return p.slice(0, 500)
}

/* ── Page types ─────────────────────────────────────────────────────────── */

const INFO_SEGMENTS = new Set([
  'about', 'faqs', 'glossary', 'terms', 'privacy', 'cookies', 'help', 'contact',
  'team', 'media', 'investors', 'insights', 'affiliates', 'agencies', 'removals',
  'content-guidelines', 'do-not-sell', 'write-review', 'news',
])
const CATEGORY_LIST_SEGMENTS = new Set(['categories', 'all', 'category-guides'])
const VIEW_ALL_PREFIX = 'view-all-sub-categories-'
const COUNTRY_SUFFIX_RE = /^(.+)-business-directory$/i

export interface PageClass { pageType: PageType; entity: string | null }

/** Page type + the slug that identifies the thing on the page (category,
    listing, company, post...), from a path and the HTTP-ish status the
    tracker saw (404 = the not-found screen rendered). */
export function classifyPage(rawPath: string, status?: number | null): PageClass {
  const path = normalizePath(rawPath)
  if (status === 404) return { pageType: 'not_found', entity: null }
  if (path === '/') return { pageType: 'home', entity: null }

  const segs = path.slice(1).split('/')
  const first = segs[0]
  const rest = (from: number) => cap(segs.slice(from).join('/'), 200)

  if (SECTOR_URL_SEGMENTS.has(first)) {
    if (segs.length === 1) return { pageType: 'sector', entity: first }
    if (segs[1].startsWith(VIEW_ALL_PREFIX)) return { pageType: 'category_index', entity: first }
    return { pageType: 'category', entity: cap(segs[1], 200) }
  }
  if (first === 'listing' && segs.length > 1) return { pageType: 'listing', entity: cap(segs[1], 200) }
  if (first === 'profile' && segs.length > 1) return { pageType: 'profile', entity: cap(segs[1], 200) }
  if (first.startsWith('compare')) return { pageType: 'compare', entity: rest(1) }
  if (first === 'countries') return { pageType: 'country', entity: rest(1) }
  if (isCountryDirectoryPath(path)) {
    /* entity = the {country} part, plus the sector segment when present:
       'us' or 'india/it-directory'. */
    const m = first.match(COUNTRY_SUFFIX_RE)
    const country = m ? m[1].toLowerCase() : first
    return { pageType: 'country', entity: cap(segs[1] ? `${country}/${segs[1]}` : country, 200) }
  }
  if (CATEGORY_LIST_SEGMENTS.has(first)) return { pageType: 'categories', entity: rest(1) }
  if (first === 'search') return { pageType: 'search', entity: null }
  if (first === 'blog') {
    return segs.length > 1 ? { pageType: 'blog_post', entity: cap(segs[1], 200) } : { pageType: 'blog', entity: null }
  }
  if (first === 'developers') return { pageType: 'developers', entity: rest(1) }
  if (first === 'business') return { pageType: 'business', entity: rest(1) }
  if (first === 'dashboard') return { pageType: 'dashboard', entity: rest(1) }
  if (INFO_SEGMENTS.has(first)) return { pageType: 'info', entity: first }
  return { pageType: 'other', entity: null }
}

/* ── Query strings ──────────────────────────────────────────────────────── */

const KEPT_KEYS: ReadonlySet<string> = new Set(KEPT_QUERY_KEYS)

/** Only the query keys that change what a page shows (KEPT_QUERY_KEYS),
    sorted so the same view always stores the same string. Everything else
    (utm_*, click ids, tracking junk, anything personal) is dropped. */
export function cleanQuery(search: string | null | undefined): string | null {
  if (!search) return null
  let sp: URLSearchParams
  try { sp = new URLSearchParams(search) } catch { return null }
  const pairs: [string, string][] = []
  sp.forEach((value, key) => {
    if (!KEPT_KEYS.has(key)) return
    const v = value.trim().slice(0, 200)
    if (v) pairs.push([key, v])
  })
  if (!pairs.length) return null
  pairs.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
  /* Over the column size: drop whole pairs from the end rather than cut
     a value (or a %-escape) in half. */
  while (pairs.length) {
    const s = new URLSearchParams(pairs).toString()
    if (s.length <= 500) return s
    pairs.pop()
  }
  return null
}

/* ── Traffic source ─────────────────────────────────────────────────────── */

export interface TrafficInput {
  /** location.search of the landing page ('?utm_source=...' or '') */
  search: string | null | undefined
  /** document.referrer (hard load) or the previous page URL (in-app navigation) */
  ref: string | null | undefined
  /** PageviewHit.nav */
  navType?: string | null
  /** Extra hosts that are this site (e.g. the request Host header). */
  ownHosts?: readonly string[]
}

export interface TrafficInfo {
  channel: Channel
  source: string
  medium: string | null
  campaign: string | null
  term: string | null
  content: string | null
  /** Type of ad click id on the URL ('gclid', 'fbclid'...), never its value. */
  clickId: string | null
  /** Referrer URL without its query string / fragment. */
  referrer: string | null
  referrerHost: string | null
}

/* Click-id URL params -> stored type, most specific first: fbclid is
   appended to every link shared on Facebook, so it only decides when no ad
   network id is present. */
const CLICK_IDS: [param: string, type: string][] = [
  ['gclid', 'gclid'], ['gbraid', 'gclid'], ['wbraid', 'gclid'],
  ['msclkid', 'msclkid'], ['dclid', 'dclid'], ['ttclid', 'ttclid'],
  ['li_fat_id', 'li_fat_id'], ['twclid', 'twclid'], ['fbclid', 'fbclid'],
]

const CLICK_ID_CLASS: Record<string, { channel: Channel; source: string }> = {
  gclid: { channel: 'paid_search', source: 'google' },
  msclkid: { channel: 'paid_search', source: 'bing' },
  dclid: { channel: 'display', source: 'google' },
  ttclid: { channel: 'paid_social', source: 'tiktok' },
  li_fat_id: { channel: 'paid_social', source: 'linkedin' },
  twclid: { channel: 'paid_social', source: 'x' },
  fbclid: { channel: 'social', source: 'facebook' },
}

/* utm_medium values, compared after lower-casing and turning '-' and
   spaces into '_' (so 'Paid-Social', 'e-mail', 'social media' all match). */
const PAID_SEARCH_MEDIUMS = new Set(['cpc', 'ppc', 'paid', 'paidsearch', 'paid_search', 'sem', 'search_ads'])
const PAID_SOCIAL_MEDIUMS = new Set(['paid_social', 'paidsocial', 'social_paid'])
const DISPLAY_MEDIUMS = new Set(['display', 'banner', 'cpm', 'programmatic'])
const EMAIL_MEDIUMS = new Set(['email', 'e_mail', 'newsletter', 'mail'])
const AFFILIATE_MEDIUMS = new Set(['affiliate', 'affiliates', 'partner', 'partners'])
const SOCIAL_MEDIUMS = new Set(['social', 'social_media', 'social_network', 'sm', 'organic_social'])
const REFERRAL_MEDIUMS = new Set(['referral', 'link'])

const DEFAULT_MEDIUM: Record<Channel, string | null> = {
  direct: '(none)',
  organic_search: 'organic',
  ai_assistant: 'ai',
  social: 'social',
  referral: 'referral',
  email: 'email',
  paid_search: 'cpc',
  paid_social: 'paid_social',
  display: 'display',
  affiliate: 'affiliate',
  other_campaign: null,
}

/** Channel for a tagged (utm_*) visit. `def` = the known source, if any. */
function channelForCampaign(medium: string | null, def: SourceDef | null): Channel {
  const m = medium ? medium.replace(/[\s-]+/g, '_') : ''
  const paid = PAID_SEARCH_MEDIUMS.has(m) || PAID_SOCIAL_MEDIUMS.has(m) || DISPLAY_MEDIUMS.has(m)
  /* AI assistants tag their links (ChatGPT adds utm_source=chatgpt.com):
     any medium except a paid one is still an AI-assistant visit. */
  if (def?.channel === 'ai_assistant' && !paid) return 'ai_assistant'
  if (!m) return def?.channel ?? 'other_campaign'
  if (PAID_SEARCH_MEDIUMS.has(m)) return def?.channel === 'social' ? 'paid_social' : 'paid_search'
  if (PAID_SOCIAL_MEDIUMS.has(m)) return 'paid_social'
  if (DISPLAY_MEDIUMS.has(m)) return 'display'
  if (EMAIL_MEDIUMS.has(m)) return 'email'
  if (AFFILIATE_MEDIUMS.has(m)) return 'affiliate'
  if (SOCIAL_MEDIUMS.has(m)) return 'social'
  if (REFERRAL_MEDIUMS.has(m)) return 'referral'
  /* 'organic' from a social network is organic social (GA4 does the same). */
  if (m === 'organic') return def?.channel === 'social' ? 'social' : 'organic_search'
  return 'other_campaign'
}

/* App referrers: android-app://com.google.android.gm/ (Android intents) and
   ios-app://... - the "host" is the app package. */
const APP_REF_RE = /^(android-app|ios-app):\/\/([^/?#\s]+)([^?#\s]*)/i

/** Referrer URL (query + fragment stripped, for privacy) and its host. */
export function parseReferrer(ref: string | null | undefined): { url: string; host: string } | null {
  const raw = String(ref ?? '').trim()
  if (!raw) return null
  const app = raw.match(APP_REF_RE)
  if (app) {
    const host = normalizeHost(app[2])
    if (!host || host.length > LEN.referrerHost) return null
    return { url: `${app[1].toLowerCase()}://${host}${app[3] || '/'}`.slice(0, LEN.referrer), host }
  }
  let u: URL
  try { u = new URL(raw) } catch { return null }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
  const host = normalizeHost(u.hostname)
  /* The URL parser accepts hostnames longer than an_sessions.referrer_host
     (VARCHAR 255); strict mode would reject the whole session insert. */
  if (!host || host.length > LEN.referrerHost) return null
  /* u.host keeps a port but never user:password. */
  return { url: `${u.protocol}//${u.host.toLowerCase()}${u.pathname}`.slice(0, LEN.referrer), host }
}

function isOwnHost(host: string, ownHosts: readonly string[] | undefined): boolean {
  if (isExcludedReferrerHost(host)) return true
  return !!ownHosts?.some(h => h && normalizeHost(h.replace(/:\d+$/, '')) === host)
}

/** Where a visit came from. Called once per new session (landing pageview).
    Precedence: utm_* tags > ad click ids > referrer > direct. */
export function classifyTraffic(input: TrafficInput): TrafficInfo {
  let sp: URLSearchParams
  try { sp = new URLSearchParams(input.search || '') } catch { sp = new URLSearchParams() }
  const get = (k: string) => {
    const v = sp.get(k)
    return v == null ? null : v.trim()
  }

  const utmSource = cap(get('utm_source')?.toLowerCase(), LEN.source)
  const utmMedium = cap(get('utm_medium')?.toLowerCase(), LEN.medium)
  const campaign = cap(get('utm_campaign'), LEN.campaign)
  const term = cap(get('utm_term'), LEN.term)
  const content = cap(get('utm_content'), LEN.content)

  let clickId: string | null = null
  for (const [param, type] of CLICK_IDS) {
    if (get(param)) { clickId = type; break }
  }

  /* In-app navigations carry our own previous page as the referrer. */
  const inApp = input.navType === 'push' || input.navType === 'traverse'
  const parsedRef = inApp ? null : parseReferrer(input.ref)
  const internalRef = inApp || (!!parsedRef && isOwnHost(parsedRef.host, input.ownHosts))
  const ref = internalRef ? null : parsedRef
  const refDef = ref ? sourceForHost(ref.host) : null

  const base = {
    term, content, clickId,
    referrer: ref?.url ?? null,
    referrerHost: ref?.host ?? null,
  }

  /* 1. Tagged campaign (any utm_source / utm_medium / utm_campaign). */
  if (utmSource || utmMedium || campaign) {
    const def = utmSource ? sourceForUtm(utmSource) : refDef
    const source = utmSource
      ? (def?.key ?? utmSource)
      : (refDef?.key ?? ref?.host ?? '(not set)')
    const channel = channelForCampaign(utmMedium, def)
    return { ...base, channel, source: source.slice(0, LEN.source), medium: utmMedium ?? DEFAULT_MEDIUM[channel], campaign }
  }

  /* 2. Ad click id without utm tags. */
  if (clickId) {
    let cls = CLICK_ID_CLASS[clickId]
    /* fbclid rides along on links shared anywhere in Meta's apps; a known
       referrer (Instagram, Messenger web...) says more than the id does. */
    if (clickId === 'fbclid' && refDef && refDef.key !== 'facebook') cls = { channel: refDef.channel, source: refDef.key }
    return { ...base, channel: cls.channel, source: cls.source, medium: DEFAULT_MEDIUM[cls.channel], campaign: null }
  }

  /* 3. Our own site, a sign-in or a payment page: not a new source. */
  if (internalRef) {
    return { ...base, channel: 'direct', source: '(internal)', medium: '(none)', campaign: null }
  }

  /* 4. A referrer: known source, else a plain referral from that host. */
  if (ref) {
    const channel: Channel = refDef?.channel ?? 'referral'
    const source = (refDef?.key ?? ref.host).slice(0, LEN.source)
    return { ...base, channel, source, medium: DEFAULT_MEDIUM[channel], campaign: null }
  }

  /* 5. Nothing at all. */
  return { ...base, channel: 'direct', source: '(direct)', medium: '(none)', campaign: null }
}

/* ── User agent ─────────────────────────────────────────────────────────── */

export interface UaHints {
  /** sec-ch-ua header, e.g. '"Chromium";v="128", "Google Chrome";v="128"' */
  secChUa?: string | null
  /** sec-ch-ua-mobile header: '?1' | '?0' */
  secChUaMobile?: string | null
  /** sec-ch-ua-platform header, e.g. '"Windows"' */
  secChUaPlatform?: string | null
  /** navigator.maxTouchPoints from the tracker (iPadOS detection) */
  touch?: number | null
}

export interface UaInfo {
  deviceType: DeviceType
  os: string | null
  osVersion: string | null
  browser: string | null
  browserVersion: string | null
}

interface BrowserRule {
  name: string
  test: RegExp
  /** Version pattern (capture group 1); defaults to `test`'s first group. */
  version?: RegExp
}

/* Order matters: in-app browsers and Chromium forks also carry "Chrome/"
   and "Safari/" tokens, so the specific ones are checked first, and
   Chrome before Safari (Chrome's UA contains "Safari/" too). */
const BROWSER_RULES: BrowserRule[] = [
  /* in-app browsers */
  { name: 'Instagram', test: /\bInstagram[ /](\d+)/ },
  { name: 'Facebook', test: /\bFBAN\/|\bFB_IAB\/|\bFBAV\//, version: /\bFBAV\/(\d+)/ },
  { name: 'LinkedIn', test: /\bLinkedInApp\b/, version: /\bLinkedInApp\/(\d+)/ },
  { name: 'WhatsApp', test: /\bWhatsApp\/(\d+)/ },
  { name: 'Telegram', test: /\bTelegram-(?:Android|iOS)\/(\d+)|\bTelegram\b/ },
  { name: 'Snapchat', test: /\bSnapchat\/(\d+)/ },
  { name: 'TikTok', test: /\b(?:musical_ly|BytedanceWebview|TikTok)\b/ },
  { name: 'Google app', test: /\bGSA\/(\d+)/ },
  /* browsers */
  { name: 'Edge', test: /\bEdg(?:e|A|iOS)?\/(\d+)/ },
  { name: 'Opera', test: /\b(?:OPR|OPT|OPiOS)\/(\d+)|\bOpera[ /](\d+)/ },
  { name: 'Samsung Internet', test: /\bSamsungBrowser\/(\d+)/ },
  { name: 'UC Browser', test: /\bUC ?Browser\/(\d+)/ },
  { name: 'Yandex', test: /\bYaBrowser\/(\d+)/ },
  { name: 'Vivaldi', test: /\bVivaldi\/(\d+)/ },
  { name: 'DuckDuckGo', test: /\b(?:DuckDuckGo|Ddg)\/(\d+)/ },
  { name: 'Firefox', test: /\b(?:Firefox|FxiOS)\/(\d+)/ },
  { name: 'Android WebView', test: /; wv\).*?\bChrome\/(\d+)/ },
  { name: 'Chrome', test: /\b(?:Chrome|CriOS|Chromium)\/(\d+)/ },
  { name: 'Safari', test: /\bVersion\/(\d+(?:\.\d+)?)[^ ]*(?: Mobile\/\w+)? Safari\// },
  { name: 'IE', test: /\bTrident\/.*\brv:(\d+)|\bMSIE (\d+)/ },
]

const WINDOWS_VERSIONS: Record<string, string> = {
  /* Windows 11 still says "NT 10.0" in the UA, so the two can't be told apart. */
  '10.0': '10/11', '6.3': '8.1', '6.2': '8', '6.1': '7', '6.0': 'Vista', '5.2': 'XP', '5.1': 'XP',
}

const PLATFORM_HINT_OS: Record<string, string> = {
  windows: 'Windows', macos: 'macOS', android: 'Android', 'chrome os': 'ChromeOS',
  'chromium os': 'ChromeOS', linux: 'Linux', ios: 'iOS',
}

function firstGroup(m: RegExpMatchArray | null): string | null {
  if (!m) return null
  for (let i = 1; i < m.length; i++) if (m[i]) return m[i]
  return null
}

function detectBrowser(ua: string, secChUa: string): { browser: string | null; version: string | null } {
  for (const rule of BROWSER_RULES) {
    const m = ua.match(rule.test)
    if (!m) continue
    const version = rule.version ? firstGroup(ua.match(rule.version)) : firstGroup(m)
    /* Brave ships Chrome's exact UA; only its client hints name it. */
    if (rule.name === 'Chrome' && /"Brave"/i.test(secChUa)) return { browser: 'Brave', version }
    return { browser: rule.name, version }
  }
  /* iOS apps embedding WKWebView: WebKit without a browser token. */
  if (/\b(?:iPhone|iPad|iPod)\b/.test(ua) && /AppleWebKit\//.test(ua)) return { browser: 'iOS WebView', version: null }
  return { browser: null, version: null }
}

function detectOs(ua: string, touch: number): { os: string | null; version: string | null } {
  if (/\bWindows Phone\b/.test(ua)) return { os: 'Windows Phone', version: firstGroup(ua.match(/Windows Phone (?:OS )?(\d+(?:\.\d+)?)/)) }
  const win = ua.match(/\bWindows NT (\d+\.\d+)/)
  if (win) return { os: 'Windows', version: WINDOWS_VERSIONS[win[1]] ?? win[1] }
  if (/\bWindows\b/.test(ua)) return { os: 'Windows', version: null }

  const iosVersion = () => {
    const m = ua.match(/\bOS (\d+)[_.](\d+)/)
    return m ? `${m[1]}.${m[2]}` : null
  }
  if (/\b(?:iPhone|iPod)\b/.test(ua)) return { os: 'iOS', version: iosVersion() }
  if (/\biPad\b/.test(ua)) return { os: 'iPadOS', version: iosVersion() }
  if (/\bCrOS\b/.test(ua)) return { os: 'ChromeOS', version: null }

  const android = ua.match(/\bAndroid(?:[ /;](\d+(?:\.\d+)?))?/)
  if (android) {
    /* Chrome's reduced UA freezes every phone to "Android 10; K", which
       says nothing about the real version. */
    const reduced = /\bAndroid 10; K\)/.test(ua)
    return { os: 'Android', version: reduced ? null : (android[1] ?? null) }
  }

  if (/\b(?:Macintosh|Mac OS X)\b/.test(ua)) {
    /* iPadOS 13+ Safari asks for desktop sites with a Mac UA; only touch
       support gives it away. Its "Version/x.y" is the iPadOS version. */
    if (touch > 1) return { os: 'iPadOS', version: firstGroup(ua.match(/\bVersion\/(\d+(?:\.\d+)?)/)) }
    const m = ua.match(/Mac OS X (\d+)[_.](\d+)/)
    /* Safari, Chrome and Firefox all freeze macOS at 10.15(.7) since
       Big Sur, so that value is meaningless. */
    const version = m && !(m[1] === '10' && m[2] === '15') ? `${m[1]}.${m[2]}` : null
    return { os: 'macOS', version }
  }
  if (/\b(?:Linux|X11|Ubuntu|Fedora)\b/.test(ua)) return { os: 'Linux', version: null }
  return { os: null, version: null }
}

function unquote(v: string | null | undefined): string {
  return String(v ?? '').trim().replace(/^"|"$/g, '').trim().toLowerCase()
}

/** Device type, OS and browser from the UA string, refined by client hints
    (Chromium sends sec-ch-ua*, which survive UA reduction). Regex based,
    no dependency. Values fit the an_sessions column sizes. */
export function parseUserAgent(rawUa: string | null | undefined, hints: UaHints = {}): UaInfo {
  const ua = String(rawUa ?? '').slice(0, 1000)
  const touch = Number(hints.touch) || 0
  const mobileHint = unquote(hints.secChUaMobile)
  const platformHint = unquote(hints.secChUaPlatform)

  let { os, version: osVersion } = detectOs(ua, touch)
  const hintedOs = PLATFORM_HINT_OS[platformHint]
  if (hintedOs && hintedOs !== os) { os = hintedOs; osVersion = null }

  const { browser, version: browserVersion } = detectBrowser(ua, String(hints.secChUa ?? ''))

  const isIpad = os === 'iPadOS'
  let deviceType: DeviceType = 'desktop'
  if (isIpad || /\b(?:Tablet|Kindle|PlayBook)\b|\bSilk\//i.test(ua) || (/\bAndroid\b/.test(ua) && !/\bMobile\b/.test(ua))) {
    deviceType = 'tablet'
  } else if (/Mobi|\biPhone\b|\biPod\b|Android.*Mobile|Windows Phone/.test(ua)) {
    deviceType = 'mobile'
  }
  /* Client hints win when present: '?1' is a phone; an Android device that
     says '?0' is a tablet (large Android tablets request desktop sites with
     a Linux desktop UA). */
  if (mobileHint === '?1') deviceType = 'mobile'
  else if (mobileHint === '?0' && os === 'Android') deviceType = 'tablet'

  return {
    deviceType,
    os: cap(os, 32),
    osVersion: cap(osVersion, 16),
    browser: cap(browser, 32),
    browserVersion: cap(browserVersion, 16),
  }
}

/* ── Bots ───────────────────────────────────────────────────────────────── */

/* Crawlers, link previewers, uptime monitors, test runners and HTTP
   libraries. Kept as substrings so new versions still match. Real UAs this
   must catch / must not catch (also in the self-test):
     BOT  Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
     BOT  Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)
     BOT  Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)
     BOT  Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/120.0.0.0 Safari/537.36
     BOT  facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)
     BOT  WhatsApp/2.23.20.0 A                     (link-preview fetcher: no "Mozilla/")
     BOT  curl/8.4.0
     HUMAN ...(iPhone...) Mobile/15E148 [FBAN/FBIOS;FBAV/445.0.0.35.117;...]   (Facebook in-app)
     HUMAN ...Chrome/124.0.0.0 Mobile Safari/537.36 Instagram 330.0.0.40.92 Android (...)
     HUMAN ...Mobile Safari/537.36 WhatsApp/2.24.8.78   (WhatsApp in-app webview)
     HUMAN ...(Linux; Android 10; CUBOT X30) ... Mobile Safari/537.36   ("bot" inside a phone brand) */
const BOT_RE = new RegExp([
  'bot', 'crawl', 'spider', 'slurp', 'fetch', 'scrape', 'preview', 'monitor', 'headless',
  'lighthouse', 'pagespeed', 'gtmetrix', 'pingdom', 'uptime', 'curl/', 'wget', 'python',
  'java/', 'go-http', 'okhttp', 'axios', 'node-fetch', 'undici', 'httpclient', 'libwww',
  'guzzlehttp', 'postmanruntime', 'insomnia', 'scrapy', 'phantomjs', 'puppeteer',
  'playwright', 'selenium', 'facebookexternalhit', 'externalagent', 'embedly', 'iframely',
  'quora link preview', 'vkshare', 'google-inspectiontool', 'google-read-aloud',
  'googleother', 'google-safety', 'appengine-google', 'adsbot', 'mediapartners',
  'apis-google', 'feedfetcher', 'bingpreview', 'yahoo! slurp', 'yandex(?:bot|images)',
  'baiduspider', 'bytespider', 'ccbot', 'gptbot', 'chatgpt-user', 'oai-searchbot',
  'claude-user', 'claude-searchbot', 'perplexity-user', 'mistralai-user', 'cohere',
  'diffbot', 'ia_archiver', 'sitebulb', 'ptst/', 'statuscake', 'datadog', 'httrack',
  'slack-imgproxy', 'qwantify', 'omgili',
].join('|'), 'i')

/* Phone brands whose names contain a bot word. */
const BOT_FALSE_POSITIVES = /cubot/gi

/** True for automated clients. Every real browser engine (and every in-app
    webview) sends "Mozilla/5.0"; a UA without it is a script or a fetcher
    (WhatsApp's preview fetcher is "WhatsApp/2.x A", its in-app webview is a
    normal Mozilla UA), so that alone marks a bot. */
export function isBotUserAgent(rawUa: string | null | undefined): boolean {
  const ua = String(rawUa ?? '').trim()
  if (ua.length < 20) return true
  if (!/mozilla\/|opera\//i.test(ua)) return true
  return BOT_RE.test(ua.replace(BOT_FALSE_POSITIVES, ''))
}
