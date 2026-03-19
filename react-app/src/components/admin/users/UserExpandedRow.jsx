export default function UserExpandedRow({ user }) {
  return (
    <div style={{ display: 'flex', gap: 32, padding: '20px 24px', background: '#f9fafb', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
      {/* Left: User info */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', minWidth: 220 }}>
        <div
          className="db-side-avatar"
          style={{ width: 48, height: 48, fontSize: 16, background: user.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 600, flexShrink: 0 }}
        >
          {user.avatar}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{user.email}</div>
          <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>Joined {user.joinDate} &middot; {user.country}</div>
        </div>
      </div>

      {/* Center: Stats */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', flex: 1, minWidth: 200 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{user.listings}</div>
          <div style={{ fontSize: 11, color: 'var(--text-light)' }}>Listings</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{user.reviews}</div>
          <div style={{ fontSize: 11, color: 'var(--text-light)' }}>Reviews</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{user.revenue}</div>
          <div style={{ fontSize: 11, color: 'var(--text-light)' }}>Revenue</div>
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button className="db-btn db-btn--outline" style={{ fontSize: 12, padding: '6px 14px' }}>View Profile</button>
        <button className="db-btn" style={{ fontSize: 12, padding: '6px 14px' }}>Verify</button>
        <button className="db-btn db-btn--outline" style={{ fontSize: 12, padding: '6px 14px', color: 'var(--amber)' }}>Suspend</button>
        <button className="db-btn db-btn--danger" style={{ fontSize: 12, padding: '6px 14px' }}>Ban</button>
      </div>
    </div>
  )
}
