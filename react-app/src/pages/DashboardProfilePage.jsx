import { useState } from 'react'
import DashboardLayout from '../components/dashboard/DashboardLayout'

export default function DashboardProfilePage() {
  const [activeSection, setActiveSection] = useState('basic')

  return (
    <DashboardLayout title="Business Profile" subtitle="Manage your public listing">
      {/* Profile Hero */}
      <div className="db-profile-hero">
        <div className="db-profile-avatar-lg">AP</div>
        <div className="db-profile-info">
          <div className="db-profile-name">CloudGuard Technologies</div>
          <div className="db-profile-email">contact@cloudguard.tech &middot; San Francisco, CA</div>
          <div className="db-profile-badges">
            <span className="db-badge-pill db-badge--active">Verified</span>
            <span className="db-badge-pill db-badge--neutral">Pro Plan</span>
            <span className="db-badge-pill db-badge--pending">Featured</span>
          </div>
        </div>
        <button className="db-btn db-btn--outline">View Public Listing</button>
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { key: 'basic', label: 'Basic Info' },
          { key: 'details', label: 'Business Details' },
          { key: 'media', label: 'Photos & Media' },
          { key: 'hours', label: 'Hours & Contact' },
        ].map(t => (
          <button key={t.key} className={`db-btn ${activeSection === t.key ? 'db-btn--primary' : 'db-btn--outline'}`} onClick={() => setActiveSection(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Basic Info */}
      {activeSection === 'basic' && (
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
      )}

      {/* Business Details */}
      {activeSection === 'details' && (
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
      )}

      {/* Photos & Media */}
      {activeSection === 'media' && (
        <div className="db-card db-full">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
              Photos & Media
            </div>
          </div>
          <div className="db-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 12, marginBottom: 20 }}>
              {['Office HQ', 'Team Photo', 'SOC Dashboard', 'Awards Wall', 'Conference'].map((label, i) => (
                <div key={i} style={{ aspectRatio: '4/3', borderRadius: 'var(--r-sm)', background: `linear-gradient(135deg, hsl(${220 + i * 30},60%,90%), hsl(${220 + i * 30},60%,80%))`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                  <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--gray-600)' }}>{label}</span>
                  <button style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,.5)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: '#fff', fill: 'none', strokeWidth: 2 }}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              ))}
              <div style={{ aspectRatio: '4/3', borderRadius: 'var(--r-sm)', border: '2px dashed var(--gray-200)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', transition: 'border-color .2s' }}>
                <svg viewBox="0 0 24 24" style={{ width: 24, height: 24, stroke: 'var(--gray-400)', fill: 'none', strokeWidth: 1.5 }}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--gray-400)' }}>Add Photo</span>
              </div>
            </div>
            <div className="db-form-group">
              <label className="db-form-label">Video URL (YouTube or Vimeo)</label>
              <input className="db-form-input" placeholder="https://youtube.com/watch?v=..." />
            </div>
            <div className="db-form-actions">
              <button className="db-btn db-btn--primary">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Hours & Contact */}
      {activeSection === 'hours' && (
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
      )}
    </DashboardLayout>
  )
}
