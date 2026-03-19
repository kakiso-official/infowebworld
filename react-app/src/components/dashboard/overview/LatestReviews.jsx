import { Link } from 'react-router-dom'
import { recentReviews } from '../../../data/dashboard/overviewData'
import Stars from '../shared/Stars'

const reviewSources = ['Google', 'InfoWebWorld', 'Yelp', 'Direct']

const ratingDistribution = [
  { stars: 5, pct: 72, count: 246 },
  { stars: 4, pct: 20, count: 68 },
  { stars: 3, pct: 5, count: 17 },
  { stars: 2, pct: 2, count: 7 },
  { stars: 1, pct: 1, count: 4 },
]

const enrichedReviews = recentReviews.map((r, i) => ({
  ...r,
  source: reviewSources[i % reviewSources.length],
}))

export default function LatestReviews() {
  return (
    <div className="db-card">
      {/* Header */}
      <div className="db-card-header" style={{ alignItems: 'center' }}>
        <div className="db-card-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
          Latest Reviews
          <span style={{
            background: 'linear-gradient(135deg, var(--amber), var(--coral))',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            padding: '2px 10px',
            borderRadius: 10,
            lineHeight: '18px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            4.8 avg
          </span>
        </div>
        <Link to="/dashboard/reviews" className="db-card-action">See All</Link>
      </div>

      {/* Summary bar + rating distribution */}
      <div style={{
        padding: '0 20px 12px',
        borderBottom: '1px solid var(--border)',
      }}>
        {/* Stats row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 12,
          flexWrap: 'wrap',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}>
            <span style={{ fontSize: 22, fontWeight: 800, background: 'linear-gradient(135deg, var(--amber), var(--coral))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>4.8</span>
            <Stars rating={5} size={13} />
          </div>
          <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>342</strong> total reviews
          </span>
          <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--emerald)',
            background: 'color-mix(in srgb, var(--emerald) 10%, transparent)',
            padding: '2px 8px',
            borderRadius: 6,
          }}>
            94% positive
          </span>
        </div>

        {/* Mini rating distribution */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {ratingDistribution.map(d => (
            <div key={d.stars} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
              <span style={{ width: 14, textAlign: 'right', color: 'var(--text-secondary)', fontWeight: 600, fontSize: 10 }}>{d.stars}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--amber)" stroke="none" style={{ opacity: 0.7, minWidth: 10 }}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <div style={{
                flex: 1,
                height: 6,
                borderRadius: 3,
                background: 'var(--bg-alt)',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: d.pct + '%',
                  height: '100%',
                  borderRadius: 3,
                  background: d.stars >= 4
                    ? 'linear-gradient(90deg, var(--amber), var(--coral))'
                    : d.stars === 3 ? 'var(--text-secondary)' : 'var(--coral)',
                  transition: 'width 0.6s ease',
                }} />
              </div>
              <span style={{ width: 32, color: 'var(--text-secondary)', fontSize: 10, fontWeight: 500 }}>{d.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review cards */}
      <div className="db-card-body" style={{ padding: '4px 20px', maxHeight: 420, overflowY: 'auto' }}>
        {enrichedReviews.map((r, i) => (
          <div className="db-review" key={i} style={{
            padding: '14px 0',
            borderBottom: i < enrichedReviews.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <div className="db-review-top" style={{ marginBottom: 8 }}>
              <div className="db-review-author" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="db-review-avatar" style={{
                  background: r.bg,
                  width: 38,
                  height: 38,
                  minWidth: 38,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 13,
                  boxShadow: `0 2px 8px color-mix(in srgb, ${r.bg} 30%, transparent)`,
                }}>
                  {r.initials}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <div className="db-review-name" style={{ fontWeight: 650, fontSize: 13.5 }}>{r.name}</div>
                    {r.verified && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                        fontSize: 10,
                        fontWeight: 600,
                        color: 'var(--emerald)',
                        background: 'color-mix(in srgb, var(--emerald) 10%, transparent)',
                        padding: '1px 6px',
                        borderRadius: 4,
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r.company}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-secondary)', opacity: 0.4 }}>|</span>
                    <span className="db-review-date" style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                      {r.date} via {r.source}
                    </span>
                  </div>
                </div>
              </div>
              <div className="db-stars">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} viewBox="0 0 24 24" style={{ width: 14, height: 14 }} className={s > r.rating ? 'empty' : ''}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Review text - clamped to 2 lines */}
            <div className="db-review-text" style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.55,
              fontSize: 13,
              color: 'var(--text-primary)',
              marginBottom: 6,
            }}>
              {r.text}
            </div>

            {r.text.length > 100 && (
              <button style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
                marginBottom: 8,
              }}>
                Read more
              </button>
            )}

            {/* Helpful count */}
            <div style={{
              fontSize: 11.5,
              color: 'var(--text-secondary)',
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
              {r.helpful} found this helpful
            </div>

            {/* Action buttons */}
            <div className="db-review-actions" style={{ display: 'flex', gap: 6 }}>
              <button className="db-review-action" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Reply
              </button>
              <button className="db-review-action" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
                Thank
              </button>
              <button className="db-review-action" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                marginLeft: 'auto',
                opacity: 0.6,
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
                Flag
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 20px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        fontSize: 12,
        color: 'var(--text-secondary)',
        flexWrap: 'wrap',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Response rate: <strong style={{ color: 'var(--emerald)' }}>94%</strong>
        </span>
        <span style={{ color: 'var(--border)' }}>|</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          Avg response time: <strong style={{ color: 'var(--accent)' }}>2.1 hours</strong>
        </span>
      </div>
    </div>
  )
}
