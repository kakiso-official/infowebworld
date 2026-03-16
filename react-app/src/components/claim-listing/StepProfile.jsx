export default function StepProfile({ listing, form, up, onComplete, onBack }) {
  return (
    <div className="cl-step-content">
      {/* Verified listing bar */}
      <div className="cl-selected">
        <div className="cl-selected-logo" style={{ background: `linear-gradient(135deg, ${listing.color}, ${listing.color}88)` }}>
          {listing.logo}
        </div>
        <div className="cl-selected-info">
          <div className="cl-selected-name">
            {listing.name}
            <span className="cl-selected-verified">
              <svg viewBox="0 0 24 24" fill="var(--emerald)" stroke="#fff" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Verified
            </span>
          </div>
          <div className="cl-selected-tagline">{listing.tagline}</div>
        </div>
      </div>

      <div className="cl-card">
        <div className="cl-card-header">
          <div className="cl-card-icon" style={{ background: 'rgba(59,130,246,.08)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--azure)" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div>
            <h3>Complete Your Business Profile</h3>
            <p>Add your details so customers can reach you</p>
          </div>
        </div>

        {/* Section 1: Contact */}
        <div className="cl-form-section">
          <div className="cl-form-section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Your Contact Information
          </div>
          <div className="cl-form-row">
            <div className="cl-form-field">
              <label className="cl-form-label">Full Name <span className="cl-req">*</span></label>
              <input className="cl-form-input" placeholder="e.g., Aadil Parmar" value={form.fullName} onChange={e => up('fullName', e.target.value)} />
            </div>
            <div className="cl-form-field">
              <label className="cl-form-label">Job Title <span className="cl-req">*</span></label>
              <input className="cl-form-input" placeholder="e.g., CEO, Marketing Director" value={form.jobTitle} onChange={e => up('jobTitle', e.target.value)} />
            </div>
          </div>
          <div className="cl-form-row">
            <div className="cl-form-field">
              <label className="cl-form-label">Work Email <span className="cl-req">*</span></label>
              <input className="cl-form-input" type="email" placeholder="you@company.com" value={form.workEmail} onChange={e => up('workEmail', e.target.value)} />
            </div>
            <div className="cl-form-field">
              <label className="cl-form-label">Phone Number</label>
              <input className="cl-form-input" type="tel" placeholder="+1 (555) 123-4567" value={form.phone} onChange={e => up('phone', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Section 2: Business */}
        <div className="cl-form-section">
          <div className="cl-form-section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            Business Details
          </div>
          <div className="cl-form-row">
            <div className="cl-form-field">
              <label className="cl-form-label">Website URL</label>
              <input className="cl-form-input" placeholder="https://yourwebsite.com" value={form.website} onChange={e => up('website', e.target.value)} />
            </div>
            <div className="cl-form-field">
              <label className="cl-form-label">LinkedIn</label>
              <input className="cl-form-input" placeholder="https://linkedin.com/company/..." value={form.linkedin} onChange={e => up('linkedin', e.target.value)} />
            </div>
          </div>
          <div className="cl-form-field">
            <label className="cl-form-label">Business Description</label>
            <span className="cl-form-hint">Brief description of what your business does</span>
            <textarea className="cl-form-input cl-form-textarea" rows={4} placeholder="Tell potential customers what makes your business unique..." value={form.description} onChange={e => up('description', e.target.value)} maxLength={500} />
            <div className="cl-form-charcount">{form.description.length}/500</div>
          </div>
        </div>

        {/* Section 3: Hours */}
        <div className="cl-form-section">
          <div className="cl-form-section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            Business Hours <span className="cl-form-opt">(optional)</span>
          </div>
          <div className="cl-hours-grid">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <div key={day} className="cl-hours-row">
                <span className="cl-hours-day">{day}</span>
                <div className="cl-hours-inputs">
                  <select className="cl-form-select" defaultValue={day === 'Saturday' || day === 'Sunday' ? 'closed' : '9:00 AM'}>
                    <option value="closed">Closed</option>
                    <option value="8:00 AM">8:00 AM</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                  </select>
                  <span className="cl-hours-to">to</span>
                  <select className="cl-form-select" defaultValue={day === 'Saturday' || day === 'Sunday' ? 'closed' : '6:00 PM'}>
                    <option value="closed">Closed</option>
                    <option value="5:00 PM">5:00 PM</option>
                    <option value="6:00 PM">6:00 PM</option>
                    <option value="7:00 PM">7:00 PM</option>
                    <option value="8:00 PM">8:00 PM</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Logo */}
        <div className="cl-form-section">
          <div className="cl-form-section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Logo Upload <span className="cl-form-opt">(optional)</span>
          </div>
          <div className="cl-upload-zone">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span>Drop your logo here or click to browse</span>
            <span className="cl-upload-hint">PNG, JPG, SVG — Recommended: 400x400px</span>
          </div>
        </div>

        {/* Actions */}
        <div className="cl-form-actions">
          <button className="cl-btn-secondary" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <button className="cl-btn-primary" onClick={onComplete}>
            Complete & Claim Listing
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
