import { sourcesData } from '../../../data/dashboard/reviewsData'

export default function SentimentCloud() {
  return (
    <div className="db-card">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" /></svg>
          Review Sources
        </div>
      </div>
      <div className="db-card-body" style={{ padding: '12px 20px' }}>
        {sourcesData.map(s => (
          <div key={s.source} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: s.color, opacity: .15, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: s.color }}>{s.source[0]}</span>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-700)' }}>{s.source}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-800)' }}>{s.count}</span>
              </div>
              <div style={{ height: 4, background: 'var(--gray-100)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: 2, opacity: .6 }} />
              </div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" style={{ width: 10, height: 10, fill: 'var(--amber)', stroke: 'none' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              {s.avg}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
