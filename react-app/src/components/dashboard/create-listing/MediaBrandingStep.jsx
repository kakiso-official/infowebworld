export default function MediaBrandingStep({ form, up, totalSteps }) {
  return (
    <div className="db-card db-full">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          Media & Branding
        </div>
        <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>Step 2 of {totalSteps}</span>
      </div>
      <div className="db-card-body">
        {/* Logo Upload */}
        <div style={{ marginBottom: 24 }}>
          <label className="db-form-label">Company Logo</label>
          <div className="db-form-hint" style={{ marginBottom: 8 }}>Recommended: 256x256px or larger, PNG/SVG with transparent background</div>
          <div className="dcl-upload-zone">
            <div className="dcl-upload-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <div className="dcl-upload-text">
              <span style={{ fontWeight: 500, color: 'var(--accent)' }}>Click to upload</span> or drag & drop
            </div>
            <div className="dcl-upload-hint">PNG, SVG, JPG up to 5MB</div>
          </div>
        </div>

        {/* Screenshots */}
        <div style={{ marginBottom: 24 }}>
          <label className="db-form-label">Product Screenshots</label>
          <div className="db-form-hint" style={{ marginBottom: 8 }}>Upload up to 10 screenshots. 16:10 aspect ratio recommended.</div>
          <div className="dcl-screenshot-grid">
            {[0,1,2,3,4].map(i => (
              <div className="dcl-screenshot-slot" key={i}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                <span>Screenshot {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cover Image */}
        <div style={{ marginBottom: 24 }}>
          <label className="db-form-label">Cover Image</label>
          <div className="db-form-hint" style={{ marginBottom: 8 }}>1200x400px recommended (PNG, JPG)</div>
          <div className="dbl-cover-upload">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" style={{ width: 28, height: 28 }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span>Drag & drop your cover image or click to browse</span>
          </div>
        </div>

        {/* Demo Video */}
        <div className="db-form-group">
          <label className="db-form-label">Demo Video URL</label>
          <input className="db-form-input" type="url" placeholder="https://youtube.com/watch?v=..." value={form.demoVideo} onChange={e => up('demoVideo', e.target.value)} />
          <div className="db-form-hint">Link to a YouTube or Vimeo demo of your product</div>
        </div>
      </div>
    </div>
  )
}
