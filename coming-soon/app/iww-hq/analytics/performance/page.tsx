'use client'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faCircleCheck, faCircleExclamation, faCircleXmark, faGaugeHigh } from '@fortawesome/free-solid-svg-icons'
import { VITAL_THRESHOLDS, type PerformanceReport, type PageType, type VitalsSummary } from '@/lib/analytics/types'
import '../../../styles/analytics-insights.css'
import {
  DataTable, EmptyState, InfoTip, PageHeader, PageTypeBadge, Panel, PathCell, ReportView, Segmented, Skeleton,
  fmtNumber, fmtPercent, fmtRange, pageDetailHref, sectionFor, useAnalyticsQuery, useReport,
  type Column,
} from '../_ui'
import {
  ALL_VITALS, CORE_VITALS, VitalCard, VitalTrendChart, VitalValue, coreVerdict, fmtVital,
  type VitalKey, type VitalRating,
} from '../_ui/insights'

/* ════════════════════════════════════════════════════════════════════════
   Analytics - Performance. How fast pages load and respond for real
   visitors (Core Web Vitals, measured on full page loads): the site-wide
   verdict Google would give, each vital's 75th percentile and its
   good / needs-work / poor split, the trend against Google's lines, and
   which page types and pages are slowest.
   ════════════════════════════════════════════════════════════════════════ */

type TrendKey = 'lcp' | 'inp' | 'cls'
const TREND_KEYS: TrendKey[] = ['lcp', 'inp', 'cls']

export default function PerformancePage() {
  const r = useReport<PerformanceReport>('performance')
  const range = r.data?.range
  return (
    <>
      <PageHeader
        title="Performance"
        subtitle={sectionFor('performance').subtitle}
        meta={range && (
          <>
            <span>{fmtRange(range.from, range.to)}</span>
            {r.data && r.data.overall.samples > 0 && <span>{fmtNumber(r.data.overall.samples)} measured page loads</span>}
          </>
        )}
      />
      <ReportView state={r} skeleton={<PerformanceSkeleton />}>
        {data => <PerformanceBody data={data} />}
      </ReportView>
    </>
  )
}

function PerformanceSkeleton() {
  return (
    <>
      <Skeleton variant="block" height={96} />
      <Skeleton variant="kpis" rows={5} />
      <Skeleton variant="chart" height={280} />
    </>
  )
}

function PerformanceBody({ data }: { data: PerformanceReport }) {
  if (data.overall.samples === 0) {
    return (
      <EmptyState
        icon={faGaugeHigh}
        title="No speed measurements in this period"
        text="Speed is measured in real visitors' browsers on the first page of each visit (a full page load) - loading time (LCP), responsiveness (INP), layout shifts (CLS), first paint (FCP) and server response (TTFB). Numbers appear here as soon as visits are recorded. Try a longer date range."
      />
    )
  }
  return (
    <>
      <Verdict overall={data.overall} />
      <div className="an-ix-vitals">
        {ALL_VITALS.map(k => (
          <VitalCard key={k} vital={k} stat={data.overall[k]} samples={data.overall.samples} core={CORE_VITALS.includes(k)} />
        ))}
      </div>
      <TrendPanel data={data} />
      <ByTypePanel rows={data.byPageType} />
      <SlowestPanel rows={data.slowestPages} />
    </>
  )
}

/* ── Verdict ────────────────────────────────────────────────────────────── */

const VERDICT: Record<VitalRating, { icon: IconDefinition; title: string }> = {
  good: { icon: faCircleCheck, title: 'Passing Core Web Vitals' },
  ni: { icon: faCircleExclamation, title: 'Core Web Vitals need improvement' },
  poor: { icon: faCircleXmark, title: 'Failing Core Web Vitals' },
}

/**
 * The verdict Google's own tools give: pass when LCP, INP and CLS are all
 * "good" at the 75th percentile. Then the one sentence a non-expert needs:
 * how long 3 of 4 visitors wait for the main content.
 */
function Verdict({ overall }: { overall: VitalsSummary }) {
  const v = coreVerdict(overall)
  if (!v.rating) return null
  const meta = VERDICT[v.rating]
  const lcp = overall.lcp
  const failingNames = v.failing.map(k => VITAL_THRESHOLDS[k].short).join(' and ')
  const missing = CORE_VITALS.filter(k => !v.measured.includes(k)).map(k => VITAL_THRESHOLDS[k].short)
  return (
    <section className={`an-ix-verdict an-ix-verdict--${v.rating}`} aria-label="Core Web Vitals verdict">
      <span className="an-ix-verdict-icon" aria-hidden="true"><FontAwesomeIcon icon={meta.icon} /></span>
      <div className="an-ix-verdict-body">
        <h2 className="an-ix-verdict-title">
          {meta.title}
          <InfoTip title="Core Web Vitals" text="Google's page experience check: a site passes when loading (LCP), responsiveness (INP) and visual stability (CLS) are all 'good' for at least 3 of 4 page loads. It is one of the signals Google uses in search ranking." />
        </h2>
        <p className="an-ix-verdict-text">
          {lcp && <>3 of 4 visitors see the main content within <b>{fmtVital('lcp', lcp.p75)}</b> ({fmtPercent(lcp.good, 0)} of page loads are fast). </>}
          {v.rating === 'good'
            ? 'Loading, responsiveness and layout stability are all in the good range.'
            : `To improve: ${failingNames}${v.failing.length === 1 ? ' is' : ' are'} outside the good range - see the cards below and the slowest pages.`}
          {missing.length > 0 && <> {missing.join(' and ')} not measured yet.</>}
        </p>
      </div>
    </section>
  )
}

