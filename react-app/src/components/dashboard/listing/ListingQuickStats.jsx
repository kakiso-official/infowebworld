import { QUICK_STATS } from '../../../data/dashboard/listingData'

const STAT_ICONS = {
  eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  click: <><path d="M15 3h6v6"/><path d="M10 14L21 3"/><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/></>,
  leads: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/></>,
}

export default function ListingQuickStats() {
  return (
    <div className="db-stats" style={{ marginBottom: 20 }}>
      {QUICK_STATS.map((s, i) => (
        <div key={i} className="db-stat">
          <div className="db-stat-icon" style={{ background: `${s.color}12` }}>
            <svg viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{STAT_ICONS[s.icon]}</svg>
          </div>
          <div className="db-stat-info">
            <div className="db-stat-value">{s.value}</div>
            <div className="db-stat-label">{s.label}</div>
          </div>
          <div className={`db-stat-change db-stat-change--${s.up ? 'up' : 'down'}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points={s.up ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}/></svg>
            {s.change}
          </div>
        </div>
      ))}
    </div>
  )
}
