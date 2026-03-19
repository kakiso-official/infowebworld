import { totalReviews } from '../../../data/dashboard/reviewsData'

export default function ReviewsBanner({ unrepliedCount }) {
  return (
    <div className="db-welcome">
      <div className="db-welcome-bg" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ef6b4a 30%, #e11d48 60%, #8b5cf6 100%)' }} />
      <div className="db-welcome-content">
        <div className="db-welcome-text">
          <div className="db-welcome-title">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <svg viewBox="0 0 24 24" style={{ width: 24, height: 24, fill: '#facc15', stroke: 'none' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              4.8 Star Reputation — #{1} in Category
            </span>
          </div>
          <div className="db-welcome-desc">
            You&apos;ve earned <strong>{totalReviews} reviews</strong> with a <strong>92% positive sentiment</strong> score.
            {unrepliedCount > 0 && <> You have <strong>{unrepliedCount} reviews</strong> waiting for your response.</>}
            {' '}Your response rate is <strong>87%</strong> with an average reply time of <strong>4.2 hours</strong>.
          </div>
          <div className="db-welcome-actions">
            <button className="db-btn" style={{ background: '#fff', color: '#e11d48' }}>Request Reviews</button>
            <button className="db-btn" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', border: '1px solid rgba(255,255,255,.25)' }}>Share Review Page</button>
          </div>
        </div>
        <div className="db-welcome-stats-mini">
          <div className="db-welcome-stat-pill"><span className="db-welcome-stat-dot" style={{ background: '#facc15' }} /> 4.8 avg rating</div>
          <div className="db-welcome-stat-pill"><span className="db-welcome-stat-dot" style={{ background: '#4ade80' }} /> 92% positive</div>
          <div className="db-welcome-stat-pill"><span className="db-welcome-stat-dot" style={{ background: '#f87171' }} /> {unrepliedCount} need reply</div>
        </div>
      </div>
    </div>
  )
}
