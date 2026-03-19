import Sparkline from '../../dashboard/shared/Sparkline'

export default function AdminStatCard({ label, value, change, up, gradient, icon, spark, sparkColor }) {
  return (
    <div className="db-stat">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
        <div className="db-stat-icon" style={{ background: gradient, marginBottom: 0 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
        </div>
        {spark && <Sparkline data={spark} color={sparkColor || (up ? 'var(--emerald)' : 'var(--coral)')} />}
      </div>
      <div className="db-stat-value">{value}</div>
      <div className="db-stat-label">{label}</div>
      {change && (
        <div className={`db-stat-change ${up ? 'db-stat-change--up' : 'db-stat-change--down'}`}>
          <svg viewBox="0 0 24 24">{up ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}</svg>
          {change} this month
        </div>
      )}
    </div>
  )
}
