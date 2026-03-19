import { plans } from '../../../data/dashboard/billingData'

export default function PlanComparison() {
  return (
    <div className="db-card db-full" style={{ marginBottom: 24 }}>
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
          Compare Plans
        </div>
      </div>
      <div className="db-card-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {plans.map(p => (
            <div key={p.name} style={{ padding: 20, borderRadius: 'var(--r)', border: p.current ? '2px solid var(--accent)' : '1px solid var(--gray-200)', background: p.current ? 'var(--accent-soft)' : '#fff', position: 'relative' }}>
              {p.current && <span style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#fff', fontSize: 10, fontWeight: 600, padding: '2px 10px', borderRadius: 10 }}>Current</span>}
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 2 }}>{p.name}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent)', marginBottom: 16 }}>{p.price}</div>
              {p.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--gray-600)', marginBottom: 6 }}>
                  <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'var(--emerald)', fill: 'none', strokeWidth: 2, flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg>
                  {f}
                </div>
              ))}
              <button className={`db-btn ${p.current ? 'db-btn--outline' : 'db-btn--primary'}`} style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
                {p.current ? 'Current Plan' : `Choose ${p.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
