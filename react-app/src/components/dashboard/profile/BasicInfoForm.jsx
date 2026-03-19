export default function BasicInfoForm() {
  return (
    <div className="db-card db-full">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          Basic Information
        </div>
      </div>
      <div className="db-card-body">
        <div className="db-form-row">
          <div className="db-form-group">
            <label className="db-form-label">Business Name</label>
            <input className="db-form-input" defaultValue="CloudGuard Technologies" />
          </div>
          <div className="db-form-group">
            <label className="db-form-label">Category</label>
            <select className="db-form-select" defaultValue="technology">
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="education">Education</option>
              <option value="realestate">Real Estate</option>
              <option value="food">Food & Dining</option>
              <option value="legal">Legal</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>
        </div>
        <div className="db-form-group">
          <label className="db-form-label">Tagline</label>
          <input className="db-form-input" defaultValue="Enterprise cloud security solutions with zero-trust architecture" />
          <div className="db-form-hint">Brief description shown in search results (max 120 characters)</div>
        </div>
        <div className="db-form-group">
          <label className="db-form-label">Full Description</label>
          <textarea className="db-form-textarea" defaultValue="CloudGuard Technologies provides enterprise-grade cloud security solutions built on zero-trust architecture. Our platform helps organizations protect their cloud infrastructure with real-time threat detection, automated response, and comprehensive compliance reporting." />
        </div>
        <div className="db-form-row">
          <div className="db-form-group">
            <label className="db-form-label">Website URL</label>
            <input className="db-form-input" defaultValue="https://cloudguard.tech" />
          </div>
          <div className="db-form-group">
            <label className="db-form-label">Founded Year</label>
            <input className="db-form-input" defaultValue="2019" />
          </div>
        </div>
        <div className="db-form-row">
          <div className="db-form-group">
            <label className="db-form-label">Company Size</label>
            <select className="db-form-select" defaultValue="51-200">
              <option>1-10</option><option>11-50</option><option value="51-200">51-200</option><option>201-500</option><option>500+</option>
            </select>
          </div>
          <div className="db-form-group">
            <label className="db-form-label">Price Range</label>
            <select className="db-form-select" defaultValue="$$$$">
              <option>$</option><option>$$</option><option>$$$</option><option value="$$$$">$$$$</option>
            </select>
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
