'use client'

import { useMemo } from 'react'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import RowFilter, { type RowFilterControl, type RowFilterOption, type RowSortOption } from '../ui/RowFilter'

/* ═══════════════════════════════════════════════════════════════════════
   SdkFilterBar (spec 3.17): "Official only" (on by default), a category
   select and Recently published / API name sorting over the
   server-rendered SdkRowsTable rows. Without JS every package shows,
   official and community, newest first.
   ═══════════════════════════════════════════════════════════════════════ */

const NOUN = { one: 'package', many: 'packages' } as const
const SEARCH = { label: 'Filter packages', placeholder: 'Filter packages...' } as const
const OFFICIAL: RowFilterControl = {
  kind: 'toggle', key: 'official', label: 'Official only', attr: 'official', value: '1', defaultOn: true, icon: faCircleCheck,
}
const SORTS: readonly RowSortOption[] = [
  { key: 'new', label: 'Recently published', attr: 'published', type: 'number', dir: 'desc' },
  { key: 'name', label: 'API name', attr: 'name', type: 'string', dir: 'asc' },
]

export interface SdkFilterBarProps {
  target: string
  categories?: readonly RowFilterOption[]
  /** Show the "Official only" toggle (only when community packages exist). */
  officialToggle?: boolean
  label?: string
  className?: string
}

export default function SdkFilterBar({ target, categories, officialToggle = true, label = 'Filter SDK packages', className }: SdkFilterBarProps) {
  const controls = useMemo<readonly RowFilterControl[]>(() => {
    const list: RowFilterControl[] = []
    if (categories && categories.length > 1) {
      list.push({ kind: 'select', key: 'cat', label: 'Category', attr: 'category', allLabel: 'All categories', options: categories })
    }
    if (officialToggle) list.push(OFFICIAL)
    return list
  }, [categories, officialToggle])

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
