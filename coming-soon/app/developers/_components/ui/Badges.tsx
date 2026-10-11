import type { ReactNode } from 'react'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBoxArchive, faCircleCheck, faCodeFork, faCreditCard, faKey, faLock, faLockOpen, faPlay,
  faScaleBalanced, faSeedling, faStar, faTriangleExclamation, faUnlock, faUserShield,
  faCircleExclamation, faGlobe,
} from '@fortawesome/free-solid-svg-icons'
import type { AuthType, IsoDateTime, Tri } from '@/lib/developers/types'
import { formatCompact, formatNumber } from '@/lib/developers/format'
import DvTime from './DvTime'

/* ═══════════════════════════════════════════════════════════════════════
   Every badge of spec 4.7. Pills carry a word next to their icon, so the
   colour is never the only signal. The tones map to the status pairs in
   tokens.css (each >= 6:1).

   A badge that would print a 0 count renders nothing (3.0 zero rule).
   No hooks: usable from server and client components.
   ═══════════════════════════════════════════════════════════════════════ */

export type BadgeTone = 'ok' | 'warn' | 'bad' | 'info' | 'brand' | 'neutral' | 'unknown'

export interface DvBadgeProps {
  tone?: BadgeTone
  icon?: IconDefinition
  title?: string
  className?: string
  children: ReactNode
}

/** Generic pill. Prefer the named badges below. */
export function DvBadge({ tone = 'neutral', icon, title, className, children }: DvBadgeProps) {
  return (
    <span className={`dv-badge dv-badge--${tone}${className ? ` ${className}` : ''}`} title={title}>
      {icon && <FontAwesomeIcon icon={icon} aria-hidden="true" />}
      {children}
    </span>
  )
}

/* ── Counts (inline meta, not pills) ─────────────────────────────────── */

export interface CountProps {
  count: number
  /** Larger type for stat-like placements. */
  size?: 'md' | 'lg'
  /** Print the grouped number ('44,112') instead of compact ('44.1k'). */
  full?: boolean
}

/** Star count: '44.1k' with the exact number in the tooltip and label. */
export function StarCount({ count, size = 'md', full = false }: CountProps) {
  const exact = `${formatNumber(count)} GitHub ${count === 1 ? 'star' : 'stars'}`
  return (
    <span className={`dv-count dv-count--star${size === 'lg' ? ' dv-count--lg' : ''}`} title={exact}>
      <FontAwesomeIcon icon={faStar} aria-hidden="true" />
      <span aria-hidden="true">{full ? formatNumber(count) : formatCompact(count)}</span>
      <span className="sr-only">{exact}</span>
    </span>
  )
}

/** Fork count: '1.1k'. */
export function ForkCount({ count, size = 'md', full = false }: CountProps) {
  const exact = `${formatNumber(count)} ${count === 1 ? 'fork' : 'forks'}`
  return (
    <span className={`dv-count dv-count--fork${size === 'lg' ? ' dv-count--lg' : ''}`} title={exact}>
      <FontAwesomeIcon icon={faCodeFork} aria-hidden="true" />
      <span aria-hidden="true">{full ? formatNumber(count) : formatCompact(count)}</span>
      <span className="sr-only">{exact}</span>
    </span>
  )
}

/* ── Open source ─────────────────────────────────────────────────────── */

/** SPDX license id in <code>; a missing license reads as a warning. */
export function LicenseBadge({ spdx }: { spdx: string | null | undefined }) {
  if (!spdx || spdx === 'NOASSERTION' || spdx.toLowerCase() === 'other') {
    return <DvBadge tone="warn" icon={faCircleExclamation}>No license found</DvBadge>
  }
  return (
    <DvBadge tone="neutral" icon={faScaleBalanced} title={`License: ${spdx}`}>
      <span className="sr-only">License </span>
      <code>{spdx}</code>
    </DvBadge>
  )
}

/** '3 good first issues'. Nothing for 0. */
export function GfiBadge({ count }: { count: number }) {
  if (!count) return null
  return (
    <DvBadge tone="ok" icon={faSeedling}>
      {formatNumber(count)} good first {count === 1 ? 'issue' : 'issues'}
    </DvBadge>
  )
}

export function ArchivedBadge() {
  return <DvBadge tone="warn" icon={faBoxArchive}>Archived</DvBadge>
}

/** GitHub's own verified-domain flag, shown as-is. */
export function VerifiedOrgBadge() {
  return (
    <DvBadge tone="info" icon={faCircleCheck} title="GitHub shows this organization's domain as verified">
      GitHub verified org
    </DvBadge>
  )
}

