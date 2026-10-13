'use client'
import { useState, type KeyboardEvent, type PointerEvent } from 'react'
import { VITAL_THRESHOLDS } from '@/lib/analytics/types'
import {
  ChartTooltip, SERIES, SrTable, TooltipRow, axisLabel, labelIndices, linePath, niceTicks, textWidth,
  useElementWidth,
} from '..'
import { RatingBadge } from './Vitals'
import { fmtVital, fmtVitalAxis, vitalRating, type VitalKey } from './util'

export interface VitalTrendPoint { t: string; label: string; value: number | null }

const M = { top: 12, right: 14, bottom: 26 }

/**
 * p75 of one web vital per bucket, drawn against Google's "good" and "poor"
 * lines so the reader sees at a glance which side of the line the site is
 * on. The y scale always reaches past the poor line (both lines visible);
 * the zones above the lines get a faint status wash. Buckets with no page
 * loads break the line. Hover / arrow keys read each bucket.
 */
export function VitalTrendChart({ vital, points, height = 240 }: {
  vital: VitalKey
  points: VitalTrendPoint[]
  height?: number
}) {
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const [active, setActive] = useState<number | null>(null)
  const th = VITAL_THRESHOLDS[vital]
  const n = points.length
  const color = SERIES[0]

  const maxVal = Math.max(0, ...points.map(p => p.value ?? 0))
  const ticks = niceTicks(Math.max(maxVal, th.poor * 1.15), vital === 'cls' ? 'decimal' : 'number')
  const top = ticks[ticks.length - 1] || 1
  const tickLabels = ticks.map(t => fmtVitalAxis(vital, t))
  const left = Math.ceil(Math.max(...tickLabels.map(l => textWidth(l)))) + 10
  const plotW = Math.max(1, width - left - M.right)
  const plotH = Math.max(1, height - M.top - M.bottom)
  const baseY = M.top + plotH
  const xAt = (i: number) => (n <= 1 ? left + plotW / 2 : left + (i / (n - 1)) * plotW)
  const yAt = (v: number) => M.top + plotH - (Math.min(v, top) / top) * plotH
  const xs = points.map((_, i) => xAt(i))
  const ys = points.map(p => (p.value == null ? null : yAt(p.value)))
  const goodY = yAt(th.good)
  const poorY = yAt(th.poor)

  // Lone points (a bucket with data between two empty ones) have no segment - give them a dot.
  const lone = points.map((p, i) => p.value != null && points[i - 1]?.value == null && points[i + 1]?.value == null)

  const xLabels = points.map(p => axisLabel(p.label))
  const xIdx = labelIndices(n, plotW, xLabels)

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    if (n <= 1) { setActive(0); return }
    setActive(Math.max(0, Math.min(n - 1, Math.round(((e.clientX - rect.left - left) / plotW) * (n - 1)))))
  }
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!n) return
    if (e.key === 'ArrowRight') { e.preventDefault(); setActive(a => Math.min(n - 1, (a ?? -1) + 1)) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); setActive(a => Math.max(0, (a ?? n) - 1)) }
    else if (e.key === 'Escape') setActive(null)
  }

  const a = active != null && active < n ? active : null
  const cur = a != null ? points[a] : null
  const summary = `${th.label} (${th.short}), 75th percentile over time`

  return (
    <figure className="an-chart" aria-label={summary}>
      <div className="an-legend">
        <span className="an-legend-item"><span className="an-key an-key--line" style={{ ['--k' as string]: color }} />{th.short} (75th percentile)</span>
        <span className="an-legend-item"><span className="an-key an-ix-key-line an-ix-key-line--good" />Good line ({fmtVital(vital, th.good)})</span>
        <span className="an-legend-item"><span className="an-key an-ix-key-line an-ix-key-line--poor" />Poor line ({fmtVital(vital, th.poor)})</span>
      </div>
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
            {/* zones: needs-work between the lines, poor above the poor line */}
            <rect x={left} y={poorY} width={plotW} height={Math.max(0, goodY - poorY)} className="an-ix-zone an-ix-zone--ni" />
            <rect x={left} y={M.top} width={plotW} height={Math.max(0, poorY - M.top)} className="an-ix-zone an-ix-zone--poor" />

            {ticks.map((t, i) => (
              <g key={t}>
                <line className={i === 0 ? 'an-axis-line' : 'an-grid-line'} x1={left} x2={left + plotW} y1={yAt(t)} y2={yAt(t)} />
                <text className="an-axis-text" x={left - 8} y={yAt(t)} dy="0.32em" textAnchor="end">{tickLabels[i]}</text>
              </g>
            ))}
            <line className="an-ix-thresh an-ix-thresh--good" x1={left} x2={left + plotW} y1={goodY} y2={goodY} />
            <line className="an-ix-thresh an-ix-thresh--poor" x1={left} x2={left + plotW} y1={poorY} y2={poorY} />

            {xIdx.map(i => {
              const anchor = n > 1 && i === 0 ? 'start' : n > 1 && i === n - 1 ? 'end' : 'middle'
              return <text key={i} className="an-axis-text" x={xAt(i)} y={baseY + 17} textAnchor={anchor}>{xLabels[i]}</text>
            })}

            <path d={linePath(xs, ys)} className="an-line" style={{ stroke: color }} />
            {lone.map((isLone, i) => isLone && ys[i] != null
              ? <circle key={i} cx={xs[i]} cy={ys[i]!} r={4} className="an-marker" style={{ fill: color }} />
              : null)}

            {a != null && (
              <g>
                <line className="an-crosshair" x1={xs[a]} x2={xs[a]} y1={M.top} y2={baseY} />
                {ys[a] != null && <circle cx={xs[a]} cy={ys[a]!} r={4.5} className="an-marker" style={{ fill: color }} />}
              </g>
            )}
            <rect x={left} y={M.top} width={plotW} height={plotH} fill="transparent" />
          </svg>
        )}
        {cur && a != null && width > 0 && (
          <ChartTooltip x={xs[a]} width={width}>
            <div className="an-tt-head">{cur.label}</div>
            {cur.value == null ? (
              <div className="an-muted">No page loads measured</div>
            ) : (
              <>
                <TooltipRow color={color} value={fmtVital(vital, cur.value)} label={`${th.short} p75`} />
                <div className="an-tt-foot"><RatingBadge rating={vitalRating(vital, cur.value)} /></div>
              </>
            )}
          </ChartTooltip>
        )}
      </div>
      <SrTable
        caption={summary}
        headers={['Period', `${th.short} p75`]}
        rows={points.map(p => [p.label, p.value == null ? 'No data' : fmtVital(vital, p.value)])}
      />
    </figure>
  )
}
