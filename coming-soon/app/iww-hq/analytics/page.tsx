'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { faBullhorn, faChartLine, faEarthAmericas, faHandPointer, faRobot } from '@fortawesome/free-solid-svg-icons'
import {
  METRICS,
  type Bucket, type KpiSet, type OverviewReport, type RealtimeReport, type SeriesPoint,
} from '@/lib/analytics/types'
import {
  BarList, Delta, DimensionList, EmptyState, EventIcon, InfoTip, InsightList, KpiCard, KpiStrip, LiveDot,
  LiveFeed, PageHeader, PageList, Panel, PanelGrid, ReportView, Skeleton, Tabs, TimeSeriesChart,
  eventHref, fmtCompact, fmtDate, fmtPercent, fmtRange, sectionFor, todayInTz, useAnalyticsQuery, useReport,
  type MetricKey,
} from './_ui'

/* ════════════════════════════════════════════════════════════════════════
   Analytics - Overview. Leads with the answer (KPI strip + trend), then
   "What stands out", then where visits came from, what they viewed, where
   they are, what they used, what they did, and who is on the site now.
   Every list row filters the whole section; every panel links deeper.
   ════════════════════════════════════════════════════════════════════════ */

type ChartMetric = 'visitors' | 'sessions' | 'pageviews' | 'bounceRate' | 'avgEngagedMs' | 'pagesPerSession' | 'signups'
const CHART_METRICS: ChartMetric[] = ['visitors', 'sessions', 'pageviews', 'bounceRate', 'avgEngagedMs', 'pagesPerSession', 'signups']

/** The 8 headline tiles. Tiles with `chart` switch the main chart; the rest link to their detail. */
const KPIS: { key: keyof KpiSet & MetricKey; chart?: ChartMetric; href?: string }[] = [
  { key: 'visitors', chart: 'visitors' },
  { key: 'sessions', chart: 'sessions' },
  { key: 'pageviews', chart: 'pageviews' },
  { key: 'bounceRate', chart: 'bounceRate' },
  { key: 'avgEngagedMs', chart: 'avgEngagedMs' },
  { key: 'pagesPerSession', chart: 'pagesPerSession' },
  { key: 'signups', chart: 'signups' },
  { key: 'websiteClicks', href: eventHref('website_click') },
]

const BUCKET_WORD: Record<Bucket, string> = { hour: 'Per hour', day: 'Per day', week: 'Per week', month: 'Per month' }

/** A point's value for the chosen metric. Rates/averages of an empty bucket are "no data", not 0. */
function seriesValue(p: SeriesPoint, m: ChartMetric): number | null {
  switch (m) {
    case 'bounceRate': return p.sessions ? p.bounceRate : null
    case 'avgEngagedMs': return p.sessions ? p.avgEngagedMs : null
    case 'pagesPerSession': return p.sessions ? p.pageviews / p.sessions : null
    default: return p[m]
  }
}

export default function OverviewPage() {
  const q = useAnalyticsQuery()
  const r = useReport<OverviewReport>('overview')
  const raw = q.param('metric')
  const metric: ChartMetric = CHART_METRICS.includes(raw as ChartMetric) ? (raw as ChartMetric) : 'visitors'
  const range = r.data?.range

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle={sectionFor('').subtitle}
        meta={range && (
          <>
            <span>{fmtRange(range.from, range.to)}{range.prev ? ` · compared with ${fmtRange(range.prev.from, range.prev.to)}` : ''}</span>
            {r.data?.trackingSince && <span>Tracking since {fmtDate(r.data.trackingSince, q.tz)}</span>}
          </>
        )}
      />
      <ReportView state={r} skeleton={<OverviewSkeleton />}>
        {data => <OverviewBody data={data} metric={metric} />}
      </ReportView>
    </>
  )
}

function OverviewSkeleton() {
  return (
    <>
      <Skeleton variant="kpis" rows={8} />
      <div className="an-ov-top">
        <Skeleton variant="chart" height={340} />
        <Skeleton variant="block" height={340} />
      </div>
      <PanelGrid>
        <Skeleton variant="block" height={360} />
        <Skeleton variant="block" height={360} />
      </PanelGrid>
    </>
  )
}

