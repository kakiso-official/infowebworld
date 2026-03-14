import { Link } from 'react-router-dom'

const stats = [
  { value: '2,500+', label: 'Active businesses', icon: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>, color: 'var(--accent)' },
  { value: '25,400+', label: 'Verified reviews', icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>, color: 'var(--emerald)' },
  { value: '99.9%', label: 'Uptime guarantee', icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>, color: 'var(--azure)' },
  { value: '4.8/5', label: 'Owner satisfaction', icon: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>, color: 'var(--gold)' },
]

const testimonials = [
  { name: 'Michael Chen', role: 'CEO, CloudSync Pro', text: '"Upgrading to Pro doubled our inbound leads within the first month. The analytics alone are worth it."', plan: 'Pro Plan', avatar: 'M', color: 'var(--accent)' },
  { name: 'Sarah Williams', role: 'Owner, The Garden Table', text: '"The verified badge gave us instant credibility. Customers specifically mentioned it when visiting."', plan: 'Business Plan', avatar: 'S', color: 'var(--coral)' },
  { name: 'David Park', role: 'Founder, BrightPath Academy', text: '"We started on Free and grew to Business. The ROI has been incredible — best marketing spend we make."', plan: 'Business Plan', avatar: 'D', color: 'var(--teal)' },
]

export default function PricingTrust() {
  return (
    <div className="container">
      {/* Stats bar */}
      <div className="pr-trust-stats fade-in">
        {stats.map((s, i) => (
          <div className="pr-trust-stat" key={i}>
            <div className="pr-trust-stat-icon" style={{ color: s.color }}>
              <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.5">{s.icon}</svg>
            </div>
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="pr-testimonials fade-in">
        <h2 className="pr-test-title">
          <svg viewBox="0 0 24 24" stroke="var(--accent)" fill="none" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Trusted by Business Owners
        </h2>
        <div className="pr-test-grid">
          {testimonials.map((t, i) => (
            <div className="pr-test-card" key={i}>
              <div className="pr-test-quote">"</div>
              <p className="pr-test-text">{t.text}</p>
              <div className="pr-test-footer">
                <div className="pr-test-avatar" style={{ background: t.color }}>{t.avatar}</div>
                <div className="pr-test-info">
                  <div className="pr-test-name">{t.name}</div>
                  <div className="pr-test-role">{t.role}</div>
                </div>
                <span className="pr-test-plan">{t.plan}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="pr-bottom-cta fade-in">
        <div className="pr-bottom-cta-bg">
          <div className="pr-bottom-orb pr-bottom-orb--1"></div>
          <div className="pr-bottom-orb pr-bottom-orb--2"></div>
        </div>
        <div className="pr-bottom-cta-content">
          <h2 className="pr-bottom-cta-title">Ready to grow your business?</h2>
          <p className="pr-bottom-cta-text">Start your free trial today. No credit card required.</p>
          <div className="pr-bottom-cta-actions">
            <Link to="/submit-listing" className="pr-bottom-btn pr-bottom-btn--primary">
              Get Started Free
              <svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <Link to="/contact" className="pr-bottom-btn pr-bottom-btn--ghost">
              Talk to Sales
              <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </Link>
          </div>
          <div className="pr-bottom-trust-row">
            <span><svg viewBox="0 0 24 24" stroke="var(--emerald)" fill="none" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> 14-day free trial</span>
            <span><svg viewBox="0 0 24 24" stroke="var(--emerald)" fill="none" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> No credit card</span>
            <span><svg viewBox="0 0 24 24" stroke="var(--emerald)" fill="none" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> Cancel anytime</span>
          </div>
        </div>
      </div>
    </div>
  )
}
