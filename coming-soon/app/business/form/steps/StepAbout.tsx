'use client'
import Field from '../components/Field'
import StepHead from '../components/StepHead'
import ImageUploader from '../components/ImageUploader'
import { I } from '../icons'
import type { StepProps, PlanCaps } from '../types'

export default function StepAbout({ form, set, caps }: StepProps & { caps: PlanCaps }) {
  return (
    <div className="lf2-section">
      <StepHead icon={I.image} title="About your business"
        sub="Your description and images drive lead quality." />

      <Field label="Description"
        hint="2–4 paragraphs. What you do, who it's for, what makes you different.">
        <textarea className="lf2-input lf2-textarea" value={form.description}
          onChange={e => set('description', e.target.value)}
          placeholder="We help SaaS teams reduce support tickets by 40% with AI-powered customer conversations that feel human. Used by 500+ companies…"
          rows={5} maxLength={2000} />
      </Field>

      <Field label="Logo" hint="Square (1:1) PNG or SVG recommended. Max 5MB.">
        <ImageUploader type="logo" value={form.logoUrl ? [form.logoUrl] : []}
          onChange={arr => set('logoUrl', arr[0] || '')} maxItems={1} />
      </Field>

      <Field label={`Screenshots (up to ${caps.maxScreenshots})`}
        hint={caps.maxScreenshots === 1
          ? 'Free plan includes 1 screenshot. Upgrade for more.'
          : 'Product shots, dashboard views, or key feature images.'}>
        <ImageUploader type="screenshot" value={form.screenshots}
          onChange={arr => set('screenshots', arr.slice(0, caps.maxScreenshots))}
          maxItems={caps.maxScreenshots} />
      </Field>
    </div>
  )
}
