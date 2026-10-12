'use client'

import { useMemo } from 'react'
import { faBoxArchive, faSeedling } from '@fortawesome/free-solid-svg-icons'
import RowFilter, { type RowFilterControl, type RowFilterOption, type RowSortOption } from '../ui/RowFilter'

/* ═══════════════════════════════════════════════════════════════════════
   RepoFilterBar (spec 3.6, 3.8, 3.11, 4.8): the repository lists' client
   filter bar on the generic RowFilter engine. It only hides and reorders
   the server-rendered rows of RepoRankTable / RepoTable (their data-*
   values); without JS every row is visible in rank order.

     Language (select, optional)  [Has good first issues]  [Hide archived]
     Filter repositories...                         Sort: Stars | Forks | Recently pushed

   "Hide archived" starts ON (archived projects no longer take
   contributions), so the count line can read "Showing 45 of 48".

   Sorts and fixed controls are module constants: RowFilter's effects
   depend on them by reference (see ApiFilterBar). The language select is
   built once per `languages` prop with useMemo for the same reason.
   ═══════════════════════════════════════════════════════════════════════ */

const NOUN = { one: 'repository', many: 'repositories' } as const

const GFI: RowFilterControl = { kind: 'toggle', key: 'gfi', label: 'Has good first issues', attr: 'gfi', value: '1', icon: faSeedling }
const ARCHIVED: RowFilterControl = {
  kind: 'toggle', key: 'archived', label: 'Hide archived', attr: 'archived', value: '1', mode: 'exclude', defaultOn: true, icon: faBoxArchive,
}
const FIXED: readonly RowFilterControl[] = [GFI, ARCHIVED]

const SORTS: readonly RowSortOption[] = [
  { key: 'stars', label: 'Stars', attr: 'stars', type: 'number', dir: 'desc' },
  { key: 'forks', label: 'Forks', attr: 'forks', type: 'number', dir: 'desc' },
  { key: 'pushed', label: 'Recently pushed', attr: 'pushed', type: 'number', dir: 'desc' },
]

export interface RepoFilterBarProps {
  /** id of the element holding the [data-row] rows. */
  target: string
  /** Language select options (value = language slug); omit on a language page. */
  languages?: readonly RowFilterOption[]
  /** Accessible name of the region ('Filter TypeScript repositories'). */
  label?: string
  className?: string
}

const SEARCH = { label: 'Filter repositories', placeholder: 'Filter repositories...' } as const

export default function RepoFilterBar({ target, languages, label = 'Filter repositories', className }: RepoFilterBarProps) {
  const controls = useMemo<readonly RowFilterControl[]>(() => (
    languages && languages.length > 1
      ? [{ kind: 'select', key: 'lang', label: 'Language', attr: 'lang', allLabel: 'All languages', options: languages }, ...FIXED]
      : FIXED
  ), [languages])

  return (
    <RowFilter
      target={target}
      label={label}
      noun={NOUN}
      search={SEARCH}
      controls={controls}
      sorts={SORTS}
      sticky
      className={className}
    />
  )
}
