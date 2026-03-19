import Sparkline from '../shared/Sparkline'
import { statsRow } from '../../../data/dashboard/reviewsData'

export default function ReviewStats() {
  return (
    <div className="db-stats">
      {statsRow.map(s => (
        <div className="db-stat" key={s.label}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
            <div className="db-stat-icon" style={{ background: s.gradient }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon} /></svg>
            </div>
            <Sparkline data={s.spark} color={s.sparkColor} />
          </div>
          <div className="db-stat-value">{s.value}</div>
          <div className="db-stat-label">{s.label}</div>
          <div className="db-stat-change db-stat-change--up">
            <svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15" /></svg>
            {s.change}
          </div>
        </div>
      ))}
    </div>
  )
}
