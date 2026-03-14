import { useState } from 'react'
import DashboardLayout from '../components/dashboard/DashboardLayout'

/* ── Sparkline component ── */
function Spark({ data, color = 'var(--accent)', w = 80, h = 28 }) {
  const max = Math.max(...data), min = Math.min(...data)
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * (h - 4) - 2}`).join(' ')
  const area = `${pts} ${w},${h} 0,${h}`
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <defs><linearGradient id={`sg-${color.replace(/[^a-z0-9]/gi, '')}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".25" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <polygon points={area} fill={`url(#sg-${color.replace(/[^a-z0-9]/gi, '')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Data ── */
const stats = [
  { label: 'Total Views', value: '38,421', change: '+22.4%', up: true, gradient: 'linear-gradient(135deg,var(--accent),var(--plum))', spark: [18,22,19,28,25,32,30,38,35,42,40,48,45,52], icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z|M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },
  { label: 'Unique Visitors', value: '12,847', change: '+18.2%', up: true, gradient: 'linear-gradient(135deg,var(--azure),var(--accent))', spark: [8,12,10,15,13,18,16,20,19,22,21,24,23,26], icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2|M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z|M23 21v-2a4 4 0 0 0-3-3.87|M16 3.13a4 4 0 0 1 0 7.75' },
  { label: 'Avg. Session', value: '2m 34s', change: '+8.1%', up: true, gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))', spark: [100,115,108,125,118,132,128,140,135,148,142,155,150,160], icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z|M12 6v6l4 2' },
  { label: 'Bounce Rate', value: '24.3%', change: '-5.7%', up: true, gradient: 'linear-gradient(135deg,var(--amber),var(--coral))', spark: [38,35,36,32,34,30,31,28,29,26,27,25,26,24], icon: 'M23 6l-9.5 9.5-5-5L1 18' },
]

const daily30 = [
  320,380,410,390,450,480,420,350,310,460,500,520,480,540,560,530,490,470,580,620,600,580,640,670,650,620,700,720,710,680
]
const dailyVisitors30 = [
  180,210,230,220,250,270,240,200,180,260,280,290,270,300,310,300,280,270,320,340,330,320,350,370,360,340,380,400,390,370
]
const dailyLabels = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 1, 13 + i)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
})

const trafficSources = [
  { source: 'Organic Search', value: 16142, pct: 42, color: 'var(--accent)', icon: 'M11 11a8 8 0 1 0 0-16 8 8 0 0 0 0 16z|M21 21l-4.35-4.35' },
  { source: 'Direct Traffic', value: 10758, pct: 28, color: 'var(--emerald)', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3' },
  { source: 'Social Media', value: 6916, pct: 18, color: 'var(--azure)', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
  { source: 'Referral Links', value: 3074, pct: 8, color: 'var(--amber)', icon: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71|M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71' },
  { source: 'Email Campaigns', value: 1531, pct: 4, color: 'var(--plum)', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z|M22 6l-10 7L2 6' },
]

const topSearchTerms = [
  { term: 'cloud security solutions', count: 342, change: +12, spark: [20,25,22,28,30,26,34,38,35,40] },
  { term: 'enterprise cybersecurity', count: 256, change: +8, spark: [15,18,16,20,22,19,24,26,25,28] },
  { term: 'zero trust architecture', count: 198, change: +24, spark: [8,10,12,14,16,20,22,26,28,32] },
  { term: 'business security services', count: 167, change: -3, spark: [18,20,19,17,18,16,17,15,16,14] },
  { term: 'IT security consulting', count: 134, change: +5, spark: [10,11,12,11,13,12,14,13,15,14] },
  { term: 'SOC 2 compliance provider', count: 98, change: +32, spark: [3,5,6,8,10,12,14,16,18,22] },
  { term: 'cloud infrastructure audit', count: 87, change: +15, spark: [5,7,8,7,9,10,12,11,13,14] },
]

const topPages = [
  { page: 'Main Listing Page', views: 8421, sessions: 6240, bounceRate: 18, avgTime: '3:12' },
  { page: 'Reviews Section', views: 5632, sessions: 4180, bounceRate: 22, avgTime: '2:45' },
  { page: 'Contact / Quote Form', views: 3847, sessions: 2850, bounceRate: 31, avgTime: '1:58' },
  { page: 'Photo Gallery', views: 2156, sessions: 1600, bounceRate: 35, avgTime: '1:42' },
  { page: 'About / Team', views: 1890, sessions: 1400, bounceRate: 28, avgTime: '2:15' },
  { page: 'Pricing Page', views: 1245, sessions: 920, bounceRate: 40, avgTime: '1:20' },
]

/* Hour × Day heatmap data (0-23 hours, Mon-Sun) */
const heatmapData = [
  [2,1,0,0,0,1,3,12,28,35,42,38,30,32,40,45,42,35,28,18,12,8,5,3],
  [3,1,1,0,0,2,4,14,30,38,45,40,32,35,42,48,44,38,30,20,14,9,6,4],
  [2,2,0,0,1,2,5,16,32,40,48,44,35,38,46,50,47,40,32,22,15,10,7,3],
  [3,1,1,0,0,1,4,15,34,42,50,46,38,40,48,52,48,42,34,24,16,11,6,4],
  [4,2,1,0,0,2,5,18,36,44,52,48,40,42,50,55,50,44,36,28,20,14,8,5],
  [6,4,2,1,0,1,2,8,16,22,28,32,28,26,24,22,20,18,16,14,12,10,8,6],
  [5,3,2,1,0,0,1,6,12,18,22,26,24,22,20,18,16,14,12,10,8,7,6,4],
]
const heatDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const deviceData = [
  { device: 'Desktop', pct: 52, sessions: 6680, color: 'var(--accent)' },
  { device: 'Mobile', pct: 38, sessions: 4882, color: 'var(--emerald)' },
  { device: 'Tablet', pct: 10, sessions: 1285, color: 'var(--amber)' },
]

const geoData = [
  { country: 'United States', visits: 8420, pct: 65.5, flag: '🇺🇸' },
  { country: 'United Kingdom', visits: 1540, pct: 12.0, flag: '🇬🇧' },
  { country: 'Canada', visits: 980, pct: 7.6, flag: '🇨🇦' },
  { country: 'Germany', visits: 620, pct: 4.8, flag: '🇩🇪' },
  { country: 'Australia', visits: 480, pct: 3.7, flag: '🇦🇺' },
  { country: 'India', visits: 340, pct: 2.6, flag: '🇮🇳' },
  { country: 'Others', visits: 467, pct: 3.8, flag: '🌍' },
]

const conversionGoals = [
  { goal: 'Quote Request Submitted', completions: 847, rate: 6.6, change: +18, color: 'var(--accent)' },
  { goal: 'Contact Form Filled', completions: 623, rate: 4.8, change: +12, color: 'var(--emerald)' },
  { goal: 'Phone Number Clicked', completions: 412, rate: 3.2, change: +8, color: 'var(--azure)' },
  { goal: 'Directions Requested', completions: 256, rate: 2.0, change: -2, color: 'var(--amber)' },
]

const audienceInsights = [
  { label: 'New Visitors', value: '68%', sub: '8,736 users', gradient: 'linear-gradient(135deg,var(--azure),var(--accent))' },
  { label: 'Returning Visitors', value: '32%', sub: '4,111 users', gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))' },
  { label: 'Pages / Session', value: '3.4', sub: '+0.6 vs last month', gradient: 'linear-gradient(135deg,var(--plum),var(--rose))' },
  { label: 'Avg. Visit Duration', value: '2:34', sub: '+18s vs last month', gradient: 'linear-gradient(135deg,var(--amber),var(--coral))' },
]

const browserData = [
  { name: 'Chrome', pct: 58 },
  { name: 'Safari', pct: 22 },
  { name: 'Firefox', pct: 10 },
  { name: 'Edge', pct: 7 },
  { name: 'Other', pct: 3 },
]

const referrers = [
  { site: 'google.com', visits: 5420, trend: 'up' },
  { site: 'linkedin.com', visits: 1840, trend: 'up' },
  { site: 'twitter.com', visits: 980, trend: 'down' },
  { site: 'techcrunch.com', visits: 640, trend: 'up' },
  { site: 'producthunt.com', visits: 420, trend: 'up' },
  { site: 'reddit.com', visits: 380, trend: 'down' },
]

export default function DashboardAnalyticsPage() {
  const [chartRange, setChartRange] = useState('30d')
  const [hoveredBar, setHoveredBar] = useState(null)

  const maxViews = Math.max(...daily30)
  const totalSrcPct = trafficSources.reduce((a, s) => a + s.pct, 0)
  let srcAcc = 0

  /* Heatmap color */
  const heatMax = Math.max(...heatmapData.flat())
  const heatColor = (v) => {
    if (v === 0) return 'var(--gray-50)'
    const intensity = v / heatMax
    if (intensity < 0.25) return 'rgba(108,114,241,.1)'
    if (intensity < 0.5) return 'rgba(108,114,241,.25)'
    if (intensity < 0.75) return 'rgba(108,114,241,.5)'
    return 'rgba(108,114,241,.8)'
  }

  return (
    <DashboardLayout title="Analytics" subtitle="Deep performance insights">
      {/* ═══ Real-time Banner ═══ */}
      <div className="db-welcome">
        <div className="db-welcome-bg" />
        <div className="db-welcome-content">
          <div className="db-welcome-text">
            <div className="db-welcome-title">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span className="an-pulse" />
                Real-Time Analytics
              </span>
            </div>
            <div className="db-welcome-desc">
              <strong>23 active visitors</strong> on your listing right now. Peak hour today was <strong>2:00 PM</strong> with 67 concurrent visitors. Your listing is trending <strong>22% higher</strong> than the same day last week.
            </div>
            <div className="db-welcome-actions">
              <button className="db-btn" style={{ background: '#fff', color: 'var(--accent)' }}>Export Report</button>
              <button className="db-btn" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', border: '1px solid rgba(255,255,255,.25)' }}>Schedule Email</button>
            </div>
          </div>
          <div className="db-welcome-stats-mini">
            <div className="db-welcome-stat-pill"><span className="db-welcome-stat-dot" style={{ background: '#4ade80' }} /> 23 live visitors</div>
            <div className="db-welcome-stat-pill"><span className="db-welcome-stat-dot" style={{ background: '#facc15' }} /> 847 today's views</div>
            <div className="db-welcome-stat-pill"><span className="db-welcome-stat-dot" style={{ background: '#38bdf8' }} /> 12 conversions today</div>
          </div>
        </div>
      </div>

      {/* ═══ Enhanced Stat Cards ═══ */}
      <div className="db-stats">
        {stats.map(s => (
          <div className="db-stat" key={s.label} style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
              <div className="db-stat-icon" style={{ background: s.gradient }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  {s.icon.split('|').map((d, i) => <path key={i} d={d} />)}
                </svg>
              </div>
              <Spark data={s.spark} color={s.up ? 'var(--emerald)' : 'var(--coral)'} />
            </div>
            <div className="db-stat-value">{s.value}</div>
            <div className="db-stat-label">{s.label}</div>
            <div className={`db-stat-change ${s.up ? 'db-stat-change--up' : 'db-stat-change--down'}`}>
              <svg viewBox="0 0 24 24">{s.up ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}</svg>
              {s.change} vs last month
            </div>
          </div>
        ))}
      </div>

      {/* ═══ Audience Insights Mini Cards ═══ */}
      <div className="db-stats" style={{ marginBottom: 24 }}>
        {audienceInsights.map(a => (
          <div key={a.label} style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--r)', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--r-sm)', background: a.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{a.value}</span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)' }}>{a.label}</div>
              <div style={{ fontSize: 11, fontWeight: 300, color: 'var(--gray-400)' }}>{a.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ 30-Day Traffic Chart ═══ */}
      <div className="db-card db-full">
        <div className="db-card-header">
          <div className="db-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            Traffic Overview
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[{ k: '7d', l: '7D' }, { k: '30d', l: '30D' }].map(r => (
              <button key={r.k} className={`db-btn ${chartRange === r.k ? 'db-btn--primary' : 'db-btn--outline'}`} style={{ padding: '4px 12px', fontSize: 11 }} onClick={() => setChartRange(r.k)}>
                {r.l}
              </button>
            ))}
          </div>
        </div>
        <div className="db-card-body" style={{ padding: '20px 20px 12px' }}>
          {/* Legend */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--gray-500)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--accent)', display: 'inline-block' }} /> Page Views
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--gray-500)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--emerald)', display: 'inline-block' }} /> Unique Visitors
            </span>
            <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 500, color: 'var(--gray-800)' }}>
              Total: <strong>38,421</strong> views &middot; <strong>12,847</strong> visitors
            </span>
          </div>
          {/* Y-axis labels + chart */}
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: 24, width: 36 }}>
              {[maxViews, Math.round(maxViews * 0.75), Math.round(maxViews * 0.5), Math.round(maxViews * 0.25), 0].map(v => (
                <span key={v} style={{ fontSize: 9, color: 'var(--gray-400)', fontWeight: 300, textAlign: 'right' }}>{v}</span>
              ))}
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              {/* Grid lines */}
              <div style={{ position: 'absolute', inset: 0, bottom: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
                {[0,1,2,3,4].map(i => <div key={i} style={{ borderBottom: '1px solid var(--gray-100)', width: '100%' }} />)}
              </div>
              {/* Bars */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: chartRange === '7d' ? 8 : 3, height: 200, position: 'relative' }}>
                {(chartRange === '7d' ? daily30.slice(-7) : daily30).map((v, i) => {
                  const visitors = chartRange === '7d' ? dailyVisitors30.slice(-7)[i] : dailyVisitors30[i]
                  const label = chartRange === '7d' ? dailyLabels.slice(-7)[i] : dailyLabels[i]
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, height: '100%', justifyContent: 'flex-end', position: 'relative', cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
                      {/* Tooltip */}
                      {hoveredBar === i && (
                        <div style={{ position: 'absolute', bottom: '100%', marginBottom: 8, background: 'var(--gray-900)', color: '#fff', padding: '6px 10px', borderRadius: 6, fontSize: 11, whiteSpace: 'nowrap', zIndex: 10, fontWeight: 400, lineHeight: 1.6, boxShadow: '0 4px 12px rgba(0,0,0,.2)' }}>
                          <div style={{ fontWeight: 600 }}>{label}</div>
                          <div>Views: {v}</div>
                          <div>Visitors: {visitors}</div>
                          <div style={{ position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8, background: 'var(--gray-900)', rotate: '45deg' }} />
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 1, alignItems: 'flex-end', width: '100%' }}>
                        <div style={{ flex: 1, height: `${(v / maxViews) * 176}px`, background: hoveredBar === i ? 'var(--accent)' : 'var(--accent)', borderRadius: '2px 2px 0 0', opacity: hoveredBar === i ? .9 : .55, transition: 'all .2s' }} />
                        <div style={{ flex: 1, height: `${(visitors / maxViews) * 176}px`, background: hoveredBar === i ? 'var(--emerald)' : 'var(--emerald)', borderRadius: '2px 2px 0 0', opacity: hoveredBar === i ? .9 : .55, transition: 'all .2s' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
              {/* X-axis labels */}
              <div style={{ display: 'flex', gap: chartRange === '7d' ? 8 : 3, marginTop: 6 }}>
                {(chartRange === '7d' ? dailyLabels.slice(-7) : dailyLabels.filter((_, i) => i % (chartRange === '7d' ? 1 : 5) === 0)).map((l, i) => (
                  <span key={i} style={{ flex: chartRange === '7d' ? 1 : 5, fontSize: 9, color: 'var(--gray-400)', textAlign: 'center', fontWeight: 300 }}>{l}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="db-grid-2">
        {/* ═══ Traffic Sources Donut ═══ */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              Traffic Sources
            </div>
            <span className="db-card-action">38,421 total</span>
          </div>
          <div className="db-card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20 }}>
              {/* Donut */}
              <svg width="130" height="130" viewBox="0 0 130 130" style={{ flexShrink: 0 }}>
                {trafficSources.map((s) => {
                  const startAngle = (srcAcc / totalSrcPct) * 360
                  srcAcc += s.pct
                  const endAngle = (srcAcc / totalSrcPct) * 360
                  const startRad = ((startAngle - 90) * Math.PI) / 180
                  const endRad = ((endAngle - 90) * Math.PI) / 180
                  const r = 52, cx = 65, cy = 65
                  const x1 = cx + r * Math.cos(startRad), y1 = cy + r * Math.sin(startRad)
                  const x2 = cx + r * Math.cos(endRad), y2 = cy + r * Math.sin(endRad)
                  const large = endAngle - startAngle > 180 ? 1 : 0
                  return <path key={s.source} d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`} fill={s.color} opacity=".75" />
                })}
                <circle cx="65" cy="65" r="32" fill="#fff" />
                <text x="65" y="62" textAnchor="middle" fontSize="16" fontWeight="700" fill="var(--gray-900)">42%</text>
                <text x="65" y="76" textAnchor="middle" fontSize="9" fill="var(--gray-400)" fontWeight="300">Organic</text>
              </svg>
              {/* Legend */}
              <div style={{ flex: 1 }}>
                {trafficSources.map(s => (
                  <div key={s.source} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 12, fontWeight: 400, color: 'var(--gray-600)' }}>{s.source}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-800)' }}>{s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Source detail bars */}
            {trafficSources.map(s => (
              <div key={s.source} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 400, color: 'var(--gray-600)' }}>{s.source}</span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray-500)' }}>{s.value.toLocaleString()}</span>
                </div>
                <div style={{ height: 5, background: 'var(--gray-100)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.pct * 2.38}%`, background: s.color, borderRadius: 3, opacity: .7 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ Conversion Goals ═══ */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              Conversion Goals
            </div>
            <span className="db-card-action">2,138 total</span>
          </div>
          <div className="db-card-body">
            {conversionGoals.map(g => (
              <div key={g.goal} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)' }}>{g.goal}</span>
                  <span className={`db-stat-change ${g.change >= 0 ? 'db-stat-change--up' : 'db-stat-change--down'}`} style={{ fontSize: 10 }}>
                    <svg viewBox="0 0 24 24">{g.change >= 0 ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}</svg>
                    {g.change >= 0 ? '+' : ''}{g.change}%
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                  <div style={{ flex: 1, height: 8, background: 'var(--gray-100)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${g.rate * 10}%`, background: g.color, borderRadius: 4, opacity: .7 }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-800)', minWidth: 42, textAlign: 'right' }}>{g.rate}%</span>
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 11, fontWeight: 300, color: 'var(--gray-400)' }}>
                  <span>{g.completions.toLocaleString()} completions</span>
                  <span>Conversion rate: {g.rate}%</span>
                </div>
              </div>
            ))}
            {/* Total conversion summary */}
            <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--r-sm)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-700)' }}>Overall Conversion Rate</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>16.6%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Hourly Activity Heatmap ═══ */}
      <div className="db-card db-full">
        <div className="db-card-header">
          <div className="db-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
            Activity Heatmap
          </div>
          <span className="db-card-action">Visitors by hour &times; day</span>
        </div>
        <div className="db-card-body" style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 600 }}>
            {/* Hour labels */}
            <div style={{ display: 'flex', marginLeft: 40, marginBottom: 4 }}>
              {Array.from({ length: 24 }, (_, i) => (
                <span key={i} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: 'var(--gray-400)', fontWeight: 300 }}>
                  {i % 3 === 0 ? `${i}h` : ''}
                </span>
              ))}
            </div>
            {/* Heatmap rows */}
            {heatmapData.map((row, di) => (
              <div key={di} style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 2 }}>
                <span style={{ width: 36, fontSize: 10, color: 'var(--gray-500)', fontWeight: 400, textAlign: 'right', paddingRight: 6 }}>{heatDays[di]}</span>
                <div style={{ display: 'flex', flex: 1, gap: 2 }}>
                  {row.map((v, hi) => (
                    <div key={hi} style={{ flex: 1, aspectRatio: '1', borderRadius: 3, background: heatColor(v), transition: 'all .2s', cursor: 'pointer', position: 'relative', minHeight: 16 }} title={`${heatDays[di]} ${hi}:00 — ${v} visitors`} />
                  ))}
                </div>
              </div>
            ))}
            {/* Scale */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 40, marginTop: 8 }}>
              <span style={{ fontSize: 9, color: 'var(--gray-400)' }}>Less</span>
              {[.05, .15, .3, .55, .8].map((o, i) => (
                <div key={i} style={{ width: 14, height: 14, borderRadius: 3, background: `rgba(108,114,241,${o})` }} />
              ))}
              <span style={{ fontSize: 9, color: 'var(--gray-400)' }}>More</span>
            </div>
          </div>
        </div>
      </div>

      <div className="db-grid-2">
        {/* ═══ Top Search Terms ═══ */}
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
                <Spark data={t.spark} color={t.change >= 0 ? 'var(--emerald)' : 'var(--coral)'} w={50} h={18} />
                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray-500)', minWidth: 30, textAlign: 'right' }}>{t.count}</span>
                <span className={`db-stat-change ${t.change >= 0 ? 'db-stat-change--up' : 'db-stat-change--down'}`} style={{ fontSize: 9, padding: '1px 5px' }}>
                  {t.change >= 0 ? '+' : ''}{t.change}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ Top Pages Table ═══ */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
              Top Pages
            </div>
            <span className="db-card-action">View all</span>
          </div>
          <div className="db-card-body" style={{ padding: 0, overflowX: 'auto' }}>
            <table className="db-table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Views</th>
                  <th>Bounce</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map(p => (
                  <tr key={p.page}>
                    <td className="db-table-name">{p.page}</td>
                    <td>{p.views.toLocaleString()}</td>
                    <td>
                      <span style={{ color: p.bounceRate > 30 ? 'var(--coral)' : 'var(--emerald)', fontWeight: 500 }}>{p.bounceRate}%</span>
                    </td>
                    <td>{p.avgTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="db-grid-2">
        {/* ═══ Device Breakdown ═══ */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
              Devices & Browsers
            </div>
          </div>
          <div className="db-card-body">
            <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
              {/* Device bars */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 12 }}>Devices</div>
                {deviceData.map(d => (
                  <div key={d.device} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 400, color: 'var(--gray-700)' }}>{d.device}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-800)' }}>{d.pct}%</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--gray-100)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${d.pct}%`, background: d.color, borderRadius: 4, opacity: .65 }} />
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 300, color: 'var(--gray-400)', marginTop: 2 }}>{d.sessions.toLocaleString()} sessions</div>
                  </div>
                ))}
              </div>
              {/* Browser bars */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 12 }}>Browsers</div>
                {browserData.map(b => (
                  <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ width: 52, fontSize: 12, fontWeight: 400, color: 'var(--gray-600)' }}>{b.name}</span>
                    <div style={{ flex: 1, height: 6, background: 'var(--gray-100)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${b.pct}%`, background: 'var(--accent)', borderRadius: 3, opacity: 0.3 + (b.pct / 100) * 0.6 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray-500)', minWidth: 30, textAlign: 'right' }}>{b.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Geographic Breakdown ═══ */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              Top Locations
            </div>
          </div>
          <div className="db-card-body" style={{ padding: '4px 20px' }}>
            {geoData.map((g, i) => (
              <div key={g.country} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < geoData.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{g.flag}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 400, color: 'var(--gray-700)' }}>{g.country}</span>
                    <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray-500)' }}>{g.visits.toLocaleString()}</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--gray-100)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${g.pct}%`, background: 'var(--accent)', borderRadius: 2, opacity: 0.4 + (g.pct / 100) * 0.5 }} />
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-800)', minWidth: 36, textAlign: 'right' }}>{g.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="db-grid-2">
        {/* ═══ Top Referrers ═══ */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
              Top Referrers
            </div>
          </div>
          <div className="db-card-body" style={{ padding: '4px 20px' }}>
            {referrers.map((r, i) => (
              <div key={r.site} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < referrers.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-500)' }}>{r.site[0].toUpperCase()}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--gray-700)' }}>{r.site}</div>
                  <div style={{ fontSize: 10, fontWeight: 300, color: 'var(--gray-400)' }}>{r.visits.toLocaleString()} visits</div>
                </div>
                <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: r.trend === 'up' ? 'var(--emerald)' : 'var(--coral)', fill: 'none', strokeWidth: 2 }}>
                  {r.trend === 'up' ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ Engagement Metrics ═══ */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
              Engagement Deep-Dive
            </div>
          </div>
          <div className="db-card-body">
            {[
              { label: 'Scroll Depth', value: '72%', desc: 'Average of all visitors', bar: 72, color: 'var(--accent)' },
              { label: 'Click-Through Rate', value: '8.4%', desc: 'From listing to action', bar: 84, color: 'var(--emerald)' },
              { label: 'Photo Gallery Views', value: '43%', desc: 'Visitors who view photos', bar: 43, color: 'var(--azure)' },
              { label: 'Review Section Reach', value: '67%', desc: 'Visitors reaching reviews', bar: 67, color: 'var(--plum)' },
              { label: 'Contact Form Visibility', value: '58%', desc: 'Visitors seeing the form', bar: 58, color: 'var(--amber)' },
            ].map(m => (
              <div key={m.label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--gray-700)' }}>{m.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>{m.value}</span>
                </div>
                <div style={{ height: 6, background: 'var(--gray-100)', borderRadius: 3, overflow: 'hidden', marginBottom: 2 }}>
                  <div style={{ height: '100%', width: `${m.bar}%`, background: m.color, borderRadius: 3, opacity: .65 }} />
                </div>
                <div style={{ fontSize: 10, fontWeight: 300, color: 'var(--gray-400)' }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Performance Comparison ═══ */}
      <div className="db-card db-full">
        <div className="db-card-header">
          <div className="db-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></svg>
            Period Comparison
          </div>
          <span className="db-card-action">This month vs. last month</span>
        </div>
        <div className="db-card-body" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="db-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>This Month</th>
                <th>Last Month</th>
                <th>Change</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {[
                { metric: 'Page Views', curr: '38,421', prev: '31,380', change: '+22.4%', up: true, spark: [18,22,19,28,25,32,30,38] },
                { metric: 'Unique Visitors', curr: '12,847', prev: '10,870', change: '+18.2%', up: true, spark: [8,12,10,15,13,18,16,20] },
                { metric: 'Avg. Session Duration', curr: '2m 34s', prev: '2m 22s', change: '+8.1%', up: true, spark: [100,115,108,125,118,132,128,140] },
                { metric: 'Bounce Rate', curr: '24.3%', prev: '25.8%', change: '-5.7%', up: true, spark: [30,28,29,27,26,25,25,24] },
                { metric: 'Conversion Rate', curr: '16.6%', prev: '14.2%', change: '+16.9%', up: true, spark: [10,11,12,12,13,14,15,17] },
                { metric: 'Quote Requests', curr: '847', prev: '718', change: '+18.0%', up: true, spark: [50,55,60,58,65,70,72,80] },
                { metric: 'Phone Clicks', curr: '412', prev: '381', change: '+8.1%', up: true, spark: [30,32,34,33,35,37,38,42] },
              ].map(r => (
                <tr key={r.metric}>
                  <td className="db-table-name">{r.metric}</td>
                  <td style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{r.curr}</td>
                  <td>{r.prev}</td>
                  <td>
                    <span className={`db-stat-change ${r.up ? 'db-stat-change--up' : 'db-stat-change--down'}`} style={{ fontSize: 10 }}>
                      <svg viewBox="0 0 24 24">{r.up ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}</svg>
                      {r.change}
                    </span>
                  </td>
                  <td><Spark data={r.spark} color={r.up ? 'var(--emerald)' : 'var(--coral)'} w={60} h={20} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
