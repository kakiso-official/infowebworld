import { useState } from 'react'
import { Link } from 'react-router-dom'
import { performanceDays, maxView } from '../../../data/dashboard/overviewData'

const totalViews = performanceDays.reduce((sum, d) => sum + d.views, 0)
const totalClicks = performanceDays.reduce((sum, d) => sum + d.clicks, 0)
const avgCTR = ((totalClicks / totalViews) * 100).toFixed(1)
const avgDaily = Math.round(totalViews / performanceDays.length)
const bestDay = performanceDays.reduce((best, d) => d.views > best.views ? d : best, performanceDays[0])
const bestDayIndex = performanceDays.indexOf(bestDay)

const yLabels = [0, 200, 400, 600, 800]

export default function PerformanceChart() {
  const [chartHover, setChartHover] = useState(null)

  return (
    <div className="db-card">
      <div className="db-card-header">
        <div className="db-card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
          14-Day Performance
        </div>
        <Link to="/dashboard/analytics" className="db-card-action">Full Analytics</Link>
      </div>
      <div className="db-card-body">
        {/* Summary Row */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '8px 20px', marginBottom: 16,
          padding: '10px 14px', background: 'var(--gray-50)', borderRadius: 8,
          borderLeft: '3px solid var(--accent)'
        }}>
          <span style={{ fontSize: 12, color: 'var(--gray-600)', fontWeight: 500 }}>
            Total Views: <strong style={{ color: 'var(--gray-800)' }}>{totalViews.toLocaleString()}</strong>
          </span>
          <span style={{ fontSize: 12, color: 'var(--gray-600)', fontWeight: 500 }}>
            Total Clicks: <strong style={{ color: 'var(--gray-800)' }}>{totalClicks.toLocaleString()}</strong>
          </span>
          <span style={{ fontSize: 12, color: 'var(--gray-600)', fontWeight: 500 }}>
            Avg CTR: <strong style={{ color: 'var(--emerald)' }}>{avgCTR}%</strong>
          </span>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--gray-500)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--accent)', display: 'inline-block' }} /> Views
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--gray-500)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--emerald)', display: 'inline-block' }} /> Clicks
          </span>
          {chartHover !== null && (
            <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 500, color: 'var(--gray-700)' }}>
              {performanceDays[chartHover].day}: {performanceDays[chartHover].views} views, {performanceDays[chartHover].clicks} clicks
            </span>
          )}
        </div>

        {/* Chart Area */}
        <div style={{ display: 'flex', minHeight: 180, position: 'relative' }}>
          {/* Y-Axis Labels */}
          <div style={{
            display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-between',
            paddingBottom: 20, paddingRight: 8, width: 32, flexShrink: 0
          }}>
            {yLabels.map(v => (
              <span key={v} style={{
                fontSize: 9, color: 'var(--gray-400)', fontWeight: 400, lineHeight: 1,
                textAlign: 'right', position: 'relative', top: 3
              }}>{v}</span>
            ))}
          </div>

          {/* Chart Body with Grid Lines */}
          <div style={{ flex: 1, position: 'relative' }}>
            {/* Horizontal Grid Lines */}
            {yLabels.map((v, i) => (
              <div key={v} style={{
                position: 'absolute', left: 0, right: 0,
                bottom: `calc(${(v / 800) * 100}% + 20px)`,
                borderBottom: '1px dashed var(--gray-100)',
                zIndex: 0
              }} />
            ))}

            {/* Bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 160, position: 'relative', zIndex: 1 }}>
              {performanceDays.map((d, i) => {
                const isBest = i === bestDayIndex
                const ctr = ((d.clicks / d.views) * 100).toFixed(1)
                return (
                  <div key={i} style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 2, cursor: 'pointer', position: 'relative'
                  }}
                    onMouseEnter={() => setChartHover(i)}
                    onMouseLeave={() => setChartHover(null)}
                  >
                    {/* Floating Tooltip Card */}
                    {chartHover === i && (
                      <div style={{
                        position: 'absolute', bottom: `calc(${(d.views / maxView) * 100}% + 12px)`,
                        left: '50%', transform: 'translateX(-50%)',
                        background: 'var(--gray-800)', color: '#fff', borderRadius: 8,
                        padding: '8px 11px', fontSize: 11, lineHeight: 1.6,
                        whiteSpace: 'nowrap', zIndex: 20,
                        boxShadow: '0 4px 16px rgba(0,0,0,.2)',
                        pointerEvents: 'none'
                      }}>
                        <div style={{ fontWeight: 600, marginBottom: 2, color: 'var(--gray-200)' }}>{d.day}</div>
                        <div>Views: <strong>{d.views}</strong></div>
                        <div>Clicks: <strong>{d.clicks}</strong></div>
                        <div>CTR: <strong style={{ color: '#6ee7b7' }}>{ctr}%</strong></div>
                        <div style={{
                          position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%) rotate(45deg)',
                          width: 8, height: 8, background: 'var(--gray-800)'
                        }} />
                      </div>
                    )}

                    <div style={{
                      display: 'flex', gap: 1, alignItems: 'flex-end', width: '100%', height: 140,
                      ...(isBest ? {
                        borderRadius: 4,
                        boxShadow: '0 0 8px rgba(99,102,241,.25)',
                        background: 'rgba(99,102,241,.04)',
                        padding: '0 1px'
                      } : {})
                    }}>
                      <div style={{
                        flex: 1,
                        height: `${(d.views / maxView) * 100}%`,
                        background: isBest
                          ? 'linear-gradient(to top, var(--accent), rgba(99,102,241,.7))'
                          : 'var(--accent)',
                        borderRadius: '3px 3px 0 0',
                        opacity: chartHover === i ? 1 : isBest ? 0.85 : 0.5,
                        transition: 'opacity .15s, box-shadow .15s',
                        ...(isBest ? { boxShadow: '0 -2px 8px rgba(99,102,241,.3)' } : {})
                      }} />
                      <div style={{
                        flex: 1,
                        height: `${(d.clicks / maxView) * 100}%`,
                        background: isBest
                          ? 'linear-gradient(to top, var(--emerald), rgba(52,211,153,.7))'
                          : 'var(--emerald)',
                        borderRadius: '3px 3px 0 0',
                        opacity: chartHover === i ? 1 : isBest ? 0.85 : 0.5,
                        transition: 'opacity .15s'
                      }} />
                    </div>
                    {i % 2 === 0 && (
                      <span style={{
                        fontSize: 9, color: isBest ? 'var(--accent)' : 'var(--gray-400)',
                        fontWeight: isBest ? 600 : 300, whiteSpace: 'nowrap'
                      }}>{d.day.replace('Mar ', '')}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8,
          marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--gray-100)',
          fontSize: 11, color: 'var(--gray-400)'
        }}>
          <span>
            Best Day: <strong style={{ color: 'var(--accent)' }}>{bestDay.day}</strong> ({bestDay.views} views)
          </span>
          <span>
            Avg Daily: <strong style={{ color: 'var(--gray-600)' }}>{avgDaily.toLocaleString()} views</strong>
          </span>
        </div>
      </div>
    </div>
  )
}
