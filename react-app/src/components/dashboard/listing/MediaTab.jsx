import { LISTING } from '../../../data/dashboard/listingData'

export default function MediaTab() {
  return (
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
  )
}
