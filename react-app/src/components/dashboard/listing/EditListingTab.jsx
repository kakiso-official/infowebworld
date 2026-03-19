import { Link } from 'react-router-dom'
import { LISTING } from '../../../data/dashboard/listingData'

export default function EditListingTab() {
  return (
    <div className="db-card db-full">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          Edit Listing Content
        </div>
        <Link to="/listing" className="db-card-action" target="_blank">Preview →</Link>
      </div>
      <div className="db-card-body">
        <div className="db-form-row">
          <div className="db-form-group">
            <label className="db-form-label">Business Name</label>
            <input className="db-form-input" defaultValue={LISTING.name} />
          </div>
          <div className="db-form-group">
            <label className="db-form-label">Category</label>
            <select className="db-form-select" defaultValue="cybersecurity">
              <option value="cybersecurity">Cybersecurity</option>
              <option value="technology">Technology</option>
              <option value="analytics">Analytics</option>
              <option value="fintech">FinTech</option>
              <option value="healthcare">Healthcare</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>
        </div>

        <div className="db-form-group">
          <label className="db-form-label">Tagline</label>
          <input className="db-form-input" defaultValue={LISTING.tagline} />
          <div className="db-form-hint">Brief headline shown in search results (max 120 chars)</div>
        </div>

        <div className="db-form-group">
          <label className="db-form-label">Full Description</label>
          <textarea className="db-form-textarea" rows={5} defaultValue="CloudGuard Technologies provides enterprise-grade cloud security solutions built on zero-trust architecture. Our platform helps organizations protect their cloud infrastructure with real-time threat detection, automated response, and comprehensive compliance reporting. Trusted by Fortune 500 companies and government agencies worldwide." />
          <div className="db-form-hint">Detailed description of your business (300+ characters recommended for SEO)</div>
        </div>

        <div className="db-form-row">
          <div className="db-form-group">
            <label className="db-form-label">Website URL</label>
            <input className="db-form-input" defaultValue="https://cloudguard.io" />
          </div>
          <div className="db-form-group">
            <label className="db-form-label">Phone</label>
            <input className="db-form-input" defaultValue="+1 (555) 123-4567" />
          </div>
        </div>

        <div className="db-form-row">
          <div className="db-form-group">
            <label className="db-form-label">Email</label>
            <input className="db-form-input" defaultValue="contact@cloudguard.io" />
          </div>
          <div className="db-form-group">
            <label className="db-form-label">Address</label>
            <input className="db-form-input" defaultValue="123 Business Ave, San Francisco, CA 94102" />
          </div>
        </div>

        <div className="db-form-row">
          <div className="db-form-group">
            <label className="db-form-label">Founded Year</label>
            <input className="db-form-input" defaultValue="2019" />
          </div>
          <div className="db-form-group">
            <label className="db-form-label">Company Size</label>
            <select className="db-form-select" defaultValue="51-200">
              <option>1-10</option><option>11-50</option><option value="51-200">51-200</option><option>201-500</option><option>500+</option>
            </select>
          </div>
        </div>

        <div className="db-form-group">
          <label className="db-form-label">Tags / Keywords</label>
          <input className="db-form-input" defaultValue="Cloud Security, Zero Trust, Cybersecurity, Enterprise, SOC 2, Compliance" />
          <div className="db-form-hint">Comma-separated keywords for search discoverability</div>
        </div>

        <div className="db-form-group">
          <label className="db-form-label">Business Hours</label>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
            <div key={day} className="dbl-hours-row">
              <span className="dbl-hours-day">{day}</span>
              <select className="db-form-select" defaultValue="9:00 AM" style={{ flex: 1 }}>
                <option>8:00 AM</option><option value="9:00 AM">9:00 AM</option><option>10:00 AM</option>
              </select>
              <span className="dbl-hours-to">to</span>
              <select className="db-form-select" defaultValue="6:00 PM" style={{ flex: 1 }}>
                <option>5:00 PM</option><option value="6:00 PM">6:00 PM</option><option>7:00 PM</option><option>8:00 PM</option>
              </select>
            </div>
          ))}
          {['Saturday', 'Sunday'].map(day => (
            <div key={day} className="dbl-hours-row">
              <span className="dbl-hours-day">{day}</span>
              <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>Closed</span>
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
          <button className="db-btn db-btn--primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 14, height: 14 }}><polyline points="20 6 9 17 4 12"/></svg>
            Save Changes
          </button>
          <button className="db-btn db-btn--outline">Discard Changes</button>
        </div>
      </div>
    </div>
  )
}
