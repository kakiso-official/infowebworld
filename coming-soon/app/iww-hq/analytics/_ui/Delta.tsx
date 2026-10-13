'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import type { Metric, MetricFormat } from '@/lib/analytics/types'
import { deltaInfo } from '../_lib/format'

export interface DeltaProps {
  value: number
  /** Comparison value; null/undefined renders nothing (no comparison selected). */
  previous: number | null | undefined
  format?: MetricFormat
  /** Which direction is good (METRICS[k].better). Decides green vs red. */
  better?: 'up' | 'down'
  /** 'chip' = tinted pill (KPI tiles), 'text' = inline text (tables, lists). */
  variant?: 'chip' | 'text'
  /** Name of the comparison period for the tooltip, e.g. "previous period". */
  periodLabel?: string
}

/**
 * Change vs the comparison period: arrow + "+12%" (or "+2.1 pts" for rates),
 * green when it moves the good way, red otherwise, gray when flat. Color is
 * never alone - the arrow and sign carry the same meaning.
 */
export function Delta({ value, previous, format = 'number', better = 'up', variant = 'chip', periodLabel = 'the previous period' }: DeltaProps) {
  // Nothing in either period: a "0%" chip would be noise, not information.
  if (value === 0 && previous === 0) return null
  const d = deltaInfo(value, previous, format, better)
  if (!d) return null
  return (
    <span
      className={`an-delta an-delta--${variant} an-delta--${d.tone}`}
      title={`${d.long} in ${periodLabel}`}
    >
      {d.dir !== 'flat' && <FontAwesomeIcon icon={d.dir === 'up' ? faArrowUp : faArrowDown} className="an-delta-icon" aria-hidden="true" />}
      <span>{d.text}</span>
      <span className="an-sr">{` (${d.long} in ${periodLabel})`}</span>
    </span>
  )
}

/** Delta straight from a report Metric ({ value, previous }). */
export function MetricDelta({ metric, ...rest }: { metric: Metric } & Omit<DeltaProps, 'value' | 'previous'>) {
  return <Delta value={metric.value} previous={metric.previous} {...rest} />
}
