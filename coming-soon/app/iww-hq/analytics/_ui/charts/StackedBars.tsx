'use client'
import { useState, type KeyboardEvent, type PointerEvent } from 'react'
import type { MetricFormat } from '@/lib/analytics/types'
import { useElementWidth } from '../../_lib/hooks'
import { fmtAxis, fmtMetric } from '../../_lib/format'
import {
  ChartTooltip, Legend, SrTable, TooltipRow, axisLabel, labelIndices, niceTicks, roundedTopRect, textWidth,
} from './chart-utils'

export interface StackSeries {
  key: string
  label: string
  /** CSS color - use CHANNEL_COLOR / SERIES / OTHER_COLOR so color follows the entity. */
  color: string
  /** One value per bucket, aligned with `labels`. */
  values: number[]
}

export interface StackedChartProps {
  labels: { t: string; label: string }[]
  /** Bottom -> top. Max 8 + "Other" (fold the tail before passing). */
  series: StackSeries[]
  format?: MetricFormat
  /** Total height incl. the x-axis band. Default 260. */
  height?: number
  /** 'bars' (default) = stacked columns; 'area' = stacked areas. */
  variant?: 'bars' | 'area'
  /** Legend with click-to-hide. Default true. */
  legend?: boolean
  /** Name of the measure for the tooltip total ("Visits"). */
  totalLabel?: string
  ariaLabel?: string
}

const M = { top: 10, right: 14, bottom: 26 }
const GAP = 2

/**
 * Part-to-whole over time (e.g. visits per channel per day). Stacked columns
 * with a 2px surface gap between segments and a rounded top; or stacked
 * areas. Hover/focus a bucket for one tooltip listing every series + total.
 * Legend items hide/show a series without repainting the others.
 */
