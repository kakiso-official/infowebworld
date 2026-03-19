import { useState } from 'react'
import { LISTING, VISIBILITY_OPTIONS } from '../../../data/dashboard/listingData'

export default function SEOVisibilityTab() {
  const [seoTitle, setSeoTitle] = useState('CloudGuard Technologies | Enterprise Cloud Security')
  const [seoDesc, setSeoDesc] = useState('Enterprise-grade cloud security solutions built on zero-trust architecture. Protect your infrastructure with real-time threat detection and automated response.')
  const [visibility, setVisibility] = useState({ searchable: true, featured: true, acceptLeads: true, showReviews: true, showPricing: true })

  const toggleVis = (key) => setVisibility(v => ({ ...v, [key]: !v[key] }))

  return (
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
          {VISIBILITY_OPTIONS.map(v => (
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
  )
}
