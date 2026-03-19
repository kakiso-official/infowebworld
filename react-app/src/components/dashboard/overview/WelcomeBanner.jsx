import { Link } from 'react-router-dom'
import { useMemo } from 'react'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatLastLogin() {
  const now = new Date()
  const h = now.getHours()
  const m = now.getMinutes()
  const ampm = h >= 12 ? 'PM' : 'AM'
  const displayH = h % 12 || 12
  const displayM = m < 10 ? '0' + m : m
  return `Today at ${displayH}:${displayM} ${ampm}`
}

const shimmerKeyframes = `
@keyframes welcomeShimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: .5; transform: scale(.75); }
}
@keyframes subtleFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
`

export default function WelcomeBanner() {
  const greeting = useMemo(() => getGreeting(), [])
  const lastLogin = useMemo(() => formatLastLogin(), [])

  const leadsGoalCurrent = 360
  const leadsGoalTarget = 500
  const leadsGoalPct = Math.round((leadsGoalCurrent / leadsGoalTarget) * 100)

  return (
    <div className="db-welcome" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Inject keyframes */}
      <style>{shimmerKeyframes}</style>

      {/* Animated shimmer overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,.06) 40%, rgba(255,255,255,.12) 50%, rgba(255,255,255,.06) 60%, transparent 100%)',
        backgroundSize: '200% 100%',
        animation: 'welcomeShimmer 6s ease-in-out infinite',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      <div className="db-welcome-bg" />
      <div className="db-welcome-content" style={{ position: 'relative', zIndex: 2 }}>
        <div className="db-welcome-text">
          <h2 className="db-welcome-title">{greeting}, Aadil</h2>
          <p className="db-welcome-desc">
            Your listing is performing <strong>18% better</strong> than last month. You have <strong>3 new leads</strong> and <strong>5 reviews</strong> awaiting reply.
          </p>

          {/* Today's Highlight */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,.12)',
            backdropFilter: 'blur(8px)',
            borderRadius: 8,
            padding: '8px 14px',
            marginTop: 6,
            marginBottom: 10,
            border: '1px solid rgba(255,255,255,.15)',
            animation: 'subtleFloat 4s ease-in-out infinite',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>
              Your listing ranked <strong style={{ color: 'var(--amber)' }}>#3</strong> in Cloud Security this week
            </span>
          </div>

          {/* Monthly goal progress */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 14,
          }}>
            <span style={{ color: 'rgba(255,255,255,.7)', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>
              Monthly Goal
            </span>
            <div style={{
              flex: 1,
              maxWidth: 180,
              height: 6,
              background: 'rgba(255,255,255,.15)',
              borderRadius: 3,
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${leadsGoalPct}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--emerald), var(--teal))',
                borderRadius: 3,
                transition: 'width .6s ease',
              }} />
            </div>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>
              {leadsGoalPct}%
            </span>
            <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 11 }}>
              ({leadsGoalCurrent}/{leadsGoalTarget} leads)
            </span>
          </div>

          <div className="db-welcome-actions">
            <Link to="/dashboard/leads" className="db-btn db-btn--primary">View New Leads</Link>
            <Link to="/dashboard/reviews" className="db-btn db-btn--outline" style={{ background: 'rgba(255,255,255,.15)', borderColor: 'rgba(255,255,255,.2)', color: '#fff' }}>Reply to Reviews</Link>
          </div>
        </div>

        <div className="db-welcome-stats-mini">
          {/* Active visitors pill with pulsing dot */}
          <div className="db-welcome-stat-pill" style={{ gap: 6 }}>
            <span style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--emerald)',
              display: 'inline-block',
              animation: 'pulseDot 1.8s ease-in-out infinite',
              boxShadow: '0 0 6px var(--emerald)',
            }} />
            <span>23 active visitors now</span>
          </div>

          <div className="db-welcome-stat-pill">
            <span className="db-welcome-stat-dot" style={{ background: 'var(--amber)' }} />
            <span>Pro Plan</span>
          </div>

          <div className="db-welcome-stat-pill">
            <span className="db-welcome-stat-dot" style={{ background: 'var(--azure)' }} />
            <span>Verified Business</span>
          </div>

          {/* Last login subtle text */}
          <div style={{
            width: '100%',
            textAlign: 'right',
            marginTop: 6,
            color: 'rgba(255,255,255,.4)',
            fontSize: 11,
            fontStyle: 'italic',
          }}>
            Last login: {lastLogin}
          </div>
        </div>
      </div>
    </div>
  )
}
