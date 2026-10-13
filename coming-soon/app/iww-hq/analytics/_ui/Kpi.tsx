'use client'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { METRICS, type Metric, type MetricFormat } from '@/lib/analytics/types'
import { fmtMetric } from '../_lib/format'
import { useAnalyticsQuery } from '../_lib/state'
import { InfoTip, type MetricKey } from './InfoTip'
import { Delta } from './Delta'
import { Sparkline } from './charts/Sparkline'

export interface KpiCardProps {
  /** METRICS key - supplies label, format, which direction is good, and the ⓘ text. */
  metric: MetricKey
  /** { value, previous } from the report. undefined = still loading (renders a dash). */
  value: Metric | null | undefined
  /** Override the METRICS label (keep "Visits" wording, not "Sessions"). */
  label?: string
  format?: MetricFormat
  better?: 'up' | 'down'
  /** Trend for the sparkline (current period). */
  spark?: (number | null)[]
  /** Highlighted as the metric the main chart shows. */
  selected?: boolean
  /** Makes the tile a toggle button ("show this metric on the chart"). */
  onSelect?: () => void
  /** Or makes it a link (kept range + filters). Ignored when onSelect is set. */
  href?: string
  /** Small muted line under the delta ("of 2,310 visits"). */
  hint?: ReactNode
  /** Comparison wording for the delta tooltip. */
  periodLabel?: string
  /** Show the full number (1,234,567) instead of the compact 1.2M. */
  full?: boolean
}

/**
 * A stat tile: label + ⓘ, the number (proportional figures, compact when
 * large), the change vs the comparison period (green/red by METRICS.better,
 * with an arrow) and an optional sparkline. Selectable tiles drive the
 * Overview chart; the whole tile is the click target.
 */
export function KpiCard({
  metric, value, label, format, better, spark, selected, onSelect, href, hint, periodLabel, full,
}: KpiCardProps) {
  const q = useAnalyticsQuery()
  const def = METRICS[metric]
  const name = label ?? def.label
  const fmt = format ?? def.format
  const dir = better ?? def.better
  const shown = value ? fmtMetric(value.value, fmt, { compact: !full }) : '–'
  const exact = value && fmt === 'number' ? fmtMetric(value.value, 'number') : undefined
  const interactive = !!onSelect || !!href

  return (
    <div className={'an-kpi' + (selected ? ' an-kpi--sel' : '') + (interactive ? ' an-kpi--click' : '')}>
      {onSelect ? (
        <button type="button" className="an-kpi-hit" aria-pressed={!!selected} aria-label={`${name}: ${shown}. Show on chart`} onClick={onSelect} />
      ) : href ? (
        <Link className="an-kpi-hit" href={q.href(href)} aria-label={`${name}: ${shown}. Open details`} />
      ) : null}
      <div className="an-kpi-label">
        <span>{name}</span>
        <InfoTip metric={metric} title={name} />
      </div>
      <div className="an-kpi-value" title={exact !== shown ? exact : undefined}>{shown}</div>
      <div className="an-kpi-foot">
        {value && <Delta value={value.value} previous={value.previous} format={fmt} better={dir} periodLabel={periodLabel} />}
        {hint && <span className="an-kpi-hint">{hint}</span>}
      </div>
      {spark && spark.length > 1 && <Sparkline values={spark} className="an-kpi-spark" color={selected ? 'var(--an-s1)' : 'var(--an-s-muted-strong)'} />}
    </div>
  )
}

/** Responsive row of KpiCards (auto-fits 2 per row on phones, up to 8 on wide screens). */
export function KpiStrip({ children, ariaLabel = 'Key numbers', className }: { children: ReactNode; ariaLabel?: string; className?: string }) {
  return <div className={'an-kpis ' + (className ?? '')} role="group" aria-label={ariaLabel}>{children}</div>
}
