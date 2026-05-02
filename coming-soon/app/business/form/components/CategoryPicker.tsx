'use client'
import { useMemo } from 'react'
import type { Category } from '../../../iww-hq/data/category-storage'
import CustomSelect from './CustomSelect'

type Props = {
  categories: Category[]
  l1Id: string
  l2Id: string
  l3Id: string
  errors?: { l1?: string; l2?: string; l3?: string }
  onChange: (l1: string, l2: string, l3: string) => void
}

/**
 * 3-step vertical cascading picker.
 * Each level is full-width. L2 appears after L1 is picked, L3 after L2.
 * No horizontal overflow issues.
 */
export default function CategoryPicker({ categories, l1Id, l2Id, l3Id, errors, onChange }: Props) {
  const l1s = useMemo(
    () => categories.filter(c => c.level === 1).sort((a, b) => a.sortOrder - b.sortOrder),
    [categories]
  )
  const l2s = useMemo(
    () => l1Id ? categories.filter(c => c.level === 2 && c.parentId === l1Id).sort((a, b) => a.sortOrder - b.sortOrder) : [],
    [categories, l1Id]
  )
  const l3s = useMemo(
    () => l2Id ? categories.filter(c => c.level === 3 && c.parentId === l2Id).sort((a, b) => a.sortOrder - b.sortOrder) : [],
    [categories, l2Id]
  )

  return (
    <div className="lf2-cat-stack">
      <div className={`lf2-cat-row${errors?.l1 ? ' lf2-cat-row--err' : ''}`}>
        <div className="lf2-cat-num">1</div>
        <div className="lf2-cat-col">
          <div className="lf2-cat-title">Sector</div>
          <CustomSelect
            value={l1Id}
            onChange={v => onChange(v, '', '')}
            options={l1s.map(c => ({ value: c.id, label: c.name, color: c.color }))}
            placeholder={`Pick a sector${l1s.length ? ` (${l1s.length})` : ''}`}
            searchable
          />
          {errors?.l1 && <div className="lf2-field-error">{errors.l1}</div>}
        </div>
      </div>

      {l1Id && (
        <div className={`lf2-cat-row${errors?.l2 ? ' lf2-cat-row--err' : ''}`}>
          <div className="lf2-cat-num">2</div>
          <div className="lf2-cat-col">
            <div className="lf2-cat-title">Category</div>
            <CustomSelect
              value={l2Id}
              onChange={v => onChange(l1Id, v, '')}
              options={l2s.map(c => ({ value: c.id, label: c.name, color: c.color }))}
              placeholder={l2s.length ? `Pick a category (${l2s.length})` : 'No categories in this sector'}
              disabled={l2s.length === 0}
              searchable
            />
            {errors?.l2 && <div className="lf2-field-error">{errors.l2}</div>}
          </div>
        </div>
      )}

      {l2Id && (
        <div className={`lf2-cat-row${errors?.l3 ? ' lf2-cat-row--err' : ''}`}>
          <div className="lf2-cat-num">3</div>
          <div className="lf2-cat-col">
            <div className="lf2-cat-title">Subcategory</div>
            <CustomSelect
              value={l3Id}
              onChange={v => onChange(l1Id, l2Id, v)}
              options={l3s.map(c => ({ value: c.id, label: c.name, color: c.color }))}
              placeholder={l3s.length ? `Pick a subcategory (${l3s.length})` : 'No subcategories here'}
              disabled={l3s.length === 0}
              searchable
            />
            {errors?.l3 && <div className="lf2-field-error">{errors.l3}</div>}
          </div>
        </div>
      )}
    </div>
  )
}
