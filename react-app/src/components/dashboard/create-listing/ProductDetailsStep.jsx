export default function ProductDetailsStep({ form, up, totalSteps, addFeature, removeFeature, updateFeature, addIntegration, removeIntegration, updateTier }) {
  return (
    <>
      {/* Key Features */}
      <div className="db-card db-full">
        <div className="db-card-header">
          <div className="db-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
            Key Features
          </div>
          <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>Step 3 of {totalSteps}</span>
        </div>
        <div className="db-card-body">
          <div className="db-form-hint" style={{ marginBottom: 12 }}>List the top features of your product (minimum 3)</div>
          <div className="dcl-feature-list">
            {form.features.map((f, i) => (
              <div className="dcl-feature-item" key={i}>
                <div className="dcl-feature-num">{i + 1}</div>
                <input className="db-form-input" placeholder={`Feature ${i + 1} (e.g. "Real-time collaboration")`} value={f} onChange={e => updateFeature(i, e.target.value)} style={{ flex: 1 }} />
                {form.features.length > 3 && (
                  <button className="dcl-feature-remove" onClick={() => removeFeature(i)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          {form.features.length < 15 && (
            <button className="db-btn db-btn--outline" style={{ marginTop: 10, fontSize: 12 }} onClick={addFeature}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12 }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Feature
            </button>
          )}
        </div>
      </div>

      {/* Integrations */}
      <div className="db-card db-full">
        <div className="db-card-header">
          <div className="db-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
            Integrations
          </div>
        </div>
        <div className="db-card-body">
          <div className="db-form-hint" style={{ marginBottom: 12 }}>What tools and platforms does your product integrate with?</div>
          <div className="dcl-tags-wrap">
            {form.integrations.map((t, i) => (
              <span className="dcl-tag" key={i}>
                {t}
                <button className="dcl-tag-remove" onClick={() => removeIntegration(i)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </span>
            ))}
            <input
              className="db-form-input dcl-tags-input"
              placeholder="Type and press Enter (e.g. Slack, Salesforce)"
              value={form.integrationsInput}
              onChange={e => up('integrationsInput', e.target.value)}
              onKeyDown={addIntegration}
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="db-card db-full">
        <div className="db-card-header">
          <div className="db-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            Pricing Information
          </div>
        </div>
        <div className="db-card-body">
          <div className="db-form-group">
            <label className="db-form-label">Pricing Model</label>
            <select className="db-form-select" value={form.pricingModel} onChange={e => up('pricingModel', e.target.value)} style={{ maxWidth: 300 }}>
              <option value="subscription">Subscription (Monthly/Annual)</option>
              <option value="one-time">One-time Purchase</option>
              <option value="freemium">Freemium</option>
              <option value="usage">Usage-based / Pay-per-use</option>
              <option value="contact">Contact for Pricing</option>
              <option value="free">Completely Free</option>
            </select>
          </div>

          <label className="db-form-label">Pricing Tiers</label>
          <div className="db-form-hint" style={{ marginBottom: 10 }}>Optional — helps users understand your pricing at a glance</div>
          <div className="dcl-pricing-grid">
            {form.pricingTiers.map((tier, i) => (
              <div className="dcl-pricing-tier" key={i}>
                <div className="dcl-pricing-tier-head">Tier {i + 1}</div>
                <input className="db-form-input" placeholder="Plan name" value={tier.name} onChange={e => updateTier(i, 'name', e.target.value)} style={{ marginBottom: 6 }} />
                <input className="db-form-input" placeholder="$0" value={tier.price} onChange={e => updateTier(i, 'price', e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
