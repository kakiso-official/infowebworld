import { Link } from 'react-router-dom'

export default function ClaimSidebar({ step }) {
  return (
    <aside className="cl-sidebar">
      {/* Why Claim */}
      <div className="cl-sb-card">
        <div className="cl-sb-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Why claim your listing?
        </div>
        <div className="cl-sb-benefits">
          {[
            { icon: <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, color: 'var(--accent)', bg: 'rgba(108,114,241,.08)', title: 'Build Trust', desc: 'Verified listings get 3x more clicks and inquiries' },
            { icon: <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/></svg>, color: 'var(--emerald)', bg: 'rgba(47,174,106,.08)', title: 'Generate Leads', desc: 'Receive and manage leads directly from your listing' },
            { icon: <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, color: 'var(--amber)', bg: 'rgba(245,158,11,.08)', title: 'Manage Reputation', desc: 'Respond to reviews and improve your rating' },
            { icon: <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, color: 'var(--azure)', bg: 'rgba(59,130,246,.08)', title: 'Track Analytics', desc: "See who's viewing your listing and where they come from" },
          ].map((b, i) => (
            <div key={i} className="cl-sb-benefit">
              <div className="cl-sb-benefit-icon" style={{ background: b.bg }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={b.color} strokeWidth="1.5">{b.icon.props.children}</svg>
              </div>
              <div>
                <div className="cl-sb-benefit-title">{b.title}</div>
                <div className="cl-sb-benefit-desc">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="cl-sb-card cl-sb-stats">
        <div className="cl-sb-stat"><div className="cl-sb-stat-num">3x</div><div className="cl-sb-stat-text">more clicks on verified listings</div></div>
        <div className="cl-sb-stat"><div className="cl-sb-stat-num">72%</div><div className="cl-sb-stat-text">of users prefer claimed business profiles</div></div>
        <div className="cl-sb-stat"><div className="cl-sb-stat-num">5 min</div><div className="cl-sb-stat-text">average time to claim your listing</div></div>
      </div>

      {/* Testimonial */}
      <div className="cl-sb-card">
        <div className="cl-sb-testimonial">
          <div className="cl-sb-testimonial-quote">"Claiming our listing increased inbound leads by 40% in the first month. The dashboard gives us incredible insights."</div>
          <div className="cl-sb-testimonial-author">
            <div className="cl-sb-testimonial-avatar">RK</div>
            <div>
              <div className="cl-sb-testimonial-name">Rahul Kapoor</div>
              <div className="cl-sb-testimonial-role">CEO, DataPulse Analytics</div>
            </div>
          </div>
        </div>
      </div>

      {/* Help */}
      <div className="cl-sb-card cl-sb-help">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        <div>
          <div className="cl-sb-help-title">Need help claiming?</div>
          <div className="cl-sb-help-desc">Our team is here to assist.</div>
          <Link to="/contact" className="cl-sb-help-link">Contact Support</Link>
        </div>
      </div>
    </aside>
  )
}