function OverviewBody({ data, metric }: { data: OverviewReport; metric: ChartMetric }) {
  const q = useAnalyticsQuery()
  const { kpis, series, range } = data
  const periodLabel = range.compare === 'year' ? 'the same period last year' : 'the previous period'
  const prevName = range.compare === 'year' ? 'Same period last year' : 'Previous period'
  const nothing = kpis.sessions.value === 0 && kpis.pageviews.value === 0
  const def = METRICS[metric]

  const select = (m: ChartMetric) => q.set({ metric: m === 'visitors' ? null : m }, { replace: true })

  return (
    <>
      {nothing && (
        <div className="an-ov-banner">
          <EmptyState
            icon={faChartLine}
            title={data.trackingSince ? 'No visits in this period' : 'No visits recorded yet'}
            text={data.trackingSince
              ? `Tracking has been running since ${fmtDate(data.trackingSince, q.tz)}, but nobody visited in the selected dates${q.filterList.length ? ' with these filters' : ''}. Try a longer range${q.filterList.length ? ' or clear the filters' : ''}.`
              : 'Visits are recorded from the moment the new tracking went live. Your own browsing is excluded while you are signed in to this admin - open the site in a private window and watch Realtime to see the first visit arrive.'}
            action={q.filterList.length ? <button type="button" className="an-btn an-btn--sm" onClick={q.clearFilters}>Clear filters</button> : undefined}
          />
        </div>
      )}

      <KpiStrip ariaLabel="Key numbers for the selected period">
        {KPIS.map(k => (
          <KpiCard
            key={k.key}
            metric={k.key}
            value={kpis[k.key]}
            periodLabel={periodLabel}
            selected={k.chart === metric}
            onSelect={k.chart ? () => select(k.chart!) : undefined}
            href={k.href}
            spark={k.chart && series.points.length > 1 ? series.points.map(p => seriesValue(p, k.chart!)) : undefined}
          />
        ))}
      </KpiStrip>

      <div className="an-ov-top">
        <Panel
          title={<span className="an-ov-chart-title">{def.label}</span>}
          info={<InfoTip metric={metric} />}
          subtitle={`${BUCKET_WORD[series.bucket]} · ${fmtRange(range.from, range.to)} · click a number above to chart it`}
        >
          <TimeSeriesChart
            points={series.points.map(p => ({ t: p.t, label: p.label, value: seriesValue(p, metric) }))}
            previous={series.previous ? series.previous.map(p => ({ t: p.t, label: p.label, value: seriesValue(p, metric) })) : null}
            format={def.format}
            better={def.better}
            seriesLabel={def.label}
            previousLabel={prevName}
            partialLast={range.to === todayInTz(range.tz)}
            height={280}
            ariaLabel={`${def.label}, ${BUCKET_WORD[series.bucket].toLowerCase()}, ${fmtRange(range.from, range.to)}`}
          />
        </Panel>
        <Panel
          title="What stands out"
          info={<InfoTip title="What stands out" text="Automatic plain-English findings for the selected dates and filters - big changes, problem pages, new sources. Each one links to the report with the detail." />}
        >
          <InsightList insights={data.insights} />
        </Panel>
      </div>

      <PanelGrid>
        <SourcesPanel data={data} />
        <PagesPanel data={data} />
        <LocationsPanel data={data} />
        <DevicesPanel data={data} />
        <KeyActionsPanel data={data} periodLabel={periodLabel} />
        <RightNowPanel />
      </PanelGrid>
    </>
  )
}

/* ── Panels ─────────────────────────────────────────────────────────────── */

type SourceTab = 'channels' | 'sources' | 'ai' | 'campaigns'

