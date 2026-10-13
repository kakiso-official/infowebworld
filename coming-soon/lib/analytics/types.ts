/* ═══════════════════════════════════════════════════════════════════════════
   InfoWebWorld Analytics - shared contract (types + constants).

   Isomorphic: imported by the browser tracker, the collector, the report
   modules and the admin UI. Never import server-only modules here.
   Tables: database/migration-analytics-v1.sql (an_* tables, all UTC).
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Identity, sessions, thresholds ─────────────────────────────────────── */

/** Anonymous visitor id cookie (HttpOnly, 1 year). Same name the old tracker
    used, so browsers that already carry one keep their identity. */
export const AN_VID_COOKIE = 'iww_vid'
/** "Exclude this browser" cookie set from Analytics settings (1 year). */
export const AN_IGNORE_COOKIE = 'iww_an_ignore'
/** localStorage keys used by the browser tracker. */
export const AN_LS_VID = 'iww_vid'
export const AN_LS_IGNORE = 'iww_an_ignore'

/** Collector endpoint (neutral name so ad-block lists don't match it). */
export const AN_ENDPOINT = '/api/pulse'

export const SESSION_TIMEOUT_MS = 30 * 60 * 1000   // 30 min of inactivity ends a session
export const SESSION_MAX_MS = 12 * 60 * 60 * 1000  // hard cap on one session
export const ENGAGED_SESSION_MS = 10_000           // >= 10s engaged time = engaged session
export const ACTIVE_NOW_MS = 5 * 60 * 1000         // "online now" window
export const RAW_RETENTION_DAYS = 400              // an_pageviews + an_events
export const SESSION_RETENTION_DAYS = 760          // an_sessions (an_visitors kept)
export const MAX_RANGE_DAYS = 400

/* ── Channels (where a visit came from) ─────────────────────────────────── */

export const CHANNELS = [
  'direct', 'organic_search', 'ai_assistant', 'social', 'referral', 'email',
  'paid_search', 'paid_social', 'display', 'affiliate', 'other_campaign',
] as const
export type Channel = (typeof CHANNELS)[number]

export const CHANNEL_META: Record<Channel, { label: string; description: string }> = {
  direct:         { label: 'Direct',          description: 'Typed the address, used a bookmark, or came from an app that hides where the visit came from.' },
  organic_search: { label: 'Organic search',  description: 'Unpaid results from Google, Bing, DuckDuckGo and other search engines.' },
  ai_assistant:   { label: 'AI assistants',   description: 'Links clicked inside ChatGPT, Perplexity, Claude, Gemini, Copilot and other AI assistants.' },
  social:         { label: 'Social',          description: 'Unpaid links from LinkedIn, Facebook, X, Reddit, YouTube and other social networks.' },
  referral:       { label: 'Referral',        description: 'Links on other websites.' },
  email:          { label: 'Email',           description: 'Links in emails (webmail referrers or utm_medium=email).' },
  paid_search:    { label: 'Paid search',     description: 'Search ads (utm_medium=cpc/ppc or a gclid/msclkid click id).' },
  paid_social:    { label: 'Paid social',     description: 'Paid posts and ads on social networks.' },
  display:        { label: 'Display ads',     description: 'Banner and display advertising.' },
  affiliate:      { label: 'Affiliate',       description: 'Affiliate and partner links (utm_medium=affiliate).' },
  other_campaign: { label: 'Other campaigns', description: 'Tagged campaign links (utm_*) that do not fit another channel.' },
}

/* ── Page types (what kind of page was viewed) ──────────────────────────── */

export const PAGE_TYPES = [
  'home', 'sector', 'category_index', 'category', 'listing', 'profile',
  'compare', 'country', 'categories', 'search', 'blog', 'blog_post',
  'developers', 'business', 'dashboard', 'info', 'not_found', 'other',
] as const
export type PageType = (typeof PAGE_TYPES)[number]

