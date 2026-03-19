import { Link } from 'react-router-dom'
import { CATEGORIES } from './BusinessInfoStep'

export default function ReviewSubmitStep({ form, totalSteps }) {
  return (
    <>
      <div className="db-card db-full">
        <div className="db-card-header">
          <div className="db-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Review Your Listing
          </div>
          <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>Step 5 of {totalSteps}</span>
        </div>
        <div className="db-card-body">
          <div className="db-form-hint" style={{ marginBottom: 16 }}>Please verify all information before submitting. You can edit your listing after approval.</div>

          <div className="dcl-review-grid">
            {[
              { label: 'Business Name', value: form.name, color: 'var(--accent)', icon: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v3"/></> },
              { label: 'Website', value: form.website, color: 'var(--azure)', icon: <><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></> },
              { label: 'Category', value: CATEGORIES.find(c => c.id === form.category)?.name, color: 'var(--plum)', icon: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></> },
              { label: 'Plan', value: 'Pro Plan (Current)', color: 'var(--emerald)', icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></> },
              { label: 'Email', value: form.email, color: 'var(--coral)', icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></> },
              { label: 'Team & Location', value: `${form.teamSize || '\u2014'} \u00b7 ${form.hqLocation || '\u2014'}`, color: 'var(--teal)', icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></> },
            ].map((item, i) => (
              <div key={i} className="dcl-review-item">
                <div className="dcl-review-icon" style={{ background: `${item.color}12` }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{item.icon}</svg>
                </div>
                <div>
                  <div className="dcl-review-label">{item.label}</div>
                  <div className="dcl-review-value">{item.value || '\u2014'}</div>
                </div>
              </div>
            ))}
          </div>

          {form.description && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--gray-100)' }}>
              <div className="dcl-review-section-title">Description</div>
              <p style={{ fontSize: 13, fontWeight: 300, color: 'var(--gray-600)', lineHeight: 1.6, margin: 0 }}>{form.description}</p>
            </div>
          )}

          {form.features.filter(Boolean).length > 0 && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--gray-100)' }}>
              <div className="dcl-review-section-title">Key Features</div>
              <div className="dcl-review-features">
                {form.features.filter(Boolean).map((f, i) => (
                  <div className="dcl-review-feature" key={i}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="2" style={{ width: 14, height: 14, flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {form.integrations.length > 0 && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--gray-100)' }}>
              <div className="dcl-review-section-title">Integrations</div>
              <div className="dcl-review-tags">
                {form.integrations.map((t, i) => (
                  <span className="dcl-tag" key={i} style={{ cursor: 'default' }}>{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Plan Notice */}
      <div className="db-card db-full">
        <div className="db-card-body">
          <div className="dcl-plan-notice">
            <div className="dcl-plan-notice-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <div className="dcl-plan-notice-title">Covered Under Your Pro Plan</div>
              <div className="dcl-plan-notice-desc">This listing will be created under your existing Pro Plan. No additional payment required. You can manage your plan from <Link to="/dashboard/billing" style={{ color: 'var(--accent)', fontWeight: 500 }}>Billing & Plan</Link>.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="db-card db-full">
        <div className="db-card-body" style={{ textAlign: 'center', padding: '20px' }}>
          <p style={{ fontSize: 12, fontWeight: 300, color: 'var(--gray-500)', lineHeight: 1.6, maxWidth: 500, margin: '0 auto' }}>
            By submitting, you agree to InfoWebWorld's <Link to="/terms" style={{ color: 'var(--accent)', fontWeight: 400 }}>Terms of Service</Link> and <Link to="/privacy" style={{ color: 'var(--accent)', fontWeight: 400 }}>Privacy Policy</Link>.
            Listings are reviewed within 24-48 hours.
          </p>
        </div>
      </div>
    </>
  )
}
