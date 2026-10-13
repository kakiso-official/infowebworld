'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faUser, faUsers } from '@fortawesome/free-solid-svg-icons'
import type { SessionSummary, SessionsReport } from '@/lib/analytics/types'
import { sourceLabel } from '@/lib/analytics/sources'
import '../../../styles/analytics-people.css'
import {
  Badge, BrowserIcon, CountryFlag, DataTable, DeviceIcon, EmptyState, InfoTip, LiveDot, MenuSelect, OsIcon,
  PageHeader, Panel, ReportView, SearchInput, Segmented, Skeleton, SourceIcon,
  countryName, deviceLabel, fmtDateTime, fmtNumber, fmtRange, fmtRelative, sectionFor,
  sessionHref, useAnalyticsQuery, useNow, useReport, visitorHref,
  type Column,
} from '../_ui'
import { ConversionIcons, FLAG_EVENTS, placeText } from '../_ui/people'

/* ════════════════════════════════════════════════════════════════════════
   Analytics - Visitors (route /sessions). Every visit as one row: when,
   who (new / returning, business account), where from, landing -> exit
   page, pages, time engaged, location, device and what they did. Sorted
   and paged on the server; the range and every filter apply. A row opens
   the visit's full timeline; the visitor cell opens the visitor profile.
   URL params: q (landing or exit page contains), sort, dir, offset.
   ════════════════════════════════════════════════════════════════════════ */

const PAGE_SIZE = 50
const SORTS = ['started_at', 'duration', 'pageviews', 'engaged', 'key_events'] as const
type SortKey = (typeof SORTS)[number]

const CONVERTED_OPTIONS = [
  { value: '', label: 'Any visit' },
  { value: 'any', label: 'Did a key action' },
  { value: 'signup', label: 'Signed up' },
  { value: 'listing', label: 'Submitted a listing' },
  { value: 'lead', label: 'Contacted a business' },
  { value: 'outbound', label: 'Visited a business website' },
] as const

