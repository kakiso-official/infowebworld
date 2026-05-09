'use client'

import { useMemo, useState } from 'react'
import CategoryPicker from '../components/CategoryPicker'
import PillToggle from '../components/PillToggle'
import type { CategoryStepProps } from '../types'
import type { TagGroup } from '../../../../iww-hq/data/tag-storage'

/* ──────────────────────────────────────────────────────────────────────
   Step 2 — Category & Classification.
   Two blocks: "Where you live" (category + specializations) and
   "How you describe yourself" (tag groups as collapsible accordion).
   See ./Step2Category.css companion classes (`df-step2-*` namespace).
   ────────────────────────────────────────────────────────────────────── */

export default function Step2Category({
  form, set, errors, caps, allCategories, listingTypes, tagGroups,
}: CategoryStepProps) {

  /* ── Breadcrumb summary derived from the form state. Shown only when
     at least L1 is picked. Each level only appears once the user reaches it. */
  const path = useMemo(() => {
    const find = (id: string) => allCategories.find(c => c.id === id)
    return [form.l1Id, form.l2Id, form.l3Id]
      .map(id => (id ? find(id)?.name || '' : ''))
      .filter(Boolean) as string[]
  }, [form.l1Id, form.l2Id, form.l3Id, allCategories])

  const totalGroups = tagGroups.length
  const groupsCovered = useMemo(
    () => tagGroups.filter(g => g.tags.some(t => form.tagIds.includes(t.id))).length,
    [tagGroups, form.tagIds],
  )

  return (
    <>
      <header className="df-section-head">
        <h2 className="df-section-title">Category &amp; classification</h2>
        <p className="df-section-sub">
          Two things: where your listing lives in our taxonomy, and how visitors filter for it.
        </p>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          BLOCK 1 — Category (the file-system path of your listing)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="df-step2-card">
        <header className="df-step2-card-head">
          <div className="df-step2-card-head-text">
            <h3 className="df-step2-card-title">Where does your listing live?</h3>
            <p className="df-step2-card-sub">
              Pick a sector, category, and subcategory. Your listing appears on those category pages
              and any owner-picked specializations.
            </p>
          </div>
          {path.length > 0 && (
            <span className="df-step2-progress">
              <span className={'df-step2-progress-dot' + (path.length >= 1 ? ' is-on' : '')} />
              <span className={'df-step2-progress-dot' + (path.length >= 2 ? ' is-on' : '')} />
              <span className={'df-step2-progress-dot' + (path.length >= 3 ? ' is-on' : '')} />
            </span>
          )}
        </header>

        {path.length > 0 && (
          <div className="df-step2-breadcrumb" role="status" aria-label="Selected category path">
            <CompassIcon />
            <ol className="df-step2-bc-list">
              {path.map((name, i) => (
                <li key={i} className="df-step2-bc-item">
                  <span>{name}</span>
                  {i < path.length - 1 && <span className="df-step2-bc-sep" aria-hidden="true">›</span>}
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="df-step2-card-body">
          <CategoryPicker
            categories={allCategories}
            l1Id={form.l1Id}
            l2Id={form.l2Id}
            l3Id={form.l3Id}
            errors={{ l1: errors.l1, l2: errors.l2, l3: errors.l3 }}
            onChange={(l1, l2, l3) => {
              set('l1Id', l1)
              set('l2Id', l2)
              set('l3Id', l3)
            }}
          />

          {/* Specializations — only meaningful once L3 is picked. Live inside
              the same card because they're contextual to the subcategory. */}
          {form.l3Id && (
            <div className="df-step2-spec">
              <div className="df-step2-spec-head">
                <span className="df-step2-spec-label">Specializations</span>
                {listingTypes.length > 0 && (
                  <span className="df-step2-spec-count">
                    {form.listingTypeIds.length} of {listingTypes.length} selected
                  </span>
                )}
                <span className="df-step2-spec-hint">
                  Optional — pick the niches you serve so visitors filtering for them find you.
                </span>
              </div>
              {listingTypes.length > 0 ? (
                <PillToggle
                  options={listingTypes.map(t => t.name)}
                  selected={form.listingTypeIds
                    .map(id => listingTypes.find(t => t.id === id)?.name || '')
                    .filter(Boolean)}
                  onChange={names => {
                    const ids = names
                      .map(n => listingTypes.find(t => t.name === n)?.id || '')
                      .filter(Boolean)
                    set('listingTypeIds', ids)
                  }}
                />
              ) : (
                <div className="df-empty">No specializations defined for this subcategory yet.</div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          BLOCK 2 — Tag groups (how visitors filter & describe you)
          ═══════════════════════════════════════════════════════════════ */}
      {tagGroups.length > 0 && (
        <section className={'df-step2-card' + (errors.tagIds ? ' df-step2-card--err' : '')}>
          <header className="df-step2-card-head">
            <div className="df-step2-card-head-text">
              <h3 className="df-step2-card-title">How would you describe your business?</h3>
              <p className="df-step2-card-sub">
                Pick at least one tag in each group. These power the filter sidebar on category
                pages — visitors find you here.
              </p>
            </div>
            <span className={'df-step2-cover' + (groupsCovered === totalGroups ? ' is-done' : '')}>
              <strong>{groupsCovered}</strong>
              <span> of {totalGroups} done</span>
            </span>
          </header>

          <div className="df-step2-tg-list">
            {tagGroups.map((g, i) => (
              <TagGroupRow
                key={g.id}
                group={g}
                tagIds={form.tagIds}
                defaultOpen={i === 0}
                maxPerGroup={Math.max(1, Math.floor(caps.maxTags / Math.max(totalGroups, 1)) + 2)}
                onChange={ids => {
                  const otherGroups = form.tagIds.filter(id => !g.tags.some(t => t.id === id))
                  set('tagIds', [...otherGroups, ...ids])
                }}
              />
            ))}
          </div>

          {errors.tagIds && <div className="df-err df-step2-card-err">{errors.tagIds}</div>}
        </section>
      )}
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────── */
/* Tag group accordion row.

   Closed state shows: colored dot, name, count chip, and a strip of any
   currently-selected pills (so the user always sees what they picked even
   without expanding). Open state adds: description + the full PillToggle.
   First group is open by default; user toggles can override.                */

function TagGroupRow({
  group, tagIds, onChange, defaultOpen, maxPerGroup,
}: {
  group: TagGroup
  tagIds: string[]
  onChange: (next: string[]) => void
  defaultOpen?: boolean
  maxPerGroup: number
}) {
  const [open, setOpen] = useState(Boolean(defaultOpen))
  const selectedTags = useMemo(
    () => group.tags.filter(t => tagIds.includes(t.id)),
    [group.tags, tagIds],
  )
  const selectedCount = selectedTags.length
  const accent = group.color || '#6B7280'

  return (
    <div className={'df-step2-tg' + (open ? ' is-open' : '') + (selectedCount > 0 ? ' has-pick' : '')}>
      <button
        type="button"
        className="df-step2-tg-head"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className="df-step2-tg-dot" style={{ background: accent }} aria-hidden="true" />
        <span className="df-step2-tg-name">{group.name}</span>
        <span
          className={'df-step2-tg-count' + (selectedCount > 0 ? ' is-on' : '')}
          style={selectedCount > 0 ? { background: hexA(accent, 0.12), color: accent } : undefined}
        >
          {selectedCount > 0 ? `${selectedCount} selected` : 'Select'}
        </span>
        <ChevronIcon open={open} />
      </button>

      {/* Selected strip — visible even when the body is collapsed, so the
          user sees their picks at a glance. */}
      {!open && selectedCount > 0 && (
        <div className="df-step2-tg-strip" aria-label={`${group.name} selections`}>
          {selectedTags.map(t => (
            <span
              key={t.id}
              className="df-step2-tg-strip-pill"
              style={{ borderColor: hexA(accent, 0.4), color: accent }}
            >{t.name}</span>
          ))}
        </div>
      )}

      {open && (
        <div className="df-step2-tg-body">
          {group.description && <p className="df-step2-tg-desc">{group.description}</p>}
          <PillToggle
            options={group.tags.map(t => t.name)}
            selected={selectedTags.map(t => t.name)}
            onChange={names => {
              const ids = group.tags.filter(t => names.includes(t.name)).map(t => t.id)
              onChange(ids)
            }}
            max={maxPerGroup}
          />
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────── */
/* Tiny icons + helpers, kept inline to avoid one-off component files.    */

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"
      style={{ transition: 'transform .18s ease', transform: open ? 'rotate(180deg)' : 'none' }}
    >
      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CompassIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="m15 9-2 6-4 1 1-4 6-2-1-1Z" fill="currentColor" />
    </svg>
  )
}

/** Hex color → rgba with given alpha. Treats 3-char hex as expanded. */
function hexA(hex: string, alpha: number): string {
  const m = hex.replace('#', '').trim()
  const full = m.length === 3 ? m.split('').map(c => c + c).join('') : m
  if (full.length !== 6) return `rgba(107, 114, 128, ${alpha})` // neutral gray fallback
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
