import DashboardLayout from '../components/dashboard/DashboardLayout'

export default function DashboardSettingsPage() {
  return (
    <DashboardLayout title="Settings" subtitle="Account preferences">
      {/* Account */}
      <div className="db-card db-full" style={{ marginBottom: 24 }}>
        <div className="db-card-header">
          <div className="db-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            Account Information
          </div>
        </div>
        <div className="db-card-body">
          <div className="db-form-row">
            <div className="db-form-group">
              <label className="db-form-label">Full Name</label>
              <input className="db-form-input" defaultValue="Aadil Parmar" />
            </div>
            <div className="db-form-group">
              <label className="db-form-label">Email Address</label>
              <input className="db-form-input" defaultValue="aadil@cloudguard.tech" />
            </div>
          </div>
          <div className="db-form-row">
            <div className="db-form-group">
              <label className="db-form-label">Phone</label>
              <input className="db-form-input" defaultValue="+1 (555) 123-4567" />
            </div>
            <div className="db-form-group">
              <label className="db-form-label">Timezone</label>
              <select className="db-form-select" defaultValue="pst">
                <option value="est">Eastern (EST)</option><option value="cst">Central (CST)</option><option value="mst">Mountain (MST)</option><option value="pst">Pacific (PST)</option>
              </select>
            </div>
          </div>
          <div className="db-form-actions">
            <button className="db-btn db-btn--primary">Update Account</button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="db-card db-full" style={{ marginBottom: 24 }}>
        <div className="db-card-header">
          <div className="db-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
            Notification Preferences
          </div>
        </div>
        <div className="db-card-body" style={{ padding: '8px 20px' }}>
          {[
            { label: 'New lead notifications', desc: 'Get notified when someone submits a contact form or quote request', on: true },
            { label: 'Review alerts', desc: 'Receive an alert when a new review is posted on your listing', on: true },
            { label: 'Weekly analytics digest', desc: 'Summary of your listing performance delivered every Monday', on: true },
            { label: 'Marketing tips & updates', desc: 'Tips to improve your listing visibility and conversion rates', on: false },
            { label: 'Product announcements', desc: 'New features and platform updates from InfoWebWorld', on: false },
            { label: 'Competitor alerts', desc: 'Notifications when competitors update their listings', on: true },
          ].map(n => (
            <div className="db-settings-row" key={n.label}>
              <div>
                <div className="db-settings-row-label">{n.label}</div>
                <div className="db-settings-row-desc">{n.desc}</div>
              </div>
              <label className="db-toggle">
                <input type="checkbox" defaultChecked={n.on} />
                <span className="db-toggle-track" />
                <span className="db-toggle-thumb" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
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

      {/* Danger Zone */}
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
    </DashboardLayout>
  )
}
