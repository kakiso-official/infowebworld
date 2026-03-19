import { referrers } from '../../../data/dashboard/analyticsData'

export default function TopReferrers() {
  return (
    <div className="db-card">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
          Top Referrers
        </div>
      </div>
      <div className="db-card-body" style={{ padding: '4px 20px' }}>
        {referrers.map((r, i) => (
          <div key={r.site} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < referrers.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-500)' }}>{r.site[0].toUpperCase()}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--gray-700)' }}>{r.site}</div>
              <div style={{ fontSize: 10, fontWeight: 300, color: 'var(--gray-400)' }}>{r.visits.toLocaleString()} visits</div>
            </div>
            <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: r.trend === 'up' ? 'var(--emerald)' : 'var(--coral)', fill: 'none', strokeWidth: 2 }}>
              {r.trend === 'up' ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}
            </svg>
          </div>
        ))}
      </div>
    </div>
  )
}
