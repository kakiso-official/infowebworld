'use client'
import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import type { MetricFormat } from '@/lib/analytics/types'
import { fmtMetric } from '../../_lib/format'
import { SEQ_RAMP, seqColor } from '../../_lib/colors'
import { SrTable } from './chart-utils'

export interface HeatmapProps {
  rows: { key: string; label: ReactNode; /** Extra cell after the label (e.g. cohort size). */ meta?: ReactNode; /** Plain text for a11y/tooltip. */ text?: string }[]
  cols: { key: string; label: string; /** Longer name for the tooltip. */ title?: string }[]
  /** values[row][col]; null = not applicable (drawn empty, e.g. weeks that haven't happened yet). */
  values: (number | null)[][]
  /** How values are formatted in cells/tooltips. Default 'number'. */
  format?: MetricFormat
  /** Override cell text (e.g. retention shows a % but colors by rate). */
  display?: (v: number, row: number, col: number) => string
  /** Tooltip body for a cell (default: "<row> · <col>: <value>"). */
  tooltip?: (v: number | null, row: number, col: number) => ReactNode
  /** Value that maps to the darkest color (default: max of values). */
  max?: number
  /** Print values inside cells (default true when cells are wide enough). */
  showValues?: boolean
  /** Header over the row labels / meta column. */
  rowHeader?: ReactNode
  metaHeader?: ReactNode
  /** Show every Nth column label (hours: 3). Default 1. */
  colLabelEvery?: number
  /** Scale legend ends. Default ['Less', 'More']. */
  legendLabels?: [string, string]
  /** Min cell width before the grid scrolls sideways inside its card. Default 28. */
  minCellWidth?: number
  cellHeight?: number
  ariaLabel: string
}

/**
 * Generic matrix colored on one sequential blue ramp (more = darker) - used
 * for "when visitors come" (weekday x hour) and retention cohorts. Hover or
 * arrow-key through cells for exact values; a scale legend sits underneath;
 * a hidden table carries every value for screen readers.
 */
