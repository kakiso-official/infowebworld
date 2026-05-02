'use client'
import type { TagGroup } from '../../../iww-hq/data/tag-storage'
import Field from '../components/Field'
import StepHead from '../components/StepHead'
import { I } from '../icons'
import type { StepProps, PlanCaps } from '../types'

type Props = StepProps & { caps: PlanCaps; tagGroups: TagGroup[] }

export default function StepFeatures({ form, set, errors, caps, tagGroups }: Props) {
  const addFeature = () => { if (form.features.length >= caps.maxFeatures) return; set('features', [...form.features, '']) }
  const updateFeature = (i: number, v: string) => { const arr = [...form.features]; arr[i] = v; set('features', arr) }
  const removeFeature = (i: number) => {
    const arr = form.features.filter((_, j) => j !== i)
    set('features', arr.length ? arr : [''])
  }

  const toggleTag = (id: string) => {
    if (form.tagIds.includes(id)) set('tagIds', form.tagIds.filter(t => t !== id))
    else { if (form.tagIds.length >= caps.maxTags) return; set('tagIds', [...form.tagIds, id]) }
  }

  return (
    <div className="lf2-section">
      <StepHead icon={I.star} title="Features & tags"
        sub="Key bullets on your listing, plus discovery tags." />

      <Field label={`Key features (up to ${caps.maxFeatures})`} hint="Short bullets.">
        {form.features.map((f, i) => (
          <div key={i} className="lf2-list-row">
            <input type="text" className="lf2-input" value={f}
              onChange={e => updateFeature(i, e.target.value)}
              placeholder="One-click Stripe integration" maxLength={80} />
            {form.features.length > 1 && (
              <button type="button" className="lf2-icon-btn" onClick={() => removeFeature(i)} aria-label="Remove">{I.trash}</button>
            )}
          </div>
        ))}
        {form.features.length < caps.maxFeatures && (
          <button type="button" className="lf2-add-btn" onClick={addFeature}>{I.plus} Add feature</button>
        )}
      </Field>

      {tagGroups.length > 0 && caps.maxTags > 0 && (
        <>
          <div className="lf2-divider" />
          <h3 className="lf2-subsection-title">Tags</h3>
          <p className="lf2-subsection-sub">
            Pick <strong>at least 1 from every group</strong>. Up to {caps.maxTags} total.
          </p>
          {tagGroups.map(g => {
            const selectedInGroup = g.tags.filter(t => form.tagIds.includes(t.id)).length
            const unmet = selectedInGroup === 0
            return (
              <div key={g.id} className={`lf2-tag-group${unmet ? ' lf2-tag-group--unmet' : ''}`}>
                <div className="lf2-tag-group-label">
                  <span className="lf2-tag-dot" />
                  {g.name}
                  <span className={`lf2-tag-group-badge${unmet ? ' lf2-tag-group-badge--req' : ''}`}>
                    {unmet ? 'Pick 1+' : `${selectedInGroup} ✓`}
                  </span>
                </div>
                <div className="lf2-tag-pills">
                  {g.tags.map(t => {
                    const on = form.tagIds.includes(t.id)
                    return (
                      <button key={t.id} type="button"
                        className={`lf2-tag-pill${on ? ' lf2-tag-pill--on' : ''}`}
                        onClick={() => toggleTag(t.id)}>
                        {t.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
          <div className="lf2-tag-count">{form.tagIds.length} / {caps.maxTags} selected</div>
          {errors.tagIds && <div className="lf2-field-error">{errors.tagIds}</div>}
        </>
      )}
    </div>
  )
}
