import type { CSSProperties, ReactNode } from 'react'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DvBreadcrumbs, { type DvCrumb } from './DvBreadcrumbs'

/* ═══════════════════════════════════════════════════════════════════════
   Page header (spec 4.3) for detail, index and reading pages: white with a
   faint wash, 1px bottom line, 32/28px padding (24/20 at <= 768).

     Home / Developers / Open Source / Stripe            crumbs
     [notice]                                            e.g. archived repo
     [media]  kicker                                     [actions]
              H1 {title}<muted> by Stripe</muted>
              {sub}                                      (<code> + copy)
     [meta badges]
     lead
     * GitHub data from Oct 11, 2026 - How we check      dataLine
     ---------------------------------------------- aside (>= 980: 340px)
     below: stat strip, language bar, chips (full width)

   Every slot is optional except the crumbs and the title.
   ═══════════════════════════════════════════════════════════════════════ */

export interface DvPageHeaderProps {
  crumbs: readonly DvCrumb[]
  /** The H1. */
  title: ReactNode
  /** Muted tail inside the H1 (' by Stripe' on repo pages). */
  titleMuted?: ReactNode
  /** Id of the H1 (defaults to 'dv-title'). */
  titleId?: string
  kicker?: ReactNode
  /** A 56px icon tile left of the title (category, collection). */
  icon?: IconDefinition
  /** Any leading visual instead of `icon` (a 64px company avatar). */
  media?: ReactNode
  /** Line under the H1 ('<code>stripe/stripe-node</code> [copy]'). */
  sub?: ReactNode
  /** Buttons at the top right (View on GitHub, Docs). */
  actions?: ReactNode
  /** Badge row under the title. */
  meta?: ReactNode
  /** Intro copy: a string becomes one paragraph. */
  lead?: ReactNode
  /** The DvDataLine (or any small line) under the intro. */
  dataLine?: ReactNode
  /** A DvNotice shown above the title (archived repository). */
  notice?: ReactNode
  /** Right column at >= 980 (the "Listed on InfoWebWorld" card). */
  aside?: ReactNode
  /** Accessible name of the aside. */
  asideLabel?: string
  /** Full-width blocks under the header grid (stat strip, language bar). */
  below?: ReactNode
  /** Decorative 4px top border colour (language pages). */
  accent?: string | null
  width?: 'default' | 'wide'
  className?: string
}

export default function DvPageHeader({
  crumbs, title, titleMuted, titleId = 'dv-title', kicker, icon, media, sub, actions, meta, lead, dataLine, notice,
  aside, asideLabel = 'Summary', below, accent, width = 'default', className,
}: DvPageHeaderProps) {
  const leadNode = typeof lead === 'string' ? <p>{lead}</p> : lead
  const visual = media ?? (icon ? <span className="dv-ph-icon"><FontAwesomeIcon icon={icon} /></span> : null)
  const style = accent ? ({ '--dv-ph-accent': accent } as CSSProperties) : undefined

  return (
    <header className={`dv-ph${accent ? ' dv-ph--accent' : ''}${className ? ` ${className}` : ''}`} style={style}>
      <div className={width === 'wide' ? 'dv-wrap dv-wrap--wide' : 'dv-wrap'}>
        <DvBreadcrumbs items={crumbs} />
        {notice && <div className="dv-ph-notice">{notice}</div>}
        <div className={`dv-ph-grid${aside ? ' dv-ph-grid--aside' : ''}`}>
          <div className="dv-ph-main">
            <div className="dv-ph-top">
              {visual && <div className="dv-ph-media" aria-hidden={media ? undefined : true}>{visual}</div>}
              <div className="dv-ph-head">
                {kicker && <span className="dv-kicker">{kicker}</span>}
                <h1 id={titleId} className="dv-h1 dv-ph-title">
                  {title}
                  {titleMuted && <span className="dv-ph-title-muted">{titleMuted}</span>}
                </h1>
                {sub && <div className="dv-ph-sub">{sub}</div>}
              </div>
              {actions && <div className="dv-ph-actions">{actions}</div>}
            </div>
            {meta && <div className="dv-ph-meta">{meta}</div>}
            {leadNode && <div className="dv-lead dv-ph-lead">{leadNode}</div>}
            {dataLine && <div className="dv-ph-dataline">{dataLine}</div>}
          </div>
          {aside && <aside className="dv-ph-aside" aria-label={asideLabel}>{aside}</aside>}
        </div>
        {below && <div className="dv-ph-below">{below}</div>}
      </div>
    </header>
  )
}
