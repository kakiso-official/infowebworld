'use client'
import { useState } from 'react'
import Field from '../components/Field'
import StepHead from '../components/StepHead'
import CustomSelect from '../components/CustomSelect'
import { I } from '../icons'
import type { StepProps, PricingTier } from '../types'

export default function StepPremium({ form, set }: StepProps) {
  const [integrationInput, setIntegrationInput] = useState('')

  const addIntegration = () => {
    const v = integrationInput.trim()
    if (!v || form.integrations.includes(v)) { setIntegrationInput(''); return }
    set('integrations', [...form.integrations, v])
    setIntegrationInput('')
  }
  const removeIntegration = (i: number) => set('integrations', form.integrations.filter((_, j) => j !== i))

  const updateTier = (i: number, f: keyof PricingTier, v: string) => {
    const arr = [...form.pricingTiers]
    arr[i] = { ...arr[i], [f]: v } as PricingTier
    set('pricingTiers', arr)
  }
  const addTier = () => {
    if (form.pricingTiers.length >= 5) return
    set('pricingTiers', [...form.pricingTiers, { name: '', price: '', period: '/ month' }])
  }
  const removeTier = (i: number) => set('pricingTiers', form.pricingTiers.filter((_, j) => j !== i))

  return (
    <div className="lf2-section">
      <StepHead icon={I.diamond} title="Premium details"
        sub="Only on Early Adopter and Lifetime. Extra signals that close leads." />

      <Field label="Integrations" hint="Press Enter or click Add.">
        <div className="lf2-row-inline">
          <input type="text" className="lf2-input" value={integrationInput}
            onChange={e => setIntegrationInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addIntegration() } }}
            placeholder="Stripe, Slack, Zapier…" maxLength={40} />
          <button type="button" className="lf2-btn lf2-btn--outline" onClick={addIntegration}>Add</button>
        </div>
        {form.integrations.length > 0 && (
          <div className="lf2-chip-row">
            {form.integrations.map((it, i) => (
              <span key={it + i} className="lf2-chip">
                {it}
                <button type="button" onClick={() => removeIntegration(i)} aria-label="Remove">{I.x}</button>
              </span>
            ))}
          </div>
        )}
      </Field>

      <div className="lf2-divider" />
      <h3 className="lf2-subsection-title">Pricing</h3>
      <Field label="Pricing model">
        <CustomSelect value={form.pricingModel} onChange={v => set('pricingModel', v)}
          options={['Subscription', 'One-time Purchase', 'Freemium', 'Usage-based', 'Contact for Pricing', 'Completely Free'].map(o => ({ value: o, label: o }))}
          placeholder="Select a pricing model" />
      </Field>

      <Field label="Pricing tiers">
        {form.pricingTiers.map((tier, i) => (
          <div key={i} className="lf2-tier-row">
            <input type="text" className="lf2-input" value={tier.name}
              onChange={e => updateTier(i, 'name', e.target.value)} placeholder="Plan name" maxLength={30} />
            <input type="text" className="lf2-input lf2-input--price" value={tier.price}
              onChange={e => updateTier(i, 'price', e.target.value)} placeholder="$29" maxLength={20} />
            <CustomSelect value={tier.period} onChange={v => updateTier(i, 'period', v)}
              options={['/ month', '/ year', 'one-time', 'lifetime'].map(o => ({ value: o, label: o }))}
              placeholder="Period" />
            <button type="button" className="lf2-icon-btn" onClick={() => removeTier(i)} aria-label="Remove">{I.trash}</button>
          </div>
        ))}
        {form.pricingTiers.length < 5 && (
          <button type="button" className="lf2-add-btn" onClick={addTier}>{I.plus} Add tier</button>
        )}
      </Field>

      <div className="lf2-divider" />
      <h3 className="lf2-subsection-title">Company details</h3>
      <div className="lf2-row-2">
        <Field label="Founded year">
          <input type="number" className="lf2-input" value={form.founded}
            onChange={e => set('founded', e.target.value)}
            placeholder="2021" min={1900} max={new Date().getFullYear()} />
        </Field>
        <Field label="Team size">
          <CustomSelect value={form.employees} onChange={v => set('employees', v)}
            options={['Solo/Freelancer', '2-10', '11-50', '51-200', '201-500', '500+'].map(o => ({ value: o, label: o }))}
            placeholder="Select team size" />
        </Field>
      </div>

      <Field label="Funding stage">
        <CustomSelect value={form.funding} onChange={v => set('funding', v)}
          options={['Bootstrapped', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Publicly Traded', 'Profitable'].map(o => ({ value: o, label: o }))}
          placeholder="Select funding stage" />
      </Field>

      <Field label="Demo video" hint="YouTube, Vimeo, or Loom URL.">
        <input type="url" className="lf2-input" value={form.demoVideo}
          onChange={e => set('demoVideo', e.target.value)} placeholder="https://youtube.com/watch?v=…" />
      </Field>

      <div className="lf2-divider" />
      <h3 className="lf2-subsection-title">Social links</h3>
      <Field label="LinkedIn">
        <input type="url" className="lf2-input" value={form.linkedin}
          onChange={e => set('linkedin', e.target.value)} placeholder="https://linkedin.com/company/…" />
      </Field>
      <div className="lf2-row-2">
        <Field label="X (Twitter)">
          <input type="url" className="lf2-input" value={form.twitter}
            onChange={e => set('twitter', e.target.value)} placeholder="https://x.com/…" />
        </Field>
        <Field label="Facebook">
          <input type="url" className="lf2-input" value={form.facebook}
            onChange={e => set('facebook', e.target.value)} placeholder="https://facebook.com/…" />
        </Field>
      </div>
    </div>
  )
}
