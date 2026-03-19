import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { healthChecks, overallHealth } from '../../../data/dashboard/overviewData'

function getStatusLabel(score) {
  if (score >= 95) return { text: 'Excellent', color: 'var(--emerald)' }
  if (score >= 80) return { text: 'Good', color: 'var(--amber)' }
  return { text: 'Needs Work', color: 'var(--coral)' }
}

function getItemColor(score) {
  if (score >= 100) return 'var(--emerald)'
  if (score >= 80) return 'var(--amber)'
  return 'var(--coral)'
}

export default function ListingHealth() {
  const [mounted, setMounted] = useState(false)
  const status = getStatusLabel(overallHealth)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="db-card">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
          Listing Health
        </div>
      </div>
      <div className="db-card-body" style={{ textAlign: 'center' }}>
        {/* Animated Health Ring */}
        <div className="db-health-ring" style={{ position: 'relative', display: 'inline-block' }}>
          <svg viewBox="0 0 120 120" width="120" height="120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--gray-100)" strokeWidth="8" />
            {/* Background track with subtle pattern */}
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--gray-75, var(--gray-50))" strokeWidth="8"
              strokeDasharray="4 4" opacity="0.3" />
            {/* Animated progress arc */}
            <circle cx="60" cy="60" r="52" fill="none"
              stroke={overallHealth >= 90 ? 'var(--emerald)' : overallHealth >= 70 ? 'var(--amber)' : 'var(--coral)'}
              strokeWidth="8"
              strokeDasharray={mounted ? `${(overallHealth / 100) * 327} 327` : '0 327'}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dasharray .9s cubic-bezier(.4,.0,.2,1)' }}
            />
          </svg>
          <div className="db-health-ring-value" style={{ lineHeight: 1.2 }}>
            <span className="db-health-score">{overallHealth}</span>
            <span className="db-health-label">/ 100</span>
            {/* Status Badge */}
            <div style={{
              marginTop: 4, fontSize: 10, fontWeight: 600, letterSpacing: 0.3,
              color: status.color, textTransform: 'uppercase'
            }}>
              {status.text}
            </div>
          </div>
        </div>

        {/* Health Check Items */}
        <div style={{ textAlign: 'left', marginTop: 16 }}>
          {healthChecks.map(h => {
            const itemColor = getItemColor(h.score)
            return (
              <div key={h.label} className="db-health-item" style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
                borderBottom: '1px solid var(--gray-50)'
              }}>
                <span className={`db-health-dot ${h.score === 100 ? 'db-health-dot--ok' : 'db-health-dot--warn'}`}
                  style={{ flexShrink: 0 }}
                >
                  {h.icon}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: 4
                  }}>
                    <span className="db-health-item-label" style={{ fontSize: 12, fontWeight: 500 }}>{h.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="db-health-item-score" style={{
                        fontSize: 11, fontWeight: 600, color: itemColor
                      }}>{h.score}%</span>
                      {h.score < 100 && (
                        <Link to="/dashboard/listings" style={{
                          fontSize: 10, fontWeight: 500, color: 'var(--accent)',
                          textDecoration: 'none', whiteSpace: 'nowrap',
                          opacity: 0.8, transition: 'opacity .15s'
                        }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}
                        >
                          Fix this &rarr;
                        </Link>
                      )}
                    </div>
                  </div>
                  {/* Mini Progress Bar */}
                  <div style={{
                    height: 4, borderRadius: 2, background: 'var(--gray-100)',
                    overflow: 'hidden', position: 'relative'
                  }}>
                    <div style={{
                      height: '100%', borderRadius: 2,
                      background: itemColor,
                      width: mounted ? `${h.score}%` : '0%',
                      transition: 'width .7s cubic-bezier(.4,.0,.2,1)',
                      transitionDelay: '.15s'
                    }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 6,
          marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--gray-100)',
          fontSize: 10, color: 'var(--gray-400)', textAlign: 'left'
        }}>
          <span>Last Updated: Today at 2:15 PM</span>
          <span>Next Audit: Mar 21</span>
        </div>

        {/* Improve Score Button */}
        <Link to="/dashboard/listings" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          marginTop: 12, padding: '8px 20px',
          fontSize: 12, fontWeight: 600, color: 'var(--accent)',
          background: 'rgba(99,102,241,.06)', border: '1px solid rgba(99,102,241,.15)',
          borderRadius: 8, textDecoration: 'none', cursor: 'pointer',
          transition: 'background .15s, border-color .15s'
        }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(99,102,241,.12)'
            e.currentTarget.style.borderColor = 'rgba(99,102,241,.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(99,102,241,.06)'
            e.currentTarget.style.borderColor = 'rgba(99,102,241,.15)'
          }}
        >
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 3v10M3 8h10" strokeLinecap="round" />
          </svg>
          Improve Score
        </Link>
      </div>
    </div>
  )
}
