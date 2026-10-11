import type { ReactNode } from 'react'
import { slugify } from '@/lib/developers/paths'

/* ═══════════════════════════════════════════════════════════════════════
   Page band (spec 4.3): a full-width <section aria-labelledby> in one of
   three tones - white, wash (alternating) or navy (one featured band per
   page) - with an optional heading block (kicker, H2, sub, action link)
   and a centred content column.

   The heading id comes from `id` or the title, so each band is a
   labelled region. Two adjacent bands of the same tone drop the seam.
   ═══════════════════════════════════════════════════════════════════════ */

export interface DvBandProps {
  tone?: 'white' | 'wash' | 'navy'
  /** Section id (anchor target); also seeds the heading id. */
  id?: string
  title?: string
  /** Rich heading content (must read the same as `title`). */
  titleNode?: ReactNode
  kicker?: string
  sub?: ReactNode
  /** Right-aligned link next to the heading ("All 51 categories ->"). */
  action?: ReactNode
  /** Centred content under the band ("Show all" buttons). */
  foot?: ReactNode
  align?: 'left' | 'center'
  width?: 'default' | 'wide' | 'read'
  /** Less vertical padding. */
  tight?: boolean
  /** Accessible name when the band has no visible title. */
  label?: string
  headingLevel?: 2 | 3
  className?: string
  children?: ReactNode
}

export default function DvBand({
  tone = 'white', id, title, titleNode, kicker, sub, action, foot, align = 'left', width = 'default',
  tight = false, label, headingLevel = 2, className, children,
}: DvBandProps) {
  const headingId = title ? `${id ?? `dv-${slugify(title)}`}-title` : undefined
  const Heading = headingLevel === 3 ? 'h3' : 'h2'
  const wrap = width === 'wide' ? 'dv-wrap dv-wrap--wide' : width === 'read' ? 'dv-wrap dv-wrap--read' : 'dv-wrap'

  return (
    <section
      id={id}
      className={`dv-band dv-band--${tone}${tight ? ' dv-band--tight' : ''}${className ? ` ${className}` : ''}`}
      aria-labelledby={headingId}
      aria-label={headingId ? undefined : label}
    >
      <div className={wrap}>
        {title && (
          <div className={`dv-band-head${align === 'center' ? ' dv-band-head--center' : ''}`}>
            <div className="dv-band-head-text">
              {kicker && <span className="dv-label dv-band-kicker">{kicker}</span>}
              <Heading id={headingId} className="dv-h2 dv-band-title">{titleNode ?? title}</Heading>
              {sub && <p className="dv-lead dv-band-sub">{sub}</p>}
            </div>
            {action && <div className="dv-band-action">{action}</div>}
          </div>
        )}
        {children}
        {foot && <div className="dv-band-foot">{foot}</div>}
      </div>
    </section>
  )
}
