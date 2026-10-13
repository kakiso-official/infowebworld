'use client'
import { useState, type ReactNode } from 'react'
import { fmtNumber, fmtPercent } from '..'

export interface ProportionSegment {
  key: string
  label: string
  /** Raw amount (visitors, samples...) or a 0..1 share - only the ratio matters. */
  value: number
  /** CSS color (a series slot or a status token) - identity, never text color. */
  color: string
  /** Icon shown next to the legend label (status needs icon + words, never color alone). */
  icon?: ReactNode
  /** Extra tooltip line ("1,204 visitors"). */
  detail?: ReactNode
}

/**
 * One horizontal bar split into parts of a whole (new vs returning visitors,
 * good / needs improvement / poor page loads). Parts are separated by a 2px
 * surface gap, the outer ends are rounded, and every part has a hover/focus
 * tooltip; the legend underneath repeats each label with its share, so
 * nothing depends on color alone.
 */
export function ProportionBar({ segments, height = 10, legend = true, ariaLabel, showCounts = false }: {
  segments: ProportionSegment[]
  height?: number
  legend?: boolean
  ariaLabel: string
  /** Legend shows the raw value next to the share (for counts, not 0..1 shares). */
  showCounts?: boolean
}) {
  const [active, setActive] = useState<string | null>(null)
  const total = segments.reduce((s, x) => s + Math.max(0, x.value), 0)
  const visible = segments.filter(s => s.value > 0)
  const summary = segments.map(s => `${s.label} ${fmtPercent(total ? s.value / total : 0, 0)}`).join(', ')

  return (
    <div className="an-ix-prop">
      <div className="an-ix-prop-track" style={{ height }} role="img" aria-label={`${ariaLabel}: ${summary}`}>
        {total === 0 ? (
          <span className="an-ix-prop-empty" />
        ) : visible.map(s => {
          const share = s.value / total
          const on = active === s.key
          return (
            <span
              key={s.key}
              className={'an-ix-prop-seg' + (on ? ' an-ix-prop-seg--on' : '')}
              style={{ flexGrow: s.value, background: s.color }}
              onPointerEnter={() => setActive(s.key)}
              onPointerLeave={() => setActive(null)}
              onPointerDown={() => setActive(s.key)}
            >
              {on && (
                <span className="an-tt an-ix-prop-tt" aria-hidden="true">
                  <span className="an-tt-head">{s.label}</span>
                  <b className="an-tt-val">{fmtPercent(share)}</b>
                  {s.detail && <span className="an-ix-prop-detail">{s.detail}</span>}
                </span>
              )}
            </span>
          )
        })}
      </div>
      {legend && (
        <ul className="an-ix-prop-legend">
          {segments.map(s => (
            <li key={s.key}>
              <span className="an-key an-key--rect" style={{ ['--k' as string]: s.color }} aria-hidden="true" />
              {s.icon}
              <span className="an-ix-prop-label">{s.label}</span>
              <b className="an-num">{fmtPercent(total ? s.value / total : 0, total && s.value / total < 0.1 ? 1 : 0)}</b>
              {showCounts && <span className="an-muted an-num">({fmtNumber(s.value)})</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
