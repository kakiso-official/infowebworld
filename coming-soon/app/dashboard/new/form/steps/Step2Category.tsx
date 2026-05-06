'use client'
import Field from '../components/Field'
import CategoryPicker from '../components/CategoryPicker'
import PillToggle from '../components/PillToggle'
import type { CategoryStepProps } from '../types'

export default function Step2Category({
  form, set, errors, caps, allCategories, listingTypes, tagGroups,
}: CategoryStepProps) {
  return (
    <>
      <header className="df-section-head">
        <h2 className="df-section-title">Category &amp; tags</h2>
        <p className="df-section-sub">
          Where your listing shows up. Pick a sector, category and subcategory, then choose
          your specializations and tags.
        </p>
      </header>

      <Field label="Category" required error={errors.l1 || errors.l2 || errors.l3}>
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
      </Field>

      <Field
        label="Specializations"
        error={errors.listingTypeIds}
        hint={form.l3Id ? 'Optional — pick any niches you serve.' : 'Pick a subcategory above to see specializations.'}
      >
        {form.l3Id && listingTypes.length > 0 ? (
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
          <div className="df-empty">
            {form.l3Id
              ? 'No specializations defined for this subcategory yet.'
              : 'Pick a subcategory first.'}
          </div>
        )}
      </Field>

      {tagGroups.length > 0 && (
        <Field label="Tags" required error={errors.tagIds}
          hint={`Pick at least one tag per group (${tagGroups.length} groups).`}>
          <div className="df-tag-groups">
            {tagGroups.map(g => (
              <div key={g.id} className="df-tag-group">
                <div className="df-tag-group-head">
                  <span className="df-tag-dot" style={{ background: g.color || '#6B7280' }} />
                  <span className="df-tag-group-name">{g.name}</span>
                </div>
                <PillToggle
                  options={g.tags.map(t => t.name)}
                  selected={form.tagIds
                    .map(id => g.tags.find(t => t.id === id)?.name || '')
                    .filter(Boolean)}
                  onChange={names => {
                    const groupIds = g.tags.filter(t => names.includes(t.name)).map(t => t.id)
                    const otherGroups = form.tagIds.filter(id => !g.tags.some(t => t.id === id))
                    set('tagIds', [...otherGroups, ...groupIds])
                  }}
                  max={Math.max(1, Math.floor(caps.maxTags / Math.max(tagGroups.length, 1)) + 2)}
                />
              </div>
            ))}
          </div>
        </Field>
      )}
    </>
  )
}
