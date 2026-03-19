import { growthTips } from '../../../data/dashboard/overviewData'

export default function GrowthTips() {
  const totalTime = growthTips.reduce((a, t) => a + parseInt(t.time.replace(/\D/g, '')), 0)

  const ImpactDots = ({ score }) => (
    <span style={{ display: 'inline-flex', gap: 3 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: i < score ? 'var(--accent)' : 'var(--gray-200)',
            transition: 'background .2s ease',
          }}
        />
      ))}
    </span>
  )

  return (
    <div className="db-card db-full">
      <div className="db-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
          Growth Recommendations
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="1.5" width="13" height="13"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /></svg>
            {growthTips.length} Recommendations
          </span>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="1.5" width="13" height="13"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            Est. {totalTime} min total
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="2" width="13" height="13"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
            +45% potential improvement
          </span>
        </div>
      </div>
      <div className="db-card-body" style={{ padding: 0 }}>
        <div className="db-tips-grid">
          {growthTips.map(tip => {
            const isHigh = tip.impact === 'High'
            return (
              <div
                key={tip.title}
                className="db-tip"
                style={{
                  borderLeft: `3px solid ${tip.color}`,
                  background: isHigh ? 'rgba(99,102,241,.02)' : 'transparent',
                  borderRadius: '0 8px 8px 0',
                  padding: '14px 14px 12px 14px',
                  position: 'relative',
                }}
              >
                {/* Top row: icon + content + time badge */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                  <div className="db-tip-icon" style={{ background: tip.color, flexShrink: 0 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{tip.icon}</svg>
                  </div>
                  <div className="db-tip-content" style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <div className="db-tip-title" style={{ flex: 1 }}>{tip.title}</div>
                      <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-400)', background: 'var(--gray-100)', padding: '2px 7px', borderRadius: 10, flexShrink: 0, whiteSpace: 'nowrap' }}>
                        {tip.time}
                      </span>
                    </div>
                    <div className="db-tip-desc">{tip.desc}</div>
                  </div>
                </div>

                {/* Bottom row: impact + progress + CTA */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 42, flexWrap: 'wrap' }}>
                  {/* Impact score */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Impact</span>
                    <ImpactDots score={tip.impactScore} />
                  </div>

                  {/* Progress bar if applicable */}
                  {tip.progress && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 100 }}>
                      <div style={{ flex: 1, maxWidth: 80, height: 4, background: 'var(--gray-100)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(tip.progress.current / tip.progress.total) * 100}%`, background: tip.color, borderRadius: 2, transition: 'width .3s ease' }} />
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--gray-400)', whiteSpace: 'nowrap' }}>{tip.progress.current}/{tip.progress.total}</span>
                    </div>
                  )}

                  {/* Badge */}
                  <span
                    className={`db-badge-pill ${isHigh ? 'db-badge--active' : tip.impact === 'Medium' ? 'db-badge--pending' : 'db-badge--inactive'}`}
                    style={{ marginLeft: tip.progress ? 0 : 'auto' }}
                  >
                    {tip.impact}
                  </span>

                  {/* CTA button */}
                  <button
                    type="button"
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: tip.color,
                      background: 'none',
                      border: `1.5px solid ${tip.color}`,
                      borderRadius: 6,
                      padding: '4px 10px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      transition: 'background .15s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = `color-mix(in srgb, ${tip.color} 8%, transparent)`}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    {tip.cta}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11"><polyline points="9 18 15 12 9 6" /></svg>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
