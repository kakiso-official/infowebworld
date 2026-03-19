import { useState } from 'react'
import { funnelSteps } from '../../../data/dashboard/overviewData'

const overallConv = ((funnelSteps[funnelSteps.length - 1].value / funnelSteps[0].value) * 100).toFixed(2)

const stageDurations = ['—', '~1.1 days', '~0.8 days', '~2.3 days', '~4.2 days']

export default function ConversionFunnel() {
  const [hoveredStep, setHoveredStep] = useState(null)

  return (
    <div className="db-card">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
          Conversion Funnel
        </div>
      </div>
      <div className="db-card-body">
        {/* Summary Header */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 16px',
          marginBottom: 18, padding: '10px 14px', background: 'var(--gray-50)',
          borderRadius: 8, borderLeft: '3px solid var(--coral)'
        }}>
          <span style={{ fontSize: 12, color: 'var(--gray-600)', fontWeight: 500 }}>
            Overall Conversion: <strong style={{ color: 'var(--coral)' }}>{overallConv}%</strong>
          </span>
          <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>
            ({funnelSteps[funnelSteps.length - 1].value} of {funnelSteps[0].value.toLocaleString()})
          </span>
        </div>

        {/* Funnel Steps */}
        {funnelSteps.map((step, i) => {
          const prevValue = i > 0 ? funnelSteps[i - 1].value : null
          const dropOff = prevValue !== null ? prevValue - step.value : 0
          const convFromPrev = prevValue !== null ? ((step.value / prevValue) * 100).toFixed(1) : null
          const barWidth = Math.max(step.pct, 12)

          return (
            <div key={step.label}>
              {/* Arrow Connector between steps */}
              {i > 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '3px 0', position: 'relative'
                }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" style={{ color: 'var(--gray-300)' }}>
                    <path d="M7 2 L7 10 M3 7 L7 11 L11 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {/* Drop-off indicator */}
                  <span style={{
                    position: 'absolute', right: 0, fontSize: 10,
                    color: 'var(--coral)', fontWeight: 500, opacity: 0.75,
                    display: 'flex', alignItems: 'center', gap: 3
                  }}>
                    <span style={{
                      display: 'inline-block', width: 6, height: 6,
                      borderRadius: '50%', background: 'var(--coral)', opacity: 0.5
                    }} />
                    -{dropOff.toLocaleString()} lost
                  </span>
                </div>
              )}

              <div
                className="db-funnel-step"
                style={{ position: 'relative', cursor: 'default' }}
                onMouseEnter={() => setHoveredStep(i)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div className="db-funnel-bar-wrap" style={{ position: 'relative', overflow: 'hidden' }}>
                  <div className="db-funnel-bar" style={{
                    width: `${barWidth}%`,
                    background: `linear-gradient(90deg, ${step.color}, ${step.color}88)`,
                    transition: 'width .4s ease, opacity .2s',
                    opacity: hoveredStep === i ? 1 : 0.82
                  }} />
                </div>
                <div className="db-funnel-info" style={{ position: 'relative' }}>
                  <span className="db-funnel-label">{step.label}</span>
                  <span className="db-funnel-value">{step.value.toLocaleString()}</span>
                  {i > 0 && (
                    <span className="db-funnel-conv" style={{
                      background: 'var(--gray-50)', padding: '2px 7px',
                      borderRadius: 10, fontSize: 10, fontWeight: 600,
                      color: 'var(--gray-600)', border: '1px solid var(--gray-150, var(--gray-100))'
                    }}>
                      {convFromPrev}% from prev
                    </span>
                  )}
                </div>

                {/* Hover tooltip with stage duration */}
                {hoveredStep === i && (
                  <div style={{
                    position: 'absolute', top: -36, left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--gray-800)', color: '#fff', borderRadius: 6,
                    padding: '5px 10px', fontSize: 10, whiteSpace: 'nowrap', zIndex: 10,
                    boxShadow: '0 4px 12px rgba(0,0,0,.15)', pointerEvents: 'none'
                  }}>
                    Stage Duration: {stageDurations[i]}
                    <div style={{
                      position: 'absolute', bottom: -4, left: '50%',
                      transform: 'translateX(-50%) rotate(45deg)',
                      width: 8, height: 8, background: 'var(--gray-800)'
                    }} />
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Footer */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8,
          marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--gray-100)',
          fontSize: 11, color: 'var(--gray-400)'
        }}>
          <span>
            Avg. Time to Convert: <strong style={{ color: 'var(--gray-600)' }}>4.2 days</strong>
          </span>
          <span>
            Funnel Velocity: <strong style={{ color: 'var(--emerald)' }}>&#8593;12% vs last month</strong>
          </span>
        </div>
      </div>
    </div>
  )
}
