import { conversionGoals } from '../../../data/dashboard/analyticsData'

export default function ConversionGoals() {
  return (
    <div className="db-card">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
          Conversion Goals
        </div>
        <span className="db-card-action">2,138 total</span>
      </div>
      <div className="db-card-body">
        {conversionGoals.map(g => (
          <div key={g.goal} style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)' }}>{g.goal}</span>
              <span className={`db-stat-change ${g.change >= 0 ? 'db-stat-change--up' : 'db-stat-change--down'}`} style={{ fontSize: 10 }}>
                <svg viewBox="0 0 24 24">{g.change >= 0 ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}</svg>
                {g.change >= 0 ? '+' : ''}{g.change}%
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <div style={{ flex: 1, height: 8, background: 'var(--gray-100)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${g.rate * 10}%`, background: g.color, borderRadius: 4, opacity: .7 }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-800)', minWidth: 42, textAlign: 'right' }}>{g.rate}%</span>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 11, fontWeight: 300, color: 'var(--gray-400)' }}>
              <span>{g.completions.toLocaleString()} completions</span>
              <span>Conversion rate: {g.rate}%</span>
            </div>
          </div>
        ))}
        {/* Total conversion summary */}
        <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--r-sm)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-700)' }}>Overall Conversion Rate</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>16.6%</span>
        </div>
      </div>
    </div>
  )
}
