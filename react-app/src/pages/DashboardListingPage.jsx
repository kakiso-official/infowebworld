import { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/dashboard/DashboardLayout'

const LISTING = {
  name: 'CloudGuard Technologies',
  tagline: 'Enterprise-grade cloud security & compliance platform',
  category: 'Cybersecurity',
  url: 'cloudguard.io',
  logo: 'CG',
  color: '#6C72F1',
  status: 'active',
  plan: 'Pro',
  verified: true,
  featured: true,
  rating: 4.8,
  reviews: 127,
  createdAt: 'Jan 12, 2025',
  lastUpdated: 'Mar 14, 2026',
  slug: 'cloudguard-technologies',
}

const SERVICES = [
  { name: 'Cloud Security Audits', price: '$5,000', status: 'active' },
  { name: 'Zero-Trust Implementation', price: '$15,000', status: 'active' },
  { name: 'Compliance Consulting (SOC 2)', price: '$8,000', status: 'active' },
  { name: 'Penetration Testing', price: '$3,500', status: 'active' },
  { name: '24/7 Security Monitoring', price: '$2,000/mo', status: 'active' },
  { name: 'Incident Response', price: 'Custom', status: 'draft' },
]

const HEALTH_ITEMS = [
  { label: 'Business Info', done: true },
  { label: 'Logo & Photos', done: true },
  { label: 'Contact Details', done: true },
  { label: 'Business Hours', done: true },
  { label: 'Services Listed', done: true },
  { label: 'Description (300+ chars)', done: true },
  { label: 'Social Links', done: false },
  { label: 'Video/Demo', done: false },
]

const ACTIVITY = [
  { text: 'Listing appeared in 42 search results', time: '2 hours ago', icon: 'search', color: 'var(--accent)' },
  { text: 'New review from Michael Chen (5★)', time: '5 hours ago', icon: 'star', color: 'var(--amber)' },
  { text: 'Lead captured from listing page', time: '8 hours ago', icon: 'lead', color: 'var(--emerald)' },
  { text: 'Listing viewed 24 times today', time: '12 hours ago', icon: 'eye', color: 'var(--azure)' },
  { text: 'Featured badge renewed', time: '1 day ago', icon: 'badge', color: 'var(--plum)' },
]

export default function DashboardListingPage() {
  const [tab, setTab] = useState('overview')
  const [seoTitle, setSeoTitle] = useState('CloudGuard Technologies | Enterprise Cloud Security')
  const [seoDesc, setSeoDesc] = useState('Enterprise-grade cloud security solutions built on zero-trust architecture. Protect your infrastructure with real-time threat detection and automated response.')
  const [visibility, setVisibility] = useState({ searchable: true, featured: true, acceptLeads: true, showReviews: true, showPricing: true })

  const healthScore = Math.round((HEALTH_ITEMS.filter(h => h.done).length / HEALTH_ITEMS.length) * 100)

  const toggleVis = (key) => setVisibility(v => ({ ...v, [key]: !v[key] }))

  return (
    <DashboardLayout title="My Listing" subtitle="Manage, edit, and optimize your business listing">

      {/* ── Listing Hero Card ── */}
      <div className="db-card db-full" style={{ marginBottom: 20 }}>
        <div className="db-card-body" style={{ padding: 0 }}>
          <div className="dbl-hero">
            <div className="dbl-hero-left">
              <div className="dbl-hero-avatar" style={{ background: `linear-gradient(135deg, ${LISTING.color}, ${LISTING.color}88)` }}>
                {LISTING.logo}
              </div>
              <div className="dbl-hero-info">
                <div className="dbl-hero-name">
                  {LISTING.name}
                  <span className="db-badge-pill db-badge--active">
                    <svg viewBox="0 0 24 24" style={{ width: 10, height: 10, stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}><polyline points="20 6 9 17 4 12"/></svg>
                    Active
                  </span>
                </div>
                <div className="dbl-hero-tagline">{LISTING.tagline}</div>
                <div className="dbl-hero-meta">
                  <span className="dbl-hero-meta-item">
                    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                    {LISTING.category}
                  </span>
                  <span className="dbl-hero-meta-item">
                    <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                    {LISTING.url}
                  </span>
                  <span className="dbl-hero-meta-item">
                    <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    {LISTING.rating} ({LISTING.reviews} reviews)
                  </span>
                </div>
                <div className="dbl-hero-badges">
                  {LISTING.verified && <span className="db-badge-pill db-badge--active">Verified</span>}
                  <span className="db-badge-pill db-badge--neutral">{LISTING.plan} Plan</span>
                  {LISTING.featured && <span className="db-badge-pill db-badge--pending">Featured</span>}
                  <span className="dbl-hero-date">Listed {LISTING.createdAt} · Updated {LISTING.lastUpdated}</span>
                </div>
              </div>
            </div>
            <div className="dbl-hero-actions">
              <Link to="/listing" className="db-btn db-btn--outline" target="_blank">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                Preview Listing
              </Link>
              <Link to="/submit-listing" className="db-btn db-btn--primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                Create New Listing
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="db-stats" style={{ marginBottom: 20 }}>
        {[
          { label: 'Profile Views', value: '12,847', change: '+18%', up: true, color: 'var(--accent)', icon: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></> },
          { label: 'Search Impressions', value: '5,230', change: '+12%', up: true, color: 'var(--emerald)', icon: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></> },
          { label: 'Click-through Rate', value: '8.4%', change: '+2.1%', up: true, color: 'var(--azure)', icon: <><path d="M15 3h6v6"/><path d="M10 14L21 3"/><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/></> },
          { label: 'Leads Generated', value: '384', change: '+24%', up: true, color: 'var(--amber)', icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/></> },
        ].map((s, i) => (
          <div key={i} className="db-stat">
            <div className="db-stat-icon" style={{ background: `${s.color}12` }}>
              <svg viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{s.icon}</svg>
            </div>
            <div className="db-stat-info">
              <div className="db-stat-value">{s.value}</div>
              <div className="db-stat-label">{s.label}</div>
            </div>
            <div className={`db-stat-change db-stat-change--${s.up ? 'up' : 'down'}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points={s.up ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}/></svg>
              {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="dbl-tabs">
        {[
          { key: 'overview', label: 'Overview', icon: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></> },
          { key: 'edit', label: 'Edit Listing', icon: <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></> },
          { key: 'services', label: 'Services & Pricing', icon: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></> },
          { key: 'seo', label: 'SEO & Visibility', icon: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></> },
          { key: 'media', label: 'Media', icon: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></> },
        ].map(t => (
          <button key={t.key} className={`dbl-tab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{t.icon}</svg>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════════ OVERVIEW TAB ══════════ */}
      {tab === 'overview' && (
        <>
          <div className="db-grid-2">
            {/* Listing Health */}
            <div className="db-card">
              <div className="db-card-header">
                <div className="db-card-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                  Listing Health
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: healthScore >= 80 ? 'var(--emerald)' : 'var(--amber)' }}>{healthScore}%</span>
              </div>
              <div className="db-card-body">
                <div className="dbl-health-bar">
                  <div className="dbl-health-fill" style={{ width: `${healthScore}%`, background: healthScore >= 80 ? 'var(--emerald)' : 'var(--amber)' }} />
                </div>
                <div className="dbl-health-items">
                  {HEALTH_ITEMS.map((h, i) => (
                    <div key={i} className={`dbl-health-item${h.done ? ' done' : ''}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {h.done ? <polyline points="20 6 9 17 4 12"/> : <circle cx="12" cy="12" r="10"/>}
                      </svg>
                      {h.label}
                    </div>
                  ))}
                </div>
                {healthScore < 100 && (
                  <button className="db-btn db-btn--primary" style={{ width: '100%', marginTop: 12 }} onClick={() => setTab('edit')}>
                    Complete Your Listing
                  </button>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="db-card">
              <div className="db-card-header">
                <div className="db-card-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Recent Activity
                </div>
                <Link to="/dashboard/analytics" className="db-card-action">View All</Link>
              </div>
              <div className="db-card-body">
                <div className="dbl-activity">
                  {ACTIVITY.map((a, i) => (
                    <div key={i} className="dbl-activity-item">
                      <div className="dbl-activity-dot" style={{ background: `${a.color}18`, borderColor: a.color }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke={a.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          {a.icon === 'search' && <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>}
                          {a.icon === 'star' && <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>}
                          {a.icon === 'lead' && <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></>}
                          {a.icon === 'eye' && <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                          {a.icon === 'badge' && <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>}
                        </svg>
                      </div>
                      <div className="dbl-activity-text">
                        <div>{a.text}</div>
                        <div className="dbl-activity-time">{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Summary Table */}
          <div className="db-card db-full" style={{ marginTop: 20 }}>
            <div className="db-card-header">
              <div className="db-card-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                Performance Summary
              </div>
              <Link to="/dashboard/analytics" className="db-card-action">Full Analytics →</Link>
            </div>
            <div className="db-card-body">
              <table className="db-table">
                <thead>
                  <tr><th>Metric</th><th>This Week</th><th>Last Week</th><th>Change</th><th>Trend</th></tr>
                </thead>
                <tbody>
                  {[
                    { m: 'Profile Views', tw: '3,214', lw: '2,847', ch: '+12.9%', up: true },
                    { m: 'Search Impressions', tw: '1,340', lw: '1,120', ch: '+19.6%', up: true },
                    { m: 'Click-throughs', tw: '567', lw: '498', ch: '+13.9%', up: true },
                    { m: 'Leads Captured', tw: '28', lw: '22', ch: '+27.3%', up: true },
                    { m: 'Review Responses', tw: '8', lw: '5', ch: '+60%', up: true },
                    { m: 'Bounce Rate', tw: '24.3%', lw: '28.1%', ch: '-3.8%', up: true },
                  ].map((r, i) => (
                    <tr key={i}>
                      <td className="db-table-name">{r.m}</td>
                      <td>{r.tw}</td>
                      <td style={{ color: 'var(--gray-400)' }}>{r.lw}</td>
                      <td><span className={`db-badge-pill db-badge--${r.up ? 'active' : 'danger'}`}>{r.ch}</span></td>
                      <td>
                        <svg viewBox="0 0 60 20" style={{ width: 60, height: 20 }}>
                          <polyline points={r.up ? '0,18 10,14 20,16 30,10 40,12 50,6 60,2' : '0,2 10,6 20,4 30,10 40,8 50,14 60,18'} fill="none" stroke={r.up ? 'var(--emerald)' : 'var(--coral)'} strokeWidth="1.5"/>
                        </svg>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ══════════ EDIT LISTING TAB ══════════ */}
      {tab === 'edit' && (
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
      )}

      {/* ══════════ SERVICES & PRICING TAB ══════════ */}
      {tab === 'services' && (
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
      )}

      {/* ══════════ SEO & VISIBILITY TAB ══════════ */}
      {tab === 'seo' && (
        <>
          {/* SEO Settings */}
          <div className="db-card db-full" style={{ marginBottom: 20 }}>
            <div className="db-card-header">
              <div className="db-card-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                SEO Settings
              </div>
            </div>
            <div className="db-card-body">
              {/* SEO Preview */}
              <div className="dbl-seo-preview">
                <div className="dbl-seo-preview-title">Google Search Preview</div>
                <div className="dbl-seo-google">
                  <div className="dbl-seo-google-url">infowebworld.com › listing › {LISTING.slug}</div>
                  <div className="dbl-seo-google-title">{seoTitle}</div>
                  <div className="dbl-seo-google-desc">{seoDesc}</div>
                </div>
              </div>

              <div className="db-form-group">
                <label className="db-form-label">SEO Title</label>
                <input className="db-form-input" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} />
                <div className="db-form-hint">{seoTitle.length}/60 characters (recommended: 50-60)</div>
              </div>
              <div className="db-form-group">
                <label className="db-form-label">Meta Description</label>
                <textarea className="db-form-textarea" rows={3} value={seoDesc} onChange={e => setSeoDesc(e.target.value)} />
                <div className="db-form-hint">{seoDesc.length}/160 characters (recommended: 120-160)</div>
              </div>
              <div className="db-form-row">
                <div className="db-form-group">
                  <label className="db-form-label">URL Slug</label>
                  <input className="db-form-input" defaultValue={LISTING.slug} />
                  <div className="db-form-hint">infowebworld.com/listing/{LISTING.slug}</div>
                </div>
                <div className="db-form-group">
                  <label className="db-form-label">Canonical URL</label>
                  <input className="db-form-input" placeholder="https://..." />
                  <div className="db-form-hint">Optional — used to prevent duplicate content issues</div>
                </div>
              </div>
              <div className="db-form-group">
                <label className="db-form-label">Focus Keywords</label>
                <input className="db-form-input" defaultValue="cloud security, enterprise cybersecurity, zero trust platform" />
              </div>
              <div className="db-form-actions">
                <button className="db-btn db-btn--primary">Save SEO Settings</button>
              </div>
            </div>
          </div>

          {/* Visibility Controls */}
          <div className="db-card db-full">
            <div className="db-card-header">
              <div className="db-card-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                Visibility Controls
              </div>
            </div>
            <div className="db-card-body">
              {[
                { key: 'searchable', label: 'Searchable', desc: 'Your listing appears in search results and category pages' },
                { key: 'featured', label: 'Featured Listing', desc: 'Show as featured in your category (requires Pro plan)' },
                { key: 'acceptLeads', label: 'Accept Leads', desc: 'Allow visitors to submit inquiry forms from your listing' },
                { key: 'showReviews', label: 'Show Reviews', desc: 'Display customer reviews on your public listing page' },
                { key: 'showPricing', label: 'Show Pricing', desc: 'Display service pricing on your listing page' },
              ].map(v => (
                <div key={v.key} className="dbl-vis-row">
                  <div>
                    <div className="dbl-vis-label">{v.label}</div>
                    <div className="dbl-vis-desc">{v.desc}</div>
                  </div>
                  <label className="db-toggle">
                    <input type="checkbox" checked={visibility[v.key]} onChange={() => toggleVis(v.key)} />
                    <span className="db-toggle-track" />
                    <span className="db-toggle-thumb" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ══════════ MEDIA TAB ══════════ */}
      {tab === 'media' && (
        <div className="db-card db-full">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              Photos & Media
            </div>
            <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>5 of 10 photos used</span>
          </div>
          <div className="db-card-body">
            {/* Logo */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)', marginBottom: 8 }}>Business Logo</div>
              <div className="dbl-logo-upload">
                <div className="dbl-logo-preview" style={{ background: `linear-gradient(135deg, ${LISTING.color}, ${LISTING.color}88)` }}>
                  {LISTING.logo}
                </div>
                <div>
                  <button className="db-btn db-btn--outline" style={{ fontSize: 11, padding: '6px 14px', marginBottom: 4 }}>Change Logo</button>
                  <div style={{ fontSize: 10, color: 'var(--gray-400)' }}>PNG, JPG, SVG — 400x400px recommended</div>
                </div>
              </div>
            </div>

            {/* Photo Gallery */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)', marginBottom: 8 }}>Photo Gallery</div>
              <div className="dbl-media-grid">
                {['Office HQ', 'Team Photo', 'SOC Dashboard', 'Awards Wall', 'Conference'].map((label, i) => (
                  <div key={i} className="dbl-media-item">
                    <div className="dbl-media-thumb" style={{ background: `linear-gradient(135deg, hsl(${220 + i * 30},60%,88%), hsl(${220 + i * 30},60%,78%))` }}>
                      <span>{label}</span>
                      <button className="dbl-media-remove">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                    <div className="dbl-media-label">{label}</div>
                  </div>
                ))}
                <div className="dbl-media-item">
                  <div className="dbl-media-add">
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    <span>Add Photo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)', marginBottom: 8 }}>Cover Image</div>
              <div className="dbl-cover-upload">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" style={{ width: 28, height: 28 }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span>Drag & drop your cover image or click to browse</span>
                <span style={{ fontSize: 10, color: 'var(--gray-400)' }}>1200x400px recommended (PNG, JPG)</span>
              </div>
            </div>

            {/* Video */}
            <div className="db-form-group">
              <label className="db-form-label">Video URL (YouTube or Vimeo)</label>
              <input className="db-form-input" placeholder="https://youtube.com/watch?v=..." />
              <div className="db-form-hint">Add a demo or company overview video to your listing</div>
            </div>

            <div className="db-form-actions">
              <button className="db-btn db-btn--primary">Save Media</button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  )
}
