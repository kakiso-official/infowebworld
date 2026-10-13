'use client'
import { useState, useSyncExternalStore, type ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleCheck, faCircleExclamation, faClock, faDatabase, faEarthAmericas, faEyeSlash, faShieldHalved,
  faSpinner, faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'
import { AN_LS_IGNORE, type HealthReport } from '@/lib/analytics/types'
import '../../../styles/analytics-people.css'
import {
  Badge, BarList, DataTable, InfoTip, KpiStrip, MigrationNotice, PageHeader, Panel, PanelGrid, ReportView, Skeleton,
  browserTimeZone, fmtDate, fmtDateTime, fmtNumber, fmtRelative, getTimeZoneOverride, postAnalytics, sectionFor,
  setAnalyticsTimeZone, useAnalyticsQuery, useNow, useReport, useViewerTimeZone,
  type Column,
} from '../_ui'
import { StatTile } from '../_ui/people'

/* ════════════════════════════════════════════════════════════════════════
   Analytics - Settings. Is tracking working (last hit, last 24 h, what was
   filtered out and why), exclude this browser from the numbers, the
   timezone the whole section uses, how long data is kept and how big the
   tables are, Cloudflare location headers (cities), and the privacy model.
   Everything here is per-site except the timezone and the exclusion, which
   are per-browser.
   ════════════════════════════════════════════════════════════════════════ */

const FILTER_REASONS: Record<string, { label: string; text: string }> = {
  internal: { label: 'Your team', text: 'Signed-in admins and browsers excluded below - never counted.' },
  bot_ua: { label: 'Bots and crawlers', text: 'Search-engine crawlers, link previews, monitors and scripts, recognised by their user agent.' },
  rate_limited: { label: 'Too many hits', text: 'More than 240 hits a minute from one network, or 60 page views a minute from one browser - floods and scrapers.' },
  invalid: { label: 'Invalid data', text: 'Malformed or oversized tracking data, or events the browser is not allowed to send.' },
  overloaded: { label: 'Overload protection', text: 'Hits dropped because too many were waiting to be saved at once - protects the live site during traffic spikes.' },
}

/* Browser-side stores (localStorage), read with useSyncExternalStore so the
   server render and the first client render agree. */
const subscribeStorage = (cb: () => void) => {
  window.addEventListener('storage', cb)
  return () => window.removeEventListener('storage', cb)
}
const noSubscribe = () => () => {}
function readIgnored(): boolean {
  try { return window.localStorage.getItem(AN_LS_IGNORE) === '1' } catch { return false }
}

export default function SettingsPage() {
  const r = useReport<HealthReport>('health', undefined, { ignoreRange: true, ignoreFilters: true })
  return (
    <>
      <PageHeader title="Settings" subtitle={sectionFor('settings').subtitle} />
      <ReportView state={r} skeleton={<SettingsSkeleton />}>
        {data => <SettingsBody data={data} />}
      </ReportView>
    </>
  )
}

function SettingsSkeleton() {
  return (
    <>
      <Skeleton variant="kpis" rows={4} />
      <PanelGrid>
        <Skeleton variant="block" height={240} />
        <Skeleton variant="block" height={240} />
      </PanelGrid>
    </>
  )
}

function SettingsBody({ data }: { data: HealthReport }) {
  return (
    <>
      <TrackingStatus data={data} />
      <PanelGrid>
        <ExcludePanel />
        <TimezonePanel />
        <FilteredPanel data={data} />
        <GeoPanel data={data} />
        <RetentionPanel data={data} />
        <PrivacyPanel />
      </PanelGrid>
    </>
  )
}

/* ── Is tracking working? ────────────────────────────────────────────── */

function TrackingStatus({ data }: { data: HealthReport }) {
  const q = useAnalyticsQuery()
  const now = useNow()
  if (!data.installed) {
    return (
      <Panel title="Tracking status" info={<InfoTip title="Tracking status" text="Whether the analytics database tables exist and visits are being recorded." />}>
        <MigrationNotice missingTables={data.missingTables} />
      </Panel>
    )
  }

  const lastMs = data.lastHitAt ? Date.parse(data.lastHitAt) : null
  const ageMs = lastMs != null && now ? now - lastMs : null
  let tone: 'good' | 'warn' | 'wait' = 'good'
  let headline: ReactNode
  let detail: ReactNode
  if (lastMs == null) {
    tone = 'wait'
    headline = 'Waiting for the first visit'
    detail = 'The tables are ready. Open the site in a private window (you are excluded while signed in here) and the first visit appears within seconds.'
  } else if (ageMs != null && ageMs > 24 * 3600_000) {
    tone = 'warn'
    headline = 'No visits recorded in the last 24 hours'
    detail = <>Last visit {fmtDateTime(data.lastHitAt, q.tz)}. If the site had traffic, check that the latest version is deployed and that the browser console shows no errors for <code>/api/pulse</code>.</>
  } else {
    headline = 'Tracking is working'
    detail = <>Last activity {now && data.lastHitAt ? fmtRelative(data.lastHitAt, now, q.tz) : fmtDateTime(data.lastHitAt, q.tz)}{data.trackingSince ? <> · recording since {fmtDate(data.trackingSince, q.tz)}</> : null}.</>
  }

  return (
    <>
      <div className={`an-set-status an-set-status--${tone}`} role="status">
        <span className="an-set-status-icon" aria-hidden="true">
          <FontAwesomeIcon icon={tone === 'good' ? faCircleCheck : tone === 'warn' ? faTriangleExclamation : faClock} />
        </span>
        <div>
          <div className="an-set-status-title">{headline}</div>
          <div className="an-set-status-text">{detail}</div>
        </div>
      </div>
      <KpiStrip ariaLabel="Last 24 hours" className="an-pp-kpis">
        <StatTile label="Visitors · 24 h" value={fmtNumber(data.last24h.visitors)} info="Unique browsers with a visit that started in the last 24 hours (site-wide, no filters)." />
        <StatTile label="Visits · 24 h" value={fmtNumber(data.last24h.sessions)} info="Visits that started in the last 24 hours." />
        <StatTile label="Pageviews · 24 h" value={fmtNumber(data.last24h.pageviews)} info="Pages viewed in the last 24 hours." />
        <StatTile label="Events · 24 h" value={fmtNumber(data.last24h.events)} info="Clicks, searches, signups and every other recorded action in the last 24 hours." />
      </KpiStrip>
    </>
  )
}

/* ── Exclude this browser ────────────────────────────────────────────── */

function ExcludePanel() {
  const [, bump] = useState(0)
  const excluded = useSyncExternalStore(subscribeStorage, readIgnored, () => false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ tone: 'good' | 'bad'; text: string } | null>(null)

  const toggle = async () => {
    const next = !excluded
    setBusy(true)
    setMsg(null)
    try {
      // Cookie (server side, HttpOnly) stops the collector; localStorage stops the tracker from even sending.
      await postAnalytics('exclude', { exclude: next })
      try {
        if (next) window.localStorage.setItem(AN_LS_IGNORE, '1')
        else window.localStorage.removeItem(AN_LS_IGNORE)
      } catch { /* storage blocked: the cookie alone still excludes */ }
      setMsg({ tone: 'good', text: next ? 'This browser is now excluded. Its visits will not be counted, even when signed out.' : 'This browser is counted again when signed out of the admin.' })
    } catch (err) {
      setMsg({ tone: 'bad', text: err instanceof Error ? err.message : 'Could not save. Retry.' })
    } finally {
      setBusy(false)
      bump(v => v + 1)
    }
  }

  return (
    <Panel
      title="Exclude this browser"
      info={<InfoTip title="Exclude this browser" text="Keeps your own visits out of the numbers. While you are signed in to this admin your visits are already ignored; this also covers the times you browse the site signed out. It applies to this browser only - repeat it on your phone and other computers." />}
    >
      <div className="an-set-switchrow">
        <button
          type="button"
          role="switch"
          aria-checked={excluded}
          className={'an-switch' + (excluded ? ' an-switch--on' : '')}
          onClick={toggle}
          disabled={busy}
        >
          <span className="an-switch-knob" aria-hidden="true" />
          <span className="an-sr">Exclude this browser from analytics</span>
        </button>
        <div>
          <div className="an-set-switch-title">
            {busy ? <><FontAwesomeIcon icon={faSpinner} spin aria-hidden="true" /> Saving…</> : excluded ? 'Excluded - this browser is not counted' : 'Counted when signed out'}
          </div>
          <div className="an-set-switch-text">
            <FontAwesomeIcon icon={faEyeSlash} aria-hidden="true" /> Signed-in admins are always excluded.
          </div>
        </div>
      </div>
      {msg && <p className={`an-set-msg an-set-msg--${msg.tone}`} role="status">{msg.text}</p>}
    </Panel>
  )
}

/* ── Timezone ────────────────────────────────────────────────────────── */

function allTimeZones(): string[] {
  try {
    if (typeof Intl.supportedValuesOf === 'function') return Intl.supportedValuesOf('timeZone')
  } catch { /* old browser */ }
  return ['UTC', 'Europe/London', 'Europe/Berlin', 'Asia/Dubai', 'Asia/Kolkata', 'Asia/Singapore', 'Australia/Sydney', 'America/New_York', 'America/Chicago', 'America/Los_Angeles']
}

function TimezonePanel() {
  const [, bump] = useState(0)
  const tz = useViewerTimeZone()
  const browser = useSyncExternalStore(noSubscribe, browserTimeZone, () => 'UTC')
  const override = useSyncExternalStore(subscribeStorage, getTimeZoneOverride, () => null)
  const zones = useSyncExternalStore(noSubscribe, allTimeZonesCached, () => EMPTY)
  const now = useNow()
  const list = override && !zones.includes(override) ? [override, ...zones] : zones

  return (
    <Panel
      title="Timezone"
      info={<InfoTip title="Timezone" text="Days start and end at midnight in this timezone, and every time in Analytics is shown in it. It is saved in this browser only." />}
    >
      <label className="an-set-field">
        <span className="an-set-field-label">Show analytics in</span>
        <select
          className="an-select"
          value={override ?? ''}
          onChange={e => { setAnalyticsTimeZone(e.target.value || null); bump(v => v + 1) }}
        >
          <option value="">This browser&apos;s timezone ({browser})</option>
          {list.map(z => <option key={z} value={z}>{z.replace(/_/g, ' ')}</option>)}
        </select>
      </label>
      <p className="an-set-note">
        <FontAwesomeIcon icon={faClock} aria-hidden="true" /> Now using <b>{tz}</b>
        {now ? <> · it is {new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(now)} there</> : null}.
      </p>
    </Panel>
  )
}

const EMPTY: string[] = []
let zonesCache: string[] | null = null
function allTimeZonesCached(): string[] {
  zonesCache ??= allTimeZones()
  return zonesCache
}

/* ── What was filtered out ───────────────────────────────────────────── */

function FilteredPanel({ data }: { data: HealthReport }) {
  const total = data.filtered7d.reduce((a, r) => a + r.hits, 0)
  return (
    <Panel
      title="Filtered out (last 7 days)"
      info={<InfoTip title="Filtered hits" text="Tracking hits that were dropped on purpose and never reached the numbers, by reason. A hit is one page view, click or engagement update." />}
      subtitle={total ? `${fmtNumber(total)} hits ignored` : undefined}
    >
      <BarList
        rows={data.filtered7d.map(r => {
          const meta = FILTER_REASONS[r.reason]
          return {
            key: r.reason,
            label: meta?.label ?? r.reason.replace(/_/g, ' '),
            text: meta ? `${meta.label}: ${meta.text}` : r.reason,
            sub: meta?.text,
            value: r.hits,
            share: total ? r.hits / total : null,
          }
        })}
        labelHeader="Reason"
        valueHeader="Hits"
        empty={<p className="an-set-note">Nothing was filtered in the last 7 days.</p>}
      />
    </Panel>
  )
}

/* ── Cloudflare location headers ─────────────────────────────────────── */

function GeoRow({ ok, label, yes, no }: { ok: boolean; label: string; yes: string; no: string }) {
  return (
    <div className="an-set-check">
      <FontAwesomeIcon icon={ok ? faCircleCheck : faCircleExclamation} className={ok ? 'an-set-ok' : 'an-set-warn'} aria-hidden="true" />
      <div>
        <b>{label}</b> <Badge tone={ok ? 'good' : 'warn'}>{ok ? 'Received' : 'Missing'}</Badge>
        <div className="an-set-check-text">{ok ? yes : no}</div>
      </div>
    </div>
  )
}

function GeoPanel({ data }: { data: HealthReport }) {
  return (
    <Panel
      title="Visitor locations"
      info={<InfoTip title="Locations" text="Countries and cities come from Cloudflare headers on each request - no IP lookups, no IPs stored. Checked on visits from the last 7 days." />}
    >
      <GeoRow ok={data.geo.countryHeader} label="Country" yes="Cloudflare sends each visitor's country." no="No country seen in the last 7 days. It arrives automatically when the site is served through Cloudflare - check that the domain is proxied (orange cloud)." />
      <GeoRow ok={data.geo.cityHeader} label="City and region" yes="Cities and regions are recorded." no="Cities need one switch in Cloudflare (free plan included):" />
      {!data.geo.cityHeader && (
        <ol className="an-set-steps">
          <li>Cloudflare dashboard → your domain → <b>Rules</b> → <b>Transform Rules</b>.</li>
          <li>Open the <b>Managed Transforms</b> tab.</li>
          <li>Turn on <b>Add visitor location headers</b>.</li>
          <li>New visits get a city within minutes; older visits stay without one.</li>
        </ol>
      )}
    </Panel>
  )
}

/* ── Retention + storage ─────────────────────────────────────────────── */

type TableRow = HealthReport['tables'][number]
const TABLE_INFO: Record<string, string> = {
  an_visitors: 'One row per browser',
  an_sessions: 'One row per visit',
  an_pageviews: 'One row per page viewed',
  an_events: 'Clicks, searches, signups...',
  an_filtered_daily: 'Filtered hits per day',
}

function RetentionPanel({ data }: { data: HealthReport }) {
  const columns: Column<TableRow>[] = [
    { key: 'name', header: 'Table', value: t => t.name, render: t => <span><span className="an-mono">{t.name}</span><span className="an-set-tinfo">{TABLE_INFO[t.name] ?? ''}</span></span> },
    { key: 'rows', header: 'Rows (approx.)', value: t => t.rows, format: 'number', tip: <InfoTip title="Rows" text="MySQL's quick estimate of the number of rows - close, not exact." /> },
    { key: 'size', header: 'Size', value: t => t.sizeMb, render: t => `${t.sizeMb.toFixed(t.sizeMb < 10 ? 2 : 0)} MB`, align: 'right', csv: t => t.sizeMb },
  ]
  return (
    <Panel
      title="Data kept"
      info={<InfoTip title="Retention" text="Old detail is deleted automatically (a few thousand rows at a time, at most every 6 hours) so the database stays small and fast." />}
      flush
    >
      <ul className="an-set-retention">
        <li><FontAwesomeIcon icon={faDatabase} aria-hidden="true" /> Page views and actions: <b>{data.retention.rawDays} days</b></li>
        <li><FontAwesomeIcon icon={faDatabase} aria-hidden="true" /> Visits: <b>{data.retention.sessionDays} days</b> (about {Math.round(data.retention.sessionDays / 365)} years)</li>
        <li><FontAwesomeIcon icon={faDatabase} aria-hidden="true" /> Visitors (first source, totals): <b>kept</b></li>
      </ul>
      <DataTable
        caption="Analytics tables"
        rows={data.tables}
        columns={columns}
        rowKey={t => t.name}
        pageSize={0}
        empty={<p className="an-set-note an-set-pad">No analytics tables found.</p>}
      />
    </Panel>
  )
}

/* ── Privacy ─────────────────────────────────────────────────────────── */

function PrivacyPanel() {
  return (
    <Panel title="Privacy" info={<InfoTip title="Privacy" text="What the tracking stores and what it never stores." />}>
      <ul className="an-set-privacy">
        <li><FontAwesomeIcon icon={faShieldHalved} aria-hidden="true" /> <span><b>No IP addresses</b> are stored anywhere. Rate limiting uses them in memory for a minute, then forgets them.</span></li>
        <li><FontAwesomeIcon icon={faShieldHalved} aria-hidden="true" /> <span>Each browser gets a <b>random anonymous id</b> in a first-party cookie (<code>iww_vid</code>, 1 year). No third-party cookies and no fingerprinting; the data stays in your own database.</span></li>
        <li><FontAwesomeIcon icon={faShieldHalved} aria-hidden="true" /> <span>Referrers are kept <b>without their query string</b>; page addresses keep only a few useful keys (search term, page, filters). Ad click ids are reduced to their type.</span></li>
        <li><FontAwesomeIcon icon={faEarthAmericas} aria-hidden="true" /> <span>Location is the <b>country and city</b> Cloudflare already knows - never a precise position.</span></li>
        <li><FontAwesomeIcon icon={faShieldHalved} aria-hidden="true" /> <span>A visitor is linked to a <b>business account</b> only after they sign up or log in, so a business owner&apos;s journey can be followed from their first visit.</span></li>
      </ul>
    </Panel>
  )
}