/* ── Free APIs ───────────────────────────────────────────────────────── */

const AUTH_LABEL: Record<AuthType, string> = {
  none: 'No key',
  apiKey: 'API key',
  OAuth: 'OAuth',
  'X-Mashape-Key': 'X-Mashape-Key',
  'User-Agent': 'User-Agent header',
  other: 'Other auth',
}

/** Plain-text auth label ('No key', 'API key', 'OAuth'), for table cells
 *  and sentences that do not want a pill. */
export function authLabel(auth: AuthType, raw?: string | null): string {
  if (auth === 'other' && raw) return raw
  return AUTH_LABEL[auth] ?? raw ?? 'Other auth'
}

export function AuthBadge({ auth, raw }: { auth: AuthType; raw?: string | null }) {
  if (auth === 'none') return <DvBadge tone="ok" icon={faLockOpen}>No key</DvBadge>
  if (auth === 'apiKey') return <DvBadge tone="info" icon={faKey}>API key</DvBadge>
  if (auth === 'OAuth') return <DvBadge tone="info" icon={faUserShield}>OAuth</DvBadge>
  return <DvBadge tone="neutral" icon={faKey}>{authLabel(auth, raw)}</DvBadge>
}

export function HttpsBadge({ https }: { https: boolean }) {
  return https
    ? <DvBadge tone="ok" icon={faLock}>HTTPS</DvBadge>
    : <DvBadge tone="warn" icon={faUnlock}>HTTP only</DvBadge>
}

/** CORS: 'unknown' is a dashed neutral pill, never shown as a failure. */
export function CorsBadge({ cors }: { cors: Tri }) {
  if (cors === 'yes') {
    return <DvBadge tone="ok" icon={faGlobe} title="Browser JavaScript can call this API (CORS enabled)">CORS</DvBadge>
  }
  if (cors === 'no') return <DvBadge tone="neutral" title="Browser JavaScript cannot call this API directly">No CORS</DvBadge>
  return <DvBadge tone="unknown" title="CORS support is not documented">CORS unknown</DvBadge>
}

export interface StatusBadgeProps {
  status: 'alive' | 'blocked'
  /** Runtime counter of consecutive failed checks (6.5); 2+ shows the bad state. */
  failedChecks?: number
  /** When the link was last checked; printed after the label. */
  checkedAt?: IsoDateTime | null
}

export function StatusBadge({ status, failedChecks = 0, checkedAt }: StatusBadgeProps) {
  const when = checkedAt ? <> <DvTime iso={checkedAt} /></> : null
  if (failedChecks >= 2) {
    return <DvBadge tone="bad" icon={faTriangleExclamation}>Failed last 2 checks{when}</DvBadge>
  }
  if (status === 'blocked') {
    return (
      <DvBadge
        tone="warn"
        icon={faTriangleExclamation}
        title="The site blocked our automated check. It is probably fine; open it to confirm."
      >
        Could not auto-check{when}
      </DvBadge>
    )
  }
  return <DvBadge tone="ok" icon={faCircleCheck}>Link OK{when}</DvBadge>
}

/** 'Verified Oct 11, 2026'. The caller decides eligibility (enriched,
 *  check.ok and lastVerified at most 30 days old). */
export function VerifiedBadge({ date }: { date: IsoDateTime }) {
  return (
    <DvBadge tone="brand" icon={faCircleCheck} title="Our check ran the sample request on this date and got a valid response">
      Verified <DvTime iso={date} />
    </DvBadge>
  )
}

export function TryableBadge() {
  return <DvBadge tone="info" icon={faPlay}>Try in browser</DvBadge>
}

export function OfficialBadge({ official }: { official: boolean }) {
  return official
    ? <DvBadge tone="ok" icon={faCircleCheck} title="Published by the API provider">Official</DvBadge>
    : <DvBadge tone="neutral" title="Published by the community, not the API provider">Community</DvBadge>
}

/** Only when the provider documents it (requiresCard non-null). */
export function CardBadge({ requiresCard }: { requiresCard: boolean | null | undefined }) {
  if (requiresCard === null || requiresCard === undefined) return null
  return requiresCard
    ? <DvBadge tone="neutral" icon={faCreditCard}>Card required</DvBadge>
    : <DvBadge tone="ok" icon={faCreditCard}>No card needed</DvBadge>
}
