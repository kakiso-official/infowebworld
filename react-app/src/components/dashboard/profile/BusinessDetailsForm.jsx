export default function BusinessDetailsForm() {
  return (
    <div className="db-card db-full">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
          Business Details
        </div>
      </div>
      <div className="db-card-body">
        <div className="db-form-group">
          <label className="db-form-label">Services Offered</label>
          <textarea className="db-form-textarea" defaultValue={"Cloud Security Audits\nZero-Trust Implementation\nCompliance Consulting (SOC 2, ISO 27001)\nPenetration Testing\n24/7 Security Monitoring\nIncident Response"} />
          <div className="db-form-hint">One service per line</div>
        </div>
        <div className="db-form-group">
          <label className="db-form-label">Tags / Keywords</label>
          <input className="db-form-input" defaultValue="Cloud Security, Zero Trust, Cybersecurity, Enterprise, SOC 2, Compliance" />
          <div className="db-form-hint">Comma-separated keywords for search discoverability</div>
        </div>
        <div className="db-form-group">
          <label className="db-form-label">Service Area</label>
          <select className="db-form-select" defaultValue="national">
            <option value="local">Local (City)</option><option value="regional">Regional (State)</option><option value="national">National</option><option value="international">International</option>
          </select>
        </div>
        <div className="db-form-group">
          <label className="db-form-label">Certifications</label>
          <input className="db-form-input" defaultValue="ISO 27001, SOC 2 Type II, CMMC Level 3, FedRAMP Authorized" />
        </div>
        <div className="db-form-actions">
          <button className="db-btn db-btn--primary">Save Changes</button>
          <button className="db-btn db-btn--outline">Discard</button>
        </div>
      </div>
    </div>
  )
}
