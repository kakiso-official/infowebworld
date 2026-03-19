import { visitorDevices, topLocations, totalSessions } from '../../../data/dashboard/overviewData'

export default function VisitorDevices() {
  const growthArrow = g => g === 'up' ? '\u2191' : g === 'down' ? '\u2193' : '\u2192'
  const growthColor = g => g === 'up' ? 'var(--emerald)' : g === 'down' ? 'var(--coral)' : 'var(--gray-400)'

  return (
    <div className="db-card">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
          Visitor Devices
        </div>
      </div>
      <div className="db-card-body">
        {/* Section title */}
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>Device Breakdown</div>

        {/* Donut with center label */}
        <div className="db-donut-wrap" style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <svg viewBox="0 0 120 120" width="110" height="110">
            {(() => {
              let offset = 0
              return visitorDevices.map(d => {
                const dash = (d.pct / 100) * 314
                const gap = 4
                const el = (
                  <circle
                    key={d.device}
                    cx="60" cy="60" r="50"
                    fill="none"
                    stroke={d.color}
                    strokeWidth="14"
                    strokeDasharray={`${Math.max(0, dash - gap)} ${314 - dash + gap}`}
                    strokeDashoffset={-offset}
                    transform="rotate(-90 60 60)"
                    strokeLinecap="round"
                  />
                )
                offset += dash
                return el
              })
            })()}
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1.1 }}>{totalSessions.toLocaleString()}</div>
            <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--gray-400)', marginTop: 2 }}>sessions</div>
          </div>
        </div>

        {/* Device rows */}
        {visitorDevices.map(d => (
          <div key={d.device} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, padding: '8px 10px', background: 'var(--gray-50)', borderRadius: 8 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke={d.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" style={{ flexShrink: 0 }}>
              <path d={d.icon} />
            </svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-800)' }}>{d.device}</span>
                <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--gray-400)' }}>{d.sessions.toLocaleString()} sessions</span>
              </div>
              <div style={{ fontSize: 10.5, fontWeight: 400, color: d.change >= 0 ? 'var(--emerald)' : 'var(--coral)', marginTop: 1 }}>
                {d.change >= 0 ? '\u2191' : '\u2193'}{Math.abs(d.change)}% from last month
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)', minWidth: 32, textAlign: 'right' }}>{d.pct}%</span>
            </div>
          </div>
        ))}

        {/* Separator */}
        <div style={{ height: 1, background: 'var(--gray-100)', margin: '18px 0 14px' }} />

        {/* Top Locations */}
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>Top Locations</div>
        {topLocations.map((l, i) => (
          <div key={l.city} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: i < topLocations.length - 1 ? 10 : 0, padding: '5px 0' }}>
            <span style={{ fontSize: 14, lineHeight: 1, flexShrink: 0 }}>{l.flag}</span>
            <span style={{ flex: 1, fontSize: 12.5, fontWeight: 450, color: 'var(--gray-700)' }}>{l.city}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: growthColor(l.growth), marginRight: 4, flexShrink: 0 }}>{growthArrow(l.growth)}</span>
            <div style={{ width: 56, height: 5, background: 'var(--gray-100)', borderRadius: 3, overflow: 'hidden', flexShrink: 0 }}>
              <div style={{ height: '100%', width: `${l.pct * 3}%`, background: 'var(--accent)', borderRadius: 3, transition: 'width .3s ease' }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray-500)', width: 30, textAlign: 'right', flexShrink: 0 }}>{l.pct}%</span>
          </div>
        ))}

        {/* Footer */}
        <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" strokeWidth="1.5" width="12" height="12"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          <span style={{ fontSize: 10.5, fontWeight: 400, color: 'var(--gray-400)' }}>Data from last 30 days &middot; Updated 2h ago</span>
        </div>
      </div>
    </div>
  )
}
