'use client'

import { useMemo } from 'react'
import { faCubes, faGlobe, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons'
import RowFilter, { type RowFilterControl, type RowSortOption } from '../ui/RowFilter'

/* ═══════════════════════════════════════════════════════════════════════
   ApiFilterBar (spec 3.14, 4.8) - the category and collection page's
   client filter bar, built on the generic ui/RowFilter engine: No key,
   HTTPS, CORS and Has SDK toggles over the server-rendered ApiTable, plus
   a free-text filter box. Everything is visible and in order without JS;
   this island only toggles `hidden` on the table's data-* rows.

   `controls` and `sorts` are module-level constants (or memoised), not
   inline literals: RowFilter's effects depend on them by reference.
   ═══════════════════════════════════════════════════════════════════════ */

const NOUN = { one: 'API', many: 'APIs' } as const
const SORTS: readonly RowSortOption[] = []
const CONTROLS: readonly RowFilterControl[] = [
  { kind: 'toggle', key: 'nokey', label: 'No key', attr: 'auth', value: 'none', icon: faLockOpen },
  { kind: 'toggle', key: 'https', label: 'HTTPS', attr: 'https', value: '1', icon: faLock },
  { kind: 'toggle', key: 'cors', label: 'CORS', attr: 'cors', value: 'yes', icon: faGlobe },
  { kind: 'toggle', key: 'sdk', label: 'Has SDK', attr: 'sdk', value: '1', icon: faCubes },
]

export interface ApiFilterBarProps {
  /** id of the element holding the rows (ApiTable's <tbody>, ApiCompactList). */
  target: string
  /** Lowercase phrase for the search box ('weather APIs'). */
  scopeLabel: string
  /** Toggles to leave out because every row already matches them
   *  ('nokey' on the no-key collection). */
  omit?: readonly ('nokey' | 'https' | 'cors' | 'sdk')[]
  className?: string
}

export default function ApiFilterBar({ target, scopeLabel, omit, className }: ApiFilterBarProps) {
  const controls = useMemo(
    () => (omit && omit.length ? CONTROLS.filter(c => !(omit as readonly string[]).includes(c.key)) : CONTROLS),
    [omit],
  )
  const search = useMemo(() => ({ label: `Filter ${scopeLabel}`, placeholder: `Filter ${scopeLabel}...` }), [scopeLabel])
  return (
    <RowFilter
      target={target}
      label={`Filter ${scopeLabel}`}
      noun={NOUN}
      search={search}
      controls={controls}
      sorts={SORTS}
      sticky
      className={className}
    />
  )
}
