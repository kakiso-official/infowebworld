export default function StepProduct({ form, up }) {
  const addFeature = () => up('features', [...form.features, ''])
  const removeFeature = (i) => up('features', form.features.filter((_, idx) => idx !== i))
  const updateFeature = (i, v) => { const f = [...form.features]; f[i] = v; up('features', f) }

  const addIntegration = (e) => {
    if (e.key === 'Enter' && form.integrationsInput.trim()) {
      e.preventDefault()
      up('integrations', [...form.integrations, form.integrationsInput.trim()])
      up('integrationsInput', '')
    }
  }
  const removeIntegration = (i) => up('integrations', form.integrations.filter((_, idx) => idx !== i))

  const updateTier = (i, key, v) => {
    const t = [...form.pricingTiers]; t[i] = { ...t[i], [key]: v }; up('pricingTiers', t)
  }

  return (
    <>
      {/* Key Features */}
      <div className="sl-section">
        <div className="sl-section-header">
          <div className="sl-section-icon" style={{ background: 'var(--emerald)' }}>
            <svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
          </div>
          <div className="sl-section-info">
            <div className="sl-section-title">Key Features</div>
            <div className="sl-section-desc">List the top features of your product (minimum 3)</div>
          </div>
        </div>

        <div className="sl-feature-list">
          {form.features.map((f, i) => (
            <div className="sl-feature-item" key={i}>
              <svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="1" /><circle cx="12" cy="15" r="1" /></svg>
              <input placeholder={`Feature ${i + 1} (e.g. "Real-time collaboration")`} value={f} onChange={e => updateFeature(i, e.target.value)} />
              {form.features.length > 3 && (
                <button className="sl-feature-remove" onClick={() => removeFeature(i)}>
                  <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              )}
            </div>
          ))}
        </div>
        {form.features.length < 15 && (
          <button className="sl-add-btn" onClick={addFeature}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add Feature
          </button>
        )}
      </div>

      {/* Integrations */}
      <div className="sl-section">
        <div className="sl-section-header">
          <div className="sl-section-icon" style={{ background: 'var(--teal)' }}>
            <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
          </div>
          <div className="sl-section-info">
            <div className="sl-section-title">Integrations</div>
            <div className="sl-section-desc">What tools and platforms does your product integrate with?</div>
          </div>
        </div>

        <div className="sl-tags-wrap">
          {form.integrations.map((t, i) => (
            <span className="sl-tag" key={i}>
              {t}
              <span className="sl-tag-remove" onClick={() => removeIntegration(i)}>
                <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </span>
            </span>
          ))}
          <input
            className="sl-tags-input"
            placeholder="Type and press Enter (e.g. Slack, Salesforce)"
            value={form.integrationsInput}
            onChange={e => up('integrationsInput', e.target.value)}
            onKeyDown={addIntegration}
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="sl-section">
        <div className="sl-section-header">
          <div className="sl-section-icon" style={{ background: 'var(--amber)' }}>
            <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          </div>
          <div className="sl-section-info">
            <div className="sl-section-title">Pricing Information</div>
            <div className="sl-section-desc">Help users understand your pricing model</div>
          </div>
        </div>

        <div className="sl-field">
          <label className="sl-label">Pricing Model</label>
          <select className="sl-input" value={form.pricingModel} onChange={e => up('pricingModel', e.target.value)} style={{ maxWidth: 280 }}>
            <option value="subscription">Subscription (Monthly/Annual)</option>
            <option value="one-time">One-time Purchase</option>
            <option value="freemium">Freemium</option>
            <option value="usage">Usage-based / Pay-per-use</option>
            <option value="contact">Contact for Pricing</option>
            <option value="free">Completely Free</option>
          </select>
        </div>

        <div className="sl-field">
          <label className="sl-label">Pricing Tiers <span className="sl-label-opt">(optional)</span></label>
          <div className="sl-pricing-builder">
            {form.pricingTiers.map((tier, i) => (
              <div className="sl-pricing-tier" key={i}>
                <div className="sl-pricing-tier-head">Tier {i + 1}</div>
                <div className="sl-field" style={{ marginBottom: 8 }}>
                  <input className="sl-input" placeholder="Plan name" value={tier.name} onChange={e => updateTier(i, 'name', e.target.value)} />
                </div>
                <div className="sl-field" style={{ marginBottom: 0 }}>
                  <input className="sl-input" placeholder="$0" value={tier.price} onChange={e => updateTier(i, 'price', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
