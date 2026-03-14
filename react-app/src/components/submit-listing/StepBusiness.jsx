const CATEGORIES = [
  { id: 'technology-saas', name: 'Technology & SaaS', color: 'rgba(108,114,241,.1)', stroke: 'var(--accent)', paths: [<path key="a" d="M16 18l6-6-6-6" />, <path key="b" d="M8 6l-6 6 6 6" />] },
  { id: 'restaurants-food', name: 'Restaurants & Food', color: 'rgba(239,107,74,.1)', stroke: 'var(--coral)', paths: [<path key="a" d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />, <path key="b" d="M7 2v20" />] },
  { id: 'healthcare-wellness', name: 'Healthcare & Wellness', color: 'rgba(47,174,106,.1)', stroke: 'var(--emerald)', paths: [<path key="a" d="M22 12h-4l-3 9L9 3l-3 9H2" />] },
  { id: 'real-estate', name: 'Real Estate & Property', color: 'rgba(59,130,246,.1)', stroke: 'var(--azure)', paths: [<path key="a" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />, <path key="b" d="M9 22V12h6v10" />] },
  { id: 'legal-financial', name: 'Legal & Financial', color: 'rgba(139,92,246,.1)', stroke: 'var(--plum)', paths: [<line key="a" x1="12" y1="1" x2="12" y2="23" />, <path key="b" d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />] },
  { id: 'education-training', name: 'Education & Training', color: 'rgba(20,184,166,.1)', stroke: 'var(--teal)', paths: [<path key="a" d="M22 10v6M2 10l10-5 10 5-10 5z" />, <path key="b" d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />] },
  { id: 'marketing-creative', name: 'Marketing & Creative', color: 'rgba(236,72,153,.1)', stroke: 'var(--rose)', paths: [<path key="a" d="M3 11l18-5v12L3 13v-2z" />] },
  { id: 'home-services', name: 'Home Services & Trades', color: 'rgba(245,158,11,.1)', stroke: 'var(--amber)', paths: [<path key="a" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />] },
]

export { CATEGORIES }

export default function StepBusiness({ form, up }) {
  return (
    <>
      <div className="sl-section">
        <div className="sl-section-header">
          <div className="sl-section-icon" style={{ background: 'var(--accent)' }}>
            <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" /></svg>
          </div>
          <div className="sl-section-info">
            <div className="sl-section-title">Business Information</div>
            <div className="sl-section-desc">Tell us about your product or service</div>
          </div>
        </div>

        <div className="sl-row">
          <div className="sl-field">
            <label className="sl-label">Business / Product Name</label>
            <input className="sl-input" placeholder="e.g. CloudSync Pro" value={form.name} onChange={e => up('name', e.target.value)} />
          </div>
          <div className="sl-field">
            <label className="sl-label">Tagline <span className="sl-label-opt">(optional)</span></label>
            <input className="sl-input" placeholder="e.g. Enterprise cloud sync made simple" value={form.tagline} onChange={e => up('tagline', e.target.value)} maxLength={80} />
            <div className="sl-char-count">{form.tagline.length}/80</div>
          </div>
        </div>

        <div className="sl-row">
          <div className="sl-field">
            <label className="sl-label">Website URL</label>
            <input className="sl-input" type="url" placeholder="https://your-product.com" value={form.website} onChange={e => up('website', e.target.value)} />
          </div>
          <div className="sl-field">
            <label className="sl-label">Business Email</label>
            <input className="sl-input" type="email" placeholder="hello@your-product.com" value={form.email} onChange={e => up('email', e.target.value)} />
          </div>
        </div>

        <div className="sl-field">
          <label className="sl-label">Description</label>
          <span className="sl-label-hint">Describe your product in 150-500 characters. This appears in search results and your listing profile.</span>
          <textarea className="sl-input" placeholder="What does your product do? What problems does it solve? Who is it for?" value={form.description} onChange={e => up('description', e.target.value)} maxLength={500} rows={4} />
          <div className="sl-char-count">{form.description.length}/500</div>
        </div>

        <div className="sl-field">
          <label className="sl-label">Phone Number <span className="sl-label-opt">(optional)</span></label>
          <input className="sl-input" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => up('phone', e.target.value)} style={{ maxWidth: 280 }} />
        </div>
      </div>

      {/* Category Selection */}
      <div className="sl-section">
        <div className="sl-section-header">
          <div className="sl-section-icon" style={{ background: 'var(--plum)' }}>
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
          </div>
          <div className="sl-section-info">
            <div className="sl-section-title">Primary Category</div>
            <div className="sl-section-desc">Choose the category that best fits your business</div>
          </div>
        </div>

        <div className="sl-cat-grid">
          {CATEGORIES.map(cat => (
            <div
              key={cat.id}
              className={`sl-cat-option${form.category === cat.id ? ' selected' : ''}`}
              onClick={() => up('category', cat.id)}
            >
              <div className="sl-cat-option-icon" style={{ background: cat.color }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={cat.stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                  {cat.paths}
                </svg>
              </div>
              <span className="sl-cat-option-text">{cat.name}</span>
              <span className="sl-cat-check">
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
