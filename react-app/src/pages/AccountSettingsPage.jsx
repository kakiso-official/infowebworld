import AccountLayout from '../components/account/AccountLayout'

export default function AccountSettingsPage() {
  return (
    <AccountLayout title="Settings" subtitle="Manage your account">
      {/* ═══ Profile Info ═══ */}
      <div className="db-card db-full" style={{ marginBottom: 24 }}>
        <div className="db-card-header">
          <div className="db-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            Personal Information
          </div>
        </div>
        <div className="db-card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
              <span style={{ fontSize: 28, fontWeight: 600, color: '#fff' }}>AP</span>
              <button style={{ position: 'absolute', bottom: -2, right: -2, width: 28, height: 28, borderRadius: '50%', background: '#fff', border: '2px solid var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: 'var(--gray-600)', fill: 'none', strokeWidth: 1.5 }}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
              </button>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 2 }}>Aadil Parmar</div>
              <div style={{ fontSize: 12, fontWeight: 300, color: 'var(--gray-400)', marginBottom: 6 }}>Gold Contributor &middot; Member since Jan 2025</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <span className="db-badge-pill db-badge--active">Verified</span>
                <span className="db-badge-pill db-badge--neutral">Gold</span>
              </div>
            </div>
          </div>
          <div className="db-form-row">
            <div className="db-form-group">
              <label className="db-form-label">Full Name</label>
              <input className="db-form-input" defaultValue="Aadil Parmar" />
            </div>
            <div className="db-form-group">
              <label className="db-form-label">Display Name</label>
              <input className="db-form-input" defaultValue="Aadil P." />
              <div className="db-form-hint">This is how your name appears on reviews</div>
            </div>
          </div>
          <div className="db-form-row">
            <div className="db-form-group">
              <label className="db-form-label">Email Address</label>
              <input className="db-form-input" defaultValue="aadil@cloudguard.tech" />
            </div>
            <div className="db-form-group">
              <label className="db-form-label">Phone (optional)</label>
              <input className="db-form-input" defaultValue="+1 (555) 123-4567" />
            </div>
          </div>
          <div className="db-form-group">
            <label className="db-form-label">Bio</label>
            <textarea className="db-form-textarea" defaultValue="Tech enthusiast and startup advisor. I review B2B SaaS products with a focus on security, fintech, and AI tools." style={{ minHeight: 80 }} />
            <div className="db-form-hint">Brief bio shown on your public profile</div>
          </div>
          <div className="db-form-row">
            <div className="db-form-group">
              <label className="db-form-label">Location</label>
              <input className="db-form-input" defaultValue="San Francisco, CA" />
            </div>
            <div className="db-form-group">
              <label className="db-form-label">Industry</label>
              <select className="db-form-select" defaultValue="technology">
                <option value="technology">Technology</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="db-form-actions">
            <button className="db-btn db-btn--primary">Save Changes</button>
            <button className="db-btn db-btn--outline">Discard</button>
          </div>
        </div>
      </div>

      {/* ═══ Privacy ═══ */}
      <div className="db-card db-full" style={{ marginBottom: 24 }}>
        <div className="db-card-header">
          <div className="db-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
            Privacy Settings
          </div>
        </div>
        <div className="db-card-body" style={{ padding: '8px 20px' }}>
          {[
            { label: 'Public profile visible', desc: 'Allow others to see your profile, reviews, and saved businesses', on: true },
            { label: 'Show my real name', desc: 'Display your full name or use your display name on reviews', on: false },
            { label: 'Show saved businesses', desc: 'Let others see which businesses you\'ve bookmarked', on: false },
            { label: 'Show review count on profile', desc: 'Display your total review count on your public profile', on: true },
            { label: 'Allow businesses to contact me', desc: 'Let businesses reach out regarding your reviews', on: true },
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

      {/* ═══ Email Preferences ═══ */}
      <div className="db-card db-full" style={{ marginBottom: 24 }}>
        <div className="db-card-header">
          <div className="db-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22 6 12 13 2 6" /></svg>
            Email Preferences
          </div>
        </div>
        <div className="db-card-body" style={{ padding: '8px 20px' }}>
          {[
            { label: 'Business replies to my reviews', desc: 'Get notified when a business responds to your review', on: true },
            { label: 'Helpful vote milestones', desc: 'Alerts when your reviews hit helpful vote milestones (10, 25, 50...)', on: true },
            { label: 'Saved business updates', desc: 'When businesses you saved add photos, change hours, or update info', on: true },
            { label: 'Weekly category newsletter', desc: 'Curated businesses and reviews in your interested categories', on: false },
            { label: 'Product announcements', desc: 'New features and improvements from InfoWebWorld', on: false },
            { label: 'Monthly review digest', desc: 'Summary of your review activity, votes received, and community impact', on: true },
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

      {/* ═══ Security ═══ */}
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
            <div className="db-settings-desc">Update your password regularly to keep your account secure</div>
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
                <div className="db-settings-row-desc">Add an extra layer of security with authenticator app or SMS</div>
              </div>
              <button className="db-btn db-btn--outline">Enable 2FA</button>
            </div>
            <div className="db-settings-row">
              <div>
                <div className="db-settings-row-label">Connected Accounts</div>
                <div className="db-settings-row-desc">Google, LinkedIn, or GitHub sign-in linked to your account</div>
              </div>
              <button className="db-btn db-btn--outline">Manage</button>
            </div>
            <div className="db-settings-row">
              <div>
                <div className="db-settings-row-label">Active Sessions</div>
                <div className="db-settings-row-desc">2 active sessions — Chrome on MacOS, Safari on iPhone</div>
              </div>
              <button className="db-btn db-btn--outline">View Sessions</button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Danger Zone ═══ */}
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
              <div className="db-settings-row-label">Export My Data</div>
              <div className="db-settings-row-desc">Download all your reviews, saved businesses, and account data</div>
            </div>
            <button className="db-btn db-btn--outline">Export</button>
          </div>
          <div className="db-settings-row">
            <div>
              <div className="db-settings-row-label">Deactivate Account</div>
              <div className="db-settings-row-desc">Temporarily hide your profile and reviews from public view</div>
            </div>
            <button className="db-btn db-btn--danger">Deactivate</button>
          </div>
          <div className="db-settings-row" style={{ borderBottom: 'none' }}>
            <div>
              <div className="db-settings-row-label">Delete Account</div>
              <div className="db-settings-row-desc">Permanently delete your account, reviews, and all associated data</div>
            </div>
            <button className="db-btn db-btn--danger">Delete Account</button>
          </div>
        </div>
      </div>
    </AccountLayout>
  )
}