export const PAGE_TYPE_META: Record<PageType, { label: string; description: string }> = {
  home:           { label: 'Homepage',          description: 'The homepage (/).' },
  sector:         { label: 'Sector directory',  description: 'The six sector landings, e.g. /saas-directory.' },
  category_index: { label: 'Category index',    description: 'The "view all sub-categories" pages of a sector.' },
  category:       { label: 'Category page',     description: 'A category page under a sector, e.g. /saas-directory/crm-platforms.' },
  listing:        { label: 'Product page',      description: 'A product listing at /listing/{slug}.' },
  profile:        { label: 'Company profile',   description: 'A company profile at /profile/{slug}.' },
  compare:        { label: 'Comparison',        description: '/compare and /compare-companies pages.' },
  country:        { label: 'Country directory', description: '/countries and the /{country}-business-directory pages.' },
  categories:     { label: 'All categories',    description: '/categories, /all and /category-guides.' },
  search:         { label: 'Site search',       description: 'The /search results page.' },
  blog:           { label: 'Blog index',        description: 'The /blog index.' },
  blog_post:      { label: 'Blog post',         description: 'A blog article at /blog/{slug}.' },
  developers:     { label: 'Developers',        description: 'Anything under /developers.' },
  business:       { label: 'For businesses',    description: '/business and /business/plans - where businesses sign up.' },
  dashboard:      { label: 'Business dashboard', description: 'Logged-in business owners inside /dashboard.' },
  info:           { label: 'Info pages',        description: 'About, FAQs, glossary, terms, privacy, contact and similar pages.' },
  not_found:      { label: '404 not found',     description: 'Pages that showed the "page not found" screen.' },
  other:          { label: 'Other',             description: 'Any page that does not fit the types above.' },
}

/** Paths the browser tracker never records. */
export const UNTRACKED_PATH_PREFIXES = ['/iww-hq', '/preview', '/test-', '/payment-test', '/api/'] as const

/** Query-string keys kept on a pageview (everything else is dropped). */
export const KEPT_QUERY_KEYS = ['q', 'page', 'country', 'sort', 'type', 'mode', 'tab', 'category', 'sector'] as const

/* ── Devices ────────────────────────────────────────────────────────────── */

export type DeviceType = 'desktop' | 'mobile' | 'tablet'

/* ── Events ─────────────────────────────────────────────────────────────── */

export type EventCategory = 'conversion' | 'engagement' | 'navigation' | 'error'
export type EventOrigin = 'client' | 'server'

export interface EventMeta {
  label: string
  description: string
  category: EventCategory
  /** Key events count as conversions and make a session "engaged". */
  isKey: boolean
  /** Server-only events can never be sent by the browser (no spoofed conversions). */
  serverOnly: boolean
  /** Session flag set when this event happens. */
  sessionFlag?: 'did_signup' | 'did_login' | 'did_listing' | 'did_lead' | 'did_outbound'
}

export const EVENTS = {
  /* conversions recorded by the server (route handlers) */
  signup_completed:  { label: 'Signed up',            description: 'Created a business account (email code, Google or another provider).', category: 'conversion', isKey: true,  serverOnly: true, sessionFlag: 'did_signup' },
  login:             { label: 'Logged in',            description: 'Logged in to an existing business account.',                         category: 'conversion', isKey: false, serverOnly: true, sessionFlag: 'did_login' },
  listing_submitted: { label: 'Listing submitted',    description: 'Submitted a product or company listing for review.',                category: 'conversion', isKey: true,  serverOnly: true, sessionFlag: 'did_listing' },
  claim_submitted:   { label: 'Claim submitted',      description: 'Asked to claim an existing company listing.',                       category: 'conversion', isKey: true,  serverOnly: true },
  review_submitted:  { label: 'Review submitted',     description: 'Wrote a review of a listing.',                                      category: 'conversion', isKey: true,  serverOnly: true },
  lead_sent:         { label: 'Inquiry sent',         description: 'Sent a message to a business from its listing (a lead for that business).', category: 'conversion', isKey: true, serverOnly: true, sessionFlag: 'did_lead' },
  contact_submitted: { label: 'Contact form sent',    description: 'Sent the InfoWebWorld contact form.',                               category: 'conversion', isKey: true,  serverOnly: true },
  purchase:          { label: 'Plan purchased',       description: 'Paid for a listing plan (value = amount).',                         category: 'conversion', isKey: true,  serverOnly: true },
  /* recorded by the browser tracker */
  website_click:     { label: 'Website visit',        description: 'Clicked through to a listed business\'s own website.',              category: 'conversion', isKey: true,  serverOnly: false, sessionFlag: 'did_outbound' },
  email_click:       { label: 'Email click',          description: 'Clicked an email address (mailto: link).',                          category: 'conversion', isKey: true,  serverOnly: false, sessionFlag: 'did_lead' },
  phone_click:       { label: 'Phone click',          description: 'Clicked a phone number (tel: link).',                               category: 'conversion', isKey: true,  serverOnly: false, sessionFlag: 'did_lead' },
  outbound_click:    { label: 'Outbound link',        description: 'Clicked any other link that leaves infowebworld.com.',              category: 'navigation', isKey: false, serverOnly: false },
  file_download:     { label: 'File download',        description: 'Clicked a link to a file (PDF, DOCX, ZIP...).',                     category: 'engagement', isKey: false, serverOnly: false },
  search:            { label: 'Site search',          description: 'Searched the site (query in the event target).',                    category: 'engagement', isKey: false, serverOnly: false },
  signup_started:    { label: 'Signup opened',        description: 'Opened the business signup form.',                                  category: 'engagement', isKey: false, serverOnly: false },
  login_started:     { label: 'Login opened',         description: 'Opened the login form.',                                            category: 'engagement', isKey: false, serverOnly: false },
  review_started:    { label: 'Review opened',        description: 'Opened the write-a-review form.',                                   category: 'engagement', isKey: false, serverOnly: false },
  chat_opened:       { label: 'Chat opened',          description: 'Opened the InfoBot chat widget.',                                   category: 'engagement', isKey: false, serverOnly: false },
  share:             { label: 'Shared',               description: 'Used a share button (network in the event target).',               category: 'engagement', isKey: false, serverOnly: false },
  cta_click:         { label: 'Button click',         description: 'Clicked an element marked with data-track (label = button text).',  category: 'engagement', isKey: false, serverOnly: false },
  not_found:         { label: '404 hit',              description: 'Landed on the "page not found" screen.',                            category: 'error',      isKey: false, serverOnly: false },
  js_error:          { label: 'JavaScript error',     description: 'A script error in the visitor\'s browser.',                         category: 'error',      isKey: false, serverOnly: false },
} as const satisfies Record<string, EventMeta>

