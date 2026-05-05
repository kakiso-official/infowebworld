'use client'
import Field from '../components/Field'
import Select from '../components/Select'
import Uploader from '../components/Uploader'
import ChipInput from '../components/ChipInput'
import PillToggle from '../components/PillToggle'
import {
  TEAM_SIZE_OPTIONS,
  FUNDING_STAGE_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  COMPLIANCE_OPTIONS,
  COMMON_LANGUAGES,
} from '../constants'
import type { StepProps, Award } from '../types'

export default function Step4Story({ form, set, errors, caps }: StepProps) {
  const upgradeReason = (limit: number, label: string) => {
    if (limit > 0) return null
    return `Upgrade for ${label}`
  }
  const updateAward = (i: number, patch: Partial<Award>) => {
    const arr = [...form.awards]
    arr[i] = { ...arr[i], ...patch }
    set('awards', arr)
  }
  const addAward = () => {
    if (form.awards.length >= caps.maxAwards) return
    set('awards', [...form.awards, { name: '', year: '' }])
  }
  const removeAward = (i: number) => set('awards', form.awards.filter((_, j) => j !== i))

  return (
    <>
      <header className="df-section-head">
        <h2 className="df-section-title">Story &amp; media</h2>
        <p className="df-section-sub">
          Background facts and visuals. Drives the &ldquo;About&rdquo;, screenshot carousel,
          and the audience-served panels.
        </p>
      </header>

      <Field label={`Screenshots (max ${caps.maxScreenshots})`}
        hint="Used in the listing's UI screenshots carousel.">
        <Uploader
          value={form.screenshots}
          onChange={v => set('screenshots', v)}
          maxItems={caps.maxScreenshots}
          type="screenshot"
        />
      </Field>

      <Field label="Demo video"
        hint="YouTube, Vimeo or Loom URL. Embedded in the listing if provided.">
        <input
          type="url"
          className="df-input"
          value={form.demoVideo}
          onChange={e => set('demoVideo', e.target.value)}
          placeholder="https://youtube.com/watch?v=…"
          maxLength={500}
        />
      </Field>

      <div className="df-grid-3">
        <Field label="Founded year">
          <input
            type="number"
            className="df-input"
            value={form.founded}
            onChange={e => set('founded', e.target.value)}
            placeholder="2021"
            min={1900}
            max={new Date().getFullYear()}
          />
        </Field>
        <Field label="Team size">
          <Select
            value={form.employees}
            onChange={v => set('employees', v)}
            options={TEAM_SIZE_OPTIONS.map(o => ({ value: o, label: o }))}
            placeholder="Select team size"
          />
        </Field>
        <Field label="Funding stage">
          <Select
            value={form.funding}
            onChange={v => set('funding', v)}
            options={FUNDING_STAGE_OPTIONS.map(o => ({ value: o, label: o }))}
            placeholder="Select funding stage"
          />
        </Field>
      </div>

      {caps.hasAudienceSection ? (
        <>
          <Field label={`Industries served (max ${caps.maxIndustries})`}
            error={errors.industriesServed}
            hint="Drives the &ldquo;Industries&rdquo; donut on the listing.">
            <ChipInput
              values={form.industriesServed}
              onChange={v => set('industriesServed', v)}
              placeholder="e.g. SaaS, Healthcare, Retail"
              max={caps.maxIndustries}
            />
          </Field>
          <Field label={`Use cases (max ${caps.maxUseCases})`}
            error={errors.useCases}
            hint="Diamond cluster on the listing.">
            <ChipInput
              values={form.useCases}
              onChange={v => set('useCases', v)}
              placeholder="e.g. Email Marketing, Lead Capture"
              max={caps.maxUseCases}
            />
          </Field>
          <Field label="Target company sizes"
            hint="Used in the &ldquo;Who uses&rdquo; column-bar chart.">
            <PillToggle
              options={COMPANY_SIZE_OPTIONS}
              selected={form.targetCompanySizes}
              onChange={v => set('targetCompanySizes', v)}
            />
          </Field>
        </>
      ) : (
        <Field label="Audience details" lockedReason="Upgrade for industry &amp; use-case panels">
          <div className="df-locked-preview">
            Industries served, use cases &amp; target company sizes power the &ldquo;Who uses&rdquo;
            section on your listing. Available on Starter and above.
          </div>
        </Field>
      )}

      <Field label={`Languages supported (max ${caps.maxLanguages})`}
        error={errors.languages}>
        <PillToggle
          options={COMMON_LANGUAGES}
          selected={form.languages}
          onChange={v => set('languages', v)}
          max={caps.maxLanguages}
          allowCustom
          customPlaceholder="Add a language"
        />
      </Field>

      <Field label="Mobile apps">
        <div className="df-checkrow">
          <label className="df-check">
            <input
              type="checkbox"
              checked={form.hasIosApp}
              onChange={e => set('hasIosApp', e.target.checked)}
            />
            <span>iOS app</span>
          </label>
          <label className="df-check">
            <input
              type="checkbox"
              checked={form.hasAndroidApp}
              onChange={e => set('hasAndroidApp', e.target.checked)}
            />
            <span>Android app</span>
          </label>
        </div>
      </Field>

      {caps.hasComplianceAndAwards ? (
        <>
          <Field label="Compliance &amp; certifications"
            hint="Standards your product meets.">
            <PillToggle
              options={COMPLIANCE_OPTIONS}
              selected={form.compliance}
              onChange={v => set('compliance', v)}
              allowCustom
              customPlaceholder="Add a custom standard"
            />
          </Field>

          <Field label={`Awards & press (max ${caps.maxAwards})`} error={errors.awards}>
            {form.awards.map((a, i) => (
              <div key={i} className="df-award-row">
                <input
                  type="text"
                  className="df-input"
                  value={a.name}
                  onChange={e => updateAward(i, { name: e.target.value })}
                  placeholder="G2 Leader"
                  maxLength={80}
                />
                <input
                  type="text"
                  className="df-input df-input--narrow"
                  value={a.year || ''}
                  onChange={e => updateAward(i, { year: e.target.value })}
                  placeholder="2026"
                  maxLength={10}
                />
                <button type="button" className="df-icon-btn" onClick={() => removeAward(i)} aria-label="Remove">
                  <svg viewBox="0 0 24 24" width="14" height="14"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>
              </div>
            ))}
            {form.awards.length < caps.maxAwards && (
              <button type="button" className="df-add-btn" onClick={addAward}>+ Add award</button>
            )}
          </Field>
        </>
      ) : (
        <Field label="Compliance &amp; awards" lockedReason={upgradeReason(caps.maxAwards, 'compliance + awards') || 'Upgrade for compliance + awards'}>
          <div className="df-locked-preview">
            GDPR / SOC 2 / HIPAA badges and award listings. Available on Early Adopter and above.
          </div>
        </Field>
      )}

      <Field label="Social links" hint="Optional but boosts trust signals on the listing.">
        <div className="df-grid-3">
          <input type="url" className="df-input" value={form.linkedin}
            onChange={e => set('linkedin', e.target.value)}
            placeholder="LinkedIn URL" maxLength={500} />
          <input type="url" className="df-input" value={form.twitter}
            onChange={e => set('twitter', e.target.value)}
            placeholder="X (Twitter) URL" maxLength={500} />
          <input type="url" className="df-input" value={form.facebook}
            onChange={e => set('facebook', e.target.value)}
            placeholder="Facebook URL" maxLength={500} />
        </div>
      </Field>
    </>
  )
}
