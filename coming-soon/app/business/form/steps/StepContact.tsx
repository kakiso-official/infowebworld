'use client'
import Field from '../components/Field'
import StepHead from '../components/StepHead'
import PhoneRow from '../components/PhoneRow'
import { I } from '../icons'
import type { StepProps } from '../types'

export default function StepContact({ form, set, errors }: StepProps) {
  return (
    <div className="lf2-section">
      <StepHead
        icon={I.contact}
        title="How do we reach you?"
        sub="We'll email when the listing goes live. Only your name is public."
      />

      <div className="lf2-row-2">
        <Field label="Your name" required error={errors.contactName}>
          <input
            type="text"
            className="lf2-input"
            value={form.contactName}
            onChange={e => set('contactName', e.target.value)}
            placeholder="Jane Smith"
          />
        </Field>
        <Field label="Email" required error={errors.email}>
          <input
            type="email"
            className="lf2-input"
            value={form.email}
            onChange={e => set('email', e.target.value)}
            placeholder="you@company.com"
          />
        </Field>
      </div>

      <Field label="Phone" hint="Optional. Not displayed publicly.">
        <PhoneRow
          iso={form.phoneIso}
          code={form.phoneCode}
          phone={form.phone}
          onCountry={(iso, code) => { set('phoneIso', iso); set('phoneCode', code) }}
          onPhone={v => set('phone', v.replace(/\D/g, ''))}
        />
      </Field>
    </div>
  )
}