export default function SessionsPage() {
  const q = useAnalyticsQuery()
  const sortRaw = q.param('sort')
  const sort: SortKey = SORTS.includes(sortRaw as SortKey) ? (sortRaw as SortKey) : 'started_at'
  const dir: 'asc' | 'desc' = q.param('dir') === 'asc' ? 'asc' : 'desc'
  const offset = Math.max(0, Number.parseInt(q.param('offset') ?? '0', 10) || 0)
  const search = q.param('q') ?? ''

  const r = useReport<SessionsReport>('sessions', { q: search, sort, dir, limit: PAGE_SIZE, offset })
  const range = r.data?.range
  const visitorFilter = q.filters.visitor ?? 'all'

  return (
    <>
      <PageHeader
        title="Visitors"
        subtitle={sectionFor('sessions').subtitle}
        meta={range && <span>{fmtNumber(r.data?.total ?? 0)} visits · {fmtRange(range.from, range.to)}</span>}
      />

      <div className="an-pp-controls" role="group" aria-label="Which visits to list">
        <div className="an-pp-control">
          <Segmented<string>
            ariaLabel="New or returning visitors"
            size="sm"
            items={[{ key: 'all', label: 'Everyone' }, { key: 'new', label: 'New' }, { key: 'returning', label: 'Returning' }]}
            value={visitorFilter}
            onChange={v => q.set({ 'f.visitor': v === 'all' ? null : v })}
          />
        </div>
        <div className="an-pp-control">
          <MenuSelect<string>
            ariaLabel="Only visits that did something"
            value={q.filters.converted ?? ''}
            options={CONVERTED_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
            onChange={v => q.set({ 'f.converted': v || null })}
          />
        </div>
        <label className="an-pp-check">
          <input type="checkbox" checked={q.filters.user === 'linked'} onChange={e => q.set({ 'f.user': e.target.checked ? 'linked' : null })} />
          <span>Business accounts only</span>
          <InfoTip title="Business accounts" text="Only visits by browsers linked to a business account (they signed up or logged in on that browser at some point)." />
        </label>
      </div>

      <Panel
        title="Visits"
        info={<InfoTip title="Visits" text="One row per visit, newest first. A visit ends after 30 minutes without activity. Click a row to replay it page by page." />}
        flush
      >
        <ReportView state={r} skeleton={<Skeleton variant="table" rows={12} />}>
          {data => <VisitsTable data={data} sort={sort} dir={dir} offset={offset} search={search} />}
        </ReportView>
      </Panel>
    </>
  )
}

function VisitsTable({ data, sort, dir, offset, search }: {
  data: SessionsReport
  sort: SortKey
  dir: 'asc' | 'desc'
  offset: number
  search: string
}) {
  const q = useAnalyticsQuery()
  const router = useRouter()
  const now = useNow()

  const columns: Column<SessionSummary>[] = [
    {
      key: 'started_at',
      header: 'Started',
      value: s => s.startedAt,
      sortable: true,
      firstDir: 'desc',
      sticky: true,
      render: s => (
        <span className="an-sv-when">
          <span className="an-sv-date">{fmtDateTime(s.startedAt, q.tz)}</span>
          <span className="an-sv-rel">
            {s.isLive ? <LiveDot label="Live now" /> : now ? fmtRelative(s.startedAt, now, q.tz) : ''}
          </span>
        </span>
      ),
      csv: s => s.startedAt,
    },
    {
      key: 'visitor',
      header: 'Visitor',
      sortable: false,
      tip: <InfoTip title="Visitor" text="New = this was the browser's first visit. Returning = it had visited before. An email means the browser is linked to a business account. Click to open the visitor's profile." />,
      render: s => (
        <Link
          href={q.href(visitorHref(s.visitorId))}
          className="an-sv-visitor"
          onClick={e => e.stopPropagation()}
          title="Open the visitor profile"
        >
          {s.userEmail ? (
            <span className="an-sv-email"><FontAwesomeIcon icon={faUser} aria-hidden="true" /> {s.userEmail}</span>
          ) : (
            <span className="an-sv-anon">Visitor #{s.visitorId}</span>
          )}
          <Badge tone={s.isNew ? 'info' : 'neutral'}>{s.isNew ? 'New' : 'Returning'}</Badge>
        </Link>
      ),
      csv: s => s.userEmail ?? `visitor ${s.visitorId}${s.isNew ? ' (new)' : ''}`,
    },
    {
      key: 'source',
      header: 'Source',
      sortable: false,
      tip: <InfoTip title="Source" text="Where the visit came from. Click to show only visits from this source." />,
      render: s => (
        <button type="button" className="an-sv-src" onClick={e => { e.stopPropagation(); q.setFilter('source', s.source) }} title="Show only visits from this source">
          <SourceIcon source={s.source} channel={s.channel} titled={false} />
          <span>{sourceLabel(s.source)}</span>
          {s.campaign && <span className="an-muted an-sv-camp">· {s.campaign}</span>}
        </button>
      ),
      csv: s => sourceLabel(s.source),
    },
    {
      key: 'journey',
      header: 'Landing → exit page',
      sortable: false,
      tip: <InfoTip title="Landing and exit page" text="The first and the last page of the visit." />,
      render: s => (
        <span className="an-sv-journey" title={s.entryPath === s.exitPath ? s.entryPath : `${s.entryPath} → ${s.exitPath}`}>
          <span className="an-mono">{s.entryPath}</span>
          {s.exitPath !== s.entryPath && (
            <>
              <FontAwesomeIcon icon={faArrowRight} className="an-sv-arrow" aria-hidden="true" />
              <span className="an-sr"> to </span>
              <span className="an-mono">{s.exitPath}</span>
            </>
          )}
        </span>
      ),
      csv: s => `${s.entryPath} -> ${s.exitPath}`,
      minWidth: 220,
    },
    {
      key: 'pageviews',
      header: 'Pages',
      value: s => s.pageviews,
      format: 'number',
      sortable: true,
      tip: <InfoTip metric="pageviews" title="Pages" text="Pages viewed in this visit." />,
    },
    {
      key: 'engaged',
      header: 'Engaged',
      value: s => s.engagedMs,
      format: 'duration',
      sortable: true,
      tip: <InfoTip title="Time engaged" text="Active time in this visit - only while the tab was visible and in use." />,
    },
    {
      key: 'duration',
      header: 'Length',
      value: s => s.durationMs,
      format: 'duration',
      sortable: true,
      tip: <InfoTip metric="avgDurationMs" title="Visit length" text="Clock time from the first to the last activity of the visit (includes idle time)." />,
    },
    {
      key: 'where',
      header: 'Location',
      sortable: false,
      render: s => (
        <button type="button" className="an-sv-where" onClick={e => { e.stopPropagation(); if (s.country) q.setFilter('country', s.country) }} title={s.country ? `Show only visits from ${countryName(s.country)}` : 'Unknown country'}>
          <CountryFlag code={s.country} decorative />
          <span>{s.city ?? countryName(s.country)}</span>
        </button>
      ),
      csv: s => placeText(s.city, s.region, s.country),
    },
    {
      key: 'device',
      header: 'Device',
      sortable: false,
      render: s => (
        <span className="an-sv-device" title={`${deviceLabel(s.deviceType)} · ${s.browser ?? 'Unknown browser'} · ${s.os ?? 'Unknown OS'}`}>
          <DeviceIcon device={s.deviceType} titled={false} />
          <BrowserIcon browser={s.browser} titled={false} />
          <OsIcon os={s.os} titled={false} />
          <span className="an-sr">{deviceLabel(s.deviceType)}, {s.browser ?? 'unknown browser'}, {s.os ?? 'unknown OS'}</span>
        </span>
      ),
      csv: s => [deviceLabel(s.deviceType), s.browser, s.os].filter(Boolean).join(' / '),
    },
    {
      key: 'key_events',
      header: 'Did',
      value: s => s.keyEvents,
      sortable: true,
      align: 'left',
      tip: <InfoTip title="What the visit did" text="Icons for the key actions in this visit: signed up, submitted a listing, contacted a business, visited a business website. Sort to bring converting visits to the top." />,
      render: s => <ConversionIcons flags={s.flags} keyEvents={s.keyEvents} compact />,
      csv: s => FLAG_EVENTS.filter(f => s.flags[f.flag]).map(f => f.label).join('; '),
    },
  ]

  const empty = (
    <EmptyState
      icon={faUsers}
      title={search ? `No visits with a landing or exit page containing "${search}"` : 'No visits in this period'}
      text={q.filterList.length || search
        ? 'Try another search, a longer date range, or clear the filters.'
        : 'Each visit to the site shows up here within seconds. Your own visits are not recorded while you are signed in to this admin.'}
      action={q.filterList.length ? <button type="button" className="an-btn an-btn--sm" onClick={q.clearFilters}>Clear filters</button> : undefined}
    />
  )

  return (
    <DataTable
      caption="Visits"
      rows={data.rows}
      columns={columns}
      rowKey={s => String(s.id)}
      onRowClick={s => router.push(q.href(sessionHref(s.id)))}
      sort={{ key: sort, dir }}
      onSortChange={(key, d) => q.set({ sort: key === 'started_at' ? null : key, dir: d === 'desc' ? null : d, offset: null })}
      server={{ total: data.total, offset, limit: PAGE_SIZE, onPageChange: o => q.set({ offset: o || null }) }}
      csvName="visits"
      toolbar={(
        <SearchInput
          value={search}
          onChange={v => q.set({ q: v || null, offset: null }, { replace: true })}
          placeholder="Landing or exit page contains…"
          ariaLabel="Search visits by landing or exit page"
        />
      )}
      empty={empty}
      maxHeight={720}
    />
  )
}

