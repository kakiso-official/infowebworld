import type { ReactNode } from 'react'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons'

/* ═══════════════════════════════════════════════════════════════════════
   Empty state (spec 4.13): dashed box, tinted icon circle, one sentence,
   one muted line, one action. No hooks, so client filter bars can render
   it too ("No weather APIs match these filters." + Clear filters).
   ═══════════════════════════════════════════════════════════════════════ */

export interface DvEmptyProps {
  title: string
  text?: ReactNode
  icon?: IconDefinition
  /** One action: a link (`.dv-btn` / `.dv-more`) or a button. */
  action?: ReactNode
  /** Heading level of the title (default 3). */
  level?: 2 | 3 | 4
  className?: string
}

export default function DvEmpty({ title, text, icon = faFolderOpen, action, level = 3, className }: DvEmptyProps) {
  const Heading = `h${level}` as 'h2' | 'h3' | 'h4'
  return (
    <div className={`dv-empty${className ? ` ${className}` : ''}`}>
      <span className="dv-empty-icon" aria-hidden="true"><FontAwesomeIcon icon={icon} /></span>
      <Heading className="dv-h3 dv-empty-title">{title}</Heading>
      {text && <p className="dv-empty-text">{text}</p>}
      {action && <div className="dv-empty-action">{action}</div>}
    </div>
  )
}
