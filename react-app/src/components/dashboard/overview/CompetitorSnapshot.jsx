import { competitors, yourListing } from '../../../data/dashboard/overviewData'

export default function CompetitorSnapshot() {
  const starRow = (rating) => {
    const full = Math.floor(rating)
    const partial = rating - full
    return (
      <span style={{ display: 'inline-flex', gap: 1, verticalAlign: 'middle' }}>
        {Array.from({ length: 5 }, (_, i) => {
          const fill = i < full ? 1 : i === full ? partial : 0
          return (
            <svg key={i} viewBox="0 0 16 16" width="13" height="13">
              <defs><linearGradient id={`star-fill-${i}-${Math.round(fill * 10)}`}><stop offset={`${fill * 100}%`} stopColor="var(--amber)" /><stop offset={`${fill * 100}%`} stopColor="var(--gray-200)" /></linearGradient></defs>
              <polygon points="8 1.5 10 5.8 14.5 6.4 11.2 9.5 12 14 8 11.8 4 14 4.8 9.5 1.5 6.4 6 5.8" fill={`url(#star-fill-${i}-${Math.round(fill * 10)})`} />
            </svg>
          )
        })}
      </span>
    )
  }

  const ratingBarWidth = (r) => `${(r / 5) * 100}%`
  const gap = (r) => (yourListing.rating - r).toFixed(1)

  return (
    <div className="db-card">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="M20 8v6" /><path d="M23 11h-6" /></svg>
          Competitor Snapshot
        </div>
      </div>
      <div className="db-card-body">
        {/* Your position - prominent */}
        <div className="db-competitor-you" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,.06), rgba(168,85,247,.04))', border: '1.5px solid rgba(99,102,241,.15)', borderRadius: 10, padding: '14px 14px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div className="db-competitor-rank" style={{ background: 'linear-gradient(135deg, var(--accent), var(--plum))', color: '#fff', fontSize: 13, fontWeight: 800, width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>#1</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>{yourListing.name}</div>
              <div style={{ fontSize: 11, fontWeight: 400, color: 'var(--gray-400)', marginTop: 1 }}>Category: {yourListing.category}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
            {starRow(yourListing.rating)}
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--amber)', marginLeft: 4 }}>{yourListing.rating}</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { label: 'Views', val: yourListing.views },
              { label: 'Rating', val: yourListing.rating },
              { label: 'Reviews', val: yourListing.reviews },
            ].map(m => (
              <div key={m.label} style={{ flex: 1, background: 'rgba(255,255,255,.7)', borderRadius: 6, padding: '6px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>{m.val}</div>
                <div style={{ fontSize: 9.5, fontWeight: 500, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '14px 0 12px' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--gray-100)' }} />
          <span style={{ fontSize: 9.5, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Competitors</span>
          <div style={{ flex: 1, height: 1, background: 'var(--gray-100)' }} />
        </div>

        {/* Competitor rows */}
        {competitors.map((c, i) => {
          const ratingGap = gap(c.rating)
          const trendUp = c.trend === 'up'
          return (
            <div key={c.name} className="db-competitor-row" style={{ padding: '10px 10px', marginBottom: i < competitors.length - 1 ? 6 : 0, borderRadius: 8, border: '1px solid var(--gray-100)', background: 'var(--gray-50)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div className="db-competitor-rank" style={{ background: 'var(--gray-100)', color: 'var(--gray-500)', fontSize: 11, fontWeight: 700, width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>#{i + 2}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--gray-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: trendUp ? 'var(--emerald)' : 'var(--coral)', flexShrink: 0 }}>
                      {trendUp ? '\u2191' : '\u2193'}{c.change}
                    </span>
                  </div>
                  <div style={{ fontSize: 10.5, fontWeight: 400, color: 'var(--gray-400)', marginTop: 1 }}>{c.reviews} reviews &middot; {c.views} views</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-700)' }}>{c.rating} <span style={{ color: 'var(--amber)' }}>&#9733;</span></div>
                  <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--coral)' }}>Gap: -{ratingGap}</div>
                </div>
              </div>
              {/* Rating comparison bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 5, background: 'var(--gray-100)', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
                  {/* Your rating as faint reference */}
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: ratingBarWidth(yourListing.rating), background: 'rgba(99,102,241,.1)', borderRadius: 3 }} />
                  {/* Competitor rating */}
                  <div style={{ position: 'relative', height: '100%', width: ratingBarWidth(c.rating), background: trendUp ? 'var(--emerald)' : 'var(--coral)', borderRadius: 3, transition: 'width .3s ease' }} />
                </div>
                <span style={{ fontSize: 9.5, fontWeight: 600, color: 'var(--gray-400)', flexShrink: 0 }}>vs {yourListing.rating}</span>
              </div>
            </div>
          )
        })}

        {/* Footer */}
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--gray-100)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10.5, fontWeight: 400, color: 'var(--gray-400)' }}>Rankings updated daily &middot; #1 held for {yourListing.rankDays} days</span>
          </div>
          <button
            type="button"
            style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10, fontSize: 12, fontWeight: 600, color: 'var(--accent)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            View Full Analysis
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
