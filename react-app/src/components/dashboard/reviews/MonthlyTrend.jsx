import { monthlyReviews } from '../../../data/dashboard/reviewsData'

export default function MonthlyTrend() {
  const maxMonthly = Math.max(...monthlyReviews.map(m => m.count))

  return (
    <div className="db-card">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></svg>
          Monthly Trend
        </div>
      </div>
      <div className="db-card-body">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, marginBottom: 12 }}>
          {monthlyReviews.map((m, i) => (
            <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--gray-600)' }}>{m.count}</span>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'stretch' }}>
                <div style={{ height: `${(m.count / maxMonthly) * 80}px`, background: i === monthlyReviews.length - 1 ? 'var(--amber)' : 'var(--amber)', borderRadius: '3px 3px 0 0', opacity: i === monthlyReviews.length - 1 ? .85 : .35 }} />
              </div>
              <span style={{ fontSize: 9, color: 'var(--gray-400)', fontWeight: 300 }}>{m.month}</span>
              <span style={{ fontSize: 8, color: 'var(--amber)', fontWeight: 500 }}>&#9733; {m.avg}</span>
            </div>
          ))}
        </div>
        <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--r-sm)', padding: '10px 14px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--gray-600)' }}>Growth Rate</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--emerald)' }}>+78% YoY</span>
        </div>
      </div>
    </div>
  )
}
