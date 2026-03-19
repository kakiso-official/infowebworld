const CATEGORIES = [
  { id: 'technology-saas', name: 'Technology & SaaS', icon: <><path d="M16 18l6-6-6-6"/><path d="M8 6l-6 6 6 6"/></>, color: 'var(--accent)' },
  { id: 'restaurants-food', name: 'Restaurants & Food', icon: <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/></>, color: 'var(--coral)' },
  { id: 'healthcare-wellness', name: 'Healthcare & Wellness', icon: <><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></>, color: 'var(--emerald)' },
  { id: 'real-estate', name: 'Real Estate & Property', icon: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></>, color: 'var(--azure)' },
  { id: 'legal-financial', name: 'Legal & Financial', icon: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>, color: 'var(--plum)' },
  { id: 'education-training', name: 'Education & Training', icon: <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/></>, color: 'var(--teal)' },
  { id: 'marketing-creative', name: 'Marketing & Creative', icon: <><path d="M3 11l18-5v12L3 13v-2z"/></>, color: 'var(--rose)' },
  { id: 'home-services', name: 'Home Services & Trades', icon: <><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></>, color: 'var(--amber)' },
]

export default function BusinessInfoStep({ form, up, totalSteps }) {
  return (
    <>
      <div className="db-card db-full">
        <div className="db-card-header">
          <div className="db-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v3"/></svg>
            Business Information
          </div>
          <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>Step 1 of {totalSteps}</span>
        </div>
        <div className="db-card-body">
          <div className="db-form-row">
            <div className="db-form-group">
              <label className="db-form-label">Business / Product Name <span className="dcl-req">*</span></label>
              <input className="db-form-input" placeholder="e.g. CloudSync Pro" value={form.name} onChange={e => up('name', e.target.value)} />
            </div>
            <div className="db-form-group">
              <label className="db-form-label">Tagline</label>
              <input className="db-form-input" placeholder="e.g. Enterprise cloud sync made simple" value={form.tagline} onChange={e => up('tagline', e.target.value)} maxLength={80} />
              <div className="db-form-hint">{form.tagline.length}/80 characters</div>
            </div>
          </div>

          <div className="db-form-row">
            <div className="db-form-group">
              <label className="db-form-label">Website URL <span className="dcl-req">*</span></label>
              <input className="db-form-input" type="url" placeholder="https://your-product.com" value={form.website} onChange={e => up('website', e.target.value)} />
            </div>
            <div className="db-form-group">
              <label className="db-form-label">Business Email <span className="dcl-req">*</span></label>
              <input className="db-form-input" type="email" placeholder="hello@your-product.com" value={form.email} onChange={e => up('email', e.target.value)} />
            </div>
          </div>

          <div className="db-form-group">
            <label className="db-form-label">Description <span className="dcl-req">*</span></label>
            <div className="db-form-hint" style={{ marginBottom: 4 }}>Describe your product in 150-500 characters. Appears in search results.</div>
            <textarea className="db-form-textarea" placeholder="What does your product do? What problems does it solve?" value={form.description} onChange={e => up('description', e.target.value)} maxLength={500} rows={4} />
            <div className="db-form-hint">{form.description.length}/500 characters</div>
          </div>

          <div className="db-form-row">
            <div className="db-form-group">
              <label className="db-form-label">Phone Number</label>
              <input className="db-form-input" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => up('phone', e.target.value)} />
            </div>
            <div className="db-form-group">
              <label className="db-form-label">Business Address</label>
              <input className="db-form-input" placeholder="123 Main St, City, State" value={form.address} onChange={e => up('address', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div className="db-card db-full">
        <div className="db-card-header">
          <div className="db-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Primary Category <span className="dcl-req">*</span>
          </div>
        </div>
        <div className="db-card-body">
          <div className="dcl-cat-grid">
            {CATEGORIES.map(cat => (
              <div
                key={cat.id}
                className={`dcl-cat-option${form.category === cat.id ? ' selected' : ''}`}
                onClick={() => up('category', cat.id)}
              >
                <div className="dcl-cat-icon" style={{ background: `${cat.color}12`, color: cat.color }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{cat.icon}</svg>
                </div>
                <span className="dcl-cat-name">{cat.name}</span>
                <div className="dcl-cat-check">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export { CATEGORIES }
