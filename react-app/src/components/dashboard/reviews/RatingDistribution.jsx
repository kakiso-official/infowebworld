import Stars from '../shared/Stars'
import { ratingDist, totalReviews, avgRating } from '../../../data/dashboard/reviewsData'

export default function RatingDistribution() {
  return (
    <div className="db-card">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
          Rating Distribution
        </div>
        <span className="db-card-action">{totalReviews} total</span>
      </div>
      <div className="db-card-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
          {/* Big score with ring */}
          <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
            <svg viewBox="0 0 110 110" width="110" height="110">
              <circle cx="55" cy="55" r="48" fill="none" stroke="var(--gray-100)" strokeWidth="8" />
              <circle cx="55" cy="55" r="48" fill="none" stroke="var(--amber)" strokeWidth="8" strokeDasharray={`${(avgRating / 5) * 301.6} ${301.6 - (avgRating / 5) * 301.6}`} strokeLinecap="round" transform="rotate(-90 55 55)" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1 }}>{avgRating}</span>
              <Stars rating={5} size={11} />
            </div>
          </div>
          {/* Distribution bars */}
          <div style={{ flex: 1 }}>
            {ratingDist.map(r => (
              <div key={r.stars} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-600)', width: 14, textAlign: 'right' }}>{r.stars}</span>
                <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, fill: 'var(--amber)', stroke: 'none', flexShrink: 0 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                <div style={{ flex: 1, height: 8, background: 'var(--gray-100)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${r.pct}%`, background: r.stars >= 4 ? 'var(--amber)' : r.stars === 3 ? 'var(--gray-400)' : 'var(--coral)', borderRadius: 4, transition: 'width .8s ease' }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-700)', width: 32, textAlign: 'right' }}>{r.count}</span>
                <span style={{ fontSize: 10, fontWeight: 300, color: 'var(--gray-400)', width: 28, textAlign: 'right' }}>{r.pct}%</span>
              </div>
            ))}
          </div>
        </div>
        {/* Quick rating summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { label: '5-Star Rate', value: '62%', color: 'var(--emerald)' },
            { label: 'Recommend', value: '96%', color: 'var(--accent)' },
            { label: 'Repeat Clients', value: '78%', color: 'var(--amber)' },
          ].map(q => (
            <div key={q.label} style={{ background: 'var(--gray-50)', borderRadius: 'var(--r-sm)', padding: '10px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: q.color }}>{q.value}</div>
              <div style={{ fontSize: 10, fontWeight: 300, color: 'var(--gray-500)' }}>{q.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