export function StackedBars({
  labels, series, format = 'number', height = 260, variant = 'bars', legend = true, totalLabel = 'Total', ariaLabel,
}: StackedChartProps) {
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const [active, setActive] = useState<number | null>(null)
  const [hidden, setHidden] = useState<Set<string>>(() => new Set())
  const n = labels.length
  const shown = series.filter(s => !hidden.has(s.key))

  const totals = labels.map((_, i) => shown.reduce((sum, s) => sum + (s.values[i] ?? 0), 0))
  const ticks = niceTicks(Math.max(0, ...totals), format)
  const top = ticks[ticks.length - 1] || 1
  const tickLabels = ticks.map(t => fmtAxis(t, format))
  const left = Math.ceil(Math.max(...tickLabels.map(l => textWidth(l)))) + 10
  const plotW = Math.max(1, width - left - M.right)
  const plotH = Math.max(1, height - M.top - M.bottom)
  const baseY = M.top + plotH
  const yAt = (v: number) => M.top + plotH - (v / top) * plotH

  const band = n ? plotW / n : plotW
  const barW = Math.max(1, Math.min(24, band * 0.68))
  const xCenter = (i: number) => (variant === 'area'
    ? (n <= 1 ? left + plotW / 2 : left + (i / (n - 1)) * plotW)
    : left + band * i + band / 2)

  const xLabels = labels.map(l => axisLabel(l.label))
  const xIdx = labelIndices(n, plotW, xLabels)

  const indexAt = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left - left
    if (n <= 1) return 0
    if (variant === 'area') return Math.max(0, Math.min(n - 1, Math.round((x / plotW) * (n - 1))))
    return Math.max(0, Math.min(n - 1, Math.floor(x / band)))
  }
  const onMove = (e: PointerEvent<SVGSVGElement>) => setActive(indexAt(e.clientX, e.currentTarget.getBoundingClientRect()))
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!n) return
    if (e.key === 'ArrowRight') { e.preventDefault(); setActive(a => Math.min(n - 1, (a ?? -1) + 1)) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); setActive(a => Math.max(0, (a ?? n) - 1)) }
    else if (e.key === 'Escape') setActive(null)
  }
  const toggle = (key: string) => setHidden(h => {
    const next = new Set(h)
    if (next.has(key)) next.delete(key)
    else if (series.length - next.size > 1) next.add(key) // never hide the last visible series
    return next
  })

  /* Area geometry: cumulative tops per series. */
  const cum: number[][] = []
  if (variant === 'area') {
    const acc = new Array(n).fill(0) as number[]
    for (const s of shown) {
      const row = labels.map((_, i) => (acc[i] += s.values[i] ?? 0))
      cum.push(row)
    }
  }

  const a = active != null && active < n ? active : null
  const summary = ariaLabel ?? 'Stacked chart over time'

  return (
    <figure className="an-chart" aria-label={summary}>
      {legend && (
        <Legend
          items={series.map(s => ({ key: s.key, label: s.label, color: s.color, kind: 'rect' as const, hidden: hidden.has(s.key) }))}
          onToggle={series.length > 1 ? toggle : undefined}
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
        onFocus={() => setActive(x => x ?? n - 1)}
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
            {ticks.map((t, i) => (
              <g key={t}>
                <line className={i === 0 ? 'an-axis-line' : 'an-grid-line'} x1={left} x2={left + plotW} y1={yAt(t)} y2={yAt(t)} />
                <text className="an-axis-text" x={left - 8} y={yAt(t)} dy="0.32em" textAnchor="end">{tickLabels[i]}</text>
              </g>
            ))}
            {xIdx.map(i => (
              <text
                key={i}
                className="an-axis-text"
                x={xCenter(i)}
                y={baseY + 17}
                textAnchor={variant === 'area' && n > 1 && i === 0 ? 'start' : variant === 'area' && n > 1 && i === n - 1 ? 'end' : 'middle'}
              >
                {xLabels[i]}
              </text>
            ))}

            {variant === 'bars' && a != null && (
              <rect className="an-hoverband" x={left + band * a} y={M.top} width={band} height={plotH} />
            )}

            {variant === 'bars' && labels.map((_, i) => {
              let acc = 0
              const x = xCenter(i) - barW / 2
              const visible = shown.filter(s => (s.values[i] ?? 0) > 0)
              return (
                <g key={i}>
                  {visible.map((s, j) => {
                    const v = s.values[i] ?? 0
                    const y0 = yAt(acc)
                    acc += v
                    const y1 = yAt(acc)
                    // 2px surface gap above every segment except the top one.
                    const isTop = j === visible.length - 1
                    const h = Math.max(0, y0 - y1 - (isTop ? 0 : GAP))
                    const yTop = isTop ? y1 : y1 + GAP
                    if (h <= 0) return null
                    return isTop
                      ? <path key={s.key} d={roundedTopRect(x, yTop, barW, h, 4)} style={{ fill: s.color }} />
                      : <rect key={s.key} x={x} y={yTop} width={barW} height={h} style={{ fill: s.color }} />
                  })}
                </g>
              )
            })}

            {variant === 'area' && shown.map((s, si) => {
              const topRow = cum[si]
              const botRow = si > 0 ? cum[si - 1] : new Array(n).fill(0)
              const xs = labels.map((_, i) => xCenter(i))
              let d = ''
              xs.forEach((x, i) => { d += `${i ? 'L' : 'M'}${x.toFixed(1)},${yAt(topRow[i]).toFixed(1)}` })
              for (let i = n - 1; i >= 0; i--) d += `L${xs[i].toFixed(1)},${yAt(botRow[i]).toFixed(1)}`
              d += 'Z'
              let edge = ''
              xs.forEach((x, i) => { edge += `${i ? 'L' : 'M'}${x.toFixed(1)},${yAt(topRow[i]).toFixed(1)}` })
              return (
                <g key={s.key}>
                  <path d={d} style={{ fill: s.color }} fillOpacity={0.78} />
                  <path d={edge} className="an-area-edge" />
                </g>
              )
            })}
            {variant === 'area' && a != null && (
              <line className="an-crosshair" x1={xCenter(a)} x2={xCenter(a)} y1={M.top} y2={baseY} />
            )}
          </svg>
        )}

        {a != null && width > 0 && (
          <ChartTooltip x={xCenter(a)} width={width}>
            <div className="an-tt-head">{labels[a].label}</div>
            {[...shown].reverse().map(s => (
              <TooltipRow key={s.key} color={s.color} kind="rect" value={fmtMetric(s.values[a] ?? 0, format)} label={s.label} />
            ))}
            <div className="an-tt-foot"><b>{fmtMetric(totals[a], format)}</b> {totalLabel.toLowerCase()}</div>
          </ChartTooltip>
        )}
      </div>
      <SrTable
        caption={summary}
        headers={['Period', ...series.map(s => s.label), totalLabel]}
        rows={labels.map((l, i) => [
          l.label,
          ...series.map(s => fmtMetric(s.values[i] ?? 0, format)),
          fmtMetric(series.reduce((sum, s) => sum + (s.values[i] ?? 0), 0), format),
        ])}
      />
    </figure>
  )
}

/** Stacked areas - same props as StackedBars (variant fixed to 'area'). */
export function StackedArea(props: Omit<StackedChartProps, 'variant'>) {
  return <StackedBars {...props} variant="area" />
}
