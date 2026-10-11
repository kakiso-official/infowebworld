import { formatNumber, formatPercent, percentOf } from '@/lib/developers/format'

/* ═══════════════════════════════════════════════════════════════════════
   Stack bar (spec 4.9): the language-bar mechanics for a categorical mix
   (auth mix, CORS mix) with fixed tones: none = ok, API key = info,
   OAuth = brand, other = muted. The bar is decorative; the legend lists
   every part with its share and count. Zero parts are left out.
   ═══════════════════════════════════════════════════════════════════════ */

export type StackTone = 'ok' | 'info' | 'brand' | 'warn' | 'bad' | 'muted'

export interface StackSegment {
  label: string
  value: number
  tone: StackTone
}

export interface DvStackBarProps {
  segments: readonly StackSegment[]
  /** Visible heading above the bar, e.g. 'Auth mix'. */
  title?: string
  /** Accessible name of the legend list (defaults to the title). */
  label?: string
  /** Print the count after the share: 'No key 46.3% (882)'. */
  showCounts?: boolean
  className?: string
}

export default function DvStackBar({ segments, title, label, showCounts = true, className }: DvStackBarProps) {
  const parts = segments.filter(s => s.value > 0)
  const total = parts.reduce((s, p) => s + p.value, 0)
  if (!total) return null

  return (
    <div className={`dv-stackbar${className ? ` ${className}` : ''}`}>
      {title && (
        <div className="dv-stackbar-head">
          <span className="dv-label">{title}</span>
          <span className="dv-small dv-muted">{formatNumber(total)} total</span>
        </div>
      )}
      <div className="dv-stackbar-track" aria-hidden="true">
        {parts.map(p => (
          <span key={p.label} className="dv-stackbar-seg" data-tone={p.tone} style={{ width: `${percentOf(p.value, total)}%` }} />
        ))}
      </div>
      <ul className="dv-stackbar-legend" aria-label={label ?? title ?? 'Breakdown'}>
        {parts.map(p => (
          <li key={p.label}>
            <span className="dv-stackbar-key" data-tone={p.tone} aria-hidden="true" />
            <strong>{p.label}</strong>
            <span className="dv-stackbar-pct">
              {formatPercent(percentOf(p.value, total))}
              {showCounts && ` (${formatNumber(p.value)})`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
