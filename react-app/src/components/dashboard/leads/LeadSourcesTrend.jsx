import { sourceBreakdown, weeklyLeads, allLeads } from '../../../data/dashboard/leadsData'

export default function LeadSourcesTrend() {
  const maxWeekly = Math.max(...weeklyLeads.map(w => w.leads))

  return (
    <div className="db-card">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></svg>
          Lead Sources & Trend
        </div>
      </div>
      <div className="db-card-body">
        {/* Source donut */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
          <svg width="100" height="100" viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
            {(() => {
              let acc = 0
              return sourceBreakdown.map(s => {
                const start = (acc / 100) * 360
                acc += s.pct
                const end = (acc / 100) * 360
                const sR = ((start - 90) * Math.PI) / 180, eR = ((end - 90) * Math.PI) / 180
                const r = 40, cx = 50, cy = 50
                const x1 = cx + r * Math.cos(sR), y1 = cy + r * Math.sin(sR)
                const x2 = cx + r * Math.cos(eR), y2 = cy + r * Math.sin(eR)
                return <path key={s.source} d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${end - start > 180 ? 1 : 0} 1 ${x2} ${y2} Z`} fill={s.color} opacity=".7" />
              })
            })()}
            <circle cx="50" cy="50" r="24" fill="#fff" />
            <text x="50" y="48" textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--gray-900)">{allLeads.length}</text>
            <text x="50" y="59" textAnchor="middle" fontSize="8" fill="var(--gray-400)" fontWeight="300">total</text>
          </svg>
          <div style={{ flex: 1 }}>
            {sourceBreakdown.map(s => (
              <div key={s.source} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 12, fontWeight: 400, color: 'var(--gray-600)' }}>{s.source}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-800)' }}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Weekly bar chart */}
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 10 }}>Weekly Trend</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
          {weeklyLeads.map((w, i) => (
            <div key={w.week} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 500, color: 'var(--gray-600)' }}>{w.leads}</span>
              <div style={{ width: '100%', height: `${(w.leads / maxWeekly) * 56}px`, background: i === weeklyLeads.length - 1 ? 'var(--accent)' : 'var(--accent)', borderRadius: '3px 3px 0 0', opacity: i === weeklyLeads.length - 1 ? .85 : .35 }} />
              <span style={{ fontSize: 9, color: 'var(--gray-400)', fontWeight: 300 }}>{w.week}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
