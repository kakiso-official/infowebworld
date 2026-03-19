import Sparkline from '../shared/Sparkline'
import { stats } from '../../../data/dashboard/overviewData'

const hoverStyles = `
.db-stat-enhanced {
  position: relative;
  transition: transform .2s ease, box-shadow .2s ease;
}
.db-stat-enhanced:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,.08);
}
.db-stat-target {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: opacity .25s ease, max-height .25s ease;
}
.db-stat-enhanced:hover .db-stat-target {
  opacity: 1;
  max-height: 30px;
}
`

export default function StatsRow() {
  return (
    <div className="db-stats">
      <style>{hoverStyles}</style>
      {stats.map(s => {
        // Extract the first color from the gradient for the left border
        const borderColor = s.gradient.match(/var\(--[^)]+\)/)?.[0] || 'var(--accent)'

        return (
          <div
            className="db-stat db-stat-enhanced"
            key={s.label}
            style={{
              borderLeft: `3px solid ${borderColor}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
              <div className="db-stat-icon" style={{ background: s.gradient, marginBottom: 0 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{s.icon}</svg>
              </div>
              <Sparkline data={s.spark} color={s.up ? 'var(--emerald)' : 'var(--coral)'} width={90} height={32} />
            </div>

            <div className="db-stat-value">{s.value}</div>
            <div className="db-stat-label">{s.label}</div>

            <div className={`db-stat-change ${s.up ? 'db-stat-change--up' : 'db-stat-change--down'}`}>
              <svg viewBox="0 0 24 24">{s.up ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}</svg>
              {s.change} this month
            </div>

            {/* Secondary metric */}
            {s.sub && (
              <div style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                marginTop: 4,
                fontWeight: 500,
                letterSpacing: '0.01em',
              }}>
                {s.sub}
              </div>
            )}

            {/* Target — reveals on hover */}
            <div className="db-stat-target" style={{
              fontSize: 10,
              color: 'var(--text-muted)',
              marginTop: 4,
              padding: '4px 8px',
              background: 'rgba(0,0,0,.03)',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
              </svg>
              {s.target}
            </div>
          </div>
        )
      })}
    </div>
  )
}
