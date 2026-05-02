'use client'
import Field from '../components/Field'
import StepHead from '../components/StepHead'
import { I } from '../icons'
import type { StepProps } from '../types'

export default function StepBusiness({ form, set, errors }: StepProps) {
  return (
    <div className="lf2-section">
      <StepHead
        icon={I.building}
        title="What's your business called?"
        sub="Name, tagline, website — that's it."
      />

      <div className="lf2-row-2">
        <Field label="Company or product name" required error={errors.companyName}>
          <input
            type="text"
            className="lf2-input"
            value={form.companyName}
            onChange={e => set('companyName', e.target.value)}
            placeholder="Acme Inc."
            maxLength={100}
          />
        </Field>
        <Field label="Tagline" required error={errors.tagline}>
          <input
            type="text"
            className="lf2-input"
            value={form.tagline}
            onChange={e => set('tagline', e.target.value)}
            placeholder="AI support for SaaS teams"
            maxLength={150}
          />
        </Field>
      </div>

      <Field
        label="Website"
        required
        error={errors.website}
        hint="Dofollow backlink goes here. Must start with https://"
      >
        <input
          type="url"
          className="lf2-input"
          value={form.website}
          onChange={e => set('website', e.target.value)}
          placeholder="https://acme.com"
        />
      </Field>
    </div>
  )
}