function SourcesPanel({ data }: { data: OverviewReport }) {
  const [tab, setTab] = useState<SourceTab>('channels')
  const viewAll = tab === 'channels' ? 'acquisition' : `acquisition?tab=${tab}`
  return (
    <Panel
      title="Where visitors came from"
      info={<InfoTip title="Traffic sources" text="The channel (search, AI assistants, social...) and the exact source of each visit, counted once per visitor. Click a row to see only those visitors everywhere." />}
      tabs={(
        <Tabs<SourceTab>
          ariaLabel="Source breakdown"
          value={tab}
          onChange={setTab}
          items={[
            { key: 'channels', label: 'Channels' },
            { key: 'sources', label: 'Sources' },
            { key: 'ai', label: 'AI assistants' },
            { key: 'campaigns', label: 'Campaigns' },
          ]}
        />
      )}
      viewAll={{ href: viewAll, label: 'All traffic sources' }}
    >
      {tab === 'channels' && (
        <DimensionList
          dim="channel"
          rows={data.channels}
          limit={8}
          empty={<EmptyState compact icon={faChartLine} title="No visits yet" text="Channels appear as soon as visits are recorded in this period." />}
        />
      )}
      {tab === 'sources' && (
        <DimensionList
          dim="source"
          rows={data.sources}
          limit={8}
          empty={<EmptyState compact icon={faChartLine} title="No visits yet" text="Search engines, websites and apps that sent visitors show up here." />}
        />
      )}
      {tab === 'ai' && (
        <DimensionList
          dim="ai"
          rows={data.aiAssistants}
          limit={8}
          empty={<EmptyState compact icon={faRobot} title="No visits from AI assistants in this period" text="When someone clicks a link to InfoWebWorld inside ChatGPT, Perplexity, Claude, Gemini or Copilot, the visit shows up here." />}
        />
      )}
      {tab === 'campaigns' && (
        <DimensionList
          dim="campaign"
          rows={data.campaigns}
          limit={8}
          empty={<EmptyState compact icon={faBullhorn} title="No campaign links used" text="Add utm_source, utm_medium and utm_campaign to links you share in emails, ads or posts and each campaign is listed here." />}
        />
      )}
    </Panel>
  )
}

type PagesTab = 'top' | 'entry' | 'exit'

function PagesPanel({ data }: { data: OverviewReport }) {
  const [tab, setTab] = useState<PagesTab>('top')
  const info = tab === 'top'
    ? 'The most viewed pages. Click a page to see only visits that viewed it; the chart icon opens its details.'
    : tab === 'entry'
      ? 'Landing pages - the first page of a visit. Usually the pages that rank in search or get shared.'
      : 'Exit pages - the last page of a visit, where people left the site.'
  return (
    <Panel
      title="Pages"
      info={<InfoTip title={tab === 'top' ? 'Top pages' : tab === 'entry' ? 'Landing pages' : 'Exit pages'} text={info} />}
      tabs={(
        <Tabs<PagesTab>
          ariaLabel="Page breakdown"
          value={tab}
          onChange={setTab}
          items={[
            { key: 'top', label: 'Top pages' },
            { key: 'entry', label: 'Landing' },
            { key: 'exit', label: 'Exit' },
          ]}
        />
      )}
      viewAll={{ href: tab === 'top' ? 'pages' : `pages?group=${tab}`, label: 'All pages' }}
    >
      {tab === 'top' && <PageList rows={data.topPages} metric="views" filterKey="page" limit={8} />}
      {tab === 'entry' && <PageList rows={data.entryPages} metric="entries" filterKey="entry" limit={8} />}
      {tab === 'exit' && <PageList rows={data.exitPages} metric="exits" filterKey="exit" limit={8} />}
    </Panel>
  )
}

type LocTab = 'countries' | 'cities'

function LocationsPanel({ data }: { data: OverviewReport }) {
  const [tab, setTab] = useState<LocTab>('countries')
  return (
    <Panel
      title="Locations"
      info={<InfoTip title="Locations" text="Country and city of each visitor, from Cloudflare (no IP addresses are stored). Cities need Cloudflare's visitor location headers - see Settings." />}
      tabs={(
        <Tabs<LocTab>
          ariaLabel="Location breakdown"
          value={tab}
          onChange={setTab}
          items={[{ key: 'countries', label: 'Countries' }, { key: 'cities', label: 'Cities' }]}
        />
      )}
      viewAll={{ href: 'audience', label: 'Full audience' }}
    >
      {tab === 'countries' && <DimensionList dim="country" rows={data.countries} limit={8} />}
      {tab === 'cities' && (
        <DimensionList
          dim="city"
          rows={data.cities}
          limit={8}
          empty={<EmptyState compact icon={faEarthAmericas} title="No city data" text="Cities appear once Cloudflare's 'Add visitor location headers' transform is turned on (Settings explains how)." />}
        />
      )}
    </Panel>
  )
}

