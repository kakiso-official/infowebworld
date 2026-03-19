import { heatmapData, heatDays } from '../../../data/dashboard/analyticsData'

export default function ActivityHeatmap() {
  const heatMax = Math.max(...heatmapData.flat())

  const heatColor = (v) => {
    if (v === 0) return 'var(--gray-50)'
    const intensity = v / heatMax
    if (intensity < 0.25) return 'rgba(108,114,241,.1)'
    if (intensity < 0.5) return 'rgba(108,114,241,.25)'
    if (intensity < 0.75) return 'rgba(108,114,241,.5)'
    return 'rgba(108,114,241,.8)'
  }

  return (
    <div className="db-card db-full">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
          Activity Heatmap
        </div>
        <span className="db-card-action">Visitors by hour &times; day</span>
      </div>
      <div className="db-card-body" style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: 600 }}>
          {/* Hour labels */}
          <div style={{ display: 'flex', marginLeft: 40, marginBottom: 4 }}>
            {Array.from({ length: 24 }, (_, i) => (
              <span key={i} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: 'var(--gray-400)', fontWeight: 300 }}>
                {i % 3 === 0 ? `${i}h` : ''}
              </span>
            ))}
          </div>
          {/* Heatmap rows */}
          {heatmapData.map((row, di) => (
            <div key={di} style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 2 }}>
              <span style={{ width: 36, fontSize: 10, color: 'var(--gray-500)', fontWeight: 400, textAlign: 'right', paddingRight: 6 }}>{heatDays[di]}</span>
              <div style={{ display: 'flex', flex: 1, gap: 2 }}>
                {row.map((v, hi) => (
                  <div key={hi} style={{ flex: 1, aspectRatio: '1', borderRadius: 3, background: heatColor(v), transition: 'all .2s', cursor: 'pointer', position: 'relative', minHeight: 16 }} title={`${heatDays[di]} ${hi}:00 — ${v} visitors`} />
                ))}
              </div>
            </div>
          ))}
          {/* Scale */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 40, marginTop: 8 }}>
            <span style={{ fontSize: 9, color: 'var(--gray-400)' }}>Less</span>
            {[.05, .15, .3, .55, .8].map((o, i) => (
              <div key={i} style={{ width: 14, height: 14, borderRadius: 3, background: `rgba(108,114,241,${o})` }} />
            ))}
            <span style={{ fontSize: 9, color: 'var(--gray-400)' }}>More</span>
          </div>
        </div>
      </div>
    </div>
  )
}