export type EventName = keyof typeof EVENTS
export type ServerEventName = { [K in EventName]: (typeof EVENTS)[K]['serverOnly'] extends true ? K : never }[EventName]
export type ClientEventName = Exclude<EventName, ServerEventName>

/** Custom event names allowed from the browser (data-track="..." or track()).
    Unknown-but-valid names are stored as-is: category 'engagement', not key. */
export const CUSTOM_EVENT_NAME_RE = /^[a-z][a-z0-9_]{1,40}$/

/* ── Collector wire protocol: POST /api/pulse ───────────────────────────── */

export interface PulseBatch {
  v: 1
  /** visitor id hint from localStorage (used only when the cookie is missing) */
  vid?: string
  /** client clock (epoch ms) when the batch was sent - used to place queued hits in time */
  now: number
  hits: PulseHit[]
}

export type PulseHit = PageviewHit | EngagementHit | EventHit | VitalHit

/** A page was viewed. */
export interface PageviewHit {
  t: 'pv'
  ts: number            // client epoch ms
  pvid: string          // uuid generated by the tracker for this pageview
  path: string          // location.pathname
  search: string        // location.search (server keeps KEPT_QUERY_KEYS + utm/click ids for attribution only)
  title: string
  ref: string           // document.referrer on a hard load; previous page URL on in-app navigation
  nav: 'navigate' | 'reload' | 'back_forward' | 'prerender' | 'push' | 'traverse'
  status: number        // 404 when the not-found screen rendered, else 200
  sw: number; sh: number   // screen size
  vw: number; vh: number   // viewport size
  touch: number         // navigator.maxTouchPoints (iPadOS detection)
  lang: string          // navigator.language
  tz: string            // Intl timezone, e.g. "Asia/Kolkata"
  results?: number      // site-search result count when the page exposes it
}

/** Engagement update for a pageview (heartbeat or final). Values are totals, not deltas. */
export interface EngagementHit {
  t: 'pe'
  ts: number
  pvid: string
  eng: number           // engaged ms on this pageview so far
  scroll: number        // max scroll depth 0-100
  final?: boolean
}

/** A browser-side event (client event names only). */
export interface EventHit {
  t: 'ev'
  ts: number
  pvid?: string
  name: string
  target?: string
  label?: string
  value?: number
  props?: Record<string, string | number | boolean | null>
}

/** A Core Web Vital for the hard-loaded pageview. */
export interface VitalHit {
  t: 'wv'
  ts: number
  pvid: string
  name: 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB'
  value: number
}

