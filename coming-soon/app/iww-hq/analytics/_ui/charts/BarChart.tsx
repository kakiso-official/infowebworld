'use client'
import { useState, type KeyboardEvent, type ReactNode } from 'react'
import type { MetricFormat } from '@/lib/analytics/types'
import { useElementWidth } from '../../_lib/hooks'
import { fmtAxis, fmtMetric } from '../../_lib/format'
import { SERIES } from '../../_lib/colors'
import { ChartTooltip, SrTable, TooltipRow, labelIndices, niceTicks, roundedTopRect, textWidth } from './chart-utils'

export interface BarDatum {
  key: string
  /** Axis label ("12:04", "25-50%", "3-5"). */
  label: string
  value: number
  /** Longer label for the tooltip (defaults to `label`). */
  tooltipLabel?: string
  /** Extra tooltip line ("12 visitors"). */
  detail?: ReactNode
}

export interface BarChartProps {
  bars: BarDatum[]
  format?: MetricFormat
  /** Measure name for tooltip + a11y ("Pageviews"). */
  valueLabel: string
  /** Total height incl. the x-axis band. Default 200. */
  height?: number
  /** One color for every bar (single series = slot 1). */
  color?: string
  /** Draw this bar in the accent and the rest muted (emphasis form - e.g. "now"). */
  highlightKey?: string
  /** Value labels on bar caps: 'auto' shows them when every label fits. Default 'auto'. */
  showValues?: boolean | 'auto'
  onBarClick?: (bar: BarDatum) => void
  ariaLabel?: string
}

const M = { top: 18, right: 8, bottom: 26 }

/**
 * Vertical bars for a handful-to-dozens of categories in order (pageviews
 * per minute, scroll-depth buckets, visit frequency). Bars <= 24px with a
 * rounded cap and a 2px gap; each bar is its own hover/focus target.
 */
export function BarChart({
  bars, format = 'number', valueLabel, height = 200, color = SERIES[0], highlightKey,
  showValues = 'auto', onBarClick, ariaLabel,
}: BarChartProps) {
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const [active, setActive] = useState<number | null>(null)
  const n = bars.length

  const ticks = niceTicks(Math.max(0, ...bars.map(b => b.value)), format)
  const top = ticks[ticks.length - 1] || 1
  const tickLabels = ticks.map(t => fmtAxis(t, format))
  const left = Math.ceil(Math.max(...tickLabels.map(l => textWidth(l)))) + 10
  const plotW = Math.max(1, width - left - M.right)
  const plotH = Math.max(1, height - M.top - M.bottom)
  const baseY = M.top + plotH
  const yAt = (v: number) => M.top + plotH - (v / top) * plotH
  const band = n ? plotW / n : plotW
  const barW = Math.max(1, Math.min(24, band - 2))
  const xCenter = (i: number) => left + band * i + band / 2

  const xLabels = bars.map(b => b.label)
  const xIdx = labelIndices(n, plotW, xLabels)
  const valueTexts = bars.map(b => fmtMetric(b.value, format, { compact: true }))
  const valuesFit = valueTexts.every(t => textWidth(t, 11) <= band - 2)
  const showVals = showValues === true || (showValues === 'auto' && valuesFit && n <= 14)

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!n) return
    if (e.key === 'ArrowRight') { e.preventDefault(); setActive(a => Math.min(n - 1, (a ?? -1) + 1)) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); setActive(a => Math.max(0, (a ?? n) - 1)) }
    else if (e.key === 'Enter' && active != null && onBarClick) onBarClick(bars[active])
    else if (e.key === 'Escape') setActive(null)
  }

  const a = active != null && active < n ? active : null
  const summary = ariaLabel ?? valueLabel

  return (
    <figure className="an-chart" aria-label={summary}>
      <div
        ref={ref}
        className="an-chart-plot"
        style={{ height }}
        tabIndex={n ? 0 : -1}
        role="group"
        aria-label={`${summary}. Use left and right arrow keys to read values.`}
        onKeyDown={onKey}
        onBlur={() => setActive(null)}
        onFocus={() => setActive(x => x ?? n - 1)}
      >
        {width > 0 && (
          <svg width={width} height={height} className="an-svg" aria-hidden="true" onPointerLeave={e => { if (e.pointerType === 'mouse') setActive(null) }}>
            {ticks.map((t, i) => (
              <g key={t}>
                <line className={i === 0 ? 'an-axis-line' : 'an-grid-line'} x1={left} x2={left + plotW} y1={yAt(t)} y2={yAt(t)} />
                <text className="an-axis-text" x={left - 8} y={yAt(t)} dy="0.32em" textAnchor="end">{tickLabels[i]}</text>
              </g>
            ))}
            {xIdx.map(i => (
              <text key={i} className="an-axis-text" x={xCenter(i)} y={baseY + 17} textAnchor="middle">{xLabels[i]}</text>
            ))}
            {bars.map((b, i) => {
              const x = xCenter(i) - barW / 2
              const y = yAt(b.value)
              const h = baseY - y
              const fill = highlightKey == null || b.key === highlightKey ? color : 'var(--an-s-muted)'
              return (
                <g
                  key={b.key}
                  className={'an-bar' + (a === i ? ' an-bar--on' : '') + (onBarClick ? ' an-bar--click' : '')}
                  onPointerEnter={() => setActive(i)}
                  onPointerDown={() => setActive(i)}
                  onClick={onBarClick ? () => onBarClick(b) : undefined}
                >
                  {/* hit target = the whole band, taller than the mark */}
                  <rect x={left + band * i} y={M.top} width={band} height={plotH} fill="transparent" />
                  {h > 0.5 && <path d={roundedTopRect(x, y, barW, h, Math.min(4, barW / 2))} style={{ fill }} />}
                  {showVals && b.value > 0 && (
                    <text className="an-bar-value" x={xCenter(i)} y={y - 5} textAnchor="middle">{valueTexts[i]}</text>
                  )}
                </g>
              )
            })}
          </svg>
        )}
        {a != null && width > 0 && (
          <ChartTooltip x={xCenter(a)} width={width}>
            <div className="an-tt-head">{bars[a].tooltipLabel ?? bars[a].label}</div>
            <TooltipRow color={color} kind="rect" value={fmtMetric(bars[a].value, format)} label={valueLabel} />
            {bars[a].detail && <div className="an-tt-foot">{bars[a].detail}</div>}
          </ChartTooltip>
        )}
      </div>
      <SrTable caption={summary} headers={['', valueLabel]} rows={bars.map(b => [b.tooltipLabel ?? b.label, fmtMetric(b.value, format)])} />
    </figure>
  )
}
