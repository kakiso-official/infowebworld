'use client'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare, faFilter, faMagnifyingGlassChart } from '@fortawesome/free-solid-svg-icons'
import type { MetricFormat } from '@/lib/analytics/types'
import { fmtMetric, fmtPercent } from '../_lib/format'
import { useAnalyticsQuery } from '../_lib/state'

export interface BarListRow {
  /** Stable key (also the filter value when the row filters). */
  key: string
  /** Main text. */
  label: ReactNode
  /** Plain text of the label (title attribute, aria). */
  text?: string
  /** Muted second part (a path under a title, the country of a city). */
  sub?: ReactNode
  /** Icon/flag before the label. */
  icon?: ReactNode
  /** Drives the bar length and the value column. */
  value: number
  /** 0..1 share shown as "%"; omit to hide. */
  share?: number | null
  /** Extra cell before the value (a delta, a bounce rate). */
  secondary?: ReactNode
  /** Internal "details" link (page details, event detail). Range + filters are kept. */
  href?: string
  /** "Open ↗" link to the live page (new tab). */
  external?: string
  /** Set false to make just this row non-clickable. */
  clickable?: boolean
}

export interface BarListProps {
  rows: BarListRow[]
  /** How `value` is formatted. Default 'number'. */
  format?: MetricFormat
  /** Header over the labels ("Source", "Page"). Omit both headers to hide the header row. */
  labelHeader?: ReactNode
  /** Header over the values ("Visitors"). */
  valueHeader?: ReactNode
  /** Header over the secondary column. */
  secondaryHeader?: ReactNode
  /** Show the share column (uses row.share). Default true when any row has a share. */
  showShare?: boolean
  /** Row click - usually adds the row as a filter. Hover then shows a filter icon. */
  onRowClick?: (row: BarListRow) => void
  /** What a row click does, for screen readers + the hover hint ("Filter by this source"). */
  clickHint?: string
  /** Show only the first N rows. */
  limit?: number
  /** Shown when there are no rows. */
  empty?: ReactNode
  /** Bar scale max (default: the largest value) - pass the total to make bars read as shares. */
  max?: number
  /** Bar color token. Default the light blue wash. */
  barColor?: string
}

/**
 * Plausible-style ranked list: each row has a background bar proportional
 * to its value, an icon, the label, the value and its share. Clicking a row
 * filters the whole analytics section by it; hovering reveals the filter
 * hint plus optional "details" and "open page ↗" links.
 */
export function BarList({
  rows, format = 'number', labelHeader, valueHeader, secondaryHeader, showShare, onRowClick,
  clickHint = 'Filter by this', limit, empty, max, barColor,
}: BarListProps) {
  const q = useAnalyticsQuery()
  const list = limit ? rows.slice(0, limit) : rows
  if (!list.length) return <>{empty ?? <div className="an-bl-empty">No data for this period.</div>}</>
  const top = max ?? Math.max(...list.map(r => r.value), 0)
  const withShare = showShare ?? list.some(r => r.share != null)
  const withSecondary = list.some(r => r.secondary != null)

  return (
    <div className="an-bl" role="list">
      {(labelHeader || valueHeader) && (
        <div className="an-bl-head" aria-hidden="true">
          <span className="an-bl-head-label">{labelHeader}</span>
          {withSecondary && <span className="an-bl-head-sec">{secondaryHeader}</span>}
          <span className="an-bl-head-val">{valueHeader}</span>
          {withShare && <span className="an-bl-head-share">%</span>}
        </div>
      )}
      {list.map(r => {
        const pct = top > 0 ? Math.max(0, Math.min(100, (r.value / top) * 100)) : 0
        const clickable = !!onRowClick && r.clickable !== false
        const text = r.text ?? (typeof r.label === 'string' ? r.label : r.key)
        return (
          <div key={r.key} role="listitem" className={'an-bl-row' + (clickable ? ' an-bl-row--click' : '')}>
            <span className="an-bl-bar" style={{ width: `${pct}%`, background: barColor }} aria-hidden="true" />
            <span className="an-bl-label" title={text}>
              {r.icon && <span className="an-bl-icon">{r.icon}</span>}
              {clickable ? (
                <button type="button" className="an-bl-btn" onClick={() => onRowClick!(r)} aria-label={`${text}: ${fmtMetric(r.value, format)}. ${clickHint}`}>
                  <span className="an-bl-text">{r.label}</span>
                  {r.sub && <span className="an-bl-sub">{r.sub}</span>}
                </button>
              ) : (
                <span className="an-bl-plain">
                  <span className="an-bl-text">{r.label}</span>
                  {r.sub && <span className="an-bl-sub">{r.sub}</span>}
                </span>
              )}
              <span className="an-bl-acts">
                {clickable && <span className="an-bl-hint" title={clickHint} aria-hidden="true"><FontAwesomeIcon icon={faFilter} /></span>}
                {r.href && (
                  <Link href={q.href(r.href)} className="an-bl-act" title="Details" aria-label={`Details for ${text}`}>
                    <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                  </Link>
                )}
                {r.external && (
                  <a href={r.external} target="_blank" rel="noopener noreferrer" className="an-bl-act" title="Open the live page" aria-label={`Open ${text} in a new tab`}>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </a>
                )}
              </span>
            </span>
            {withSecondary && <span className="an-bl-sec">{r.secondary}</span>}
            <span className="an-bl-val">{fmtMetric(r.value, format, { compact: true })}</span>
            {withShare && <span className="an-bl-share">{r.share != null ? fmtPercent(r.share, r.share < 0.1 ? 1 : 0) : ''}</span>}
          </div>
        )
      })}
    </div>
  )
}