/** Response body of /api/pulse when the batch contained a pageview. */
export interface PulseResponse { ok: true; vid: string }

/* ── Server events: lib/analytics/server-events.ts ──────────────────────── */

export interface ServerEventOptions {
  userId?: number | null
  target?: string | null
  label?: string | null
  value?: number | null
  props?: Record<string, string | number | boolean | null>
}

/* ── Report requests ────────────────────────────────────────────────────── */

export type Bucket = 'hour' | 'day' | 'week' | 'month'
export type CompareMode = 'previous' | 'year' | 'none'

export interface ResolvedRange {
  from: string          // YYYY-MM-DD, inclusive, in tz
  to: string            // YYYY-MM-DD, inclusive, in tz
  tz: string            // IANA timezone used for day boundaries
  days: number
  bucket: Bucket
  startUtc: string      // 'YYYY-MM-DD HH:MM:SS.mmm' UTC, inclusive (SQL-ready)
  endUtc: string        // 'YYYY-MM-DD HH:MM:SS.mmm' UTC, exclusive (SQL-ready)
  compare: CompareMode
  prev: { from: string; to: string; startUtc: string; endUtc: string } | null
}

/** Filters shared by every report (URL params f.<name>). All exact match. */
export interface Filters {
  channel?: string
  source?: string
  medium?: string
  campaign?: string
  referrer?: string     // referrer_host
  country?: string      // ISO-3166 alpha-2
  region?: string
  city?: string
  device?: string       // DeviceType
  browser?: string
  os?: string
  entry?: string        // session entry_path
  exit?: string         // session exit_path
  page?: string         // sessions that viewed this path / pageviews of this path
  pageType?: string     // PageType
  visitor?: 'new' | 'returning'
  user?: 'linked'       // only visitors linked to a business account
  converted?: 'any' | 'signup' | 'listing' | 'lead' | 'outbound'
}
export const FILTER_KEYS = [
  'channel', 'source', 'medium', 'campaign', 'referrer', 'country', 'region', 'city',
  'device', 'browser', 'os', 'entry', 'exit', 'page', 'pageType', 'visitor', 'user', 'converted',
] as const satisfies readonly (keyof Filters)[]
export type FilterKey = (typeof FILTER_KEYS)[number]

/* ── Report responses ───────────────────────────────────────────────────── */

/** A number for the selected range plus the comparison range (null = no comparison). */
export interface Metric { value: number; previous: number | null }

export interface KpiSet {
  visitors: Metric
  newVisitors: Metric
  sessions: Metric
  pageviews: Metric
  pagesPerSession: Metric
  engagementRate: Metric   // 0..1
  bounceRate: Metric       // 0..1  (= 1 - engagementRate)
  avgEngagedMs: Metric     // per session
  avgDurationMs: Metric    // per session, wall clock
  keyEvents: Metric
  conversionRate: Metric   // sessions with >= 1 key event / sessions, 0..1
  signups: Metric
  listingsSubmitted: Metric
  leads: Metric            // lead_sent + email_click + phone_click
  websiteClicks: Metric
}

export interface SeriesPoint {
  t: string              // bucket key: 'YYYY-MM-DD' | 'YYYY-MM-DD HH:00' | week start | 'YYYY-MM-01'
  label: string          // short display label for the axis, e.g. "Oct 13" / "14:00"
  visitors: number
  sessions: number
  pageviews: number
  bounceRate: number     // 0..1 (0 when no sessions)
  avgEngagedMs: number
  keyEvents: number
  signups: number
}
export interface TimeSeries {
  bucket: Bucket
  points: SeriesPoint[]
  /** Comparison range, same length, aligned by index. */
  previous: SeriesPoint[] | null
}

/** One row of any "breakdown by X" table/bar list. */
export interface BreakdownRow {
  key: string            // raw value, used as the filter value when the row is clicked
  label: string          // what to show
  visitors: number
  sessions: number
  pageviews?: number
  engagementRate?: number
  bounceRate?: number
  avgEngagedMs?: number
  keyEvents?: number
  conversionRate?: number
  share: number          // 0..1 share of the report total (visitors unless stated)
  previous?: { visitors: number; sessions: number } | null
  /** Report-specific extras. Event-based breakdowns put the event count in extra.count. */
  extra?: Record<string, string | number | null>
}

