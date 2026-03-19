import { pipeline } from '../../../data/dashboard/leadsData'

export default function SalesPipeline({ totalValue, convRate }) {
  return (
    <div className="db-card">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></svg>
          Sales Pipeline
        </div>
        <span className="db-card-action">{convRate}% win rate</span>
      </div>
      <div className="db-card-body">
        {pipeline.map((p, i) => (
          <div className="db-funnel-step" key={p.stage}>
            <div className="db-funnel-info" style={{ marginBottom: 4 }}>
              <span className="db-funnel-label">{p.stage}</span>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray-500)', marginRight: 6 }}>{p.count} leads</span>
              <span className="db-funnel-value">{p.value}</span>
              {i > 0 && <span className="db-funnel-conv">{Math.round((p.count / pipeline[i - 1].count) * 100)}%</span>}
            </div>
            <div className="db-funnel-bar-wrap">
              <div className="db-funnel-bar" style={{ width: `${p.pct}%`, background: p.color, opacity: .65 }} />
            </div>
          </div>
        ))}
        {/* Pipeline total */}
        <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--r-sm)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-700)' }}>Total Pipeline Value</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--emerald)' }}>${(totalValue / 1000).toFixed(0)}K</span>
        </div>
      </div>
    </div>
  )
}
