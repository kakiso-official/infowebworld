import DonutChart from '../../dashboard/shared/DonutChart'

export default function AdminDonutChart({ segments, centerLabel, centerValue, size = 120, strokeWidth = 14 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
      <div style={{ position: 'relative' }}>
        <DonutChart segments={segments} size={size} strokeWidth={strokeWidth} />
        {centerValue && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{centerValue}</div>
            {centerLabel && <div style={{ fontSize: 10, color: 'var(--text-light)' }}>{centerLabel}</div>}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 120 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <span style={{ color: 'var(--text-light)', flex: 1 }}>{s.label}</span>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