export interface PageRow {
  path: string
  title: string | null
  pageType: PageType
  views: number
  visitors: number
  entries: number
  exits: number
  exitRate: number          // exits / views
  bounceRate: number | null // non-engaged entry sessions / entries (null when no entries)
  avgEngagedMs: number      // per view
  avgScrollPct: number      // 0..100 (percent points, not a 0..1 ratio)
  share: number             // views share
  previousViews?: number | null
}

export interface EventSummaryRow {
  name: string
  label: string
  category: EventCategory
  isKey: boolean
  count: number
  visitors: number
  sessions: number
  previousCount: number | null
}

export interface Insight {
  id: string
  tone: 'good' | 'bad' | 'neutral'
  text: string             // one plain-English sentence
  href?: string            // analytics UI link (path + query) that shows the detail
}

export interface OverviewReport {
  range: ResolvedRange
  trackingSince: string | null   // ISO
  kpis: KpiSet
  series: TimeSeries
  channels: BreakdownRow[]
  sources: BreakdownRow[]        // extra.channel
  aiAssistants: BreakdownRow[]
  campaigns: BreakdownRow[]      // extra.source, extra.medium
  topPages: PageRow[]
  entryPages: PageRow[]
  exitPages: PageRow[]
  countries: BreakdownRow[]
  cities: BreakdownRow[]         // extra.country
  devices: BreakdownRow[]
  browsers: BreakdownRow[]
  os: BreakdownRow[]
  keyEvents: EventSummaryRow[]
  insights: Insight[]
  activeNow: number
}

export interface FeedItem {
  kind: 'pageview' | 'event'
  ts: string
  sessionId: number
  visitorId: number
  path: string | null
  title: string | null
  name: string | null            // event name (kind = event)
  target: string | null
  country: string | null
  city: string | null
  deviceType: DeviceType
  channel: Channel
  source: string
  isNewVisitor: boolean
  userId: number | null
}

export interface RealtimeReport {
  serverTime: string
  activeNow: number              // visitors with a hit in the last 5 minutes
  active30m: number
  perMinute: { t: string; pageviews: number; visitors: number }[]   // last 30 minutes, oldest first
  pages: BreakdownRow[]          // page each active visitor is on now
  sources: BreakdownRow[]
  countries: BreakdownRow[]
  devices: BreakdownRow[]
  feed: FeedItem[]               // newest first, max 50
}

export interface ChannelSeries {
  bucket: Bucket
  labels: { t: string; label: string }[]
  series: { channel: Channel; sessions: number[] }[]
}

export interface AcquisitionReport {
  range: ResolvedRange
  channels: BreakdownRow[]
  channelSeries: ChannelSeries
  sources: BreakdownRow[]        // extra.channel
  referrers: BreakdownRow[]      // key = referrer host, extra.sampleUrl
  referrerUrls: BreakdownRow[]   // key = full referrer URL
  campaigns: BreakdownRow[]      // extra.source, extra.medium
  aiAssistants: BreakdownRow[]
  searchEngines: BreakdownRow[]
  socialNetworks: BreakdownRow[]
  landingPages: PageRow[]
}

export interface PagesReport {
  range: ResolvedRange
  groupBy: 'path' | 'page_type' | 'entry' | 'exit'
  total: number
  rows: PageRow[]
}

/** p75 in the metric's unit; good / needsImprovement / poor are SHARES of samples (0..1). */
export interface VitalStat { p75: number; good: number; needsImprovement: number; poor: number }
export interface VitalsSummary {
  samples: number
  lcp: VitalStat | null   // ms
  inp: VitalStat | null   // ms
  cls: VitalStat | null   // unitless
  fcp: VitalStat | null   // ms
  ttfb: VitalStat | null  // ms
}

export interface PageDetailReport {
  range: ResolvedRange
  path: string
  title: string | null
  pageType: PageType
  kpis: {
    views: Metric; visitors: Metric; entries: Metric; exits: Metric
    exitRate: Metric; bounceRate: Metric; avgEngagedMs: Metric
    avgScrollPct: Metric   // 0..100 (percent points)
  }
  series: { bucket: Bucket; points: { t: string; label: string; views: number; visitors: number }[] }
  previousPages: BreakdownRow[]  // key = previous path, or '(entrance)' with extra.channel for entries
  nextPages: BreakdownRow[]      // key = next path, or '(exit)'
  entrySources: BreakdownRow[]   // sources of sessions that landed on this page
  countries: BreakdownRow[]
  devices: BreakdownRow[]
  scroll: { bucket: '0-25%' | '25-50%' | '50-75%' | '75-100%'; views: number }[]
  vitals: VitalsSummary | null
  events: EventSummaryRow[]
  outboundTargets: BreakdownRow[]
}

