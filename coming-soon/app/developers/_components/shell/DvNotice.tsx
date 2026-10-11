import type { ReactNode } from 'react'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBoxArchive, faCircleExclamation, faCircleInfo, faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'

/* ═══════════════════════════════════════════════════════════════════════
   Notice (spec 4.13): 3px bar in the tone colour, tinted background,
   icon, one sentence and an optional link. Tones: info, warn, bad, brand.
   ("This repository is archived on GitHub...", "This data is
   refreshing. Try again in a few minutes.")
   ═══════════════════════════════════════════════════════════════════════ */

export type NoticeTone = 'info' | 'warn' | 'bad' | 'brand'

const DEFAULT_ICON: Record<NoticeTone, IconDefinition> = {
  info: faCircleInfo,
  warn: faTriangleExclamation,
  bad: faCircleExclamation,
  brand: faCircleInfo,
}

export interface DvNoticeProps {
  tone?: NoticeTone
  icon?: IconDefinition
  children: ReactNode
  link?: { href: string; label: string }
  /** 'status' for live updates; default none (static notices). */
  role?: 'status' | 'alert'
  className?: string
}

/** Archived-repository icon, re-exported for the common archived notice. */
export const archivedIcon = faBoxArchive

export default function DvNotice({ tone = 'info', icon, children, link, role, className }: DvNoticeProps) {
  return (
    <div className={`dv-notice dv-notice--${tone}${className ? ` ${className}` : ''}`} role={role}>
      <FontAwesomeIcon icon={icon ?? DEFAULT_ICON[tone]} className="dv-notice-icon" aria-hidden="true" />
      <p className="dv-notice-body">
        {children}
        {link && <> <a href={link.href}>{link.label}</a></>}
      </p>
    </div>
  )
}
