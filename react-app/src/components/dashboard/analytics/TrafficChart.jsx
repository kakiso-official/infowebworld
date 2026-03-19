import { useState } from 'react'
import { daily30, dailyVisitors30, dailyLabels } from '../../../data/dashboard/analyticsData'

export default function TrafficChart() {
  const [chartRange, setChartRange] = useState('30d')
  const [hoveredBar, setHoveredBar] = useState(null)

  const maxViews = Math.max(...daily30)

  return (
    <div className="db-card db-full">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
          Traffic Overview
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[{ k: '7d', l: '7D' }, { k: '30d', l: '30D' }].map(r => (
            <button key={r.k} className={`db-btn ${chartRange === r.k ? 'db-btn--primary' : 'db-btn--outline'}`} style={{ padding: '4px 12px', fontSize: 11 }} onClick={() => setChartRange(r.k)}>
              {r.l}
            </button>
          ))}
        </div>
      </div>
      <div className="db-card-body" style={{ padding: '20px 20px 12px' }}>
        {/* Legend */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--gray-500)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--accent)', display: 'inline-block' }} /> Page Views
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--gray-500)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--emerald)', display: 'inline-block' }} /> Unique Visitors
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 500, color: 'var(--gray-800)' }}>
            Total: <strong>38,421</strong> views &middot; <strong>12,847</strong> visitors
          </span>
        </div>
        {/* Y-axis labels + chart */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: 24, width: 36 }}>
            {[maxViews, Math.round(maxViews * 0.75), Math.round(maxViews * 0.5), Math.round(maxViews * 0.25), 0].map(v => (
              <span key={v} style={{ fontSize: 9, color: 'var(--gray-400)', fontWeight: 300, textAlign: 'right' }}>{v}</span>
            ))}
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            {/* Grid lines */}
            <div style={{ position: 'absolute', inset: 0, bottom: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
              {[0,1,2,3,4].map(i => <div key={i} style={{ borderBottom: '1px solid var(--gray-100)', width: '100%' }} />)}
            </div>
            {/* Bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: chartRange === '7d' ? 8 : 3, height: 200, position: 'relative' }}>
              {(chartRange === '7d' ? daily30.slice(-7) : daily30).map((v, i) => {
                const visitors = chartRange === '7d' ? dailyVisitors30.slice(-7)[i] : dailyVisitors30[i]
                const label = chartRange === '7d' ? dailyLabels.slice(-7)[i] : dailyLabels[i]
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, height: '100%', justifyContent: 'flex-end', position: 'relative', cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
                    {/* Tooltip */}
                    {hoveredBar === i && (
                      <div style={{ position: 'absolute', bottom: '100%', marginBottom: 8, background: 'var(--gray-900)', color: '#fff', padding: '6px 10px', borderRadius: 6, fontSize: 11, whiteSpace: 'nowrap', zIndex: 10, fontWeight: 400, lineHeight: 1.6, boxShadow: '0 4px 12px rgba(0,0,0,.2)' }}>
                        <div style={{ fontWeight: 600 }}>{label}</div>
                        <div>Views: {v}</div>
                        <div>Visitors: {visitors}</div>
                        <div style={{ position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8, background: 'var(--gray-900)', rotate: '45deg' }} />
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 1, alignItems: 'flex-end', width: '100%' }}>
                      <div style={{ flex: 1, height: `${(v / maxViews) * 176}px`, background: hoveredBar === i ? 'var(--accent)' : 'var(--accent)', borderRadius: '2px 2px 0 0', opacity: hoveredBar === i ? .9 : .55, transition: 'all .2s' }} />
                      <div style={{ flex: 1, height: `${(visitors / maxViews) * 176}px`, background: hoveredBar === i ? 'var(--emerald)' : 'var(--emerald)', borderRadius: '2px 2px 0 0', opacity: hoveredBar === i ? .9 : .55, transition: 'all .2s' }} />
                    </div>
                  </div>
                )
              })}
            </div>
            {/* X-axis labels */}
            <div style={{ display: 'flex', gap: chartRange === '7d' ? 8 : 3, marginTop: 6 }}>
              {(chartRange === '7d' ? dailyLabels.slice(-7) : dailyLabels.filter((_, i) => i % (chartRange === '7d' ? 1 : 5) === 0)).map((l, i) => (
                <span key={i} style={{ flex: chartRange === '7d' ? 1 : 5, fontSize: 9, color: 'var(--gray-400)', textAlign: 'center', fontWeight: 300 }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