export interface AudienceReport {
  range: ResolvedRange
  countries: BreakdownRow[]
  regions: BreakdownRow[]        // extra.country
  cities: BreakdownRow[]         // extra.country, extra.region
  languages: BreakdownRow[]
  devices: BreakdownRow[]
  browsers: BreakdownRow[]
  os: BreakdownRow[]
  screens: BreakdownRow[]        // key like '390x844'
  newVsReturning: { newVisitors: number; returningVisitors: number; newSessions: number; returningSessions: number }
  frequency: { bucket: '1' | '2' | '3-5' | '6-10' | '11+'; visitors: number }[]
  /** sessions by local weekday (0 = Monday) x hour (0-23), in range.tz */
  hourOfWeek: number[][]
}

export interface RetentionReport {
  range: ResolvedRange
  weeks: number
  cohorts: { cohort: string; label: string; size: number; returned: number[] }[]  // returned[k-1] = visitors active in week k after the cohort week
}

export interface PerformanceReport {
  range: ResolvedRange
  overall: VitalsSummary
  byPageType: (VitalsSummary & { key: PageType; label: string })[]
  slowestPages: (VitalsSummary & { path: string; title: string | null })[]
  series: { t: string; label: string; lcp: number | null; inp: number | null; cls: number | null }[]   // p75 per bucket
}

export interface ErrorsReport {
  range: ResolvedRange
  notFound: {
    path: string
    hits: number
    visitors: number
    lastSeen: string
    referrers: { key: string; label: string; hits: number; internal: boolean }[]
  }[]
  jsErrors: { message: string; hits: number; sessions: number; pages: string[]; browsers: string[]; lastSeen: string }[]
  series: { t: string; label: string; notFound: number; jsErrors: number }[]
}

export interface SearchTermRow {
  query: string
  searches: number
  visitors: number
  avgResults: number | null
  zeroResults: number
  lastSearched: string
}

export interface EventsReport {
  range: ResolvedRange
  events: EventSummaryRow[]
  /** Present when ?name= is given. */
  detail: {
    name: string
    series: { t: string; label: string; count: number }[]
    targets: BreakdownRow[]
    labels: BreakdownRow[]
    pages: BreakdownRow[]
  } | null
  searchTerms: SearchTermRow[]
  zeroResultTerms: SearchTermRow[]
}

export interface FlowNode {
  id: string             // `${step}|${key}`
  step: number           // 0 = first column (entry page, or the anchor page)
  key: string            // path / page type / '(exit)' / '(entrance)' / '(other)'
  label: string
  kind: 'page' | 'exit' | 'entrance' | 'other'
  sessions: number
}
export interface FlowLink { source: string; target: string; sessions: number }
export interface FlowReport {
  range: ResolvedRange
  mode: 'entries' | 'from' | 'to'
  anchor: string | null
  group: 'path' | 'page_type'
  steps: number
  totalSessions: number
  /** true when only the most recent sessions were used (cap reached) */
  sampled: boolean
  nodes: FlowNode[]
  links: FlowLink[]
}

export interface FunnelStepDef {
  kind: 'page' | 'page_prefix' | 'page_type' | 'event'
  value: string
  label?: string
}
export interface FunnelPreset { id: string; name: string; description: string; steps: FunnelStepDef[] }
export interface FunnelStepResult {
  label: string
  def: FunnelStepDef
  count: number
  rateFromStart: number   // 0..1
  rateFromPrev: number    // 0..1
  dropoff: number         // count lost since previous step
  medianMsFromPrev: number | null
}
export interface FunnelReport {
  range: ResolvedRange
  scope: 'session' | 'visitor'
  /** true when a row cap was reached and counts come from the most recent data */
  sampled: boolean
  steps: FunnelStepResult[]
  presets: FunnelPreset[]
  byChannel: { key: Channel; label: string; counts: number[] }[]
}

