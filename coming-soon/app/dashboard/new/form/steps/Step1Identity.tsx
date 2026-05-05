'use client'
import Field from '../components/Field'
import Uploader from '../components/Uploader'
import ChipInput from '../components/ChipInput'
import type { StepProps } from '../types'

export default function Step1Identity({ form, set, errors }: StepProps) {
  return (
    <>
      <header className="df-section-head">
        <h2 className="df-section-title">Identity</h2>
        <p className="df-section-sub">The essentials shown in the listing&apos;s sticky header.</p>
      </header>

      <Field label="Logo" hint="Square PNG works best. Used everywhere on the listing.">
        <Uploader
          value={form.logoUrl ? [form.logoUrl] : []}
          onChange={arr => set('logoUrl', arr[0] || '')}
          maxItems={1}
          type="logo"
          variant="single"
        />
      </Field>

      <div className="df-grid-2">
        <Field label="Company or product name" required error={errors.companyName}>
          <input
            type="text"
            className="df-input"
            value={form.companyName}
            onChange={e => set('companyName', e.target.value)}
            placeholder="Acme Inc."
            maxLength={100}
          />
        </Field>
        <Field label="Tagline" required error={errors.tagline}
          hint="One short line. Shown beneath the company name on the listing.">
          <input
            type="text"
            className="df-input"
            value={form.tagline}
            onChange={e => set('tagline', e.target.value)}
            placeholder="AI customer support for SaaS teams"
            maxLength={150}
          />
        </Field>
      </div>

      <Field label="Website" required error={errors.website}
        hint="Dofollow backlink lives here. Must start with https://">
        <input
          type="url"
          className="df-input"
          value={form.website}
          onChange={e => set('website', e.target.value)}
          placeholder="https://acme.com"
        />
      </Field>

      <Field label="Header tags"
        hint="3-5 short labels under your company name (e.g. Email Marketing · SaaS · Newsletters).">
        <ChipInput
          values={form.headerTags}
          onChange={v => set('headerTags', v)}
          placeholder="Add a tag and press Enter"
          max={5}
          maxLen={28}
        />
      </Field>

      <Field label="Description"
        hint="The first paragraph of your overview. 50-300 words works best.">
        <textarea
          className="df-textarea"
          value={form.description}
          onChange={e => set('description', e.target.value)}
          placeholder="What does your product do, who is it for, and why should they care?"
          rows={6}
          maxLength={2000}
        />
      </Field>
    </>
  )
}
