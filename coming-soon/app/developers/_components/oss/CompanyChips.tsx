import { formatNumber } from '@/lib/developers/format'
import OrgAvatar from '../ui/OrgAvatar'

/* ═══════════════════════════════════════════════════════════════════════
   Company link pills (spec 3.11, 3.12): "Companies writing TypeScript",
   "Companies with the most good first issues". Avatar, name and an
   optional count bubble; plain crawlable links to the company pages.
   ═══════════════════════════════════════════════════════════════════════ */

export interface CompanyChip {
  name: string
  href: string
  avatarUrl: string | null
  count?: number
  /** What the count is, for screen readers ('12 projects'). */
  countLabel?: string
}

export interface CompanyChipsProps {
  items: readonly CompanyChip[]
  /** Accessible name of the list. */
  label: string
  className?: string
}

export default function CompanyChips({ items, label, className }: CompanyChipsProps) {
  if (!items.length) return null
  return (
    <ul className={`dv-cochips${className ? ` ${className}` : ''}`} aria-label={label}>
      {items.map(c => (
        <li key={c.href}>
          <a className="dv-cochip" href={c.href}>
            <OrgAvatar src={c.avatarUrl} name={c.name} size={20} />
            <span>{c.name}</span>
            {typeof c.count === 'number' && c.count > 0 && (
              <span className="dv-chip-count">
                <span aria-hidden="true">{formatNumber(c.count)}</span>
                <span className="sr-only">, {c.countLabel ?? formatNumber(c.count)}</span>
              </span>
            )}
          </a>
        </li>
      ))}
    </ul>
  )
}