export interface SessionSummary {
  id: number
  visitorId: number
  userId: number | null
  userEmail: string | null
  startedAt: string
  lastSeenAt: string
  durationMs: number
  engagedMs: number
  pageviews: number
  events: number
  keyEvents: number
  isNew: boolean
  isEngaged: boolean
  isLive: boolean               // last hit within ACTIVE_NOW_MS
  entryPath: string
  exitPath: string
  channel: Channel
  source: string
  campaign: string | null
  referrer: string | null
  country: string | null
  region: string | null
  city: string | null
  deviceType: DeviceType
  browser: string | null
  os: string | null
  flags: { signup: boolean; login: boolean; listing: boolean; lead: boolean; outbound: boolean }
}
export interface SessionsReport { range: ResolvedRange; total: number; rows: SessionSummary[] }

export type TimelineItem =
  | {
      kind: 'pageview'
      id: number
      ts: string
      seq: number
      path: string
      query: string | null
      title: string | null
      pageType: PageType
      engagedMs: number
      scrollPct: number
      status: number
      navType: string | null
      vitals: { lcp: number | null; inp: number | null; cls: number | null } | null
    }
  | {
      kind: 'event'
      id: number
      ts: string
      name: string
      label: string             // EVENTS[name].label or the custom name
      category: EventCategory
      isKey: boolean
      origin: EventOrigin
      path: string | null
      target: string | null
      text: string | null       // an_events.label (link text, button label...)
      value: number | null
      props: Record<string, unknown> | null
    }

export interface VisitorUser { id: number; email: string; name: string | null; createdAt: string | null; listings: number }

export interface VisitorSummary {
  id: number
  userId: number | null
  user: VisitorUser | null
  firstSeenAt: string
  lastSeenAt: string
  sessions: number
  pageviews: number
  events: number
  engagedMs: number
  firstTouch: {
    channel: Channel | null
    source: string | null
    medium: string | null
    campaign: string | null
    referrer: string | null
    landing: string | null
  }
  country: string | null
  deviceType: DeviceType | null
  signedUpAt: string | null
}

export interface SessionDetailReport {
  session: SessionSummary & {
    referrerHost: string | null
    medium: string | null
    term: string | null
    content: string | null
    clickId: string | null
    screen: string | null
    language: string | null
    timezone: string | null
    osVersion: string | null
    browserVersion: string | null
  }
  items: TimelineItem[]          // pageviews + events, oldest first
  visitor: VisitorSummary
  otherSessions: SessionSummary[] // same visitor, newest first, max 20
}

export interface VisitorReport {
  visitor: VisitorSummary
  sessions: SessionSummary[]     // newest first, max 100
  topPages: BreakdownRow[]       // key = path, visitors = 1, pageviews = views by this visitor
  keyEvents: TimelineItem[]      // event items only, newest first
}

export interface SignupRow {
  userId: number
  email: string
  name: string | null
  signedUpAt: string
  method: string | null
  visitorId: number | null
  firstTouch: VisitorSummary['firstTouch'] | null
  signupSession: { id: number; channel: Channel; source: string; entryPath: string } | null
  sessionsBeforeSignup: number | null
  pageviewsBeforeSignup: number | null
  daysToSignup: number | null
  listings: number
}
export interface SignupsReport {
  range: ResolvedRange
  total: number                  // all business accounts created in range
  attributed: number             // of which we have tracking data for
  rows: SignupRow[]
  byChannel: BreakdownRow[]      // first-touch channel of attributed signups
  byLanding: BreakdownRow[]      // first landing page of attributed signups
  series: { t: string; label: string; signups: number }[]
}

export interface HealthReport {
  installed: boolean
  missingTables: string[]
  trackingSince: string | null
  lastHitAt: string | null
  last24h: { sessions: number; pageviews: number; events: number; visitors: number }
  filtered7d: { reason: string; hits: number }[]
  tables: { name: string; rows: number; sizeMb: number }[]
  geo: { countryHeader: boolean; cityHeader: boolean }   // seen on sessions in the last 7 days
  retention: { rawDays: number; sessionDays: number }
}

/** Returned (HTTP 503) by every report when the an_* tables are missing. */
export interface NeedsMigration { needsMigration: true; missingTables: string[] }

/* ── Metric definitions (one source of truth for every tooltip) ─────────── */

export type MetricFormat = 'number' | 'percent' | 'duration' | 'decimal'

