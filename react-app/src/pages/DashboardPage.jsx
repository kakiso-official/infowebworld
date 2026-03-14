import { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/dashboard/DashboardLayout'

/* ── Data ── */
const stats = [
  { label: 'Profile Views', value: '12,847', change: '+18%', up: true, gradient: 'linear-gradient(135deg,var(--accent),var(--plum))', icon: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>, spark: [30,45,40,55,50,65,60,72,68,80,75,85] },
  { label: 'Total Leads', value: '384', change: '+24%', up: true, gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))', icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></>, spark: [20,35,32,48,55,52,60,58,70,65,78,82] },
  { label: 'Avg Rating', value: '4.8', change: '+0.2', up: true, gradient: 'linear-gradient(135deg,var(--amber),var(--coral))', icon: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>, spark: [70,72,73,72,74,75,76,78,78,79,80,82] },
  { label: 'Click-throughs', value: '2,156', change: '-3%', up: false, gradient: 'linear-gradient(135deg,var(--azure),var(--accent))', icon: <><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></>, spark: [60,65,70,68,72,70,65,62,60,58,55,52] },
]

const recentActivity = [
  { color: 'var(--emerald)', text: '<strong>Sarah M.</strong> left a 5-star review on your listing', time: '2 hours ago' },
  { color: 'var(--azure)', text: '<strong>John D.</strong> requested a quote through your profile', time: '4 hours ago' },
  { color: 'var(--accent)', text: 'Your listing appeared in <strong>42 search results</strong> today', time: '6 hours ago' },
  { color: 'var(--amber)', text: '<strong>Emma W.</strong> saved your business to favorites', time: '8 hours ago' },
  { color: 'var(--coral)', text: 'Monthly analytics report is ready to <strong>download</strong>', time: '1 day ago' },
  { color: 'var(--plum)', text: '<strong>Mike R.</strong> left a 4-star review on your listing', time: '1 day ago' },
  { color: 'var(--teal)', text: 'You appeared in <strong>"Top 10 Security Providers"</strong> list', time: '2 days ago' },
  { color: 'var(--rose)', text: '<strong>Lisa T.</strong> shared your listing on LinkedIn', time: '2 days ago' },
]

const performanceDays = [
  { day: 'Mar 1', views: 320, clicks: 45 }, { day: 'Mar 2', views: 410, clicks: 62 },
  { day: 'Mar 3', views: 380, clicks: 51 }, { day: 'Mar 4', views: 520, clicks: 78 },
  { day: 'Mar 5', views: 480, clicks: 72 }, { day: 'Mar 6', views: 590, clicks: 85 },
  { day: 'Mar 7', views: 450, clicks: 68 }, { day: 'Mar 8', views: 620, clicks: 92 },
  { day: 'Mar 9', views: 580, clicks: 88 }, { day: 'Mar 10', views: 710, clicks: 105 },
  { day: 'Mar 11', views: 680, clicks: 98 }, { day: 'Mar 12', views: 750, clicks: 112 },
  { day: 'Mar 13', views: 720, clicks: 108 }, { day: 'Mar 14', views: 690, clicks: 95 },
]
const maxView = Math.max(...performanceDays.map(d => d.views))

const funnelSteps = [
  { label: 'Search Impressions', value: 38421, pct: 100, color: 'var(--accent)' },
  { label: 'Listing Views', value: 12847, pct: 33, color: 'var(--azure)' },
  { label: 'Click-throughs', value: 2156, pct: 17, color: 'var(--emerald)' },
  { label: 'Leads Generated', value: 384, pct: 18, color: 'var(--amber)' },
  { label: 'Conversions', value: 47, pct: 12, color: 'var(--coral)' },
]

const healthChecks = [
  { label: 'Business Info', score: 100, icon: '✓' },
  { label: 'Photos & Media', score: 80, icon: '!' },
  { label: 'Contact Details', score: 100, icon: '✓' },
  { label: 'Business Hours', score: 100, icon: '✓' },
  { label: 'Services Listed', score: 90, icon: '✓' },
  { label: 'Response Rate', score: 87, icon: '!' },
]
const overallHealth = Math.round(healthChecks.reduce((a, c) => a + c.score, 0) / healthChecks.length)

const visitorDevices = [
  { device: 'Desktop', pct: 52, color: 'var(--accent)' },
  { device: 'Mobile', pct: 38, color: 'var(--emerald)' },
  { device: 'Tablet', pct: 10, color: 'var(--amber)' },
]

const topLocations = [
  { city: 'San Francisco', pct: 28 }, { city: 'New York', pct: 22 },
  { city: 'Los Angeles', pct: 15 }, { city: 'Chicago', pct: 12 },
  { city: 'Austin', pct: 8 },
]

