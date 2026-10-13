'use client'
import type { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import type { BreakdownRow } from '@/lib/analytics/types'
import {
  DIMENSION_FILTER, DataTable, Delta, InfoTip, applyDimensionFilter, dimensionIcon, useAnalyticsQuery,
  type Column, type Dimension,
} from '..'
import { hasComparison, isHttpUrl } from './util'

export interface BreakdownTableProps {
  dim: Dimension
  rows: BreakdownRow[]
  /** Accessible table name (also the CSV file name unless csvName is set). */
  caption: string
  csvName?: string
  /** Header of the first column ("Source", "Country"). */
  nameHeader: string
  /** ⓘ for the first column. */
  nameTip?: ReactNode
  /** 'full' = visit quality columns (engaged, bounce, time, key actions, conversion); 'basic' = counts only. */
  variant?: 'full' | 'basic'
  /** Override the row icon (default: the dimension's icon). */
  icon?: (row: BreakdownRow) => ReactNode
  /** Muted second line under the name. */
  sub?: (row: BreakdownRow) => ReactNode
  /** An external URL for the row (opens in a new tab, e.g. a referring page). */
  externalUrl?: (row: BreakdownRow) => string | null | undefined
  /** Row click; default = add the dimension's filter (nothing for unfilterable dimensions). */
  onRowClick?: (row: BreakdownRow) => void
  /** Accessible wording of the row click, shown as the row title. */
  clickHint?: string
  /** Per-row ⓘ next to the name (e.g. channel definitions). */
  rowTip?: (row: BreakdownRow) => ReactNode
  empty?: ReactNode
  toolbar?: ReactNode
  pageSize?: number
  periodLabel?: string
}

/**
 * Sortable table for any BreakdownRow[] ("visits by X"): the name with its
 * icon, visitors (with an inline bar), visits, change vs the comparison
 * period, and - in the full variant - how good those visits were: engaged
 * share, bounce rate, time engaged, key actions and conversion rate. Rows
 * filter the whole section by default; CSV exports what is shown.
 */
export function BreakdownTable({
  dim, rows, caption, csvName, nameHeader, nameTip, variant = 'full', icon, sub, externalUrl,
  onRowClick, clickHint, rowTip, empty, toolbar, pageSize = 25, periodLabel,
}: BreakdownTableProps) {
  const q = useAnalyticsQuery()
  const filterKey = DIMENSION_FILTER[dim]
  const click = onRowClick ?? (filterKey ? (r: BreakdownRow) => applyDimensionFilter(q, dim, filterKey, r) : undefined)
  const withChange = hasComparison(rows, r => r.previous?.visitors)

  const columns: Column<BreakdownRow>[] = [
    {
      key: 'name',
      header: nameHeader,
      tip: nameTip,
      sticky: true,
      value: r => r.label,
      csv: r => r.label,
      minWidth: 200,
      render: r => {
        const url = externalUrl?.(r)
        return (
          <span className="an-ix-name" title={click ? clickHint : undefined}>
            <span className="an-ix-name-icon">{icon ? icon(r) : dimensionIcon(dim, r)}</span>
            <span className="an-ix-name-text">
              <span className="an-ix-name-main">{r.label}</span>
              {sub && <span className="an-ix-name-sub">{sub(r)}</span>}
            </span>
            {rowTip?.(r)}
            {isHttpUrl(url) && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="an-bl-act an-ix-name-ext"
                title="Open this page in a new tab"
                aria-label={`Open ${url} in a new tab`}
                onClick={e => e.stopPropagation()}
              >
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </a>
            )}
          </span>
        )
      },
    },
    { key: 'visitors', header: 'Visitors', tip: <InfoTip metric="visitors" />, value: r => r.visitors, format: 'number', bar: true },
    { key: 'sessions', header: 'Visits', tip: <InfoTip metric="sessions" />, value: r => r.sessions, format: 'number' },
  ]
  if (withChange) {
    columns.push({
      key: 'change',
      header: 'Change',
      tip: <InfoTip title="Change" text={`Visitors compared with ${periodLabel ?? 'the previous period'}.`} />,
      align: 'right',
      value: r => (r.previous && r.previous.visitors > 0 ? (r.visitors - r.previous.visitors) / r.previous.visitors : null),
      csv: r => r.previous?.visitors ?? null,
      csvHeader: 'Visitors (previous period)',
      render: r => (r.previous ? <Delta value={r.visitors} previous={r.previous.visitors} variant="text" periodLabel={periodLabel} /> : '–'),
    })
  }
  if (variant === 'full') {
    columns.push(
      { key: 'engagementRate', header: 'Engaged', tip: <InfoTip metric="engagementRate" />, value: r => r.engagementRate, format: 'percent' },
      { key: 'bounceRate', header: 'Bounce rate', tip: <InfoTip metric="bounceRate" />, value: r => r.bounceRate, format: 'percent', firstDir: 'desc' },
      { key: 'avgEngagedMs', header: 'Avg. time', tip: <InfoTip metric="avgEngagedMs" />, value: r => r.avgEngagedMs, format: 'duration' },
      { key: 'keyEvents', header: 'Key actions', tip: <InfoTip metric="keyEvents" />, value: r => r.keyEvents, format: 'number' },
      { key: 'conversionRate', header: 'Conversion', tip: <InfoTip metric="conversionRate" />, value: r => r.conversionRate, format: 'percent' },
    )
  } else {
    columns.push({ key: 'share', header: 'Share', tip: <InfoTip title="Share" text="Share of all visitors in this list's total." />, value: r => r.share, format: 'percent' })
  }

  return (
    <DataTable
      rows={rows}
      columns={columns}
      rowKey={r => r.key + (r.extra?.country ? `|${r.extra.country}` : '') + (r.extra?.region ? `|${r.extra.region}` : '')}
      onRowClick={click}
      defaultSort={{ key: 'visitors', dir: 'desc' }}
      pageSize={pageSize}
      csvName={csvName ?? caption}
      caption={caption}
      toolbar={toolbar}
      empty={empty}
    />
  )
}
