'use client'
import { useId, useState, type KeyboardEvent, type PointerEvent } from 'react'
import type { MetricFormat } from '@/lib/analytics/types'
import { useElementWidth } from '../../_lib/hooks'
import { fmtAxis, fmtMetric } from '../../_lib/format'
import { PREVIOUS_COLOR, SERIES } from '../../_lib/colors'
import { Delta } from '../Delta'
import {
  ChartTooltip, Legend, SrTable, TooltipRow, areaPath, axisLabel, labelIndices, linePath, niceTicks, textWidth,
} from './chart-utils'

/** One bucket of a time series. `value: null` = no data (the line breaks). */
export interface SeriesDatum {
  t: string
  /** Axis/tooltip label from the report ("Oct 13", "14:00", "Oct 13, 14:00"). */
  label: string
  value: number | null
}

export interface TimeSeriesChartProps {
  points: SeriesDatum[]
  /** Comparison period aligned by index (dashed gray line). */
  previous?: SeriesDatum[] | null
  format?: MetricFormat
  /** Name of the plotted metric ("Visitors"). */
  seriesLabel: string
  /** Name of the comparison line (default "Previous period"). */
  previousLabel?: string
  /** For the tooltip's delta color (METRICS[k].better). */
  better?: 'up' | 'down'
  /** Total height including the x-axis band (px). Default 260. */
  height?: number
  color?: string
  /** Draw the last segment dotted - the current bucket (today / this hour) is still filling. */
  partialLast?: boolean
  /** Show the legend row above the plot when there is a comparison. Default true. */
  legend?: boolean
  /** Accessible summary, e.g. "Visitors per day, 15 Sep to 13 Oct". */
  ariaLabel?: string
}

const M = { top: 10, right: 14, bottom: 26 }

/**
 * Line + soft area over time, with the comparison period dashed. Hover (or
 * focus + arrow keys) snaps a crosshair to the nearest bucket and shows one
 * tooltip with this period, the previous period and the change. Responsive
 * (ResizeObserver) and keeps its height while measuring, so no layout jump.
 */
