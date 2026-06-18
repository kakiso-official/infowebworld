'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import { CATEGORIES, type StaticCategoryRow } from '../../config/categories-data'
import { updateSubmissionCategory } from '../data/submissions-storage'

/* ──────────────────────────────────────────────────────────────────────
   Admin category reassignment — full L1→L5 cascading picker.

   The owner submit form only picks L1–L3 (CategoryPicker), so when a
   customer files a listing under the wrong category, admins need a way to
   move it anywhere in the taxonomy. This reassigns submissions.category_id
   to the deepest category the admin selects; the listing's whole hierarchy
   is the ancestry of that one category. Saves via the focused
   PATCH /api/admin/submissions/[id]/category endpoint (touches category only).
   ────────────────────────────────────────────────────────────────────── */

const MAX_LEVELS = 5
const LEVEL_LABEL = ['Sector (L1)', 'Category (L2)', 'Subcategory (L3)', 'Level 4', 'Level 5']

const BY_ID = new Map<number, StaticCategoryRow>(CATEGORIES.map(c => [c.id, c]))
const L1 = CATEGORIES.filter(c => c.level === 1).sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name))
const childrenOf = (parentId: number) =>
  CATEGORIES.filter(c => c.parent_id === parentId).sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name))

/** Walk a category slug up its parents → [l1Id, l2Id, …, leafId]. Best-effort
 *  (slugs are effectively unique across the taxonomy); empty if not found. */
function pathForSlug(slug: string): number[] {
  if (!slug) return []
  let node: StaticCategoryRow | undefined = CATEGORIES.find(c => c.slug === slug)
  const path: number[] = []
  while (node) {
    path.unshift(node.id)
    node = node.parent_id != null ? BY_ID.get(node.parent_id) : undefined
  }
  return path
}

const lbl: CSSProperties = { display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--mute)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.03em' }
const chip: CSSProperties = { fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.04em', padding: '2px 7px', borderRadius: 5, flexShrink: 0 }

export default function CategoryReassign({
  submissionId, currentSlug, currentName, isLive, busy, onSaved, flash,
}: {
  submissionId: string
  currentSlug: string
  currentName: string
  isLive: boolean
  busy: boolean
  onSaved: () => void | Promise<void>
  flash: (kind: 'ok' | 'err', msg: string) => void
}) {
  const initial = useMemo(() => pathForSlug(currentSlug), [currentSlug])
  const [picks, setPicks] = useState<number[]>(initial)
  const [saving, setSaving] = useState(false)

  const originalLeaf = initial.length ? initial[initial.length - 1] : null
  const chosenLeaf = picks.length ? picks[picks.length - 1] : null
  const changed = chosenLeaf != null && chosenLeaf !== originalLeaf

  /* Visible dropdowns: L1 always, then each next level once its parent is
     chosen, stopping at the first level with no children (a leaf). */
  const levels: { options: StaticCategoryRow[]; value: string }[] = []
  for (let i = 0; i < MAX_LEVELS; i++) {
    let options: StaticCategoryRow[]
    if (i === 0) {
      options = L1
    } else {
      const parentId = picks[i - 1]
      if (parentId == null) break
      options = childrenOf(parentId)
    }
    if (options.length === 0) break
    levels.push({ options, value: picks[i] != null ? String(picks[i]) : '' })
  }

  const pick = (level: number, id: number) => {
    setPicks(prev => {
      const next = prev.slice(0, level)
      if (id) next[level] = id
      return next
    })
  }

  const currentPath = initial.map(id => BY_ID.get(id)?.name || '').filter(Boolean)
  const chosenPath = picks.map(id => BY_ID.get(id)?.name || '').filter(Boolean)

  const save = async () => {
    if (!changed || chosenLeaf == null || saving) return
    setSaving(true)
    try {
      const res = await updateSubmissionCategory(submissionId, chosenLeaf)
      if (!res?.ok) { flash('err', res?.error || 'Could not update category.'); return }
      flash('ok', `Category set to ${res.categoryName || BY_ID.get(chosenLeaf)?.name || 'selected'}.`)
      await onSaved()
    } catch {
      flash('err', 'Network error.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="sub-sec">
      <header className="sub-sec-h">
        <h3 className="sub-sec-title">Category &amp; hierarchy</h3>
        <span className="sub-sec-sub">Reassign the full path — sector down to the deepest level</span>
      </header>

      {/* Current location (read-only, for reference) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <span style={{ ...chip, background: 'rgba(107,114,128,.12)', color: 'var(--mute)' }}>Current</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#11181C' }}>
          {currentPath.length ? currentPath.join('  ›  ') : (currentName || '—')}
        </span>
      </div>

      {/* Cascading picker */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 10 }}>
        {levels.map((lv, i) => (
          <label key={i}>
            <span style={lbl}>{LEVEL_LABEL[i]}</span>
            <div className="sub-select" style={{ width: '100%' }}>
              <select
                value={lv.value}
                onChange={e => pick(i, Number(e.target.value))}
                aria-label={LEVEL_LABEL[i]}
              >
                <option value="">{i === 0 ? 'Pick a sector…' : 'Pick…'}</option>
                {lv.options.map(o => (
                  <option key={o.id} value={String(o.id)}>{o.name}</option>
                ))}
              </select>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </label>
        ))}
      </div>

      {/* New selection + save */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', flex: 1, minWidth: 200 }}>
          {chosenPath.length > 0 ? (
            <>
              <span style={{ ...chip, background: 'rgba(16,185,129,.14)', color: '#0C7A56' }}>New</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#11181C' }}>{chosenPath.join('  ›  ')}</span>
            </>
          ) : (
            <span style={{ fontSize: 12.5, color: 'var(--mute)' }}>Pick a sector to begin reassigning.</span>
          )}
        </div>
        <button
          className="sub-btn sub-btn--primary"
          onClick={save}
          disabled={!changed || busy || saving}
          title={changed ? 'Save the new category to this listing' : 'Choose a different category to enable'}
        >
          {saving ? 'Saving…' : 'Apply category'}
        </button>
      </div>

      {isLive && changed && (
        <p style={{ margin: '12px 0 0', fontSize: 12, color: 'var(--mute)', lineHeight: 1.5 }}>
          Live listing — category counts update immediately, but the public page rebuilds on the
          next deploy. Use “Rebuild static” above to refresh it now.
        </p>
      )}
    </section>
  )
}
