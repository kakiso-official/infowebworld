import type { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'

/* ═══════════════════════════════════════════════════════════════════════
   Outbound link (spec 3.0): new tab, rel="noopener noreferrer", a small
   external icon and screen-reader text saying so. GitHub, docs and
   registry links are references and stay followed; provider marketing or
   pricing links pass `nofollow`.

   No hooks, so it renders in server and client components alike.
   ═══════════════════════════════════════════════════════════════════════ */

export interface DvExternalLinkProps {
  href: string
  children: ReactNode
  className?: string
  /** Adds rel="nofollow" (provider marketing and pricing pages). */
  nofollow?: boolean
  /** Show the trailing external-link icon (default true). */
  icon?: boolean
  title?: string
  'aria-label'?: string
}

export default function DvExternalLink({
  href, children, className, nofollow = false, icon = true, title, 'aria-label': ariaLabel,
}: DvExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel={nofollow ? 'nofollow noopener noreferrer' : 'noopener noreferrer'}
      className={className}
      title={title}
      aria-label={ariaLabel ? `${ariaLabel} (opens in a new tab)` : undefined}
    >
      {children}
      {icon && <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="dv-ext-icon" aria-hidden="true" />}
      {!ariaLabel && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  )
}