export function TimeSeriesChart({
  points, previous, format = 'number', seriesLabel, previousLabel = 'Previous period', better = 'up',
  height = 260, color = SERIES[0], partialLast = false, legend = true, ariaLabel,
}: TimeSeriesChartProps) {
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const [active, setActive] = useState<number | null>(null)
  const gradId = useId().replace(/:/g, '')
  const n = points.length
  const prev = previous && previous.length ? previous : null

  const maxVal = Math.max(0, ...points.map(p => p.value ?? 0), ...(prev ?? []).map(p => p.value ?? 0))
  const ticks = niceTicks(maxVal, format)
  const top = ticks[ticks.length - 1] || 1
  const tickLabels = ticks.map(t => fmtAxis(t, format))
  const left = Math.ceil(Math.max(...tickLabels.map(l => textWidth(l)))) + 10
  const plotW = Math.max(1, width - left - M.right)
  const plotH = Math.max(1, height - M.top - M.bottom)
  const baseY = M.top + plotH

  const xAt = (i: number) => (n <= 1 ? left + plotW / 2 : left + (i / (n - 1)) * plotW)
  const yAt = (v: number) => M.top + plotH - (v / top) * plotH
  const xs = points.map((_, i) => xAt(i))
  const ys = points.map(p => (p.value == null ? null : yAt(p.value)))
  const pys = prev ? points.map((_, i) => (prev[i]?.value == null ? null : yAt(prev[i].value!))) : null

  // Split off the still-filling last segment so it can be drawn dotted.
  const splitAt = partialLast && n >= 2 ? n - 2 : n - 1
  const solidPath = linePath(xs.slice(0, splitAt + 1), ys.slice(0, splitAt + 1))
  const partialPath = partialLast && n >= 2 ? linePath(xs.slice(n - 2), ys.slice(n - 2)) : ''

  const xLabels = points.map(p => axisLabel(p.label))
  const xIdx = labelIndices(n, plotW, xLabels)

  const indexAt = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left
    if (n <= 1) return 0
    return Math.max(0, Math.min(n - 1, Math.round(((x - left) / plotW) * (n - 1))))
  }
  const onMove = (e: PointerEvent<SVGSVGElement>) => setActive(indexAt(e.clientX, e.currentTarget.getBoundingClientRect()))
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!n) return
    if (e.key === 'ArrowRight') { e.preventDefault(); setActive(a => Math.min(n - 1, (a ?? -1) + 1)) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); setActive(a => Math.max(0, (a ?? n) - 1)) }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0) }
    else if (e.key === 'End') { e.preventDefault(); setActive(n - 1) }
    else if (e.key === 'Escape') setActive(null)
  }

  const a = active != null && active < n ? active : null
  const cur = a != null ? points[a] : null
  const pv = a != null && prev ? prev[a] : null
  const summary = ariaLabel ?? `${seriesLabel} over time`

  return (
    <figure className="an-chart" aria-label={summary}>
      {legend && prev && (
        <Legend
          items={[
            { key: 'cur', label: seriesLabel, color, kind: 'line' },
            { key: 'prev', label: previousLabel, color: PREVIOUS_COLOR, kind: 'dashed' },
          ]}
        />
      )}
      <div
        ref={ref}
        className="an-chart-plot"
        style={{ height }}
        tabIndex={n ? 0 : -1}
        role="group"
        aria-label={`${summary}. Use left and right arrow keys to read values.`}
        onKeyDown={onKey}
        onBlur={() => setActive(null)}
        onFocus={() => setActive(a => a ?? n - 1)}
      >
        {width > 0 && (
          <svg
            width={width}
            height={height}
            className="an-svg"
            aria-hidden="true"
            onPointerMove={onMove}
            onPointerDown={onMove}
            onPointerLeave={e => { if (e.pointerType === 'mouse') setActive(null) }}
          >
            <defs>
              <linearGradient id={`g${gradId}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.16} />
                <stop offset="100%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>

            {/* grid + y labels */}
            {ticks.map((t, i) => (
              <g key={t}>
                <line className={i === 0 ? 'an-axis-line' : 'an-grid-line'} x1={left} x2={left + plotW} y1={yAt(t)} y2={yAt(t)} />
                <text className="an-axis-text" x={left - 8} y={yAt(t)} dy="0.32em" textAnchor="end">{tickLabels[i]}</text>
              </g>
            ))}

            {/* x labels */}
            {xIdx.map(i => {
              const x = xAt(i)
              const anchor = n > 1 && i === 0 ? 'start' : n > 1 && i === n - 1 ? 'end' : 'middle'
              return <text key={i} className="an-axis-text" x={x} y={baseY + 17} textAnchor={anchor}>{xLabels[i]}</text>
            })}

            {/* comparison period */}
            {pys && <path d={linePath(xs, pys)} className="an-line an-line--prev" style={{ stroke: PREVIOUS_COLOR }} />}

            {/* current period */}
            <path d={areaPath(xs, ys, baseY)} fill={`url(#g${gradId})`} />
            <path d={solidPath} className="an-line" style={{ stroke: color }} />
            {partialPath && <path d={partialPath} className="an-line an-line--partial" style={{ stroke: color }} />}
            {n === 1 && ys[0] != null && <circle cx={xs[0]} cy={ys[0]!} r={4} className="an-marker" style={{ fill: color }} />}

            {/* hover layer */}
            {a != null && (
              <g>
                <line className="an-crosshair" x1={xs[a]} x2={xs[a]} y1={M.top} y2={baseY} />
                {pys && pys[a] != null && <circle cx={xs[a]} cy={pys[a]!} r={4} className="an-marker" style={{ fill: PREVIOUS_COLOR }} />}
                {ys[a] != null && <circle cx={xs[a]} cy={ys[a]!} r={4.5} className="an-marker" style={{ fill: color }} />}
              </g>
            )}
            <rect x={left} y={M.top} width={plotW} height={plotH} fill="transparent" />
          </svg>
        )}

        {cur && a != null && width > 0 && (
          <ChartTooltip x={xs[a]} width={width}>
            <div className="an-tt-head">{cur.label}{partialLast && a === n - 1 ? ' (so far)' : ''}</div>
            <TooltipRow color={color} value={fmtMetric(cur.value, format)} label={seriesLabel} />
            {pv && (
              <>
                <TooltipRow color={PREVIOUS_COLOR} kind="dashed" value={fmtMetric(pv.value, format)} label={pv.label} muted />
                {cur.value != null && pv.value != null && (
                  <div className="an-tt-foot">
                    <Delta value={cur.value} previous={pv.value} format={format} better={better} variant="text" />
                    <span> vs {previousLabel.toLowerCase()}</span>
                  </div>
                )}
              </>
            )}
          </ChartTooltip>
        )}
      </div>
      <SrTable
        caption={summary}
        headers={prev ? ['Period', seriesLabel, previousLabel] : ['Period', seriesLabel]}
        rows={points.map((p, i) => prev
          ? [p.label, fmtMetric(p.value, format), fmtMetric(prev[i]?.value ?? null, format)]
          : [p.label, fmtMetric(p.value, format)])}
      />
    </figure>
  )
}