type DevTab = 'devices' | 'browsers' | 'os'

function DevicesPanel({ data }: { data: OverviewReport }) {
  const [tab, setTab] = useState<DevTab>('devices')
  return (
    <Panel
      title="Devices"
      info={<InfoTip title="Devices" text="Device type, browser and operating system of each visitor - read from the browser, never from fingerprinting." />}
      tabs={(
        <Tabs<DevTab>
          ariaLabel="Device breakdown"
          value={tab}
          onChange={setTab}
          items={[{ key: 'devices', label: 'Device' }, { key: 'browsers', label: 'Browser' }, { key: 'os', label: 'OS' }]}
        />
      )}
      viewAll={{ href: 'audience', label: 'Full audience' }}
    >
      {tab === 'devices' && <DimensionList dim="device" rows={data.devices} limit={8} />}
      {tab === 'browsers' && <DimensionList dim="browser" rows={data.browsers} limit={8} />}
      {tab === 'os' && <DimensionList dim="os" rows={data.os} limit={8} />}
    </Panel>
  )
}

function KeyActionsPanel({ data, periodLabel }: { data: OverviewReport; periodLabel: string }) {
  const q = useAnalyticsQuery()
  const router = useRouter()
  const conv = data.kpis.conversionRate
  const rows = data.keyEvents
    .filter(e => e.count > 0 || (e.previousCount ?? 0) > 0)
    .map(e => ({
      key: e.name,
      label: e.label,
      icon: <EventIcon name={e.name} />,
      value: e.count,
      secondary: <Delta value={e.count} previous={e.previousCount} variant="text" periodLabel={periodLabel} />,
    }))
  return (
    <Panel
      title="Key actions"
      info={<InfoTip metric="keyEvents" />}
      subtitle={(
        <span>
          {fmtPercent(conv.value)} of visits did at least one
          {' '}<Delta value={conv.value} previous={conv.previous} format="percent" variant="text" periodLabel={periodLabel} />
        </span>
      )}
      viewAll={{ href: 'events', label: 'All events' }}
      className="an-ov-keys"
    >
      <BarList
        rows={rows}
        labelHeader="Action"
        valueHeader="Count"
        secondaryHeader="Change"
        showShare={false}
        onRowClick={row => router.push(q.href(eventHref(row.key)))}
        clickHint="Open this event"
        empty={<EmptyState compact icon={faHandPointer} title="No key actions in this period" text="Signups, listings submitted, inquiries, and clicks through to business websites, emails and phones appear here." />}
      />
    </Panel>
  )
}

function RightNowPanel() {
  // Same request as the live pill in the control bar (site-wide, shared cache).
  const rt = useReport<RealtimeReport>('realtime', undefined, { ignoreRange: true, ignoreFilters: true, poll: 30_000 })
  return (
    <Panel
      title="Right now"
      info={<InfoTip title="Right now" text="Visitors with any activity in the last 5 minutes, across the whole site (date range and filters don't apply). Refreshes every 30 seconds." />}
      viewAll={{ href: 'realtime', label: 'Open Realtime' }}
    >
      <ReportView state={rt} compact skeleton={<Skeleton variant="list" rows={6} />}>
        {d => (
          <>
            <div className="an-ov-now">
              <span className="an-ov-now-num">{fmtCompact(d.activeNow)}</span>
              <LiveDot label={<span className="an-ov-now-label">{d.activeNow === 1 ? 'visitor online now' : 'visitors online now'}</span>} />
            </div>
            <LiveFeed items={d.feed} limit={6} compact />
          </>
        )}
      </ReportView>
    </Panel>
  )
}
