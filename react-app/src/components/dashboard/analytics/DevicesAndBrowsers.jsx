import { deviceData, browserData } from '../../../data/dashboard/analyticsData'

export default function DevicesAndBrowsers() {
  return (
    <div className="db-card">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
          Devices & Browsers
        </div>
      </div>
      <div className="db-card-body">
        <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
          {/* Device bars */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 12 }}>Devices</div>
            {deviceData.map(d => (
              <div key={d.device} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 400, color: 'var(--gray-700)' }}>{d.device}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-800)' }}>{d.pct}%</span>
                </div>
                <div style={{ height: 8, background: 'var(--gray-100)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${d.pct}%`, background: d.color, borderRadius: 4, opacity: .65 }} />
                </div>
                <div style={{ fontSize: 10, fontWeight: 300, color: 'var(--gray-400)', marginTop: 2 }}>{d.sessions.toLocaleString()} sessions</div>
              </div>
            ))}
          </div>
          {/* Browser bars */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 12 }}>Browsers</div>
            {browserData.map(b => (
              <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ width: 52, fontSize: 12, fontWeight: 400, color: 'var(--gray-600)' }}>{b.name}</span>
                <div style={{ flex: 1, height: 6, background: 'var(--gray-100)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${b.pct}%`, background: 'var(--accent)', borderRadius: 3, opacity: 0.3 + (b.pct / 100) * 0.6 }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray-500)', minWidth: 30, textAlign: 'right' }}>{b.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
