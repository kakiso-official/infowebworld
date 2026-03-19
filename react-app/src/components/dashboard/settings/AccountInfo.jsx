export default function AccountInfo() {
  return (
    <div className="db-card db-full" style={{ marginBottom: 24 }}>
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          Account Information
        </div>
      </div>
      <div className="db-card-body">
        <div className="db-form-row">
          <div className="db-form-group">
            <label className="db-form-label">Full Name</label>
            <input className="db-form-input" defaultValue="Aadil Parmar" />
          </div>
          <div className="db-form-group">
            <label className="db-form-label">Email Address</label>
            <input className="db-form-input" defaultValue="aadil@cloudguard.tech" />
          </div>
        </div>
        <div className="db-form-row">
          <div className="db-form-group">
            <label className="db-form-label">Phone</label>
            <input className="db-form-input" defaultValue="+1 (555) 123-4567" />
          </div>
          <div className="db-form-group">
            <label className="db-form-label">Timezone</label>
            <select className="db-form-select" defaultValue="pst">
              <option value="est">Eastern (EST)</option><option value="cst">Central (CST)</option><option value="mst">Mountain (MST)</option><option value="pst">Pacific (PST)</option>
            </select>
          </div>
        </div>
        <div className="db-form-actions">
          <button className="db-btn db-btn--primary">Update Account</button>
        </div>
      </div>
    </div>
  )
}
