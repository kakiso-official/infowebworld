import { stats } from '../../../data/dashboard/analyticsData'
import Sparkline from '../shared/Sparkline'

export default function StatCards() {
  return (
    <div className="db-stats">
      {stats.map(s => (
        <div className="db-stat" key={s.label} style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
            <div className="db-stat-icon" style={{ background: s.gradient }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {s.icon.split('|').map((d, i) => <path key={i} d={d} />)}
              </svg>
            </div>
            <Sparkline data={s.spark} color={s.up ? 'var(--emerald)' : 'var(--coral)'} width={80} height={28} />
          </div>
          <div className="db-stat-value">{s.value}</div>
          <div className="db-stat-label">{s.label}</div>
          <div className={`db-stat-change ${s.up ? 'db-stat-change--up' : 'db-stat-change--down'}`}>
            <svg viewBox="0 0 24 24">{s.up ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}</svg>
            {s.change} vs last month
          </div>
        </div>
      ))}
    </div>
  )
}
