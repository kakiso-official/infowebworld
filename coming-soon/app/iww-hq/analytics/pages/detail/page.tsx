'use client'
import { useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowUpRightFromSquare, faFileLines, faFilter, faGaugeHigh, faHandPointer, faRoute, faScroll,
} from '@fortawesome/free-solid-svg-icons'
import type { PageDetailReport } from '@/lib/analytics/types'
import '../../../../styles/analytics-insights.css'
import {
  BarChart, BarList, Delta, DimensionList, EmptyState, EventIcon, InfoTip, KpiCard, KpiStrip, PageHeader,
  PageTypeBadge, Panel, PanelGrid, ReportView, Segmented, Skeleton, TimeSeriesChart, eventHref, fmtDuration, fmtNumber,
  fmtPercent, fmtRange, livePageHref, todayInTz, useAnalyticsQuery, useReport, type BarListRow,
} from '../../_ui'
import {
  ALL_VITALS, CORE_VITALS, CameFromWentNext, FactTile, VitalCard, comparisonLabel, isHttpUrl,
} from '../../_ui/insights'

/* ════════════════════════════════════════════════════════════════════════
   Analytics - Page details (?path=/x). Everything about one page: how
   often it was viewed and by whom, where those views came from and where
   people went next, how far they scrolled, which devices and countries,
   how fast it loads, and what people clicked on it.
   ════════════════════════════════════════════════════════════════════════ */

export default function PageDetailPage() {
  const q = useAnalyticsQuery()
  const path = q.param('path')
  const r = useReport<PageDetailReport>('page', { path }, { enabled: !!path })

  if (!path) {
    return (
      <>
        <PageHeader title="Page details" subtitle="Everything about one page." back={{ href: 'pages', label: 'Pages' }} />
        <EmptyState
          icon={faFileLines}
          title="No page chosen"
          text="Open a page from the Pages report (or any list of pages) to see where its visitors came from, where they went next, how far they scrolled and how fast it loads."
          action={<Link href={q.href('pages')} className="an-btn an-btn--sm">Go to Pages</Link>}
        />
      </>
    )
  }

  const d = r.data
  return (
    <>
      <PageHeader
        back={{ href: 'pages', label: 'Pages' }}
        title={<span className="an-ix-detail-title">{d?.title || path}</span>}
        subtitle={(
          <span className="an-ix-detail-sub">
            <span className="an-mono">{path}</span>
            {d && <PageTypeBadge pageType={d.pageType} />}
          </span>
        )}
        meta={d && <span>{fmtRange(d.range.from, d.range.to)}{d.range.prev ? ` · compared with ${fmtRange(d.range.prev.from, d.range.prev.to)}` : ''}</span>}
        actions={(
          <>
            <a href={livePageHref(path)} target="_blank" rel="noopener noreferrer" className="an-btn an-btn--sm">
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" /> Open live page
            </a>
            <Link href={q.href('journeys', { mode: 'from', anchor: path, group: 'path' })} className="an-btn an-btn--sm" title="See the paths visitors take after this page">
              <FontAwesomeIcon icon={faRoute} aria-hidden="true" /> Journeys from here
            </Link>
            <button type="button" className="an-btn an-btn--sm" onClick={() => q.setFilter('page', path)} title="Show every analytics report for visits that viewed this page">
              <FontAwesomeIcon icon={faFilter} aria-hidden="true" /> Filter by this page
            </button>
          </>
        )}
      />
      <ReportView state={r} skeleton={<DetailSkeleton />}>
        {data => <DetailBody data={data} />}
      </ReportView>
    </>
  )
}

function DetailSkeleton() {
  return (
    <>
      <Skeleton variant="kpis" rows={8} />
      <Skeleton variant="chart" height={260} />
      <Skeleton variant="block" height={320} />
    </>
  )
}

