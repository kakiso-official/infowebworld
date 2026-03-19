export default function MiniBarChart({ data, barColor = 'var(--accent)', height = 180, labelKey = 'label', valueKey = 'value', showValues = true }) {
  const max = Math.max(...data.map(d => d[valueKey]))
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height, padding: '0 4px' }}>
      {data.map((d, i) => {
        const h = max > 0 ? (d[valueKey] / max) * (height - 30) : 0
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            {showValues && <span style={{ fontSize: 10, color: 'var(--text-light)', fontWeight: 500 }}>{d[valueKey]}</span>}
            <div style={{ width: '100%', maxWidth: 40, height: h, background: d.color || barColor, borderRadius: '4px 4px 0 0', minHeight: 2, transition: 'height 0.3s' }} />
            <span style={{ fontSize: 10, color: 'var(--text-light)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 50 }}>{d[labelKey]}</span>
          </div>
        )
      })}
    </div>
  )
}
