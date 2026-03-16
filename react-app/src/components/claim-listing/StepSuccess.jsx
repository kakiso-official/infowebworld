import { Link } from 'react-router-dom'

const FEATURES = [
  { title: 'Full Dashboard', desc: 'Analytics, leads, reviews, billing — all in one place', color: 'var(--accent)', bg: 'rgba(108,114,241,.08)', icon: <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { title: 'Edit Your Listing', desc: 'Update info, photos, hours, services, and contact details', color: 'var(--emerald)', bg: 'rgba(47,174,106,.08)', icon: <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
  { title: 'Respond to Reviews', desc: 'Reply to customer reviews and manage your reputation', color: 'var(--amber)', bg: 'rgba(245,158,11,.08)', icon: <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { title: 'Manage Leads', desc: 'CRM-style pipeline to track and convert incoming leads', color: 'var(--azure)', bg: 'rgba(59,130,246,.08)', icon: <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  { title: 'Advanced Analytics', desc: 'Traffic, visitor sources, conversion tracking, and heatmaps', color: 'var(--plum)', bg: 'rgba(139,92,246,.08)', icon: <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { title: 'Verified Badge', desc: 'Get the trusted verified badge displayed on your listing', color: 'var(--rose)', bg: 'rgba(236,72,153,.08)', icon: <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
]

export default function StepSuccess({ listing }) {
  return (
    <div className="cl-step-content">
      <div className="cl-success">
        {/* Confetti */}
        <div className="cl-success-confetti">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="cl-confetti-piece" style={{ '--x': `${Math.random() * 100}%`, '--delay': `${Math.random() * 0.6}s`, '--rot': `${Math.random() * 1080}deg`, '--color': ['var(--accent)', 'var(--emerald)', 'var(--amber)', 'var(--coral)', 'var(--plum)', 'var(--azure)', 'var(--rose)', 'var(--teal)'][i % 8] }} />
          ))}
        </div>

        {/* Trophy icon with rings */}
        <div className="cl-success-trophy">
          <div className="cl-success-ring cl-success-ring--1"></div>
          <div className="cl-success-ring cl-success-ring--2"></div>
          <div className="cl-success-ring cl-success-ring--3"></div>
          <div className="cl-success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
        </div>

        <h2>Your Listing is Now Claimed!</h2>
        <p className="cl-success-sub">Congratulations! You now have full control of your <strong>{listing?.name}</strong> listing on InfoWebWorld.</p>

        {/* Features grid */}
        <div className="cl-success-unlocked">
          <div className="cl-success-unlocked-title">Here's what you've unlocked</div>
          <div className="cl-success-features">
            {FEATURES.map((f, i) => (
              <div key={i} className="cl-success-feature" style={{ '--delay': `${i * 0.08}s` }}>
                <div className="cl-success-feature-icon" style={{ background: f.bg, color: f.color }}>{f.icon}</div>
                <div className="cl-success-feature-title">{f.title}</div>
                <div className="cl-success-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="cl-success-actions">
          <Link to="/dashboard" className="cl-btn-primary cl-btn-lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Go to Your Dashboard
          </Link>
          <Link to="/dashboard/profile" className="cl-btn-secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Edit Your Listing
          </Link>
          <Link to="/listing" className="cl-btn-outline">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            View Public Listing
          </Link>
        </div>
      </div>
    </div>
  )
}