function DetailBody({ data }: { data: PageDetailReport }) {
  const k = data.kpis
  const periodLabel = comparisonLabel(data.range)
  const nothing = k.views.value === 0

  return (
    <>
      {nothing && (
        <div className="an-ix-banner">
          <EmptyState
            icon={faFileLines}
            title="Nobody viewed this page in this period"
            text="Try a longer date range. If the page is new or was renamed, its views are recorded from its first visit at this exact address."
          />
        </div>
      )}

      <KpiStrip ariaLabel="This page in numbers">
        <KpiCard metric="views" value={k.views} periodLabel={periodLabel} full />
        <KpiCard metric="visitors" value={k.visitors} periodLabel={periodLabel} full />
        <KpiCard metric="entries" value={k.entries} periodLabel={periodLabel} full />
        <FactTile
          label="Bounce rate"
          tip={{ metric: 'bounceRate', text: 'Of the visits that started on this page: the share that left quickly (one page, under 10 seconds of active time, no key action).' }}
          value={k.entries.value ? fmtPercent(k.bounceRate.value) : '–'}
          sub={k.entries.value ? undefined : 'nobody landed here'}
          delta={k.entries.value ? { value: k.bounceRate.value, previous: k.bounceRate.previous, format: 'percent', better: 'down', periodLabel } : undefined}
        />
        <KpiCard metric="exits" value={k.exits} periodLabel={periodLabel} full />
        <KpiCard metric="exitRate" value={k.exitRate} periodLabel={periodLabel} />
        <FactTile
          label="Avg. time on page"
          tip={{ text: 'Average active time per view of this page - only while the tab was visible and in use.' }}
          value={fmtDuration(k.avgEngagedMs.value)}
          delta={{ value: k.avgEngagedMs.value, previous: k.avgEngagedMs.previous, format: 'duration', periodLabel }}
        />
        <KpiCard
          metric="avgScrollPct"
          value={{ value: k.avgScrollPct.value / 100, previous: k.avgScrollPct.previous == null ? null : k.avgScrollPct.previous / 100 }}
          periodLabel={periodLabel}
        />
      </KpiStrip>

      <ViewsPanel data={data} />

      <Panel
        title="How visitors move through this page"
        info={<InfoTip title="Came from → went next" text="Left: what visitors saw just before this page. Right: what they opened next. Click any page to open its own details and follow the journey further." />}
        subtitle="Click a page to follow the journey"
      >
        <CameFromWentNext data={data} />
      </Panel>

      <PanelGrid>
        <Panel
          title="How they found this page"
          info={<InfoTip title="Entry sources" text="For visits that started on this page: the source that brought them (search engine, AI assistant, website...). Click a source to filter the whole section by it." />}
        >
          <DimensionList
            dim="source"
            rows={data.entrySources}
            metric="sessions"
            valueHeader="Visits"
            limit={10}
            empty={<EmptyState compact icon={faFileLines} title="No visit started here" text="When people land on this page from search, AI assistants, other sites or campaigns, those sources are listed here." />}
          />
        </Panel>
        <ScrollPanel data={data} />
        <Panel
          title="Countries"
          info={<InfoTip title="Countries" text="Where the views of this page came from (Cloudflare country, no IP addresses stored). Click to filter." />}
        >
          <DimensionList dim="country" rows={data.countries} metric="pageviews" valueHeader="Views" limit={10} />
        </Panel>
        <Panel
          title="Devices"
          info={<InfoTip title="Devices" text="Desktop, mobile and tablet split of this page's views. Click to filter." />}
        >
          <DimensionList dim="device" rows={data.devices} metric="pageviews" valueHeader="Views" />
        </Panel>
      </PanelGrid>

      <SpeedPanel data={data} />

      <PanelGrid>
        <EventsOnPage data={data} periodLabel={periodLabel} />
        <OutboundPanel data={data} />
      </PanelGrid>
    </>
  )
}

/* ── Views over time ────────────────────────────────────────────────────── */

type SeriesKey = 'views' | 'visitors'
const BUCKET_WORD = { hour: 'Per hour', day: 'Per day', week: 'Per week', month: 'Per month' } as const

function ViewsPanel({ data }: { data: PageDetailReport }) {
  const [metric, setMetric] = useState<SeriesKey>('views')
  const { series, range } = data
  const label = metric === 'views' ? 'Views' : 'Visitors'
  return (
    <Panel
      title={`${label} over time`}
      info={<InfoTip metric={metric} />}
      subtitle={`${BUCKET_WORD[series.bucket]} · ${fmtRange(range.from, range.to)}`}
      tabs={(
        <Segmented<SeriesKey>
          size="sm"
          ariaLabel="Chart metric"
          value={metric}
          onChange={setMetric}
          items={[{ key: 'views', label: 'Views' }, { key: 'visitors', label: 'Visitors' }]}
        />
      )}
    >
      <TimeSeriesChart
        points={series.points.map(p => ({ t: p.t, label: p.label, value: p[metric] }))}
        seriesLabel={label}
        partialLast={range.to === todayInTz(range.tz)}
        height={240}
        ariaLabel={`${label} of this page, ${BUCKET_WORD[series.bucket].toLowerCase()}`}
      />
    </Panel>
  )
}

/* ── Scroll depth ───────────────────────────────────────────────────────── */

