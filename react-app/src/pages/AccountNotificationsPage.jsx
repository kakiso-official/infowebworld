import { useState } from 'react'
import AccountLayout from '../components/account/AccountLayout'

const notifications = [
  { id: 1, type: 'reply', title: 'CloudGuard Technologies replied to your review', desc: '"Thank you so much, Aadil! We\'re thrilled the AI meeting assistant is making a difference..."', time: '2 hours ago', date: 'Mar 14, 2026', read: false, color: 'var(--accent)', icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z', actionLabel: 'View Reply', actionLink: '/account/reviews' },
  { id: 2, type: 'helpful', title: 'Your review of EmbeddPay received 5 helpful votes', desc: 'Your review now has 18 total helpful votes. Keep it up!', time: '5 hours ago', date: 'Mar 14, 2026', read: false, color: 'var(--emerald)', icon: 'M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3', actionLabel: 'View Review', actionLink: '/account/reviews' },
  { id: 3, type: 'milestone', title: 'Congratulations! You\'ve reached Gold Contributor status', desc: 'You\'re now in the top 5% of all reviewers. Enjoy verified badge, priority support, and early access.', time: '1 day ago', date: 'Mar 13, 2026', read: false, color: 'var(--amber)', icon: 'M12 2L2 7l10 5 10-5-10-5z|M2 17l10 5 10-5|M2 12l10 5 10-5', actionLabel: 'View Perks', actionLink: '/account' },
  { id: 4, type: 'reply', title: 'TasteWise AI replied to your review', desc: '"We love hearing about real-world predictions! Would you be open to a case study feature?"', time: '1 day ago', date: 'Mar 13, 2026', read: true, color: 'var(--accent)', icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z', actionLabel: 'View Reply', actionLink: '/account/reviews' },
  { id: 5, type: 'update', title: 'TasteWise AI updated their listing', desc: 'They added new services: Menu Analytics Dashboard and Seasonal Trend Reports.', time: '2 days ago', date: 'Mar 12, 2026', read: true, color: 'var(--azure)', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', actionLabel: 'View Listing', actionLink: '/listing' },
  { id: 6, type: 'discover', title: 'New businesses added in Technology category', desc: '3 new businesses were listed: CodeForge Studio, DataFort Security, and NexaHealth AI.', time: '2 days ago', date: 'Mar 12, 2026', read: true, color: 'var(--plum)', icon: 'M12 4v16m8-8H4', actionLabel: 'Explore', actionLink: '/category' },
  { id: 7, type: 'helpful', title: 'Your review of PropView Analytics hit 30 helpful votes!', desc: 'This is your most helpful review yet. You\'re making a real impact on the community.', time: '3 days ago', date: 'Mar 11, 2026', read: true, color: 'var(--emerald)', icon: 'M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3', actionLabel: 'View Review', actionLink: '/account/reviews' },
  { id: 8, type: 'reply', title: 'UpSkill HQ replied to your review', desc: '"That completion rate jump is incredible! Thank you for being a champion of continuous learning!"', time: '4 days ago', date: 'Mar 10, 2026', read: true, color: 'var(--accent)', icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z', actionLabel: 'View Reply', actionLink: '/account/reviews' },
  { id: 9, type: 'system', title: 'Your monthly review digest is ready', desc: 'You wrote 3 reviews in February, received 42 helpful votes, and got 4 business replies.', time: '5 days ago', date: 'Mar 9, 2026', read: true, color: 'var(--gray-400)', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', actionLabel: 'View Digest', actionLink: '/account' },
  { id: 10, type: 'reminder', title: 'Reminder: Write a review for GreenRoute Logistics', desc: 'You saved this business 3 weeks ago. Share your experience to help others!', time: '6 days ago', date: 'Mar 8, 2026', read: true, color: 'var(--coral)', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', actionLabel: 'Write Review', actionLink: '/write-review' },
  { id: 11, type: 'update', title: 'CloudGuard Technologies added new photos', desc: '5 new photos added to their gallery including office HQ and team shots.', time: '1 week ago', date: 'Mar 7, 2026', read: true, color: 'var(--azure)', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', actionLabel: 'View Photos', actionLink: '/listing' },
  { id: 12, type: 'helpful', title: 'Your review of NexaHealth AI received 8 helpful votes', desc: 'People are finding your healthcare analytics review useful!', time: '1 week ago', date: 'Mar 7, 2026', read: true, color: 'var(--emerald)', icon: 'M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3', actionLabel: 'View Review', actionLink: '/account/reviews' },
]

const typeLabels = {
  reply: { label: 'Business Replies', color: 'var(--accent)' },
  helpful: { label: 'Helpful Votes', color: 'var(--emerald)' },
  milestone: { label: 'Milestones', color: 'var(--amber)' },
  update: { label: 'Listing Updates', color: 'var(--azure)' },
  discover: { label: 'Discoveries', color: 'var(--plum)' },
  system: { label: 'System', color: 'var(--gray-400)' },
  reminder: { label: 'Reminders', color: 'var(--coral)' },
}

export default function AccountNotificationsPage() {
  const [filter, setFilter] = useState('all')
  const unreadCount = notifications.filter(n => !n.read).length

  const filtered = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter(n => !n.read) : notifications.filter(n => n.type === filter)

  return (
    <AccountLayout title="Notifications" subtitle={`${unreadCount} unread`}>
      {/* ═══ Summary Stats ═══ */}
      <div className="db-stats" style={{ marginBottom: 24 }}>
        {[
          { label: 'Unread', value: unreadCount, gradient: 'linear-gradient(135deg,var(--coral),var(--amber))' },
          { label: 'Business Replies', value: notifications.filter(n => n.type === 'reply').length, gradient: 'linear-gradient(135deg,var(--accent),var(--plum))' },
          { label: 'Helpful Votes', value: notifications.filter(n => n.type === 'helpful').length, gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))' },
          { label: 'Updates', value: notifications.filter(n => n.type === 'update' || n.type === 'discover').length, gradient: 'linear-gradient(135deg,var(--azure),var(--accent))' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--r)', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--r-sm)', background: s.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{s.value}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ═══ Notification List ═══ */}
      <div className="db-card db-full">
        <div className="db-card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
            {[
              { key: 'all', label: `All (${notifications.length})` },
              { key: 'unread', label: `Unread (${unreadCount})` },
              { key: 'reply', label: 'Replies' },
              { key: 'helpful', label: 'Helpful' },
              { key: 'update', label: 'Updates' },
              { key: 'milestone', label: 'Milestones' },
            ].map(f => (
              <button key={f.key} className={`db-btn ${filter === f.key ? 'db-btn--primary' : 'db-btn--outline'}`} style={{ padding: '5px 12px', fontSize: 11 }} onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
          <button className="db-btn db-btn--outline" style={{ padding: '5px 12px', fontSize: 11 }}>
            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12 }}><polyline points="20 6 9 17 4 12" /></svg>
            Mark all read
          </button>
        </div>

        <div className="db-card-body" style={{ padding: '0 20px' }}>
          {filtered.map(n => (
            <div key={n.id} style={{
              display: 'flex', gap: 14, padding: '16px 0', borderBottom: '1px solid var(--gray-100)',
              background: n.read ? 'transparent' : 'rgba(108,114,241,.02)',
              margin: n.read ? 0 : '0 -20px', padding: n.read ? '16px 0' : '16px 20px',
              borderRadius: n.read ? 0 : 'var(--r-sm)',
            }}>
              {/* Icon */}
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${n.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: n.color, fill: 'none', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                  {n.icon.split('|').map((d, i) => <path key={i} d={d} />)}
                </svg>
                {!n.read && <span style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: '50%', background: 'var(--coral)', border: '2px solid #fff' }} />}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 3 }}>
                  <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 600, color: 'var(--gray-800)', lineHeight: 1.4 }}>{n.title}</div>
                  <span style={{ fontSize: 10, fontWeight: 300, color: 'var(--gray-400)', flexShrink: 0, whiteSpace: 'nowrap' }}>{n.time}</span>
                </div>
                <p style={{ fontSize: 12, fontWeight: 350, color: 'var(--gray-500)', lineHeight: 1.5, margin: '0 0 8px' }}>{n.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 4, background: `${typeLabels[n.type].color}12`, color: typeLabels[n.type].color }}>{typeLabels[n.type].label}</span>
                  <button className="db-btn db-btn--outline" style={{ padding: '3px 10px', fontSize: 10, height: 'auto' }}>{n.actionLabel}</button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="db-card-empty">No notifications matching this filter</div>}
        </div>
      </div>

      {/* ═══ Notification Preferences Teaser ═══ */}
      <div className="db-card db-full">
        <div className="db-card-header">
          <div className="db-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09" /></svg>
            Quick Notification Settings
          </div>
        </div>
        <div className="db-card-body" style={{ padding: '8px 20px' }}>
          {[
            { label: 'Business replies to my reviews', desc: 'Get notified when a business responds to your review', on: true },
            { label: 'Helpful vote milestones', desc: 'Alerts when your reviews reach helpful vote milestones', on: true },
            { label: 'Saved business updates', desc: 'When businesses you saved update their listing', on: true },
            { label: 'New businesses in your categories', desc: 'Discover new businesses in categories you follow', on: false },
            { label: 'Review reminders', desc: 'Gentle reminders to review businesses you\'ve saved', on: false },
            { label: 'Monthly digest', desc: 'Monthly summary of your review activity and impact', on: true },
          ].map(n => (
            <div className="db-settings-row" key={n.label}>
              <div>
                <div className="db-settings-row-label">{n.label}</div>
                <div className="db-settings-row-desc">{n.desc}</div>
              </div>
              <label className="db-toggle">
                <input type="checkbox" defaultChecked={n.on} />
                <span className="db-toggle-track" />
                <span className="db-toggle-thumb" />
              </label>
            </div>
          ))}
        </div>
      </div>
    </AccountLayout>
  )
}
