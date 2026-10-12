'use client'

import { useMemo } from 'react'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import RowFilter, { type RowFilterControl, type RowFilterOption, type RowSortOption } from '../ui/RowFilter'

/* ═══════════════════════════════════════════════════════════════════════
   CompanyFilterBar (spec 3.9, 4.8): filters and re-sorts the
   server-rendered CompanyTable rows on this page by their data-* values.

     Industry (select)  Country (select)  [Listed on InfoWebWorld]
     Filter companies...            Sort: Stars | Repos | Name | Good first issues

   Either select is left out when its options are not passed (a country
   page has no country select). Constants and useMemo keep the props
   RowFilter depends on stable (see ApiFilterBar).
   ═══════════════════════════════════════════════════════════════════════ */

const NOUN = { one: 'company', many: 'companies' } as const
const SEARCH = { label: 'Filter companies', placeholder: 'Filter companies...' } as const
const LISTED: RowFilterControl = { kind: 'toggle', key: 'listed', label: 'Listed on InfoWebWorld', attr: 'listed', value: '1', icon: faCircleCheck }
const SORTS: readonly RowSortOption[] = [
  { key: 'stars', label: 'Stars', attr: 'stars', type: 'number', dir: 'desc' },
  { key: 'repos', label: 'Repos', attr: 'repos', type: 'number', dir: 'desc' },
  { key: 'name', label: 'Name', attr: 'name', type: 'string', dir: 'asc' },
  { key: 'gfi', label: 'Good first issues', attr: 'gfi', type: 'number', dir: 'desc' },
]

export interface CompanyFilterBarProps {
  target: string
  industries?: readonly RowFilterOption[]
  countries?: readonly RowFilterOption[]
  label?: string
  className?: string
}

export default function CompanyFilterBar({ target, industries, countries, label = 'Filter companies', className }: CompanyFilterBarProps) {
  const controls = useMemo<readonly RowFilterControl[]>(() => {
    const list: RowFilterControl[] = []
    if (industries && industries.length > 1) {
      list.push({ kind: 'select', key: 'industry', label: 'Industry', attr: 'industry', allLabel: 'All industries', options: industries })
    }
    if (countries && countries.length > 1) {
      list.push({ kind: 'select', key: 'country', label: 'Country', attr: 'country', allLabel: 'All countries', options: countries })
    }
    list.push(LISTED)
    return list
  }, [industries, countries])

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