function ScrollPanel({ data }: { data: PageDetailReport }) {
  const total = data.scroll.reduce((s, b) => s + b.views, 0)
  const pastHalf = data.scroll.filter(b => b.bucket === '50-75%' || b.bucket === '75-100%').reduce((s, b) => s + b.views, 0)
  const bottom = data.scroll.find(b => b.bucket === '75-100%')?.views ?? 0
  return (
    <Panel
      title="How far people scroll"
      info={<InfoTip title="Scroll depth" text="The deepest point each view reached, as a share of the page's height. A page that fits on one screen counts as 75-100%." />}
      subtitle={total ? `${fmtPercent(pastHalf / total, 0)} of views got past halfway · ${fmtPercent(bottom / total, 0)} reached the last quarter` : undefined}
    >
      {total ? (
        <BarChart
          bars={data.scroll.map(b => ({
            key: b.bucket,
            label: b.bucket,
            value: b.views,
            tooltipLabel: `Scrolled ${b.bucket} of the page`,
            detail: `${fmtPercent(b.views / total, 0)} of views`,
          }))}
          valueLabel="Views"
          height={200}
          ariaLabel="Views by how far down the page visitors scrolled"
        />
      ) : (
        <EmptyState compact icon={faScroll} title="No scroll data yet" text="Scroll depth is measured on every view - it appears once this page is viewed in the selected period." />
      )}
    </Panel>
  )
}

/* ── Speed ──────────────────────────────────────────────────────────────── */

function SpeedPanel({ data }: { data: PageDetailReport }) {
  const v = data.vitals
  return (
    <Panel
      title="How fast this page is"
      info={<InfoTip title="Web Vitals" text="Real visitors' loading speed, responsiveness and layout stability on this page (75th percentile - 3 of 4 page loads were at least this good). Measured on full page loads only." />}
      viewAll={{ href: 'performance', label: 'Site-wide performance' }}
    >
      {v && v.samples > 0 ? (
        <div className="an-ix-vitals an-ix-vitals--compact">
          {ALL_VITALS.map(key => (
            <VitalCard key={key} vital={key} stat={v[key]} core={CORE_VITALS.includes(key)} compact />
          ))}
        </div>
      ) : (
        <EmptyState
          compact
          icon={faGaugeHigh}
          title="No speed measurements for this page yet"
          text="Speed is measured when this page is the first page of a visit (a full page load). It appears here once that happens in the selected period."
        />
      )}
    </Panel>
  )
}

/* ── Events + outbound links ────────────────────────────────────────────── */

function EventsOnPage({ data, periodLabel }: { data: PageDetailReport; periodLabel: string }) {
  const rows: BarListRow[] = data.events
    .filter(e => e.count > 0 || (e.previousCount ?? 0) > 0)
    .map(e => ({
      key: e.name,
      label: e.label,
      icon: <EventIcon name={e.name} />,
      sub: e.isKey ? 'key action' : undefined,
      value: e.count,
      secondary: <Delta value={e.count} previous={e.previousCount} variant="text" periodLabel={periodLabel} />,
      href: eventHref(e.name),
      clickable: false,
    }))
  return (
    <Panel
      title="What people did here"
      info={<InfoTip title="Events on this page" text="Clicks, searches, signups and other actions that happened while visitors were on this page. Use the chart icon to open an event's own report." />}
      viewAll={{ href: 'events', label: 'All events' }}
    >
      <BarList
        rows={rows}
        labelHeader="Action"
        valueHeader="Count"
        secondaryHeader="Change"
        showShare={false}
        empty={<EmptyState compact icon={faHandPointer} title="No actions on this page" text="Website visits, email and phone clicks, searches, signups and other actions taken on this page appear here." />}
      />
    </Panel>
  )
}

function OutboundPanel({ data }: { data: PageDetailReport }) {
  const rows: BarListRow[] = data.outboundTargets.map(r => {
    const count = typeof r.extra?.count === 'number' ? r.extra.count : r.sessions
    const website = typeof r.extra?.websiteClicks === 'number' ? r.extra.websiteClicks : 0
    return {
      key: r.key,
      label: <span className="an-ix-target">{r.label}</span>,
      text: r.label,
      sub: website > 0 ? (website === count ? 'business website' : `${fmtNumber(website)} as business website`) : undefined,
      icon: <EventIcon name={website > 0 ? 'website_click' : 'outbound_click'} />,
      value: count,
      share: r.share,
      external: isHttpUrl(r.key) ? r.key : undefined,
      clickable: false,
    }
  })
  return (
    <Panel
      title="Links clicked to other sites"
      info={<InfoTip title="Outbound links" text="Where visitors left to from this page: business websites (our listings' 'Visit website' buttons) and any other external link." />}
    >
      <BarList
        rows={rows}
        labelHeader="Link"
        valueHeader="Clicks"
        empty={<EmptyState compact icon={faArrowUpRightFromSquare} title="No external links clicked here" text="Clicks to business websites and other sites from this page are listed here." />}
      />
    </Panel>
  )
}