/* ── Trend ──────────────────────────────────────────────────────────────── */

function TrendPanel({ data }: { data: PerformanceReport }) {
  const q = useAnalyticsQuery()
  const raw = q.param('vital') as TrendKey | null
  const vital: TrendKey = raw && TREND_KEYS.includes(raw) ? raw : 'lcp'
  const points = data.series.map(p => ({ t: p.t, label: p.label, value: p[vital] }))
  const any = points.some(p => p.value != null)
  return (
    <Panel
      title="Speed over time"
      info={<InfoTip title="Trend" text="The 75th percentile of the chosen vital in each period, against Google's good and poor lines. Below the good line = good. Periods without measured page loads leave a gap." />}
      tabs={(
        <Segmented<TrendKey>
          size="sm"
          ariaLabel="Vital to chart"
          value={vital}
          onChange={v => q.set({ vital: v === 'lcp' ? null : v }, { replace: true })}
          items={TREND_KEYS.map(k => ({ key: k, label: VITAL_THRESHOLDS[k].short }))}
        />
      )}
      subtitle={VITAL_THRESHOLDS[vital].label}
    >
      {any ? (
        <VitalTrendChart vital={vital} points={points} />
      ) : (
        <EmptyState compact icon={faGaugeHigh} title={`No ${VITAL_THRESHOLDS[vital].short} measurements in this period`} text={vital === 'inp' ? 'INP is only recorded when a visitor taps, clicks or types on a page.' : 'Measured on the first page of each visit.'} />
      )}
    </Panel>
  )
}

/* ── Tables ─────────────────────────────────────────────────────────────── */

/** The vital columns shared by both tables. */
function vitalColumns<T extends VitalsSummary>(keys: VitalKey[]): Column<T>[] {
  return keys.map(k => ({
    key: k,
    header: VITAL_THRESHOLDS[k].short,
    tip: <InfoTip vital={k} />,
    align: 'right' as const,
    value: (r: T) => r[k]?.p75 ?? null,
    csv: (r: T) => r[k]?.p75 ?? null,
    csvHeader: `${VITAL_THRESHOLDS[k].short} p75${k === 'cls' ? '' : ' (ms)'}`,
    render: (r: T) => <VitalValue vital={k} stat={r[k]} />,
    firstDir: 'desc' as const,
  }))
}

function ByTypePanel({ rows }: { rows: PerformanceReport['byPageType'] }) {
  const q = useAnalyticsQuery()
  type Row = PerformanceReport['byPageType'][number]
  const columns: Column<Row>[] = [
    {
      key: 'type', header: 'Page type', sticky: true, minWidth: 190,
      value: r => r.label,
      render: r => <span className="an-ix-name"><PageTypeBadge pageType={r.key} /><InfoTip pageType={r.key} /></span>,
    },
    { key: 'samples', header: 'Page loads', tip: <InfoTip title="Page loads" text="Full page loads of this type with at least one measurement." />, value: r => r.samples, format: 'number', bar: true },
    ...vitalColumns<Row>(['lcp', 'inp', 'cls', 'fcp', 'ttfb']),
  ]
  return (
    <Panel
      title="By page type"
      info={<InfoTip title="By page type" text="Each kind of page (category, company profile, blog post...) scored separately - slow templates show up here. Click a row to filter the section by that page type." />}
      flush
    >
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={r => r.key}
        onRowClick={r => q.setFilter('pageType', r.key as PageType)}
        defaultSort={{ key: 'samples', dir: 'desc' }}
        pageSize={20}
        csvName="performance-by-page-type"
        caption="Web Vitals by page type"
        empty={<EmptyState compact icon={faGaugeHigh} title="No measurements yet" text="Each page type's loading speed appears here once its pages are visited." />}
      />
      <p className="an-ix-note an-ix-panel-pad">
        Each value is the 75th percentile (3 of 4 page loads were at least this good). The icon next to it is Google&apos;s rating: good, needs improvement or poor.
      </p>
    </Panel>
  )
}

function SlowestPanel({ rows }: { rows: PerformanceReport['slowestPages'] }) {
  const q = useAnalyticsQuery()
  const router = useRouter()
  type Row = PerformanceReport['slowestPages'][number]
  const columns: Column<Row>[] = [
    {
      key: 'path', header: 'Page', sticky: true, minWidth: 240,
      value: r => r.path,
      render: r => <PathCell path={r.path} title={r.title} />,
    },
    ...vitalColumns<Row>(['lcp']),
    { key: 'samples', header: 'Page loads', tip: <InfoTip title="Page loads" text="Full page loads of this page with at least one measurement. Pages with very few loads can rank here by bad luck." />, value: r => r.samples, format: 'number' },
    ...vitalColumns<Row>(['inp', 'cls', 'fcp', 'ttfb']),
  ]
  return (
    <Panel
      title="Slowest pages"
      info={<InfoTip title="Slowest pages" text="Pages ranked by how long the main content takes to appear (LCP, 75th percentile). Pages with at least 3 measured loads are preferred, so one slow visit doesn't put a page on top. Click a page for its details." />}
      flush
    >
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={r => r.path}
        onRowClick={r => router.push(q.href(pageDetailHref(r.path)))}
        defaultSort={{ key: 'lcp', dir: 'desc' }}
        pageSize={20}
        csvName="slowest-pages"
        caption="Slowest pages by LCP"
        empty={<EmptyState compact icon={faGaugeHigh} title="No page has a loading-time measurement yet" text="Pages are ranked by how long their main content takes to appear, once they have been loaded by visitors." />}
      />
    </Panel>
  )
}
