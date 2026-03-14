import { Link } from 'react-router-dom'
import { CATEGORIES } from './StepBusiness'
import { PLANS } from './StepPlan'

export default function StepReview({ form }) {
  return (
    <>
      <div className="sl-review">
        <div className="sl-review-header">
          <h3>Review Your Listing</h3>
          <p>Please verify all information before submitting. You can edit your listing after approval.</p>
        </div>
        <div className="sl-review-body">
          <div className="sl-review-grid">
            <div className="sl-review-item">
              <div className="sl-review-item-icon" style={{ background: 'var(--accent)' }}>
                <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" /></svg>
              </div>
              <div>
                <div className="sl-review-item-label">Business Name</div>
                <div className="sl-review-item-value">{form.name || '—'}</div>
              </div>
            </div>
            <div className="sl-review-item">
              <div className="sl-review-item-icon" style={{ background: 'var(--azure)' }}>
                <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
              </div>
              <div>
                <div className="sl-review-item-label">Website</div>
                <div className="sl-review-item-value">{form.website || '—'}</div>
              </div>
            </div>
            <div className="sl-review-item">
              <div className="sl-review-item-icon" style={{ background: 'var(--plum)' }}>
                <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
              </div>
              <div>
                <div className="sl-review-item-label">Category</div>
                <div className="sl-review-item-value">{CATEGORIES.find(c => c.id === form.category)?.name || '—'}</div>
              </div>
            </div>
            <div className="sl-review-item">
              <div className="sl-review-item-icon" style={{ background: 'var(--emerald)' }}>
                <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
              </div>
              <div>
                <div className="sl-review-item-label">Selected Plan</div>
                <div className="sl-review-item-value">{PLANS.find(p => p.id === form.plan)?.name} — {PLANS.find(p => p.id === form.plan)?.price}{PLANS.find(p => p.id === form.plan)?.period}</div>
              </div>
            </div>
            <div className="sl-review-item">
              <div className="sl-review-item-icon" style={{ background: 'var(--coral)' }}>
                <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              </div>
              <div>
                <div className="sl-review-item-label">Email</div>
                <div className="sl-review-item-value">{form.email || '—'}</div>
              </div>
            </div>
            <div className="sl-review-item">
              <div className="sl-review-item-icon" style={{ background: 'var(--teal)' }}>
                <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
              </div>
              <div>
                <div className="sl-review-item-label">Team & Location</div>
                <div className="sl-review-item-value">{form.teamSize || '—'} &middot; {form.hqLocation || '—'}</div>
              </div>
            </div>
          </div>

          {form.features.filter(Boolean).length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray-700)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.03em' }}>Key Features</div>
              <div className="sl-review-features">
                {form.features.filter(Boolean).map((f, i) => (
                  <div className="sl-review-feature" key={i}>
                    <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {form.integrations.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray-700)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.03em' }}>Integrations</div>
              <div className="sl-review-tags">
                {form.integrations.map((t, i) => (
                  <span className="sl-review-tag" key={i}>{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Terms */}
      <div className="sl-section" style={{ textAlign: 'center', padding: '20px 28px' }}>
        <p style={{ fontSize: 12, fontWeight: 300, color: 'var(--gray-500)', lineHeight: 1.6, maxWidth: 500, margin: '0 auto' }}>
          By submitting, you agree to InfoWebWorld's <Link to="/terms" style={{ color: 'var(--accent)', fontWeight: 400 }}>Terms of Service</Link> and <Link to="/privacy" style={{ color: 'var(--accent)', fontWeight: 400 }}>Privacy Policy</Link>.
          Listings are reviewed within 24-48 hours. You can edit your listing at any time after approval.
        </p>
      </div>
    </>
  )
}
