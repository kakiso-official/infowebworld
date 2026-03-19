export default function HoursContactForm() {
  return (
    <div className="db-card db-full">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          Hours & Contact
        </div>
      </div>
      <div className="db-card-body">
        <div className="db-form-row">
          <div className="db-form-group">
            <label className="db-form-label">Phone</label>
            <input className="db-form-input" defaultValue="+1 (555) 123-4567" />
          </div>
          <div className="db-form-group">
            <label className="db-form-label">Email</label>
            <input className="db-form-input" defaultValue="contact@cloudguard.tech" />
          </div>
        </div>
        <div className="db-form-group">
          <label className="db-form-label">Address</label>
          <input className="db-form-input" defaultValue="123 Business Ave, Suite 100, San Francisco, CA 94102" />
        </div>
        <div className="db-form-group">
          <label className="db-form-label">Business Hours</label>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
            <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ width: 90, fontSize: 13, fontWeight: 400, color: 'var(--gray-700)' }}>{day}</span>
              <input className="db-form-input" defaultValue="9:00 AM" style={{ width: 110 }} />
              <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>to</span>
              <input className="db-form-input" defaultValue="6:00 PM" style={{ width: 110 }} />
            </div>
          ))}
          {['Saturday', 'Sunday'].map(day => (
            <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ width: 90, fontSize: 13, fontWeight: 400, color: 'var(--gray-700)' }}>{day}</span>
              <span style={{ fontSize: 12, fontWeight: 300, color: 'var(--gray-400)' }}>Closed</span>
            </div>
          ))}
        </div>
        <div className="db-form-row">
          <div className="db-form-group">
            <label className="db-form-label">LinkedIn</label>
            <input className="db-form-input" defaultValue="https://linkedin.com/company/cloudguard" />
          </div>
          <div className="db-form-group">
            <label className="db-form-label">Twitter / X</label>
            <input className="db-form-input" defaultValue="https://x.com/cloudguard" />
          </div>
        </div>
        <div className="db-form-actions">
          <button className="db-btn db-btn--primary">Save Changes</button>
          <button className="db-btn db-btn--outline">Discard</button>
        </div>
      </div>
    </div>
  )
}
