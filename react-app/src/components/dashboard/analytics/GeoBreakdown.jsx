import { geoData } from '../../../data/dashboard/analyticsData'

export default function GeoBreakdown() {
  return (
    <div className="db-card">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
          Top Locations
        </div>
      </div>
      <div className="db-card-body" style={{ padding: '4px 20px' }}>
        {geoData.map((g, i) => (
          <div key={g.country} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < geoData.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
            <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{g.flag}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 12.5, fontWeight: 400, color: 'var(--gray-700)' }}>{g.country}</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray-500)' }}>{g.visits.toLocaleString()}</span>
              </div>
              <div style={{ height: 4, background: 'var(--gray-100)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${g.pct}%`, background: 'var(--accent)', borderRadius: 2, opacity: 0.4 + (g.pct / 100) * 0.5 }} />
              </div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-800)', minWidth: 36, textAlign: 'right' }}>{g.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
