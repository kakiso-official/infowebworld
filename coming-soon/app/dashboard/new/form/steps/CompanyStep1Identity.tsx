'use client'
import Field from '../components/Field'
import Uploader from '../components/Uploader'
import ChipInput from '../components/ChipInput'
import type { StepProps } from '../types'

/**
 * Company form, Step 1 — Identity.
 * Logo, name, tagline, website, description + a couple of light "stats"
 * (founded year, team size) and optional header tags. Mirrors the
 * product Step 1 visual so the form feels familiar across modes.
 */
export default function CompanyStep1Identity({ form, set, errors }: StepProps) {
  return (
    <>
      <header className="df-section-head">
        <h2 className="df-section-title">Company identity</h2>
        <p className="df-section-sub">
          The basics shown on your <code>/profile</code> page header — logo, name, what you do.
        </p>
      </header>

      <Field label="Logo" hint="Square PNG works best. Used everywhere your company appears.">
        <Uploader
          value={form.logoUrl ? [form.logoUrl] : []}
          onChange={arr => set('logoUrl', arr[0] || '')}
          maxItems={1}
          type="logo"
          variant="single"
        />
      </Field>

      <div className="df-grid-2">
        <Field label="Company name" required error={errors.companyName}>
          <input
            type="text"
            className="df-input"
            value={form.companyName}
            onChange={e => set('companyName', e.target.value)}
            placeholder="Acme Inc."
            maxLength={100}
          />
        </Field>
        <Field label="One-line tagline" required error={errors.tagline}
          hint="What you do in 8–10 words.">
          <input
            type="text"
            className="df-input"
            value={form.tagline}
            onChange={e => set('tagline', e.target.value)}
            placeholder="Building AI tools for marketing teams"
            maxLength={255}
          />
        </Field>
      </div>

      <Field label="Website" required error={errors.website}
        hint="Your homepage. Must start with https://">
        <input
          type="url"
          className="df-input"
          value={form.website}
          onChange={e => set('website', e.target.value)}
          placeholder="https://acme.com"
        />
      </Field>

      <Field label="About the company"
        hint="2–4 short paragraphs. Mission, what you build, who you're for.">
        <textarea
          className="df-textarea"
          value={form.description}
          onChange={e => set('description', e.target.value)}
          placeholder="What does your company do, who is it for, and why should they care?"
          rows={6}
          maxLength={2000}
        />
      </Field>

      <div className="df-grid-2">
        <Field label="Founded" hint="Year only.">
          <input
            type="text"
            inputMode="numeric"
            className="df-input"
            value={form.founded}
            onChange={e => set('founded', e.target.value.replace(/[^\d]/g, '').slice(0, 4))}
            placeholder="2018"
            maxLength={4}
          />
        </Field>
        <Field label="Team size" hint="e.g. 1-5, 50-100, 1000+">
          <input
            type="text"
            className="df-input"
            value={form.employees}
            onChange={e => set('employees', e.target.value)}
            placeholder="10-50"
            maxLength={40}
          />
        </Field>
      </div>

      <Field label="Quick descriptors" hint="3–5 short labels under your company name. e.g. AI Lab · YC '21 · B-Corp.">
        <ChipInput
          values={form.headerTags}
          onChange={v => set('headerTags', v)}
          placeholder="Add a tag and press Enter"
          max={5}
          maxLen={28}
        />
      </Field>
    </>
  )
}
