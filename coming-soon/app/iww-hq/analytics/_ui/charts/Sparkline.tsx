'use client'
import { useId } from 'react'
import { useElementWidth } from '../../_lib/hooks'
import { SERIES } from '../../_lib/colors'
import { areaPath, linePath } from './chart-utils'

/**
 * Tiny trend line for KPI tiles and table cells: no axes, no labels (the
 * number next to it carries the value). Fills its container's width;
 * decorative (aria-hidden) - always pair with the number it summarises.
 */
export function Sparkline({ values, height = 28, color = SERIES[0], className }: {
  values: (number | null)[]
  height?: number
  color?: string
  className?: string
}) {
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const gid = useId().replace(/:/g, '')
  const n = values.length
  const nums = values.filter((v): v is number => v != null && Number.isFinite(v))
  const max = Math.max(0, ...nums)
  const min = Math.min(0, ...nums)
  const pad = 3
  const span = max - min || 1
  const xs = values.map((_, i) => (n <= 1 ? width / 2 : pad + (i / (n - 1)) * (width - pad * 2)))
  const ys = values.map(v => (v == null ? null : pad + (1 - (v - min) / span) * (height - pad * 2)))
  const lastI = (() => { for (let i = n - 1; i >= 0; i--) if (ys[i] != null) return i; return -1 })()

  return (
    <div ref={ref} className={'an-spark ' + (className ?? '')} style={{ height }} aria-hidden="true">
      {width > 0 && n > 0 && (
        <svg width={width} height={height}>
          <defs>
            <linearGradient id={`s${gid}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.14} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={areaPath(xs, ys, height - pad)} fill={`url(#s${gid})`} />
          <path d={linePath(xs, ys)} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
          {lastI >= 0 && <circle cx={xs[lastI]} cy={ys[lastI]!} r={2.5} fill={color} />}
        </svg>
      )}
    </div>
  )
}
