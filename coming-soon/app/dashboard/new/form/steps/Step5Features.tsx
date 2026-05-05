'use client'
import Field from '../components/Field'
import ChipInput from '../components/ChipInput'
import PillToggle from '../components/PillToggle'
import { SUPPORT_CHANNEL_OPTIONS, TRAINING_OPTION_OPTIONS } from '../constants'
import type { StepProps, KeyFeature } from '../types'

export default function Step5Features({ form, set, errors, caps }: StepProps) {
  const updateKeyFeature = (i: number, patch: Partial<KeyFeature>) => {
    const arr = [...form.keyFeatures]
    arr[i] = { ...arr[i], ...patch }
    set('keyFeatures', arr)
  }
  const addKeyFeature = () => {
    if (form.keyFeatures.length >= caps.maxKeyFeatures) return
    set('keyFeatures', [...form.keyFeatures, { name: '', description: '' }])
  }
  const removeKeyFeature = (i: number) =>
    set('keyFeatures', form.keyFeatures.filter((_, j) => j !== i))

  return (
    <>
      <header className="df-section-head">
        <h2 className="df-section-title">Features &amp; integrations</h2>
        <p className="df-section-sub">
          The full feature catalog, top-3 deep-dives, integrations, and support channels.
        </p>
      </header>

      <Field label={`All features (max ${caps.maxFeatures})`} required error={errors.features}
        hint="The flat catalog shown in your listing's &ldquo;All features&rdquo; matrix.">
        <ChipInput
          values={form.features}
          onChange={v => set('features', v)}
          placeholder="e.g. Drag & drop builder"
          max={caps.maxFeatures}
        />
      </Field>

      {caps.hasKeyFeatures ? (
        <Field label={`Key features (max ${caps.maxKeyFeatures})`} error={errors.keyFeatures}
          hint="3-6 most important features with a paragraph each. Shown at the top of the features section.">
          {form.keyFeatures.map((kf, i) => (
            <div key={i} className="df-kf-row">
              <input
                type="text"
                className="df-input df-kf-name"
                value={kf.name}
                onChange={e => updateKeyFeature(i, { name: e.target.value })}
                placeholder={`Feature ${i + 1} name`}
                maxLength={80}
              />
              <textarea
                className="df-textarea df-kf-desc"
                value={kf.description}
                onChange={e => updateKeyFeature(i, { description: e.target.value })}
                placeholder="Describe what this feature does and why it matters."
                rows={3}
                maxLength={1000}
              />
              <button type="button" className="df-icon-btn df-kf-rm" onClick={() => removeKeyFeature(i)} aria-label="Remove">
                <svg viewBox="0 0 24 24" width="14" height="14"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
            </div>
          ))}
          {form.keyFeatures.length < caps.maxKeyFeatures && (
            <button type="button" className="df-add-btn" onClick={addKeyFeature}>+ Add key feature</button>
          )}
        </Field>
      ) : (
        <Field label="Key features (rich)" lockedReason="Upgrade for rich feature blocks">
          <div className="df-locked-preview">
            Top 3-6 features with full paragraphs. Available on Starter and above.
          </div>
        </Field>
      )}

      <Field label="Integrations" hint="Names of products you integrate with.">
        <ChipInput
          values={form.integrations}
          onChange={v => set('integrations', v)}
          placeholder="e.g. Stripe, Slack, Zapier"
        />
      </Field>

      <Field label="Support channels" hint="Drives the &ldquo;Support options&rdquo; checklist on your listing.">
        <PillToggle
          options={SUPPORT_CHANNEL_OPTIONS}
          selected={form.supportChannels}
          onChange={v => set('supportChannels', v)}
        />
      </Field>

      <Field label="Training options">
        <PillToggle
          options={TRAINING_OPTION_OPTIONS}
          selected={form.trainingOptions}
          onChange={v => set('trainingOptions', v)}
        />
      </Field>
    </>
  )
}