export function Heatmap({
  rows, cols, values, format = 'number', display, tooltip, max, showValues, rowHeader, metaHeader,
  colLabelEvery = 1, legendLabels = ['Less', 'More'], minCellWidth = 28, cellHeight = 28, ariaLabel,
}: HeatmapProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState<{ r: number; c: number; x: number; y: number } | null>(null)
  const hasMeta = rows.some(r => r.meta != null)
  const flat = values.flat().filter((v): v is number => v != null && Number.isFinite(v))
  const top = max ?? Math.max(0, ...flat)
  const textOf = (v: number, r: number, c: number) => (display ? display(v, r, c) : fmtMetric(v, format, { compact: true }))
  const showVals = showValues ?? minCellWidth >= 40

  const place = (r: number, c: number, el: HTMLElement | null) => {
    const wrap = wrapRef.current?.getBoundingClientRect()
    const cell = el?.getBoundingClientRect()
    if (!wrap || !cell) { setActive({ r, c, x: 0, y: 0 }); return }
    setActive({ r, c, x: cell.left - wrap.left + cell.width / 2, y: cell.top - wrap.top })
  }

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const cur = active ?? { r: 0, c: 0 }
    let { r, c } = cur
    if (e.key === 'ArrowRight') c = Math.min(cols.length - 1, c + 1)
    else if (e.key === 'ArrowLeft') c = Math.max(0, c - 1)
    else if (e.key === 'ArrowDown') r = Math.min(rows.length - 1, r + 1)
    else if (e.key === 'ArrowUp') r = Math.max(0, r - 1)
    else if (e.key === 'Escape') { setActive(null); return }
    else return
    e.preventDefault()
    const el = wrapRef.current?.querySelector<HTMLElement>(`[data-cell="${r}-${c}"]`)
    el?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    place(r, c, el ?? null)
  }

  const gridCols = `minmax(64px, max-content)${hasMeta ? ' max-content' : ''} repeat(${cols.length}, minmax(${minCellWidth}px, 1fr))`
  const tipBody = (r: number, c: number): ReactNode => {
    const v = values[r]?.[c] ?? null
    if (tooltip) return tooltip(v, r, c)
    const rowText = rows[r].text ?? (typeof rows[r].label === 'string' ? rows[r].label as string : '')
    return (
      <>
        <div className="an-tt-head">{rowText}{rowText ? ' · ' : ''}{cols[c].title ?? cols[c].label}</div>
        <div><b className="an-tt-val">{v == null ? 'No data' : fmtMetric(v, format)}</b></div>
      </>
    )
  }

  return (
    <figure className="an-chart an-heat" aria-label={ariaLabel} ref={wrapRef}>
      <div
        className="an-heat-scroll"
        tabIndex={0}
        role="group"
        aria-label={`${ariaLabel}. Use the arrow keys to read cells.`}
        onKeyDown={onKey}
        onBlur={() => setActive(null)}
      >
        <div className="an-heat-grid" style={{ gridTemplateColumns: gridCols }} aria-hidden="true">
          <div className="an-heat-corner">{rowHeader}</div>
          {hasMeta && <div className="an-heat-colhead an-heat-colhead--meta">{metaHeader}</div>}
          {cols.map((c, ci) => (
            <div key={c.key} className="an-heat-colhead">{ci % colLabelEvery === 0 ? c.label : ''}</div>
          ))}
          {rows.map((row, ri) => (
            <div key={row.key} className="an-heat-row" style={{ display: 'contents' }}>
              <div className="an-heat-rowhead">{row.label}</div>
              {hasMeta && <div className="an-heat-meta">{row.meta}</div>}
              {cols.map((c, ci) => {
                const v = values[ri]?.[ci] ?? null
                const isOn = active?.r === ri && active?.c === ci
                if (v == null) {
                  return <div key={c.key} data-cell={`${ri}-${ci}`} className="an-heat-cell an-heat-cell--na" style={{ height: cellHeight }} />
                }
                const { bg, fg } = v > 0 ? seqColor(top > 0 ? v / top : 0) : { bg: 'var(--an-surface-3)', fg: 'var(--an-text-3)' }
                return (
                  <div
                    key={c.key}
                    data-cell={`${ri}-${ci}`}
                    className={'an-heat-cell' + (isOn ? ' an-heat-cell--on' : '')}
                    style={{ background: bg, color: fg, height: cellHeight }}
                    onPointerEnter={e => place(ri, ci, e.currentTarget)}
                    onPointerLeave={e => { if (e.pointerType === 'mouse') setActive(null) }}
                    onPointerDown={e => place(ri, ci, e.currentTarget)}
                  >
                    {showVals ? textOf(v, ri, ci) : ''}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="an-tt"
          aria-hidden="true"
          style={{ left: active.x, top: active.y, transform: 'translate(-50%, calc(-100% - 8px))' }}
        >
          {tipBody(active.r, active.c)}
        </div>
      )}

      <div className="an-heat-legend" aria-hidden="true">
        <span>{legendLabels[0]}</span>
        <span className="an-heat-ramp">
          <i style={{ background: 'var(--an-surface-3)' }} />
          {SEQ_RAMP.map(c => <i key={c} style={{ background: c }} />)}
        </span>
        <span>{legendLabels[1]}</span>
        {top > 0 && !display && <span className="an-heat-max">darkest = {fmtMetric(top, format)}</span>}
      </div>

      <SrTable
        caption={ariaLabel}
        headers={['', ...(hasMeta ? [typeof metaHeader === 'string' ? metaHeader : ''] : []), ...cols.map(c => c.title ?? c.label)]}
        rows={rows.map((r, ri) => [
          r.text ?? (typeof r.label === 'string' ? r.label : r.key),
          ...(hasMeta ? [typeof r.meta === 'string' || typeof r.meta === 'number' ? r.meta : ''] : []),
          ...cols.map((_, ci) => {
            const v = values[ri]?.[ci]
            return v == null ? '–' : (display ? display(v, ri, ci) : fmtMetric(v, format))
          }),
        ])}
      />
    </figure>
  )
}
