export default function PaymentMethod() {
  return (
    <div className="db-card">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
          Payment Method
        </div>
        <span className="db-card-action">Update</span>
      </div>
      <div className="db-card-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--gray-50)', borderRadius: 'var(--r-sm)' }}>
          <div style={{ width: 48, height: 32, borderRadius: 6, background: 'linear-gradient(135deg,#1a1f71,#2566af)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>VISA</span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)' }}>Visa ending in 4242</div>
            <div style={{ fontSize: 11, fontWeight: 300, color: 'var(--gray-400)' }}>Expires 08/2028</div>
          </div>
          <span className="db-badge-pill db-badge--active" style={{ marginLeft: 'auto' }}>Default</span>
        </div>
      </div>
    </div>
  )
}
