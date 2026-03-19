import { SERVICES } from '../../../data/dashboard/listingData'

export default function ServicesPricingTab() {
  return (
    <div className="db-card db-full">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          Services & Pricing
        </div>
        <button className="db-btn db-btn--primary" style={{ fontSize: 12, padding: '6px 14px' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12 }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Service
        </button>
      </div>
      <div className="db-card-body">
        <table className="db-table">
          <thead>
            <tr><th>Service</th><th>Price</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {SERVICES.map((s, i) => (
              <tr key={i}>
                <td className="db-table-name">{s.name}</td>
                <td style={{ fontWeight: 500 }}>{s.price}</td>
                <td>
                  <span className={`db-badge-pill db-badge--${s.status === 'active' ? 'active' : 'pending'}`}>{s.status === 'active' ? 'Active' : 'Draft'}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="db-btn db-btn--outline" style={{ fontSize: 11, padding: '4px 10px' }}>Edit</button>
                    <button className="db-btn db-btn--outline" style={{ fontSize: 11, padding: '4px 10px', color: 'var(--coral)', borderColor: 'rgba(239,107,74,.3)' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pricing Display Settings */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--gray-100)' }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)', marginBottom: 12 }}>Pricing Display Settings</div>
          <div className="db-form-row">
            <div className="db-form-group">
              <label className="db-form-label">Price Range Display</label>
              <select className="db-form-select" defaultValue="range">
                <option value="range">Show Price Range ($$$$)</option>
                <option value="exact">Show Exact Prices</option>
                <option value="quote">Request a Quote</option>
                <option value="hide">Hide Pricing</option>
              </select>
            </div>
            <div className="db-form-group">
              <label className="db-form-label">Currency</label>
              <select className="db-form-select" defaultValue="usd">
                <option value="usd">USD ($)</option>
                <option value="eur">EUR (€)</option>
                <option value="gbp">GBP (£)</option>
                <option value="inr">INR (₹)</option>
              </select>
            </div>
          </div>
          <div className="db-form-actions">
            <button className="db-btn db-btn--primary">Save Pricing Settings</button>
          </div>
        </div>
      </div>
    </div>
  )
}
