'use client'
import Field from '../components/Field'
import ChipInput from '../components/ChipInput'
import PillToggle from '../components/PillToggle'
import { SUPPORT_CHANNEL_OPTIONS, TRAINING_OPTION_OPTIONS } from '../constants'
import type { StepProps, KeyFeature, IntegrationItem } from '../types'

const MAX_INTEGRATIONS = 24

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

  const updateIntegration = (i: number, patch: Partial<IntegrationItem>) => {
    const arr = [...form.integrations]
    arr[i] = { ...arr[i], ...patch }
    set('integrations', arr)
  }
  const addIntegration = () => {
    if (form.integrations.length >= MAX_INTEGRATIONS) return
    set('integrations', [...form.integrations, { name: '', website: '', description: '' }])
  }
  const removeIntegration = (i: number) =>
    set('integrations', form.integrations.filter((_, j) => j !== i))

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

      <Field label={`Integrations (max ${MAX_INTEGRATIONS})`}
        hint="Each integration shows as a card on your listing — add the partner's website URL so we can pull a logo, plus a one-line note about how the integration works.">
        {form.integrations.map((it, i) => (
          <div key={i} className="df-int-row">
            <input
              type="text"
              className="df-input df-int-name"
              value={it.name}
              onChange={e => updateIntegration(i, { name: e.target.value })}
              placeholder={`Integration ${i + 1} name`}
              maxLength={60}
            />
            <input
              type="url"
              className="df-input df-int-url"
              value={it.website}
              onChange={e => updateIntegration(i, { website: e.target.value })}
              placeholder="https://stripe.com"
              maxLength={200}
            />
            <textarea
              className="df-textarea df-int-desc"
              value={it.description}
              onChange={e => updateIntegration(i, { description: e.target.value })}
              placeholder="What this integration unlocks for your customers (1–2 sentences)."
              rows={2}
              maxLength={400}
            />
            <button type="button" className="df-icon-btn df-int-rm" onClick={() => removeIntegration(i)} aria-label="Remove">
              <svg viewBox="0 0 24 24" width="14" height="14"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
        ))}
        {form.integrations.length < MAX_INTEGRATIONS && (
          <button type="button" className="df-add-btn" onClick={addIntegration}>+ Add integration</button>
        )}
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