const competitors = [
  { name: 'SecureShield Pro', rating: 4.6, reviews: 289, views: '9.8K', trend: 'up' },
  { name: 'CyberFort Systems', rating: 4.5, reviews: 312, views: '11.2K', trend: 'down' },
  { name: 'TrustLayer Inc.', rating: 4.4, reviews: 198, views: '7.5K', trend: 'up' },
]

const growthTips = [
  { icon: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>, title: 'Add more photos', desc: 'Listings with 10+ photos get 3x more clicks. You have 5.', color: 'var(--azure)', impact: 'High' },
  { icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>, title: 'Reply to 4 pending reviews', desc: 'Businesses that reply to reviews get 35% more leads.', color: 'var(--emerald)', impact: 'High' },
  { icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>, title: 'Add case studies', desc: 'Showcase your success stories to build trust with prospects.', color: 'var(--plum)', impact: 'Medium' },
  { icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>, title: 'Update business hours', desc: 'Ensure your holiday hours are set for the upcoming season.', color: 'var(--amber)', impact: 'Low' },
]

const recentReviews = [
  { name: 'Sarah Mitchell', initials: 'SM', bg: 'var(--emerald)', rating: 5, text: 'Absolutely fantastic service! The team was professional, responsive, and delivered beyond expectations. Highly recommend to anyone looking for quality.', date: '2 hours ago' },
  { name: 'Mike Rodriguez', initials: 'MR', bg: 'var(--azure)', rating: 4, text: 'Great experience overall. Communication was excellent and the end result was impressive. Minor delays but nothing significant.', date: '1 day ago' },
  { name: 'Emily Chen', initials: 'EC', bg: 'var(--plum)', rating: 5, text: 'Best in the business! I\'ve used several similar services but this one stands head and shoulders above the rest.', date: '3 days ago' },
  { name: 'Tom Wilson', initials: 'TW', bg: 'var(--amber)', rating: 4, text: 'Solid work on a tight timeline. Appreciated the transparency and regular updates throughout the project.', date: '5 days ago' },
]

