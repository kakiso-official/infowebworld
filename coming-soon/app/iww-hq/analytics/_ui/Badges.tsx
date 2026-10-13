'use client'
import type { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { channelColor, pageTypeColor } from '../_lib/colors'
import { channelLabel, pageTypeLabel } from '../_lib/labels'

export type BadgeTone = 'neutral' | 'accent' | 'info' | 'good' | 'warn' | 'bad'

/**
 * Small rounded label. Tones: neutral (gray), accent (coral), info (blue),
 * good / warn / bad (status - always pair with an icon or clear text, never
 * color alone).
 */
export function Badge({ tone = 'neutral', icon, children, title, className }: {
  tone?: BadgeTone
  icon?: IconDefinition
  children: ReactNode
  title?: string
  className?: string
}) {
  return (
    <span className={`an-badge an-badge--${tone} ${className ?? ''}`} title={title}>
      {icon && <FontAwesomeIcon icon={icon} className="an-badge-icon" aria-hidden="true" />}
      {children}
    </span>
  )
}

/** Channel name with its chart-color dot (identity comes from the dot, text stays ink). */
export function ChannelBadge({ channel, label }: { channel: string | null | undefined; label?: string }) {
  return (
    <span className="an-chbadge">
      <span className="an-dot" style={{ background: channelColor(channel) }} aria-hidden="true" />
      {label ?? channelLabel(channel)}
    </span>
  )
}

/** Colored dot for a page type's family; the type name is in the title + sr text. */
export function PageTypeDot({ pageType }: { pageType: string | null | undefined }) {
  const label = pageTypeLabel(pageType)
  return (
    <span className="an-ptdot" style={{ background: pageTypeColor(pageType) }} title={label}>
      <span className="an-sr">{label}</span>
    </span>
  )
}

/** Page type as a neutral badge with its family dot. */
export function PageTypeBadge({ pageType }: { pageType: string | null | undefined }) {
  return (
    <span className="an-badge an-badge--neutral an-ptbadge">
      <span className="an-dot" style={{ background: pageTypeColor(pageType) }} aria-hidden="true" />
      {pageTypeLabel(pageType)}
    </span>
  )
}

/**
 * Pulsing green dot for "live / online now". Pass `label` to show text next
 * to it ("Live", "7 online"). The pulse stops under prefers-reduced-motion.
 */
export function LiveDot({ label, title = 'Active in the last 5 minutes' }: { label?: ReactNode; title?: string }) {
  return (
    <span className="an-live" title={title}>
      <span className="an-live-dot" aria-hidden="true" />
      {label != null ? <span className="an-live-label">{label}</span> : <span className="an-sr">Live</span>}
    </span>
  )
}
