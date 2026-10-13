'use client'
import type { ReactNode } from 'react'
import type { MetricFormat } from '@/lib/analytics/types'

/* ═══════════════════════════════════════════════════════════════════════════
   Shared chart geometry: nice y ticks, adaptive x labels, paths, the tooltip
   shell and the legend. Mark specs follow the dataviz skill: 2px lines,
   bars <= 24px with a 4px rounded data-end, hairline solid grid, 2px surface
   gaps between touching fills, text in ink (never the series color).
   ═══════════════════════════════════════════════════════════════════════════ */

function niceStep(raw: number, integer: boolean): number {
  if (!(raw > 0)) return 1
  const mag = 10 ** Math.floor(Math.log10(raw))
  const n = raw / mag
  let f = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10
  if (integer && f === 2.5 && mag < 10) f = 5
  const step = f * mag
  return integer ? Math.max(1, Math.round(step)) : step
}

const DURATION_STEPS = [
  1e3, 2e3, 5e3, 10e3, 15e3, 30e3, 60e3, 120e3, 300e3, 600e3, 900e3, 1800e3,
  3600e3, 7200e3, 14400e3, 28800e3, 86400e3,
]

/**
 * Y-axis ticks from 0 to a "nice" top that covers `max` with ~`target`
 * intervals: 0/250/500/750/1,000; 0/25%/50%; 0/30s/1m/1m 30s. Rates never
 * go past 100%. An all-zero series still gets a sensible empty scale.
 */
export function niceTicks(max: number, format: MetricFormat = 'number', target = 4): number[] {
  let m = Number.isFinite(max) && max > 0 ? max : 0
  let step: number
  if (format === 'duration') {
    if (m === 0) m = 60e3
    step = DURATION_STEPS.find(s => m / s <= target) ?? Math.ceil(m / target / 86400e3) * 86400e3
  } else if (format === 'percent') {
    if (m === 0) m = 1
    step = niceStep(m / target, false)
  } else if (format === 'decimal') {
    if (m === 0) m = 1
    step = niceStep(m / target, false)
  } else {
    if (m === 0) m = target
    step = niceStep(m / target, true)
  }
  const top = Math.ceil(m / step - 1e-9) * step
  const ticks: number[] = []
  for (let v = 0; v <= top + step / 1e6; v += step) ticks.push(Number(v.toFixed(10)))
  if (format === 'percent' && ticks[ticks.length - 1] > 1) {
    return m > 0.5 ? [0, 0.25, 0.5, 0.75, 1] : ticks.filter(t => t <= 1)
  }
  return ticks
}

/** Rough rendered width of a label at `fontSize` px (Inter, tabular digits). */
export function textWidth(s: string, fontSize = 11): number {
  return s.length * fontSize * 0.6 + 2
}

const LABEL_STEPS = [1, 2, 3, 4, 6, 7, 12, 14, 24, 28, 30, 48, 60, 72, 96, 120, 168, 336]

/**
 * Which x indices get a label so labels never collide: picks a step from a
 * friendly list (every 2/3/6/12/24 hours, every 7/14 days...) that fits.
 */
export function labelIndices(n: number, plotWidth: number, labels: string[], fontSize = 11): number[] {
  if (n <= 0) return []
  if (n === 1) return [0]
  const widest = Math.max(...labels.map(l => textWidth(l, fontSize))) + 12
  const fit = Math.max(1, Math.floor(plotWidth / widest))
  const step = LABEL_STEPS.find(s => Math.ceil(n / s) <= fit) ?? Math.ceil(n / fit)
  const out: number[] = []
  for (let i = 0; i < n; i += step) out.push(i)
  return out
}

/**
 * Short x-axis text for a bucket label. Hourly labels across several days
 * arrive as "Oct 13, 14:00": show the date at midnight, the hour otherwise.
 */
export function axisLabel(label: string): string {
  const m = /^(.+), (\d{2}:\d{2})$/.exec(label)
  if (!m) return label
  return m[2] === '00:00' ? m[1] : m[2]
}

/** SVG path through points; null values break the line into segments. */
export function linePath(xs: number[], ys: (number | null)[]): string {
  let d = ''
  let pen = false
  for (let i = 0; i < xs.length; i++) {
    const y = ys[i]
    if (y == null || !Number.isFinite(y)) { pen = false; continue }
    d += `${pen ? 'L' : 'M'}${xs[i].toFixed(1)},${y.toFixed(1)}`
    pen = true
  }
  return d
}