export const METRICS: Record<keyof KpiSet | 'views' | 'entries' | 'exits' | 'exitRate' | 'avgScrollPct' | 'returningVisitors', {
  label: string
  description: string
  format: MetricFormat
  /** Which direction is good - drives green/red deltas. */
  better: 'up' | 'down'
}> = {
  visitors:          { label: 'Visitors',           format: 'number',   better: 'up',   description: 'Unique people (browsers) who visited. One person on two devices counts twice.' },
  newVisitors:       { label: 'New visitors',       format: 'number',   better: 'up',   description: 'Visitors whose very first visit to the site was in this period.' },
  returningVisitors: { label: 'Returning visitors', format: 'number',   better: 'up',   description: 'Visitors who had been on the site before and came back in this period.' },
  sessions:          { label: 'Visits',             format: 'number',   better: 'up',   description: 'Separate visits (sessions). A visit ends after 30 minutes with no activity.' },
  pageviews:         { label: 'Pageviews',          format: 'number',   better: 'up',   description: 'Pages viewed, including in-app navigation between pages.' },
  pagesPerSession:   { label: 'Pages per visit',    format: 'decimal',  better: 'up',   description: 'Average number of pages viewed in one visit.' },
  engagementRate:    { label: 'Engaged visits',     format: 'percent',  better: 'up',   description: 'Share of visits that lasted 10+ seconds of active time, saw 2+ pages, or did a key action.' },
  bounceRate:        { label: 'Bounce rate',        format: 'percent',  better: 'down', description: 'Share of visits that left quickly: one page, under 10 seconds of active time, no key action.' },
  avgEngagedMs:      { label: 'Avg. time engaged',  format: 'duration', better: 'up',   description: 'Average active time per visit - only while the tab was visible and in use.' },
  avgDurationMs:     { label: 'Avg. visit length',  format: 'duration', better: 'up',   description: 'Average time from the first to the last activity of a visit (includes idle time).' },
  keyEvents:         { label: 'Key actions',        format: 'number',   better: 'up',   description: 'Signups, listings submitted, claims, reviews, inquiries, website/email/phone clicks and purchases.' },
  conversionRate:    { label: 'Conversion rate',    format: 'percent',  better: 'up',   description: 'Share of visits with at least one key action.' },
  signups:           { label: 'Signups',            format: 'number',   better: 'up',   description: 'New business accounts created.' },
  listingsSubmitted: { label: 'Listings submitted', format: 'number',   better: 'up',   description: 'Product and company listings submitted for review.' },
  leads:             { label: 'Leads to businesses', format: 'number',  better: 'up',   description: 'Inquiries sent plus email and phone clicks on listings - contacts we generated for businesses.' },
  websiteClicks:     { label: 'Website visits sent', format: 'number',  better: 'up',   description: 'Clicks from our listings through to the businesses\' own websites.' },
  views:             { label: 'Views',              format: 'number',   better: 'up',   description: 'Times this page was viewed.' },
  entries:           { label: 'Entrances',          format: 'number',   better: 'up',   description: 'Visits that started on this page (it was the landing page).' },
  exits:             { label: 'Exits',              format: 'number',   better: 'down', description: 'Visits that ended on this page.' },
  exitRate:          { label: 'Exit rate',          format: 'percent',  better: 'down', description: 'Share of this page\'s views that were the last page of the visit.' },
  avgScrollPct:      { label: 'Avg. scroll depth',  format: 'percent',  better: 'up',   description: 'How far down the page visitors scrolled, on average.' },
}

/* ── Web Vitals thresholds (Google's "good" / "poor" lines) ─────────────── */

export const VITAL_THRESHOLDS = {
  lcp:  { good: 2500, poor: 4000, unit: 'ms', label: 'Largest Contentful Paint', short: 'LCP', description: 'How long until the main content is visible.' },
  inp:  { good: 200,  poor: 500,  unit: 'ms', label: 'Interaction to Next Paint', short: 'INP', description: 'How quickly the page responds to taps and clicks.' },
  cls:  { good: 0.1,  poor: 0.25, unit: '',   label: 'Cumulative Layout Shift',   short: 'CLS', description: 'How much the layout jumps around while loading.' },
  fcp:  { good: 1800, poor: 3000, unit: 'ms', label: 'First Contentful Paint',    short: 'FCP', description: 'How long until anything appears on screen.' },
  ttfb: { good: 800,  poor: 1800, unit: 'ms', label: 'Time to First Byte',        short: 'TTFB', description: 'How long the server took to start answering.' },
} as const
