'use client'

import { useMemo } from 'react'
import { faComment } from '@fortawesome/free-solid-svg-icons'
import RowFilter, { type RowFilterControl, type RowFilterOption, type RowSortOption } from '../ui/RowFilter'

/* ═══════════════════════════════════════════════════════════════════════
   IssueFilterBar (spec 3.12, 4.8): filters and re-sorts the
   server-rendered IssueCard grid by its data-* values.

     Language (select, all-languages page only)  [No comments yet]
     Filter issues...           Sort: Newest | Most discussed | Most-starred repo
   ═══════════════════════════════════════════════════════════════════════ */

const NOUN = { one: 'issue', many: 'issues' } as const
const SEARCH = { label: 'Filter issues', placeholder: 'Filter issues...' } as const
const NO_COMMENTS: RowFilterControl = { kind: 'toggle', key: 'fresh', label: 'No comments yet', attr: 'nocomments', value: '1', icon: faComment }
const SORTS: readonly RowSortOption[] = [
  { key: 'new', label: 'Newest', attr: 'created', type: 'number', dir: 'desc' },
  { key: 'talk', label: 'Most discussed', attr: 'comments', type: 'number', dir: 'desc' },
  { key: 'stars', label: 'Most-starred repo', attr: 'stars', type: 'number', dir: 'desc' },
]

export interface IssueFilterBarProps {
  target: string
  languages?: readonly RowFilterOption[]
  label?: string
  className?: string
}

export default function IssueFilterBar({ target, languages, label = 'Filter good first issues', className }: IssueFilterBarProps) {
  const controls = useMemo<readonly RowFilterControl[]>(() => (
    languages && languages.length > 1
      ? [{ kind: 'select', key: 'lang', label: 'Language', attr: 'lang', allLabel: 'All languages', options: languages }, NO_COMMENTS]
      : [NO_COMMENTS]
  ), [languages])

  return (
    <RowFilter
      target={target}
      label={label}
      noun={NOUN}
      search={SEARCH}
      controls={controls}
      sorts={SORTS}
      className={className}
    />
  )
}
