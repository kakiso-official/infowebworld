import type { CSSProperties, ReactNode } from 'react'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DvBreadcrumbs, { type DvCrumb } from './DvBreadcrumbs'

/* ═══════════════════════════════════════════════════════════════════════
   Hero header (spec 3.1, 3.5, 3.11, 3.13), the top of hubs and facet pages.

     variant="hub"   section hubs: big display H1, the petrol glow, dot
                     lattice and coral orb; `aside` makes a 56/44 split at
                     >= 980 (the hub's terminal card) and drops below
                     the text on smaller screens.
     variant="page"  index and facet pages: page-size H1, softer wash.
     compact         less vertical padding.
     align="center"  centred column (the free APIs hub).
     accent          4px top border in a colour (language pages use the
                     language colour; decorative only).

   Children are the hero body: search box, badges, buttons, stat strip,
   chips, in that visual rhythm (18px apart).
   ═══════════════════════════════════════════════════════════════════════ */

export interface DvHeroProps {
  variant?: 'hub' | 'page'
  compact?: boolean
  align?: 'left' | 'center'
  /** Breadcrumb trail shown above the title. */
  crumbs?: readonly DvCrumb[]
  /** Kicker pill above the H1 ('InfoWebWorld for Developers'). */
  kicker?: string
  kickerIcon?: IconDefinition
  /** The H1. */
  title: ReactNode
  /** Id of the H1 (defaults to 'dv-title'). */
  titleId?: string
  /** One or two sentences under the H1. */
  lead?: ReactNode
  /** Right-hand column at >= 980 (split hero). */
  aside?: ReactNode
  /** Decorative 4px top border colour. */
  accent?: string | null
  /** Show the glow / lattice / orb decoration (default: hub only). */
  deco?: boolean
  className?: string
  children?: ReactNode
}

export default function DvHero({
  variant = 'page', compact = false, align = 'left', crumbs, kicker, kickerIcon, title, titleId = 'dv-title', lead,
  aside, accent, deco, className, children,
}: DvHeroProps) {
  const showDeco = deco ?? variant === 'hub'
  const cls = [
    'dv-hero',
    `dv-hero--${variant}`,
    compact && 'dv-hero--compact',
    align === 'center' && 'dv-hero--center',
    accent && 'dv-hero--accent',
    className,
  ].filter(Boolean).join(' ')
  const style = accent ? ({ '--dv-hero-accent': accent } as CSSProperties) : undefined

  return (
    <header className={cls} style={style}>
      {showDeco && (
        <div className="dv-hero-deco" aria-hidden="true">
          <span className="dv-hero-glow" />
          <span className="dv-hero-lattice" />
          <span className="dv-hero-orb" />
        </div>
      )}
      <div className="dv-wrap">
        {crumbs && crumbs.length > 0 && <DvBreadcrumbs items={crumbs} />}
        <div className={`dv-hero-grid${aside ? ' dv-hero-grid--split' : ''}`}>
          <div className="dv-hero-main">
            {kicker && (
              <span className="dv-kicker">
                {kickerIcon && <FontAwesomeIcon icon={kickerIcon} aria-hidden="true" />}
                {kicker}
              </span>
            )}
            <h1 id={titleId} className={`${variant === 'hub' ? 'dv-display' : 'dv-h1'} dv-hero-title`}>{title}</h1>
            {lead && <p className="dv-lead dv-hero-lead">{lead}</p>}
            {children && <div className="dv-hero-body">{children}</div>}
          </div>
          {aside && <div className="dv-hero-aside">{aside}</div>}
        </div>
      </div>
    </header>
  )
}
