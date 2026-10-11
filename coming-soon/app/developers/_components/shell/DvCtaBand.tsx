import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faBuilding } from '@fortawesome/free-solid-svg-icons'

/* ═══════════════════════════════════════════════════════════════════════
   Call-to-action card (spec 4.13): radius 20, petrol-to-coral wash with a
   soft coral corner glow, title, one line, primary button. Stacks to a
   centred column at <= 620. Copies the homepage final-CTA look without
   importing its CSS.
   ═══════════════════════════════════════════════════════════════════════ */

export interface DvCtaBandProps {
  title: string
  sub: string
  action: { href: string; label: string }
  icon?: IconDefinition
  tone?: 'white' | 'wash'
  /** Section id (anchor target / heading id seed). */
  id?: string
}

export default function DvCtaBand({ title, sub, action, icon = faBuilding, tone = 'white', id = 'dv-cta' }: DvCtaBandProps) {
  const headingId = `${id}-title`
  return (
    <section className={`dv-band dv-band--${tone} dv-band--tight`} aria-labelledby={headingId} id={id}>
      <div className="dv-wrap">
        <div className="dv-cta">
          <div className="dv-cta-text">
            <span className="dv-cta-icon" aria-hidden="true"><FontAwesomeIcon icon={icon} /></span>
            <h2 id={headingId} className="dv-cta-title">{title}</h2>
            <p className="dv-cta-sub">{sub}</p>
          </div>
          <div className="dv-cta-actions">
            <a className="dv-btn dv-btn--primary" href={action.href}>
              {action.label}
              <FontAwesomeIcon icon={faArrowRight} className="dv-btn-arrow" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
