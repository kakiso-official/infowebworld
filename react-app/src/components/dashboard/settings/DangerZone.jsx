export default function DangerZone() {
  return (
    <div className="db-card db-full" style={{ borderColor: 'rgba(239,107,74,.2)' }}>
      <div className="db-card-header">
        <div className="db-card-title" style={{ color: 'var(--coral)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--coral)" strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          Danger Zone
        </div>
      </div>
      <div className="db-card-body" style={{ padding: '8px 20px' }}>
        <div className="db-settings-row">
          <div>
            <div className="db-settings-row-label">Deactivate Listing</div>
            <div className="db-settings-row-desc">Temporarily hide your listing from search results</div>
          </div>
          <button className="db-btn db-btn--danger">Deactivate</button>
        </div>
        <div className="db-settings-row" style={{ borderBottom: 'none' }}>
          <div>
            <div className="db-settings-row-label">Delete Account</div>
            <div className="db-settings-row-desc">Permanently delete your account and all associated data</div>
          </div>
          <button className="db-btn db-btn--danger">Delete Account</button>
        </div>
      </div>
    </div>
  )
}
