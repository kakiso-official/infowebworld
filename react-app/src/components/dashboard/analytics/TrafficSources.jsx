import { trafficSources } from '../../../data/dashboard/analyticsData'

export default function TrafficSources() {
  const totalSrcPct = trafficSources.reduce((a, s) => a + s.pct, 0)
  let srcAcc = 0

  return (
    <div className="db-card">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
          Traffic Sources
        </div>
        <span className="db-card-action">38,421 total</span>
      </div>
      <div className="db-card-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20 }}>
          {/* Donut */}
          <svg width="130" height="130" viewBox="0 0 130 130" style={{ flexShrink: 0 }}>
            {trafficSources.map((s) => {
              const startAngle = (srcAcc / totalSrcPct) * 360
              srcAcc += s.pct
              const endAngle = (srcAcc / totalSrcPct) * 360
              const startRad = ((startAngle - 90) * Math.PI) / 180
              const endRad = ((endAngle - 90) * Math.PI) / 180
              const r = 52, cx = 65, cy = 65
              const x1 = cx + r * Math.cos(startRad), y1 = cy + r * Math.sin(startRad)
              const x2 = cx + r * Math.cos(endRad), y2 = cy + r * Math.sin(endRad)
              const large = endAngle - startAngle > 180 ? 1 : 0
              return <path key={s.source} d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`} fill={s.color} opacity=".75" />
            })}
            <circle cx="65" cy="65" r="32" fill="#fff" />
            <text x="65" y="62" textAnchor="middle" fontSize="16" fontWeight="700" fill="var(--gray-900)">42%</text>
            <text x="65" y="76" textAnchor="middle" fontSize="9" fill="var(--gray-400)" fontWeight="300">Organic</text>
          </svg>
          {/* Legend */}
          <div style={{ flex: 1 }}>
            {trafficSources.map(s => (
              <div key={s.source} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 12, fontWeight: 400, color: 'var(--gray-600)' }}>{s.source}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-800)' }}>{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>
        {/* Source detail bars */}
        {trafficSources.map(s => (
          <div key={s.source} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 11.5, fontWeight: 400, color: 'var(--gray-600)' }}>{s.source}</span>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray-500)' }}>{s.value.toLocaleString()}</span>
            </div>
            <div style={{ height: 5, background: 'var(--gray-100)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${s.pct * 2.38}%`, background: s.color, borderRadius: 3, opacity: .7 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
