import DashboardLayout from '../components/dashboard/DashboardLayout'

const stats = [
  { label: 'Total Views', value: '38,421', change: '+22%', up: true, gradient: 'linear-gradient(135deg,var(--accent),var(--plum))' },
  { label: 'Unique Visitors', value: '12,847', change: '+18%', up: true, gradient: 'linear-gradient(135deg,var(--azure),var(--accent))' },
  { label: 'Avg. Session', value: '2m 34s', change: '+8%', up: true, gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))' },
  { label: 'Bounce Rate', value: '24.3%', change: '-5%', up: true, gradient: 'linear-gradient(135deg,var(--amber),var(--coral))' },
]

const weeklyData = [
  { day: 'Mon', views: 78, clicks: 45 },
  { day: 'Tue', views: 85, clicks: 52 },
  { day: 'Wed', views: 92, clicks: 48 },
  { day: 'Thu', views: 88, clicks: 56 },
  { day: 'Fri', views: 95, clicks: 62 },
  { day: 'Sat', views: 72, clicks: 38 },
  { day: 'Sun', views: 65, clicks: 32 },
]

const trafficSources = [
  { source: 'Organic Search', pct: 42, color: 'var(--accent)' },
  { source: 'Direct', pct: 28, color: 'var(--emerald)' },
  { source: 'Social Media', pct: 18, color: 'var(--azure)' },
  { source: 'Referral', pct: 8, color: 'var(--amber)' },
  { source: 'Email', pct: 4, color: 'var(--plum)' },
]

const topSearchTerms = [
  { term: 'cloud security solutions', count: 342 },
  { term: 'enterprise cybersecurity', count: 256 },
  { term: 'zero trust architecture', count: 198 },
  { term: 'business security services', count: 167 },
  { term: 'IT security consulting', count: 134 },
]

const topPages = [
  { page: 'Main Listing Page', views: 8421, pct: 100 },
  { page: 'Reviews Section', views: 5632, pct: 67 },
  { page: 'Contact / Quote Form', views: 3847, pct: 46 },
  { page: 'Photo Gallery', views: 2156, pct: 26 },
  { page: 'About / Team', views: 1890, pct: 22 },
]

export default function DashboardAnalyticsPage() {
  return (
    <DashboardLayout title="Analytics" subtitle="Last 30 days performance">
      <div className="db-stats">
        {stats.map(s => (
          <div className="db-stat" key={s.label}>
            <div className="db-stat-icon" style={{ background: s.gradient }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /></svg>
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

      <div className="db-grid-2">
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
              Weekly Overview
            </div>
          </div>
          <div className="db-card-body">
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--gray-500)' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--accent)', display: 'inline-block' }} /> Views
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--gray-500)' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--emerald)', display: 'inline-block' }} /> Clicks
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
              {weeklyData.map(d => (
                <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', width: '100%', height: 100 }}>
                    <div style={{ flex: 1, height: `${d.views}%`, background: 'var(--accent)', borderRadius: '3px 3px 0 0', opacity: .7 }} />
                    <div style={{ flex: 1, height: `${d.clicks}%`, background: 'var(--emerald)', borderRadius: '3px 3px 0 0', opacity: .7 }} />
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--gray-400)', fontWeight: 300 }}>{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              Traffic Sources
            </div>
          </div>
          <div className="db-card-body">
            {trafficSources.map(s => (
              <div key={s.source} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 400, color: 'var(--gray-700)' }}>{s.source}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-800)' }}>{s.pct}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--gray-100)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="db-grid-2">
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              Top Search Terms
            </div>
          </div>
          <div className="db-card-body" style={{ padding: '4px 20px' }}>
            {topSearchTerms.map((t, i) => (
              <div key={t.term} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < topSearchTerms.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                <span style={{ width: 22, height: 22, borderRadius: 6, background: i < 3 ? 'var(--accent-soft)' : 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: i < 3 ? 'var(--accent)' : 'var(--gray-500)', flexShrink: 0 }}>{i + 1}</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 400, color: 'var(--gray-700)' }}>{t.term}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-500)' }}>{t.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
              Top Pages
            </div>
          </div>
          <div className="db-card-body" style={{ padding: '4px 20px' }}>
            {topPages.map(p => (
              <div key={p.page} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 400, color: 'var(--gray-700)' }}>{p.page}</span>
                  <span style={{ fontSize: 12, fontWeight: 300, color: 'var(--gray-400)' }}>{p.views.toLocaleString()} views</span>
                </div>
                <div style={{ height: 5, background: 'var(--gray-100)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p.pct}%`, background: 'var(--accent)', borderRadius: 3, opacity: 0.4 + (p.pct / 100) * 0.5 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
