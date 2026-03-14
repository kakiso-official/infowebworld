import { Link } from 'react-router-dom'
import AccountLayout from '../components/account/AccountLayout'

/* ── Sparkline ── */
function Spark({ data, color = 'var(--accent)', w = 70, h = 24 }) {
  const max = Math.max(...data), min = Math.min(...data)
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * (h - 4) - 2}`).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <polygon points={`${pts} ${w},${h} 0,${h}`} fill={color} opacity=".12" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Data ── */
const recentReviews = [
  { id: 1, business: 'CloudGuard Technologies', rating: 5, text: 'Best remote work platform we\'ve ever used. The AI meeting assistant is a game-changer for our distributed team.', date: 'Mar 12, 2026', replied: true, replySnippet: 'Thank you for the kind words!', category: 'Technology', gradient: 'linear-gradient(135deg,var(--accent),var(--plum))' },
  { id: 2, business: 'EmbeddPay', rating: 4, text: 'Great embedded finance solution. Integration was smooth and their support team is excellent.', date: 'Mar 8, 2026', replied: true, replySnippet: 'Glad you had a great experience!', category: 'Finance', gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))' },
  { id: 3, business: 'PropView Analytics', rating: 5, text: 'Their AI valuations are incredibly accurate. Saved us thousands on property assessments.', date: 'Feb 28, 2026', replied: false, category: 'Real Estate', gradient: 'linear-gradient(135deg,var(--amber),var(--coral))' },
]

const savedBusinesses = [
  { name: 'CloudGuard Technologies', category: 'Technology', rating: 4.8, reviews: 342, gradient: 'linear-gradient(135deg,var(--coral),var(--amber))' },
  { name: 'TasteWise AI', category: 'Food & Dining', rating: 4.6, reviews: 189, gradient: 'linear-gradient(135deg,var(--amber),var(--coral))' },
  { name: 'LexFlow Legal', category: 'Legal', rating: 4.7, reviews: 256, gradient: 'linear-gradient(135deg,var(--plum),var(--rose))' },
  { name: 'UpSkill HQ', category: 'Education', rating: 4.5, reviews: 412, gradient: 'linear-gradient(135deg,var(--azure),var(--accent))' },
]

const notifications = [
  { text: 'CloudGuard Technologies replied to your review', time: '2 hours ago', type: 'reply', color: 'var(--accent)' },
  { text: 'Your review of EmbeddPay received 5 helpful votes', time: '1 day ago', type: 'helpful', color: 'var(--emerald)' },
  { text: 'New businesses added in Technology category', time: '2 days ago', type: 'discover', color: 'var(--azure)' },
  { text: 'TasteWise AI updated their listing — check what\'s new', time: '3 days ago', type: 'update', color: 'var(--amber)' },
]

const trendingBusinesses = [
  { name: 'NexaHealth AI', category: 'Healthcare', rating: 4.9, isNew: true, gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))' },
  { name: 'CodeForge Studio', category: 'Technology', rating: 4.7, isNew: true, gradient: 'linear-gradient(135deg,var(--accent),var(--azure))' },
  { name: 'GreenRoute Logistics', category: 'Logistics', rating: 4.6, isNew: false, gradient: 'linear-gradient(135deg,var(--amber),var(--coral))' },
  { name: 'LegalMind Pro', category: 'Legal', rating: 4.8, isNew: false, gradient: 'linear-gradient(135deg,var(--plum),var(--rose))' },
]

const monthlyActivity = [2, 3, 1, 4, 2, 5, 3, 6, 4, 3, 5, 4]

export default function AccountPage() {
  return (
    <AccountLayout title="My Account" subtitle="Welcome back, Aadil">
      {/* ═══ Welcome Banner ═══ */}
      <div className="db-welcome">
        <div className="db-welcome-bg" style={{ background: 'linear-gradient(135deg, #6C72F1 0%, #8B5CF6 40%, #a855f7 70%, #ec4899 100%)' }} />
        <div className="db-welcome-content">
          <div className="db-welcome-text">
            <div className="db-welcome-title">Welcome back, Aadil!</div>
            <div className="db-welcome-desc">
              You&apos;ve written <strong>12 reviews</strong> and saved <strong>24 businesses</strong>.
              Your reviews have received <strong>87 helpful votes</strong> — you&apos;re in the top <strong>5%</strong> of contributors this month!
            </div>
            <div className="db-welcome-actions">
              <Link to="/write-review" className="db-btn" style={{ background: '#fff', color: '#8B5CF6' }}>Write a Review</Link>
              <Link to="/search" className="db-btn" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', border: '1px solid rgba(255,255,255,.25)' }}>Discover Businesses</Link>
            </div>
          </div>
          <div className="db-welcome-stats-mini">
            <div className="db-welcome-stat-pill"><span className="db-welcome-stat-dot" style={{ background: '#facc15' }} /> 12 reviews written</div>
            <div className="db-welcome-stat-pill"><span className="db-welcome-stat-dot" style={{ background: '#4ade80' }} /> 87 helpful votes</div>
            <div className="db-welcome-stat-pill"><span className="db-welcome-stat-dot" style={{ background: '#38bdf8' }} /> Top 5% contributor</div>
          </div>
        </div>
      </div>

      {/* ═══ Stats Row ═══ */}
      <div className="db-stats">
        {[
          { label: 'Reviews Written', value: '12', change: '+3 this month', gradient: 'linear-gradient(135deg,var(--accent),var(--plum))', spark: [1,2,1,3,2,4,3,5,4,3,5,4], sparkColor: 'var(--accent)', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
          { label: 'Saved Businesses', value: '24', change: '+6 this month', gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))', spark: [10,12,14,15,16,18,19,20,21,22,23,24], sparkColor: 'var(--emerald)', icon: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z' },
          { label: 'Helpful Votes', value: '87', change: '+14 this month', gradient: 'linear-gradient(135deg,var(--amber),var(--coral))', spark: [40,45,50,55,60,65,68,72,76,80,84,87], sparkColor: 'var(--amber)', icon: 'M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3' },
          { label: 'Profile Views', value: '1,245', change: '+18% this month', gradient: 'linear-gradient(135deg,var(--azure),var(--accent))', spark: [600,700,750,800,850,900,950,1000,1050,1100,1180,1245], sparkColor: 'var(--azure)', icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z|M12 9a3 3 0 100 6 3 3 0 000-6z' },
        ].map(s => (
          <div className="db-stat" key={s.label}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
              <div className="db-stat-icon" style={{ background: s.gradient }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  {s.icon.split('|').map((d, i) => <path key={i} d={d} />)}
                </svg>
              </div>
              <Spark data={s.spark} color={s.sparkColor} />
            </div>
            <div className="db-stat-value">{s.value}</div>
            <div className="db-stat-label">{s.label}</div>
            <div className="db-stat-change db-stat-change--up">
              <svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15" /></svg>
              {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* ═══ Activity Chart + Contributor Rank ═══ */}
      <div className="db-grid-2">
        {/* Activity Chart */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
              Review Activity
            </div>
            <span className="db-card-action">Last 12 months</span>
          </div>
          <div className="db-card-body">
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100, marginBottom: 8 }}>
              {monthlyActivity.map((v, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--gray-600)' }}>{v}</span>
                  <div style={{ width: '100%', height: `${(v / 6) * 68}px`, background: 'var(--accent)', borderRadius: '3px 3px 0 0', opacity: i === monthlyActivity.length - 1 ? .85 : .3 }} />
                  <span style={{ fontSize: 8, color: 'var(--gray-400)', fontWeight: 300 }}>{['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'][i]}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--r-sm)', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--gray-600)' }}>Total this year</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>42 reviews</span>
            </div>
          </div>
        </div>

        {/* Contributor Rank */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
              Contributor Status
            </div>
          </div>
          <div className="db-card-body" style={{ textAlign: 'center', padding: '24px 20px' }}>
            {/* Rank badge */}
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #ef6b4a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 8px 24px rgba(245,158,11,.25)' }}>
              <svg viewBox="0 0 24 24" style={{ width: 36, height: 36, fill: '#fff', stroke: 'none' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 2 }}>Gold Contributor</div>
            <div style={{ fontSize: 12, fontWeight: 300, color: 'var(--gray-400)', marginBottom: 16 }}>Top 5% of all reviewers</div>
            {/* Progress to next level */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--gray-500)' }}>Progress to Platinum</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-700)' }}>12 / 20 reviews</span>
              </div>
              <div style={{ height: 8, background: 'var(--gray-100)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '60%', background: 'linear-gradient(90deg, var(--amber), var(--coral))', borderRadius: 4 }} />
              </div>
            </div>
            {/* Perks */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, textAlign: 'left' }}>
              {[
                { label: 'Verified Badge', unlocked: true },
                { label: 'Priority Support', unlocked: true },
                { label: 'Early Access', unlocked: true },
                { label: 'Featured Profile', unlocked: false },
              ].map(p => (
                <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 400, color: p.unlocked ? 'var(--gray-700)' : 'var(--gray-400)' }}>
                  <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: p.unlocked ? 'var(--emerald)' : 'var(--gray-300)', fill: 'none', strokeWidth: 2, flexShrink: 0 }}>
                    {p.unlocked ? <><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></> : <circle cx="12" cy="12" r="10" />}
                  </svg>
                  {p.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Recent Reviews + Notifications ═══ */}
      <div className="db-grid-2">
        {/* Recent Reviews */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              Recent Reviews
            </div>
            <Link to="/account/reviews" className="db-card-action">View all</Link>
          </div>
          <div className="db-card-body" style={{ padding: '4px 20px' }}>
            {recentReviews.map(r => (
              <div key={r.id} style={{ padding: '14px 0', borderBottom: '1px solid var(--gray-100)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', background: r.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{r.business[0]}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-800)' }}>{r.business}</div>
                    <div style={{ fontSize: 10, fontWeight: 300, color: 'var(--gray-400)' }}>{r.category} &middot; {r.date}</div>
                  </div>
                  <div className="db-stars">
                    {[1,2,3,4,5].map(s => <svg key={s} viewBox="0 0 24 24" className={s > r.rating ? 'empty' : ''} style={{ width: 12, height: 12 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>)}
                  </div>
                </div>
                <p style={{ fontSize: 12, fontWeight: 350, color: 'var(--gray-600)', lineHeight: 1.55, margin: '0 0 6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.text}</p>
                {r.replied && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--accent)', fontWeight: 400 }}>
                    <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: 'var(--accent)', fill: 'none', strokeWidth: 1.5 }}><polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 0 0-4-4H4" /></svg>
                    Business replied: &ldquo;{r.replySnippet}&rdquo;
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
              Recent Notifications
            </div>
            <Link to="/account/notifications" className="db-card-action">View all</Link>
          </div>
          <div className="db-card-body" style={{ padding: '4px 20px' }}>
            {notifications.map((n, i) => (
              <div className="db-activity-item" key={i}>
                <div className="db-activity-dot" style={{ background: n.color }} />
                <div className="db-activity-text">{n.text}</div>
                <div className="db-activity-time">{n.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Saved Businesses + Trending ═══ */}
      <div className="db-grid-2">
        {/* Saved Businesses */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
              Saved Businesses
            </div>
            <Link to="/account/saved" className="db-card-action">View all ({savedBusinesses.length})</Link>
          </div>
          <div className="db-card-body" style={{ padding: '4px 20px' }}>
            {savedBusinesses.map(b => (
              <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--gray-100)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--r-sm)', background: b.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{b.name[0]}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)' }}>{b.name}</div>
                  <div style={{ fontSize: 11, fontWeight: 300, color: 'var(--gray-400)' }}>{b.category}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 500, color: 'var(--amber)' }}>
                  <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, fill: 'var(--amber)', stroke: 'none' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  {b.rating}
                  <span style={{ fontWeight: 300, color: 'var(--gray-400)', fontSize: 10 }}>({b.reviews})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending / Discover */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
              Trending Near You
            </div>
            <Link to="/search" className="db-card-action">Explore</Link>
          </div>
          <div className="db-card-body" style={{ padding: '4px 20px' }}>
            {trendingBusinesses.map(b => (
              <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--gray-100)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--r-sm)', background: b.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{b.name[0]}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)' }}>{b.name}</span>
                    {b.isNew && <span style={{ fontSize: 9, fontWeight: 600, padding: '1px 6px', borderRadius: 4, background: 'rgba(47,174,106,.08)', color: 'var(--emerald)' }}>NEW</span>}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 300, color: 'var(--gray-400)' }}>{b.category}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 500, color: 'var(--amber)' }}>
                  <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, fill: 'var(--amber)', stroke: 'none' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  {b.rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Quick Actions ═══ */}
      <div className="db-quick-actions">
        {[
          { label: 'Write Review', icon: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7|M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z', gradient: 'linear-gradient(135deg,var(--accent),var(--plum))', to: '/write-review' },
          { label: 'Find Business', icon: 'M21 21l-4.35-4.35M11 3a8 8 0 100 16 8 8 0 000-16z', gradient: 'linear-gradient(135deg,var(--azure),var(--accent))', to: '/search' },
          { label: 'Compare', icon: 'M9 19V6l12-3v13|M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z', gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))', to: '/comparison' },
          { label: 'Categories', icon: 'M3 4h4v4H3V4zm7 0h4v4h-4V4zm7 0h4v4h-4V4zM3 10h4v4H3v-4zm7 0h4v4h-4v-4zm7 0h4v4h-4v-4zM3 16h4v4H3v-4zm7 0h4v4h-4v-4z', gradient: 'linear-gradient(135deg,var(--amber),var(--coral))', to: '/category' },
          { label: 'My Profile', icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2|M12 3a4 4 0 100 8 4 4 0 000-8z', gradient: 'linear-gradient(135deg,var(--plum),var(--rose))', to: '/profile' },
        ].map(a => (
          <Link to={a.to} className="db-quick-action" key={a.label}>
            <div className="db-quick-action-icon" style={{ background: a.gradient }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {a.icon.split('|').map((d, i) => <path key={i} d={d} />)}
              </svg>
            </div>
            <span>{a.label}</span>
          </Link>
        ))}
      </div>
    </AccountLayout>
  )
}
