'use client'
import Field from '../components/Field'
import Select from '../components/Select'
import ChipInput from '../components/ChipInput'
import { PRICING_MODEL_OPTIONS, PRICING_PERIOD_OPTIONS } from '../constants'
import type { StepProps, PricingTier, FaqItem } from '../types'

export default function Step6Pricing({ form, set, errors, caps }: StepProps) {
  const updateTier = (i: number, patch: Partial<PricingTier>) => {
    const arr = [...form.pricingTiers]
    arr[i] = { ...arr[i], ...patch }
    set('pricingTiers', arr)
  }
  const addTier = () => {
    if (form.pricingTiers.length >= caps.maxPricingTiers) return
    set('pricingTiers', [...form.pricingTiers, { name: '', price: '', period: '/ month', features: [] }])
  }
  const removeTier = (i: number) =>
    set('pricingTiers', form.pricingTiers.filter((_, j) => j !== i))

  const updateFaq = (i: number, patch: Partial<FaqItem>) => {
    const arr = [...form.faqs]
    arr[i] = { ...arr[i], ...patch }
    set('faqs', arr)
  }
  const addFaq = () => {
    if (form.faqs.length >= caps.maxFaqs) return
    set('faqs', [...form.faqs, { question: '', answer: '' }])
  }
  const removeFaq = (i: number) =>
    set('faqs', form.faqs.filter((_, j) => j !== i))

  return (
    <>
      <header className="df-section-head">
        <h2 className="df-section-title">Pricing &amp; FAQ</h2>
        <p className="df-section-sub">
          The sidebar starting price, full pricing tiers, pros / cons, and FAQs.
        </p>
      </header>

      <div className="df-grid-3">
        <Field label="Starting price" hint="Drives the overview side card.">
          <input
            type="number"
            className="df-input"
            value={form.startingPrice}
            onChange={e => set('startingPrice', e.target.value)}
            placeholder="13"
            min={0}
            step="0.01"
          />
        </Field>
        <Field label="Period">
          <Select
            value={form.startingPricePeriod}
            onChange={v => set('startingPricePeriod', v)}
            options={PRICING_PERIOD_OPTIONS.map(o => ({ value: o, label: o }))}
            placeholder="/ month"
          />
        </Field>
        <Field label="Free options">
          <div className="df-checkrow">
            <label className="df-check">
              <input
                type="checkbox"
                checked={form.hasFreeTrial}
                onChange={e => set('hasFreeTrial', e.target.checked)}
              />
              <span>Free trial</span>
            </label>
            <label className="df-check">
              <input
                type="checkbox"
                checked={form.hasFreeVersion}
                onChange={e => set('hasFreeVersion', e.target.checked)}
              />
              <span>Free version</span>
            </label>
          </div>
        </Field>
      </div>

      <Field label="Pricing model">
        <Select
          value={form.pricingModel}
          onChange={v => set('pricingModel', v)}
          options={PRICING_MODEL_OPTIONS.map(o => ({ value: o, label: o }))}
          placeholder="Select a pricing model"
        />
      </Field>

      {caps.hasPricingTiers ? (
        <Field label={`Pricing tiers (max ${caps.maxPricingTiers})`} error={errors.pricingTiers}
          hint="Each tier renders as a card in the listing's pricing section.">
          {form.pricingTiers.map((t, i) => (
            <div key={i} className="df-tier">
              <div className="df-tier-row">
                <input type="text" className="df-input df-tier-name"
                  value={t.name} onChange={e => updateTier(i, { name: e.target.value })}
                  placeholder="Plan name (Free / Pro / Enterprise)" maxLength={30} />
                <input type="text" className="df-input df-tier-price"
                  value={t.price} onChange={e => updateTier(i, { price: e.target.value })}
                  placeholder="$13" maxLength={20} />
                <Select
                  value={t.period}
                  onChange={v => updateTier(i, { period: v })}
                  options={PRICING_PERIOD_OPTIONS.map(o => ({ value: o, label: o }))}
                  placeholder="Period"
                />
                <button type="button" className="df-icon-btn" onClick={() => removeTier(i)} aria-label="Remove tier">
                  <svg viewBox="0 0 24 24" width="14" height="14"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>
              </div>
              <div className="df-tier-feats">
                <ChipInput
                  values={t.features || []}
                  onChange={v => updateTier(i, { features: v })}
                  placeholder="Features included in this tier"
                />
              </div>
            </div>
          ))}
          {form.pricingTiers.length < caps.maxPricingTiers && (
            <button type="button" className="df-add-btn" onClick={addTier}>+ Add pricing tier</button>
          )}
        </Field>
      ) : (
        <Field label="Pricing tiers" lockedReason="Upgrade for tier cards">
          <div className="df-locked-preview">
            Each tier renders as a full card with features. Available on Starter and above.
          </div>
        </Field>
      )}

      <div className="df-grid-2">
        <Field label="Pros (3 short labels)"
          hint="Shown in the overview side card.">
          <ChipInput
            values={form.pros}
            onChange={v => set('pros', v)}
            placeholder="e.g. Great free tier"
            max={6}
            maxLen={40}
          />
        </Field>
        <Field label="Cons (3 short labels)"
          hint="Honest weaknesses. Builds trust.">
          <ChipInput
            values={form.cons}
            onChange={v => set('cons', v)}
            placeholder="e.g. Steep pricing at scale"
            max={6}
            maxLen={60}
          />
        </Field>
      </div>

      {caps.hasFaqs ? (
        <Field label={`FAQs (max ${caps.maxFaqs})`} error={errors.faqs}
          hint="Q&A blocks at the bottom of the listing.">
          {form.faqs.map((f, i) => (
            <div key={i} className="df-faq">
              <div className="df-faq-head">
                <span className="df-faq-num">Q{i + 1}</span>
                <button type="button" className="df-icon-btn" onClick={() => removeFaq(i)} aria-label="Remove FAQ">
                  <svg viewBox="0 0 24 24" width="14" height="14"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>
              </div>
              <input type="text" className="df-input"
                value={f.question} onChange={e => updateFaq(i, { question: e.target.value })}
                placeholder="Question" maxLength={200} />
              <textarea className="df-textarea"
                value={f.answer} onChange={e => updateFaq(i, { answer: e.target.value })}
                placeholder="Answer" rows={3} maxLength={1000} />
            </div>
          ))}
          {form.faqs.length < caps.maxFaqs && (
            <button type="button" className="df-add-btn" onClick={addFaq}>+ Add FAQ</button>
          )}
        </Field>
      ) : (
        <Field label="FAQs" lockedReason="Upgrade for FAQ section">
          <div className="df-locked-preview">
            Q&amp;A pairs at the bottom of your listing. Available on Starter and above.
          </div>
        </Field>
      )}
    </>
  )
}