/** Closed area under a line down to `baseY` (one polygon per unbroken run). */
export function areaPath(xs: number[], ys: (number | null)[], baseY: number): string {
  let d = ''
  let run: [number, number][] = []
  const flush = () => {
    if (run.length > 1) {
      d += `M${run[0][0].toFixed(1)},${baseY.toFixed(1)}`
      for (const [x, y] of run) d += `L${x.toFixed(1)},${y.toFixed(1)}`
      d += `L${run[run.length - 1][0].toFixed(1)},${baseY.toFixed(1)}Z`
    }
    run = []
  }
  for (let i = 0; i < xs.length; i++) {
    const y = ys[i]
    if (y == null || !Number.isFinite(y)) { flush(); continue }
    run.push([xs[i], y])
  }
  flush()
  return d
}

/** A bar rectangle with only its top corners rounded (data-end round, baseline square). */
export function roundedTopRect(x: number, y: number, w: number, h: number, r = 4): string {
  if (h <= 0 || w <= 0) return ''
  const rr = Math.min(r, w / 2, h)
  return `M${x},${y + h}V${y + rr}Q${x},${y} ${x + rr},${y}H${x + w - rr}Q${x + w},${y} ${x + w},${y + rr}V${y + h}Z`
}

/* ── Tooltip shell ──────────────────────────────────────────────────────── */

/**
 * Absolutely positioned tooltip inside a chart container. Flips to the left
 * of the pointer past 60% of the width so it never leaves the card.
 */
export function ChartTooltip({ x, width, top = 8, children }: { x: number; width: number; top?: number; children: ReactNode }) {
  const flip = x > width * 0.6
  return (
    <div
      className="an-tt"
      style={{ top, left: x, transform: flip ? 'translateX(calc(-100% - 14px))' : 'translateX(14px)' }}
      aria-hidden="true"
    >
      {children}
    </div>
  )
}

/** One tooltip row: value first (strong), then the series name, keyed by a short line or swatch. */
export function TooltipRow({ color, kind = 'line', value, label, muted }: {
  color: string
  kind?: 'line' | 'dashed' | 'rect'
  value: ReactNode
  label: ReactNode
  muted?: boolean
}) {
  return (
    <div className={'an-tt-row' + (muted ? ' an-tt-row--muted' : '')}>
      <span className={`an-key an-key--${kind}`} style={{ ['--k' as string]: color }} />
      <b className="an-tt-val">{value}</b>
      <span className="an-tt-label">{label}</span>
    </div>
  )
}

/* ── Legend ─────────────────────────────────────────────────────────────── */

export interface LegendItem {
  key: string
  label: ReactNode
  color: string
  /** Mirror the mark: line for lines, dashed for comparison, rect for bars/areas. */
  kind?: 'line' | 'dashed' | 'rect'
  hidden?: boolean
}

/**
 * Chart legend. With `onToggle`, items are buttons that hide/show a series
 * (colors stay fixed to their series - nothing repaints).
 */
export function Legend({ items, onToggle }: { items: LegendItem[]; onToggle?: (key: string) => void }) {
  return (
    <div className="an-legend">
      {items.map(it => {
        const inner = (
          <>
            <span className={`an-key an-key--${it.kind ?? 'rect'}`} style={{ ['--k' as string]: it.color }} />
            <span>{it.label}</span>
          </>
        )
        return onToggle ? (
          <button
            key={it.key}
            type="button"
            className={'an-legend-item an-legend-item--btn' + (it.hidden ? ' an-legend-item--off' : '')}
            aria-pressed={!it.hidden}
            onClick={() => onToggle(it.key)}
            title={it.hidden ? 'Show this series' : 'Hide this series'}
          >
            {inner}
          </button>
        ) : (
          <span key={it.key} className="an-legend-item">{inner}</span>
        )
      })}
    </div>
  )
}

/** Visually hidden table - the accessible twin of a chart (screen readers read values here). */
export function SrTable({ caption, headers, rows }: { caption: string; headers: string[]; rows: (string | number)[][] }) {
  // The wrapper is what's visually hidden: a <table> ignores width:1px and
  // would widen the page on phones even while invisible.
  return (
    <div className="an-sr">
      <table>
        <caption>{caption}</caption>
        <thead><tr>{headers.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => (j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j}>{c}</td>))}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
