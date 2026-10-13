'use client'
import { useState } from 'react'
import { faEarthAmericas, faFileLines, faMobileScreenButton, faPause, faPlay, faShareNodes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { RealtimeReport } from '@/lib/analytics/types'
import {
  BarChart, DimensionList, EmptyState, InfoTip, LiveDot, LiveFeed, PageHeader, Panel, PanelGrid, ReportView,
  Skeleton, fmtCompact, fmtNumber, fmtTime, fmtTimeSec, sectionFor, useAnalyticsQuery, useReport,
} from '../_ui'

/* ════════════════════════════════════════════════════════════════════════
   Analytics - Realtime. Who is on the site right now: the active count,
   pageviews per minute for the last 30 minutes, what active visitors are
   looking at, where they came from, and a live activity feed. Refreshes
   every 10 s (pausable); ignores the date range, respects filters.
   ════════════════════════════════════════════════════════════════════════ */

const POLL_MS = 10_000

export default function RealtimePage() {
  const q = useAnalyticsQuery()
  const [paused, setPaused] = useState(false)
  const r = useReport<RealtimeReport>('realtime', undefined, { ignoreRange: true, poll: paused ? 0 : POLL_MS })

  return (
    <>
      <PageHeader
        title="Realtime"
        subtitle={sectionFor('realtime').subtitle}
        meta={r.updatedAt ? (
          <span className={paused ? 'an-rt-paused' : undefined}>
            {paused ? 'Paused' : 'Updates every 10 seconds'} · last update {fmtTimeSec(r.updatedAt, q.tz)}
          </span>
        ) : null}
        actions={(
          <button
            type="button"
            className="an-btn"
            aria-pressed={paused}
            onClick={() => {
              // Resuming fetches straight away rather than waiting for the next tick.
              if (paused) r.reload()
              setPaused(p => !p)
            }}
          >
            <FontAwesomeIcon icon={paused ? faPlay : faPause} aria-hidden="true" />
            {paused ? 'Resume live updates' : 'Pause'}
          </button>
        )}
      />
      <ReportView state={r} skeleton={<RealtimeSkeleton />}>
        {d => <RealtimeBody d={d} />}
      </ReportView>
    </>
  )
}

function RealtimeSkeleton() {
  return (
    <>
      <div className="an-rt-hero">
        <Skeleton variant="block" height={200} />
        <Skeleton variant="chart" height={200} />
      </div>
      <PanelGrid>
        <Skeleton variant="block" height={280} />
        <Skeleton variant="block" height={280} />
      </PanelGrid>
    </>
  )
}

function RealtimeBody({ d }: { d: RealtimeReport }) {
  const q = useAnalyticsQuery()
  const serverMs = Date.parse(d.serverTime)
  const bars = d.perMinute.map((m, i) => {
    const ago = Number.isFinite(serverMs) ? Math.max(0, Math.round((serverMs - Date.parse(m.t)) / 60000)) : d.perMinute.length - 1 - i
    return {
      key: m.t,
      label: fmtTime(m.t, q.tz),
      value: m.pageviews,
      tooltipLabel: `${fmtTime(m.t, q.tz)} · ${ago === 0 ? 'this minute (still counting)' : ago === 1 ? '1 minute ago' : `${ago} minutes ago`}`,
      detail: `${fmtNumber(m.visitors)} ${m.visitors === 1 ? 'visitor' : 'visitors'}`,
    }
  })
  const views30 = d.perMinute.reduce((s, m) => s + m.pageviews, 0)
  const nobody = d.activeNow === 0

  return (
    <>
      <div className="an-rt-hero">
        <section className="an-panel an-rt-now" aria-label="Visitors online now">
          <div className="an-rt-now-num" aria-live="polite">{fmtCompact(d.activeNow)}</div>
          <div className="an-rt-now-label">
            <LiveDot />
            {d.activeNow === 1 ? 'visitor online now' : 'visitors online now'}
            <InfoTip title="Online now" text="Visitors with any activity (a page view, a click, a heartbeat while reading) in the last 5 minutes." />
          </div>
          <div className="an-rt-now-sub">
            <b>{fmtNumber(d.active30m)}</b> in the last 30 minutes · <b>{fmtNumber(views30)}</b> pageviews
          </div>
        </section>
        <Panel
          title="Pageviews per minute"
          info={<InfoTip title="Pageviews per minute" text="Pages viewed in each of the last 30 minutes (your timezone). The last bar is the current minute, still counting." />}
          subtitle="Last 30 minutes"
        >
          <BarChart
            bars={bars}
            valueLabel="Pageviews"
            height={170}
            ariaLabel="Pageviews per minute, last 30 minutes"
          />
        </Panel>
      </div>

      <PanelGrid>
        <Panel
          title="Active pages"
          info={<InfoTip title="Active pages" text="The page each visitor online now is currently on. Click one to filter; the chart icon opens its details." />}
          viewAll={{ href: 'pages', label: 'All pages' }}
        >
          <DimensionList
            dim="page"
            rows={d.pages}
            limit={10}
            valueHeader="Visitors"
            empty={<EmptyState compact icon={faFileLines} title={nobody ? 'Nobody is on the site right now' : 'No page data yet'} text="Pages appear here the moment someone opens one." />}
          />
        </Panel>
        <Panel
          title="Sources"
          info={<InfoTip title="Sources" text="Where the visitors online now came from (the source of their current visit)." />}
          viewAll={{ href: 'acquisition', label: 'All traffic sources' }}
        >
          <DimensionList
            dim="source"
            rows={d.sources}
            limit={10}
            empty={<EmptyState compact icon={faShareNodes} title="No active visits" text="Search engines, AI assistants, social networks and websites sending visitors right now show up here." />}
          />
        </Panel>
        <Panel title="Countries" viewAll={{ href: 'audience', label: 'Full audience' }}>
          <DimensionList
            dim="country"
            rows={d.countries}
            limit={10}
            empty={<EmptyState compact icon={faEarthAmericas} title="No active visits" text="The countries of visitors online now appear here." />}
          />
        </Panel>
        <Panel title="Devices" viewAll={{ href: 'audience', label: 'Full audience' }}>
          <DimensionList
            dim="device"
            rows={d.devices}
            limit={10}
            empty={<EmptyState compact icon={faMobileScreenButton} title="No active visits" text="Desktop, mobile and tablet split of visitors online now." />}
          />
        </Panel>
      </PanelGrid>

      <Panel
        title="Live activity"
        info={<InfoTip title="Live activity" text="The latest page views and actions, newest first (up to 50). Click any line to replay that visit step by step." />}
        subtitle="Newest first · click a line to open that visit"
        viewAll={{ href: 'sessions', label: 'All visits' }}
      >
        <LiveFeed items={d.feed} />
      </Panel>
    </>
  )
}
