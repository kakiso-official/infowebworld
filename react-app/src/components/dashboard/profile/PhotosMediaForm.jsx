export default function PhotosMediaForm() {
  return (
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
  )
}
