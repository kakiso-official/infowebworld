export default function MiniLineChart({ series, labels, height = 180, width = '100%' }) {
  const allValues = series.flatMap(s => s.data)
  const max = Math.max(...allValues)
  const min = Math.min(...allValues)
  const range = max - min || 1
  const vw = 500
  const padding = 10

  return (
    <div style={{ width }}>
      <svg viewBox={`0 0 ${vw} ${height}`} style={{ width: '100%', height }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(pct => {
          const y = padding + (1 - pct) * (height - padding * 2)
          return <line key={pct} x1={padding} y1={y} x2={vw - padding} y2={y} stroke="var(--border)" strokeWidth="0.5" />
        })}

        {/* Series */}
        {series.map((s, si) => {
          const points = s.data.map((v, i) => {
            const x = padding + (i / (s.data.length - 1)) * (vw - padding * 2)
            const y = padding + (1 - (v - min) / range) * (height - padding * 2)
            return `${x},${y}`
          }).join(' ')
          return <polyline key={si} points={points} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        })}
      </svg>

      {/* Labels */}
      {labels && (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 10px 0', fontSize: 10, color: 'var(--text-light)' }}>
          {labels.filter((_, i) => i % Math.ceil(labels.length / 6) === 0 || i === labels.length - 1).map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
        {series.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-light)' }}>
            <div style={{ width: 12, height: 3, borderRadius: 2, background: s.color }} />
            {s.label}
          </div>
        ))}
      </div>
    </div>
  )
}
