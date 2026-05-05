'use client'
import type { ReviewStepProps } from '../types'

/**
 * Final review. Renders a compact preview matching the listing page identity panel
 * + a per-step summary with edit-jump buttons.
 */
export default function Step7Review({ form, allCategories, listingTypes, tagGroups, goToStep, caps }: ReviewStepProps) {
  const cat = allCategories.find(c => c.id === (form.l3Id || form.l2Id || form.l1Id))
  const sectorName = allCategories.find(c => c.id === form.l1Id)?.name
  const l2Name = allCategories.find(c => c.id === form.l2Id)?.name
  const specs = listingTypes
    .filter(t => form.listingTypeIds.includes(t.id))
    .map(t => t.name)
  const tagNames = tagGroups
    .flatMap(g => g.tags)
    .filter(t => form.tagIds.includes(t.id))
    .map(t => t.name)

  const Row = ({ label, value, on }: { label: string; value: string; on: () => void }) => (
    <div className="df-rev-row">
      <span className="df-rev-label">{label}</span>
      <span className="df-rev-value">{value || <em className="df-rev-empty">— not set</em>}</span>
      <button type="button" className="df-rev-edit" onClick={on}>Edit</button>
    </div>
  )

  return (
    <>
      <header className="df-section-head">
        <h2 className="df-section-title">Review &amp; submit</h2>
        <p className="df-section-sub">
          Check what your listing will look like. After you submit, it goes to the admin
          for approval — once approved it&apos;s live at <code>/company/your-slug</code>.
        </p>
      </header>

      <section className="df-rev-card">
        <div className="df-rev-card-head">
          {form.logoUrl && <img src={form.logoUrl} alt="logo" className="df-rev-logo" />}
          <div className="df-rev-id">
            <h3 className="df-rev-name">{form.companyName || 'Your company'}</h3>
            <p className="df-rev-tag">{form.tagline || 'Your tagline appears here'}</p>
            {form.headerTags.length > 0 && (
              <div className="df-rev-tags">
                {form.headerTags.map(t => <span key={t} className="df-rev-headertag">{t}</span>)}
              </div>
            )}
            <div className="df-rev-meta">
              {form.hqLocation || [form.city, form.state, form.country].filter(Boolean).join(', ') || 'No location'}
              {form.phone && <> · {form.phoneCode} {form.phone}</>}
            </div>
          </div>
        </div>

        <div className="df-rev-stats">
          <span className="df-rev-stat"><strong>Plan</strong> {caps.label} · {caps.price}</span>
          {form.founded && <span className="df-rev-stat"><strong>Founded</strong> {form.founded}</span>}
          {form.employees && <span className="df-rev-stat"><strong>Team</strong> {form.employees}</span>}
          {form.startingPrice && <span className="df-rev-stat"><strong>From</strong> ${form.startingPrice} {form.startingPricePeriod}</span>}
        </div>
      </section>

      <section className="df-rev-section">
        <div className="df-rev-section-head">
          <h3>Identity</h3>
          <button type="button" className="df-rev-edit" onClick={() => goToStep('identity')}>Edit step</button>
        </div>
        <Row label="Website" value={form.website} on={() => goToStep('identity')} />
        <Row label="Description" value={form.description.slice(0, 120) + (form.description.length > 120 ? '…' : '')} on={() => goToStep('identity')} />
      </section>

      <section className="df-rev-section">
        <div className="df-rev-section-head">
          <h3>Category</h3>
          <button type="button" className="df-rev-edit" onClick={() => goToStep('category')}>Edit step</button>
        </div>
        <Row label="Sector" value={sectorName || ''} on={() => goToStep('category')} />
        <Row label="Category" value={l2Name || ''} on={() => goToStep('category')} />
        <Row label="Subcategory" value={cat?.name || ''} on={() => goToStep('category')} />
        <Row label="Specializations" value={specs.join(', ')} on={() => goToStep('category')} />
        <Row label="Tags" value={tagNames.join(', ')} on={() => goToStep('category')} />
      </section>

      <section className="df-rev-section">
        <div className="df-rev-section-head">
          <h3>Story &amp; media</h3>
          <button type="button" className="df-rev-edit" onClick={() => goToStep('story')}>Edit step</button>
        </div>
        <Row label="Screenshots" value={`${form.screenshots.length} uploaded`} on={() => goToStep('story')} />
        <Row label="Demo video" value={form.demoVideo} on={() => goToStep('story')} />
        <Row label="Industries served" value={form.industriesServed.join(', ')} on={() => goToStep('story')} />
        <Row label="Use cases" value={form.useCases.join(', ')} on={() => goToStep('story')} />
        <Row label="Languages" value={form.languages.join(', ')} on={() => goToStep('story')} />
        <Row label="Awards" value={form.awards.map(a => a.name + (a.year ? ` (${a.year})` : '')).join(', ')} on={() => goToStep('story')} />
      </section>

      <section className="df-rev-section">
        <div className="df-rev-section-head">
          <h3>Features</h3>
          <button type="button" className="df-rev-edit" onClick={() => goToStep('features')}>Edit step</button>
        </div>
        <Row label="Features" value={`${form.features.length} added`} on={() => goToStep('features')} />
        <Row label="Key features" value={`${form.keyFeatures.length} added`} on={() => goToStep('features')} />
        <Row label="Integrations" value={form.integrations.slice(0, 6).join(', ') + (form.integrations.length > 6 ? '…' : '')} on={() => goToStep('features')} />
        <Row label="Support channels" value={form.supportChannels.join(', ')} on={() => goToStep('features')} />
      </section>

      <section className="df-rev-section">
        <div className="df-rev-section-head">
          <h3>Pricing &amp; FAQ</h3>
          <button type="button" className="df-rev-edit" onClick={() => goToStep('pricing')}>Edit step</button>
        </div>
        <Row label="Pricing tiers" value={`${form.pricingTiers.length} tier${form.pricingTiers.length === 1 ? '' : 's'}`} on={() => goToStep('pricing')} />
        <Row label="Pros" value={form.pros.join(', ')} on={() => goToStep('pricing')} />
        <Row label="Cons" value={form.cons.join(', ')} on={() => goToStep('pricing')} />
        <Row label="FAQs" value={`${form.faqs.length} Q&A`} on={() => goToStep('pricing')} />
      </section>

      <p className="df-rev-foot">
        By submitting, you confirm the information above is accurate. We&apos;ll email you when
        the admin approves your listing.
      </p>
    </>
  )
}
