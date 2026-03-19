import { topSearchTerms } from '../../../data/dashboard/analyticsData'
import Sparkline from '../shared/Sparkline'

export default function TopSearchTerms() {
  return (
    <div className="db-card">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          Top Search Terms
        </div>
        <span className="db-card-action">View all</span>
      </div>
      <div className="db-card-body" style={{ padding: '4px 20px' }}>
        {topSearchTerms.map((t, i) => (
          <div key={t.term} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < topSearchTerms.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, background: i < 3 ? 'var(--accent-soft)' : 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: i < 3 ? 'var(--accent)' : 'var(--gray-500)', flexShrink: 0 }}>{i + 1}</span>
            <span style={{ flex: 1, fontSize: 12.5, fontWeight: 400, color: 'var(--gray-700)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.term}</span>
            <Sparkline data={t.spark} color={t.change >= 0 ? 'var(--emerald)' : 'var(--coral)'} width={50} height={18} />
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray-500)', minWidth: 30, textAlign: 'right' }}>{t.count}</span>
            <span className={`db-stat-change ${t.change >= 0 ? 'db-stat-change--up' : 'db-stat-change--down'}`} style={{ fontSize: 9, padding: '1px 5px' }}>
              {t.change >= 0 ? '+' : ''}{t.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
