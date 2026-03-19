import { competitors } from '../../../data/dashboard/reviewsData'

export default function CompetitorComparison() {
  return (
    <div className="db-card">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
          vs. Competitors
        </div>
      </div>
      <div className="db-card-body" style={{ padding: '8px 20px' }}>
        {competitors.map(c => (
          <div key={c.name} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0',
            borderBottom: '1px solid var(--gray-100)',
            ...(c.isYou ? { background: 'linear-gradient(90deg,rgba(108,114,241,.04),transparent)', margin: '0 -20px', padding: '10px 20px', borderRadius: 'var(--r-sm)' } : {})
          }}>
            <span style={{
              width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, flexShrink: 0,
              background: c.rank === 1 ? 'var(--amber)' : c.rank === 2 ? 'var(--gray-300)' : c.rank === 3 ? '#CD7F32' : 'var(--gray-200)',
              color: c.rank <= 3 ? '#fff' : 'var(--gray-500)'
            }}>{c.rank}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 12.5, fontWeight: c.isYou ? 600 : 400, color: c.isYou ? 'var(--accent)' : 'var(--gray-700)' }}>
                {c.name} {c.isYou && <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 4, background: 'var(--accent-soft)', color: 'var(--accent)', fontWeight: 600 }}>YOU</span>}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" style={{ width: 11, height: 11, fill: 'var(--amber)', stroke: 'none' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-800)' }}>{c.rating}</span>
              <span style={{ fontSize: 10, fontWeight: 300, color: 'var(--gray-400)' }}>({c.reviews})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
