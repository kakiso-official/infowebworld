'use client'
import type { Category } from '../../../iww-hq/data/category-storage'
import type { TagGroup } from '../../../iww-hq/data/tag-storage'
import type { ListingType } from '../../../iww-hq/data/listing-type-storage'
import StepHead from '../components/StepHead'
import { I } from '../icons'
import { PLAN_CAPS } from '../constants'
import type { FormState, PlanKey } from '../types'

type Props = {
  form: FormState
  plan: PlanKey
  allCategories: Category[]
  tagGroups: TagGroup[]
  listingTypes: ListingType[]
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="lf2-preview-row">
      <span className="lf2-preview-label">{label}</span>
      <span className="lf2-preview-value">{value}</span>
    </div>
  )
}

export default function StepReview({ form, plan, allCategories, tagGroups, listingTypes }: Props) {
  const caps = PLAN_CAPS[plan]
  const l1 = allCategories.find(c => c.id === form.l1Id)
  const l2 = allCategories.find(c => c.id === form.l2Id)
  const l3 = allCategories.find(c => c.id === form.l3Id)
  const specNames = form.listingTypeIds
    .map(id => listingTypes.find(x => x.id === id)?.name)
    .filter(Boolean) as string[]
  const tagMap = new Map<string, string>()
  tagGroups.forEach(g => g.tags.forEach(t => tagMap.set(t.id, t.name)))

  return (
    <div className="lf2-section">
      <StepHead icon={I.sparkle} title="Review your listing"
        sub="Look good? Submit to get it in front of our review team." />

      <div className="lf2-preview">
        <div className="lf2-preview-head">
          {form.logoUrl
            ? <img src={form.logoUrl} alt={form.companyName} className="lf2-preview-logo" />
            : <div className="lf2-preview-logo lf2-preview-logo--placeholder">{(form.companyName[0] || '?').toUpperCase()}</div>}
          <div>
            <div className="lf2-preview-name">{form.companyName || '(no name)'}</div>
            <div className="lf2-preview-tagline">{form.tagline || '(no tagline)'}</div>
          </div>
          <span className="lf2-preview-plan">{caps.label}</span>
        </div>

        <Row label="Website" value={form.website || '—'} />
        <Row label="Category" value={[l1?.name, l2?.name, l3?.name].filter(Boolean).join(' → ') || '—'} />
        {specNames.length > 0 && <Row label="Specializations" value={specNames.join(', ')} />}
        <Row label="Location" value={[form.city, form.state, form.country].filter(Boolean).join(', ') || '—'} />
        <Row label="Contact" value={`${form.contactName} · ${form.email}${form.phone ? ' · ' + form.phoneCode + ' ' + form.phone : ''}`} />

        {form.description && (
          <div className="lf2-preview-desc">
            <div className="lf2-preview-label">Description</div>
            <div className="lf2-preview-body">{form.description}</div>
          </div>
        )}

        {form.screenshots.length > 0 && (
          <div className="lf2-preview-desc">
            <div className="lf2-preview-label">Screenshots ({form.screenshots.length})</div>
            <div className="lf2-preview-shots">
              {form.screenshots.map((s, i) => <img key={i} src={s} alt={`Screenshot ${i + 1}`} />)}
            </div>
          </div>
        )}

        {form.features.filter(f => f.trim()).length > 0 && (
          <div className="lf2-preview-desc">
            <div className="lf2-preview-label">Features</div>
            <ul className="lf2-preview-list">
              {form.features.filter(f => f.trim()).map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        )}

        {form.tagIds.length > 0 && (
          <div className="lf2-preview-desc">
            <div className="lf2-preview-label">Tags</div>
            <div className="lf2-chip-row lf2-chip-row--static">
              {form.tagIds.map(id => {
                const name = tagMap.get(id)
                return name ? <span key={id} className="lf2-chip lf2-chip--static">{name}</span> : null
              })}
            </div>
          </div>
        )}

        {caps.hasFaqs && form.faqs.filter(f => f.question.trim()).length > 0 && (
          <div className="lf2-preview-desc">
            <div className="lf2-preview-label">FAQ</div>
            {form.faqs.filter(f => f.question.trim()).map((f, i) => (
              <div key={i} className="lf2-preview-faq">
                <div className="lf2-preview-faq-q">{f.question}</div>
                <div className="lf2-preview-faq-a">{f.answer}</div>
              </div>
            ))}
          </div>
        )}

        {caps.hasPremium && form.integrations.length > 0 && (
          <div className="lf2-preview-desc">
            <div className="lf2-preview-label">Integrations</div>
            <div className="lf2-chip-row lf2-chip-row--static">
              {form.integrations.map((it, i) => <span key={i} className="lf2-chip lf2-chip--static">{it}</span>)}
            </div>
          </div>
        )}

        {caps.hasPremium && form.pricingTiers.filter(t => t.name.trim()).length > 0 && (
          <div className="lf2-preview-desc">
            <div className="lf2-preview-label">Pricing</div>
            <div className="lf2-preview-tiers">
              {form.pricingTiers.filter(t => t.name.trim()).map((t, i) => (
                <div key={i} className="lf2-preview-tier">
                  <div className="lf2-preview-tier-name">{t.name}</div>
                  <div className="lf2-preview-tier-price">{t.price ? `$${t.price.replace('$', '')}` : 'Custom'} <span>{t.period}</span></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="lf2-review-note">Edit your listing anytime from your dashboard after approval.</p>
    </div>
  )
}
