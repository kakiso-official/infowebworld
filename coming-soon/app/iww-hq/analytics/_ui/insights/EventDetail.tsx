'use client'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPointer, faXmark } from '@fortawesome/free-solid-svg-icons'
import type { BreakdownRow, EventsReport, EventSummaryRow } from '@/lib/analytics/types'
import {
  BarList, Badge, Delta, EmptyState, EventIcon, InfoTip, Panel, Skeleton, Tabs, TimeSeriesChart, fmtNumber,
  livePageHref, pageDetailHref, type BarListRow,
} from '..'
import { isHttpUrl, plural } from './util'

type DetailTab = 'targets' | 'labels' | 'pages'

/** What the target / label of an event means, in words (the column headers of its detail). */
const TARGET_NAME: Record<string, { target: string; label: string }> = {
  website_click: { target: 'Listing', label: 'Link text' },
  outbound_click: { target: 'Link address', label: 'Link text' },
  email_click: { target: 'Email address', label: 'Link text' },
  phone_click: { target: 'Phone number', label: 'Link text' },
  file_download: { target: 'File', label: 'Link text' },
  search: { target: 'Search term', label: 'Label' },
  share: { target: 'Network', label: 'Label' },
  cta_click: { target: 'Target', label: 'Button text' },
  not_found: { target: 'Missing address', label: 'Came from' },
  js_error: { target: 'Script location', label: 'Error message' },
  listing_submitted: { target: 'Listing', label: 'Label' },
  claim_submitted: { target: 'Listing', label: 'Label' },
  review_submitted: { target: 'Listing', label: 'Label' },
  lead_sent: { target: 'Listing', label: 'Label' },
}

function countOf(r: BreakdownRow): number {
  return typeof r.extra?.count === 'number' ? r.extra.count : r.sessions
}

function rowsOf(list: BreakdownRow[], kind: DetailTab): BarListRow[] {
  return list.map(r => {
    const isPage = kind === 'pages' && r.key.startsWith('/')
    return {
      key: r.key,
      label: isPage || kind === 'targets' ? <span className="an-ix-target">{r.label}</span> : r.label,
      text: r.label,
      sub: `${fmtNumber(r.visitors)} ${plural(r.visitors, 'visitor')}`,
      value: countOf(r),
      share: r.share,
      href: isPage ? pageDetailHref(r.key) : undefined,
      external: isPage ? livePageHref(r.key) : isHttpUrl(r.key) ? r.key : undefined,
      clickable: false,
    }
  })
}

/**
 * One event in depth: its count over time and its top targets (what was
 * clicked / searched / shared), labels (link or button text) and pages
 * (where it happened). Shown next to the events table when a row is chosen.
 */
export function EventDetailPanel({ summary, detail, loading, periodLabel, partialLast, onClose }: {
  summary: EventSummaryRow | null
  detail: EventsReport['detail']
  /** The detail for this name is still loading (show a skeleton, not stale data). */
  loading: boolean
  periodLabel: string
  /** The range ends today, so the last bucket is still filling (drawn dotted). */
  partialLast: boolean
  onClose: () => void
}) {
  const [tab, setTab] = useState<DetailTab>('targets')
  const name = summary?.name ?? detail?.name ?? ''
  const words = TARGET_NAME[name] ?? { target: 'Target', label: 'Label' }
  const title = summary?.label ?? name

  return (
    <Panel
      title={(
        <span className="an-ix-evtitle">
          <EventIcon name={name} />
          {title}
          {summary?.isKey && <Badge tone="accent">Key action</Badge>}
        </span>
      )}
      info={<InfoTip event={name} />}
      subtitle={summary ? (
        <span>
          {fmtNumber(summary.count)} {plural(summary.count, 'time')} by {fmtNumber(summary.visitors)} {plural(summary.visitors, 'visitor')}
          {' '}<Delta value={summary.count} previous={summary.previousCount} variant="text" periodLabel={periodLabel} />
        </span>
      ) : undefined}
      actions={(
        <button type="button" className="an-btn an-btn--sm an-btn--icon an-btn--ghost" onClick={onClose} aria-label="Close event details" title="Close">
          <FontAwesomeIcon icon={faXmark} />
        </button>
      )}
      className="an-ix-evdetail"
    >
      {loading ? (
        <Skeleton variant="chart" height={360} />
      ) : !detail ? (
        <EmptyState compact icon={faHandPointer} title="No details for this event" text="It was not recorded in this period with the current filters. Pick another event or a longer date range." />
      ) : (
        <>
          <TimeSeriesChart
            points={detail.series.map(p => ({ t: p.t, label: p.label, value: p.count }))}
            seriesLabel={title}
            partialLast={partialLast}
            height={180}
            ariaLabel={`${title} over time`}
          />
          <div className="an-ix-evtabs">
            <Tabs<DetailTab>
              ariaLabel="Event breakdown"
              value={tab}
              onChange={setTab}
              items={[
                { key: 'targets', label: words.target },
                { key: 'labels', label: words.label },
                { key: 'pages', label: 'Pages' },
              ]}
            />
          </div>
          <BarList
            rows={rowsOf(detail[tab], tab)}
            labelHeader={tab === 'targets' ? words.target : tab === 'labels' ? words.label : 'Page'}
            valueHeader="Count"
            limit={15}
            empty={(
              <EmptyState
                compact
                icon={faHandPointer}
                title="Nothing recorded"
                text={tab === 'pages' ? 'The pages this event happened on appear here.' : `This event has no ${tab === 'targets' ? words.target.toLowerCase() : words.label.toLowerCase()} values in this period.`}
              />
            )}
          />
        </>
      )}
    </Panel>
  )
}
