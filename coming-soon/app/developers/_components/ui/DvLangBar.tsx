import type { CSSProperties } from 'react'
import { LANGUAGE_FALLBACK_COLOR } from '@/lib/developers/taxonomy'
import { formatPercent } from '@/lib/developers/format'
import { langStyle } from './LanguageDot'

/* ═══════════════════════════════════════════════════════════════════════
   Language bar (spec 4.9): a 10px stacked bar of languages by code size
   plus a legend ("dot TypeScript 62.4%"). Pure CSS, server-rendered.

   The bar is decorative (aria-hidden); the legend is the accessible list.
   At most `max` languages are drawn; the rest, and any language under
   `minPct`, are grouped as "Other". Shares come from `size` (bytes) or a
   ready `pct` (0-100).
   ═══════════════════════════════════════════════════════════════════════ */

export interface LangBarItem {
  name: string
  color: string | null
  /** Bytes (repo languages) or any other weight. */
  size?: number
  /** Ready-made share, 0-100 (company/dataset aggregates). */
  pct?: number
  /** Optional link for the legend entry (a language page). */
  href?: string
}

export interface DvLangBarProps {
  languages: readonly LangBarItem[]
  /** Languages drawn before the rest becomes "Other" (default 8). */
  max?: number
  /** Languages below this share join "Other" (default 0; repo pages use 1). */
  minPct?: number
  /** Legend decimals (default 1: '62.4%'). */
  decimals?: number
  /** Accessible name of the legend list. */
  label?: string
  legend?: boolean
  size?: 'md' | 'lg'
  className?: string
}

interface Segment { name: string; color: string; pct: number; href?: string; other?: boolean }

function toSegments(languages: readonly LangBarItem[], max: number, minPct: number): Segment[] {
  const hasPct = languages.every(l => typeof l.pct === 'number')
  const total = hasPct
    ? languages.reduce((s, l) => s + (l.pct ?? 0), 0)
    : languages.reduce((s, l) => s + Math.max(0, l.size ?? 0), 0)
  if (total <= 0) return []

  const rows = languages
    .map(l => ({
      name: l.name,
      color: l.color || LANGUAGE_FALLBACK_COLOR,
      href: l.href,
      pct: hasPct ? ((l.pct ?? 0) / total) * 100 : (Math.max(0, l.size ?? 0) / total) * 100,
    }))
    .filter(r => r.pct > 0)
    .sort((a, b) => b.pct - a.pct)

  const shown: Segment[] = []
  let other = 0
  for (const r of rows) {
    if (shown.length < max && r.pct >= minPct) shown.push(r)
    else other += r.pct
  }
  if (other > 0) shown.push({ name: 'Other', color: LANGUAGE_FALLBACK_COLOR, pct: other, other: true })
  return shown
}

export default function DvLangBar({
  languages, max = 8, minPct = 0, decimals = 1, label = 'Languages by code size', legend = true, size = 'md', className,
}: DvLangBarProps) {
  const segments = toSegments(languages, max, minPct)
  if (!segments.length) return null

  return (
    <div className={`dv-langbar${size === 'lg' ? ' dv-langbar--lg' : ''}${className ? ` ${className}` : ''}`}>
      <div className="dv-langbar-track" aria-hidden="true">
        {segments.map(s => (
          <span
            key={s.name}
            className="dv-langbar-seg"
            style={{ ...langStyle(s.color), width: `${s.pct}%` } as CSSProperties}
            title={`${s.name} ${formatPercent(s.pct, decimals)}`}
          />
        ))}
      </div>
      {legend && (
        <ul className="dv-langbar-legend" aria-label={label}>
          {segments.map(s => {
            const body = (
              <>
                <span className="dv-lang-dot" style={langStyle(s.color)} aria-hidden="true" />
                <span className="dv-lang-name">{s.name}</span>
                <span className="dv-langbar-pct">{formatPercent(s.pct, decimals)}</span>
              </>
            )
            return <li key={s.name}>{s.href && !s.other ? <a href={s.href}>{body}</a> : body}</li>
          })}
        </ul>
      )}
    </div>
  )
}