/* Sparkline SVG helper */
function Sparkline({ data, color, width = 80, height = 28 }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(' ')
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function DashboardPage() {
  const [chartHover, setChartHover] = useState(null)

  return (
    <DashboardLayout title="Overview" subtitle="Welcome back, Aadil">
      {/* ═══ Welcome Hero Banner ═══ */}
      <div className="db-welcome">
        <div className="db-welcome-bg" />
        <div className="db-welcome-content">
          <div className="db-welcome-text">
            <h2 className="db-welcome-title">Good afternoon, Aadil</h2>
            <p className="db-welcome-desc">Your listing is performing <strong>18% better</strong> than last month. You have <strong>3 new leads</strong> and <strong>5 reviews</strong> awaiting reply.</p>
            <div className="db-welcome-actions">
              <Link to="/dashboard/leads" className="db-btn db-btn--primary">View New Leads</Link>
              <Link to="/dashboard/reviews" className="db-btn db-btn--outline" style={{ background: 'rgba(255,255,255,.15)', borderColor: 'rgba(255,255,255,.2)', color: '#fff' }}>Reply to Reviews</Link>
            </div>
          </div>
          <div className="db-welcome-stats-mini">
            <div className="db-welcome-stat-pill">
              <span className="db-welcome-stat-dot" style={{ background: 'var(--emerald)' }} />
              <span>Listing Active</span>
            </div>
            <div className="db-welcome-stat-pill">
              <span className="db-welcome-stat-dot" style={{ background: 'var(--amber)' }} />
              <span>Pro Plan</span>
            </div>
            <div className="db-welcome-stat-pill">
              <span className="db-welcome-stat-dot" style={{ background: 'var(--azure)' }} />
              <span>Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Quick Actions ═══ */}
      <div className="db-quick-actions">
        {[
          { to: '/dashboard/profile', label: 'Edit Profile', gradient: 'linear-gradient(135deg,var(--accent),var(--plum))', icon: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></> },
          { to: '/dashboard/analytics', label: 'Analytics', gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))', icon: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></> },
          { to: '/dashboard/reviews', label: 'Reviews', gradient: 'linear-gradient(135deg,var(--amber),var(--coral))', icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></> },
          { to: '/dashboard/leads', label: 'Leads', gradient: 'linear-gradient(135deg,var(--azure),var(--accent))', icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></> },
          { to: '/submit-listing', label: 'Add Listing', gradient: 'linear-gradient(135deg,var(--rose),var(--plum))', icon: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></> },
          { to: '/dashboard/billing', label: 'Billing', gradient: 'linear-gradient(135deg,var(--teal),var(--emerald))', icon: <><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></> },
        ].map(a => (
          <Link key={a.to} to={a.to} className="db-quick-action">
            <div className="db-quick-action-icon" style={{ background: a.gradient }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{a.icon}</svg>
            </div>
            <span>{a.label}</span>
          </Link>
        ))}
      </div>

      {/* ═══ Stats with Sparklines ═══ */}
      <div className="db-stats">
        {stats.map(s => (
          <div className="db-stat" key={s.label}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
              <div className="db-stat-icon" style={{ background: s.gradient, marginBottom: 0 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{s.icon}</svg>
              </div>
              <Sparkline data={s.spark} color={s.up ? 'var(--emerald)' : 'var(--coral)'} />
            </div>
            <div className="db-stat-value">{s.value}</div>
            <div className="db-stat-label">{s.label}</div>
            <div className={`db-stat-change ${s.up ? 'db-stat-change--up' : 'db-stat-change--down'}`}>
              <svg viewBox="0 0 24 24">{s.up ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}</svg>
              {s.change} this month
            </div>
          </div>
        ))}
      </div>

      {/* ═══ Row: Performance Chart + Conversion Funnel ═══ */}
      <div className="db-grid-2">
        {/* Interactive Performance Chart */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
              14-Day Performance
            </div>
            <Link to="/dashboard/analytics" className="db-card-action">Full Analytics</Link>
          </div>
          <div className="db-card-body">
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
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 140 }}>
              {performanceDays.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'pointer', position: 'relative' }}
                  onMouseEnter={() => setChartHover(i)} onMouseLeave={() => setChartHover(null)}>
                  <div style={{ display: 'flex', gap: 1, alignItems: 'flex-end', width: '100%', height: 120 }}>
                    <div style={{ flex: 1, height: `${(d.views / maxView) * 100}%`, background: chartHover === i ? 'var(--accent)' : 'var(--accent)', borderRadius: '3px 3px 0 0', opacity: chartHover === i ? 1 : .5, transition: 'opacity .15s' }} />
                    <div style={{ flex: 1, height: `${(d.clicks / maxView) * 100}%`, background: chartHover === i ? 'var(--emerald)' : 'var(--emerald)', borderRadius: '3px 3px 0 0', opacity: chartHover === i ? 1 : .5, transition: 'opacity .15s' }} />
                  </div>
                  {i % 2 === 0 && <span style={{ fontSize: 9, color: 'var(--gray-400)', fontWeight: 300, whiteSpace: 'nowrap' }}>{d.day.replace('Mar ', '')}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
              Conversion Funnel
            </div>
          </div>
          <div className="db-card-body">
            {funnelSteps.map((step, i) => (
              <div key={step.label} className="db-funnel-step">
                <div className="db-funnel-bar-wrap">
                  <div className="db-funnel-bar" style={{ width: `${Math.max(step.pct, 12)}%`, background: step.color }} />
                </div>
                <div className="db-funnel-info">
                  <span className="db-funnel-label">{step.label}</span>
                  <span className="db-funnel-value">{step.value.toLocaleString()}</span>
                  {i > 0 && <span className="db-funnel-conv">{step.pct}% conv</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Row: Listing Health + Visitor Breakdown ═══ */}
      <div className="db-grid-3">
        {/* Listing Health Score */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
              Listing Health
            </div>
          </div>
          <div className="db-card-body" style={{ textAlign: 'center' }}>
            <div className="db-health-ring">
              <svg viewBox="0 0 120 120" width="120" height="120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--gray-100)" strokeWidth="8" />
                <circle cx="60" cy="60" r="52" fill="none" stroke={overallHealth >= 90 ? 'var(--emerald)' : overallHealth >= 70 ? 'var(--amber)' : 'var(--coral)'} strokeWidth="8"
                  strokeDasharray={`${(overallHealth / 100) * 327} 327`} strokeLinecap="round"
                  transform="rotate(-90 60 60)" style={{ transition: 'stroke-dasharray .6s' }} />
              </svg>
              <div className="db-health-ring-value">
                <span className="db-health-score">{overallHealth}</span>
                <span className="db-health-label">/ 100</span>
              </div>
            </div>
            <div style={{ textAlign: 'left', marginTop: 16 }}>
              {healthChecks.map(h => (
                <div key={h.label} className="db-health-item">
                  <span className={`db-health-dot ${h.score === 100 ? 'db-health-dot--ok' : 'db-health-dot--warn'}`}>{h.icon}</span>
                  <span className="db-health-item-label">{h.label}</span>
                  <span className="db-health-item-score">{h.score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Visitor Devices */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
              Visitor Devices
            </div>
          </div>
          <div className="db-card-body">
            <div className="db-donut-wrap">
              <svg viewBox="0 0 120 120" width="100" height="100">
                {(() => {
                  let offset = 0
                  return visitorDevices.map(d => {
                    const dash = (d.pct / 100) * 314
                    const el = <circle key={d.device} cx="60" cy="60" r="50" fill="none" stroke={d.color} strokeWidth="12" strokeDasharray={`${dash} ${314 - dash}`} strokeDashoffset={-offset} transform="rotate(-90 60 60)" />
                    offset += dash
                    return el
                  })
                })()}
              </svg>
            </div>
            {visitorDevices.map(d => (
              <div key={d.device} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 400, color: 'var(--gray-700)' }}>{d.device}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-900)' }}>{d.pct}%</span>
              </div>
            ))}
            <div style={{ marginTop: 16, borderTop: '1px solid var(--gray-100)', paddingTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>Top Locations</div>
              {topLocations.map(l => (
                <div key={l.city} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ flex: 1, fontSize: 12, fontWeight: 350, color: 'var(--gray-600)' }}>{l.city}</span>
                  <div style={{ width: 60, height: 4, background: 'var(--gray-100)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${l.pct * 3}%`, background: 'var(--accent)', borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--gray-500)', width: 28, textAlign: 'right' }}>{l.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Competitor Snapshot */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="M20 8v6" /><path d="M23 11h-6" /></svg>
              Competitor Snapshot
            </div>
          </div>
          <div className="db-card-body">
            {/* Your position */}
            <div className="db-competitor-you">
              <div className="db-competitor-rank">#1</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-900)' }}>CloudGuard Technologies</div>
                <div style={{ fontSize: 11, fontWeight: 300, color: 'var(--gray-400)' }}>That's you!</div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--amber)' }}>4.8 ★</div>
                <div style={{ fontSize: 11, fontWeight: 300, color: 'var(--gray-400)' }}>342 reviews</div>
              </div>
            </div>
            {competitors.map((c, i) => (
              <div key={c.name} className="db-competitor-row">
                <div className="db-competitor-rank" style={{ background: 'var(--gray-100)', color: 'var(--gray-500)' }}>#{i + 2}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 400, color: 'var(--gray-700)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                  <div style={{ fontSize: 11, fontWeight: 300, color: 'var(--gray-400)' }}>{c.reviews} reviews &middot; {c.views} views</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-600)' }}>{c.rating} ★</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Growth Tips ═══ */}
      <div className="db-card db-full">
        <div className="db-card-header">
          <div className="db-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
            Growth Recommendations
          </div>
        </div>
        <div className="db-card-body" style={{ padding: 0 }}>
          <div className="db-tips-grid">
            {growthTips.map(tip => (
              <div key={tip.title} className="db-tip">
                <div className="db-tip-icon" style={{ background: tip.color }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{tip.icon}</svg>
                </div>
                <div className="db-tip-content">
                  <div className="db-tip-title">{tip.title}</div>
                  <div className="db-tip-desc">{tip.desc}</div>
                </div>
                <span className={`db-badge-pill ${tip.impact === 'High' ? 'db-badge--active' : tip.impact === 'Medium' ? 'db-badge--pending' : 'db-badge--inactive'}`}>{tip.impact}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Row: Activity + Reviews ═══ */}
      <div className="db-grid-2">
        {/* Recent Activity */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              Recent Activity
            </div>
          </div>
          <div className="db-card-body" style={{ padding: '8px 20px', maxHeight: 420, overflowY: 'auto' }}>
            {recentActivity.map((a, i) => (
              <div className="db-activity-item" key={i}>
                <div className="db-activity-dot" style={{ background: a.color }} />
                <div>
                  <div className="db-activity-text" dangerouslySetInnerHTML={{ __html: a.text }} />
                  <div className="db-activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Reviews */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              Latest Reviews
            </div>
            <Link to="/dashboard/reviews" className="db-card-action">See All</Link>
          </div>
          <div className="db-card-body" style={{ padding: '4px 20px', maxHeight: 420, overflowY: 'auto' }}>
            {recentReviews.map((r, i) => (
              <div className="db-review" key={i}>
                <div className="db-review-top">
                  <div className="db-review-author">
                    <div className="db-review-avatar" style={{ background: r.bg }}>{r.initials}</div>
                    <div>
                      <div className="db-review-name">{r.name}</div>
                      <div className="db-review-date">{r.date}</div>
                    </div>
                  </div>
                  <div className="db-stars">
                    {[1,2,3,4,5].map(s => <svg key={s} viewBox="0 0 24 24" className={s > r.rating ? 'empty' : ''}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>)}
                  </div>
                </div>
                <div className="db-review-text">{r.text}</div>
                <div className="db-review-actions">
                  <button className="db-review-action"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>Reply</button>
                  <button className="db-review-action"><svg viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>Thank</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
