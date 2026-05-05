'use client'
import { useMemo } from 'react'
import type { Category } from '../../../../iww-hq/data/category-storage'
import Select from './Select'

type Props = {
  categories: Category[]
  l1Id: string
  l2Id: string
  l3Id: string
  errors?: { l1?: string; l2?: string; l3?: string }
  onChange: (l1: string, l2: string, l3: string) => void
}

export default function CategoryPicker({ categories, l1Id, l2Id, l3Id, errors, onChange }: Props) {
  const l1s = useMemo(
    () => categories.filter(c => c.level === 1).sort((a, b) => a.sortOrder - b.sortOrder),
    [categories],
  )
  const l2s = useMemo(
    () => l1Id ? categories.filter(c => c.level === 2 && c.parentId === l1Id).sort((a, b) => a.sortOrder - b.sortOrder) : [],
    [categories, l1Id],
  )
  const l3s = useMemo(
    () => l2Id ? categories.filter(c => c.level === 3 && c.parentId === l2Id).sort((a, b) => a.sortOrder - b.sortOrder) : [],
    [categories, l2Id],
  )

  return (
    <div className="df-cat-stack">
      <div className={'df-cat-row' + (errors?.l1 ? ' df-cat-row--err' : '')}>
        <div className="df-cat-num">1</div>
        <div className="df-cat-col">
          <div className="df-cat-title">Sector</div>
          <Select
            value={l1Id}
            onChange={v => onChange(v, '', '')}
            options={l1s.map(c => ({ value: c.id, label: c.name, color: c.color }))}
            placeholder={`Pick a sector${l1s.length ? ` (${l1s.length})` : ''}`}
            searchable
          />
          {errors?.l1 && <div className="df-err">{errors.l1}</div>}
        </div>
      </div>

      {l1Id && (
        <div className={'df-cat-row' + (errors?.l2 ? ' df-cat-row--err' : '')}>
          <div className="df-cat-num">2</div>
          <div className="df-cat-col">
            <div className="df-cat-title">Category</div>
            <Select
              value={l2Id}
              onChange={v => onChange(l1Id, v, '')}
              options={l2s.map(c => ({ value: c.id, label: c.name, color: c.color }))}
              placeholder={l2s.length ? `Pick a category (${l2s.length})` : 'No categories in this sector'}
              disabled={l2s.length === 0}
              searchable
            />
            {errors?.l2 && <div className="df-err">{errors.l2}</div>}
          </div>
        </div>
      )}

      {l2Id && (
        <div className={'df-cat-row' + (errors?.l3 ? ' df-cat-row--err' : '')}>
          <div className="df-cat-num">3</div>
          <div className="df-cat-col">
            <div className="df-cat-title">Subcategory</div>
            <Select
              value={l3Id}
              onChange={v => onChange(l1Id, l2Id, v)}
              options={l3s.map(c => ({ value: c.id, label: c.name, color: c.color }))}
              placeholder={l3s.length ? `Pick a subcategory (${l3s.length})` : 'No subcategories here'}
              disabled={l3s.length === 0}
              searchable
            />
            {errors?.l3 && <div className="df-err">{errors.l3}</div>}
          </div>
        </div>
      )}
    </div>
  )
}
