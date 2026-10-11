import type { CSSProperties } from 'react'
import { LANGUAGE_FALLBACK_COLOR } from '@/lib/developers/taxonomy'

/* ═══════════════════════════════════════════════════════════════════════
   GitHub language dot (spec 4.7): a 10px circle in the language colour
   from the data (grey when GitHub has none), always printed next to the
   language name - colour never carries meaning alone.

   `dotOnly` renders just the decorative dot for places that already print
   the name themselves (bar list labels, legends).
   ═══════════════════════════════════════════════════════════════════════ */

export interface LanguageDotProps {
  name: string
  color?: string | null
  dotOnly?: boolean
  className?: string
}

export function langStyle(color: string | null | undefined): CSSProperties {
  return { '--lang': color || LANGUAGE_FALLBACK_COLOR } as CSSProperties
}

export default function LanguageDot({ name, color, dotOnly = false, className }: LanguageDotProps) {
  const dot = <span className="dv-lang-dot" style={langStyle(color)} aria-hidden="true" />
  if (dotOnly) return dot
  return (
    <span className={className ? `dv-lang ${className}` : 'dv-lang'}>
      {dot}
      <span className="dv-lang-name">{name}</span>
    </span>
  )
}
