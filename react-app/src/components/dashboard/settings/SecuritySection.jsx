export default function SecuritySection() {
  return (
    <div className="db-card db-full" style={{ marginBottom: 24 }}>
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          Security
        </div>
      </div>
      <div className="db-card-body">
        <div className="db-settings-section">
          <div className="db-settings-title">Change Password</div>
          <div className="db-settings-desc">Update your password to keep your account secure</div>
          <div className="db-form-group">
            <label className="db-form-label">Current Password</label>
            <input className="db-form-input" type="password" placeholder="Enter current password" />
          </div>
          <div className="db-form-row">
            <div className="db-form-group">
              <label className="db-form-label">New Password</label>
              <input className="db-form-input" type="password" placeholder="Enter new password" />
            </div>
            <div className="db-form-group">
              <label className="db-form-label">Confirm New Password</label>
              <input className="db-form-input" type="password" placeholder="Confirm new password" />
            </div>
          </div>
          <button className="db-btn db-btn--primary" style={{ marginTop: 8 }}>Update Password</button>
        </div>

        <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 20, marginTop: 20 }}>
          <div className="db-settings-row">
            <div>
              <div className="db-settings-row-label">Two-Factor Authentication</div>
              <div className="db-settings-row-desc">Add an extra layer of security to your account</div>
            </div>
            <button className="db-btn db-btn--outline">Enable 2FA</button>
          </div>
          <div className="db-settings-row">
            <div>
              <div className="db-settings-row-label">Active Sessions</div>
              <div className="db-settings-row-desc">Manage devices where you're currently logged in</div>
            </div>
            <button className="db-btn db-btn--outline">View Sessions</button>
          </div>
        </div>
      </div>
    </div>
  )
}
