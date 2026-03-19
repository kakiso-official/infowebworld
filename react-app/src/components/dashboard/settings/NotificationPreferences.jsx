export default function NotificationPreferences() {
  return (
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
  )
}
