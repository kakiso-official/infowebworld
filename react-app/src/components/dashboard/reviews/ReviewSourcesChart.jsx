import { sentimentData, sentimentKeywords } from '../../../data/dashboard/reviewsData'

export default function ReviewSourcesChart() {
  let sentAcc = 0

  return (
    <div className="db-card">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Sentiment Analysis
        </div>
      </div>
      <div className="db-card-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
          {/* Sentiment donut */}
          <svg width="100" height="100" viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
            {sentimentData.map(s => {
              const start = (sentAcc / 100) * 360
              sentAcc += s.pct
              const end = (sentAcc / 100) * 360
              const sR = ((start - 90) * Math.PI) / 180, eR = ((end - 90) * Math.PI) / 180
              const r = 40, cx = 50, cy = 50
              const x1 = cx + r * Math.cos(sR), y1 = cy + r * Math.sin(sR)
              const x2 = cx + r * Math.cos(eR), y2 = cy + r * Math.sin(eR)
              return <path key={s.label} d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${end - start > 180 ? 1 : 0} 1 ${x2} ${y2} Z`} fill={s.color} opacity=".7" />
            })}
            <circle cx="50" cy="50" r="24" fill="#fff" />
            <text x="50" y="47" textAnchor="middle" fontSize="16" fontWeight="700" fill="var(--emerald)">92%</text>
            <text x="50" y="59" textAnchor="middle" fontSize="8" fill="var(--gray-400)" fontWeight="300">positive</text>
          </svg>
          <div style={{ flex: 1 }}>
            {sentimentData.map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 12.5, fontWeight: 400, color: 'var(--gray-700)' }}>{s.label}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>
        {/* Keyword cloud */}
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>Top Keywords</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {sentimentKeywords.map(k => (
            <span key={k.word} style={{
              padding: '4px 10px', borderRadius: 12,
              fontSize: Math.max(10, Math.min(13, 8 + k.count / 8)),
              fontWeight: k.count > 30 ? 600 : 400,
              background: k.sentiment === 'positive' ? 'rgba(47,174,106,.08)' : k.sentiment === 'negative' ? 'rgba(239,107,74,.08)' : 'rgba(245,158,11,.08)',
              color: k.sentiment === 'positive' ? 'var(--emerald)' : k.sentiment === 'negative' ? 'var(--coral)' : 'var(--amber)',
            }}>
              {k.word} <span style={{ fontWeight: 300, fontSize: 9, opacity: .7 }}>({k.count})</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
