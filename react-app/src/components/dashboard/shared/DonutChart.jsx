export default function DonutChart({ segments, size = 100, strokeWidth = 12, innerRadius = 50 }) {
  const r = innerRadius
  const circ = 2 * Math.PI * r
  const viewBox = `0 0 ${(r + strokeWidth) * 2} ${(r + strokeWidth) * 2}`
  const cx = r + strokeWidth
  const cy = r + strokeWidth
  let offset = 0
  return (
    <div className="db-donut-wrap">
      <svg viewBox={viewBox} width={size} height={size}>
        {segments.map((s, i) => {
          const dash = (s.pct / 100) * circ
          const el = (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color}
              strokeWidth={strokeWidth} strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset} transform={`rotate(-90 ${cx} ${cy})`} />
          )
          offset += dash
          return el
        })}
      </svg>
    </div>
  )
}
