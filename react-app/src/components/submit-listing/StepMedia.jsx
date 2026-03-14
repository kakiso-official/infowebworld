export default function StepMedia({ form, up }) {
  return (
    <div className="sl-section">
      <div className="sl-section-header">
        <div className="sl-section-icon" style={{ background: 'var(--azure)' }}>
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
        </div>
        <div className="sl-section-info">
          <div className="sl-section-title">Media & Branding</div>
          <div className="sl-section-desc">Upload your logo, screenshots, and media assets</div>
        </div>
      </div>

      {/* Logo */}
      <div className="sl-field">
        <label className="sl-label">Company Logo</label>
        <span className="sl-label-hint">Recommended: 256x256px or larger, PNG/SVG with transparent background</span>
        <div className="sl-upload-zone" style={{ marginTop: 6 }}>
          <div className="sl-upload-preview">
            {form.logoPreview
              ? <img src={form.logoPreview} alt="Logo preview" />
              : <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
            }
          </div>
          <div className="sl-upload-info">
            <div className="sl-upload-title"><span>Click to upload</span> or drag & drop</div>
            <div className="sl-upload-hint">PNG, SVG, JPG up to 5MB</div>
          </div>
        </div>
      </div>

      {/* Screenshots */}
      <div className="sl-field">
        <label className="sl-label">Product Screenshots</label>
        <span className="sl-label-hint">Upload up to 10 screenshots showcasing your product. 16:10 aspect ratio recommended.</span>
        <div className="sl-screenshots">
          {[0,1,2,3,4].map(i => (
            <div className="sl-screenshot-slot" key={i}>
              <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              <span>Screenshot {i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Video */}
      <div className="sl-field">
        <label className="sl-label">Demo Video URL <span className="sl-label-opt">(optional)</span></label>
        <span className="sl-label-hint">Link to a YouTube or Vimeo demo of your product</span>
        <input className="sl-input" type="url" placeholder="https://youtube.com/watch?v=..." value={form.demoVideo} onChange={e => up('demoVideo', e.target.value)} />
      </div>
    </div>
  )
}
