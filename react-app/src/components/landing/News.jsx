import { Link } from 'react-router-dom'

export default function News() {
  return (
    <section className="section fade-section" style={{background:'var(--bg-alt)'}}>
      <div className="container">
        <div className="section-header-row">
          <div className="section-header">
            <div className="section-label">Stay Informed</div>
            <h2 className="section-title">Latest News</h2>
            <p className="section-subtitle">Industry insights, business trends, and the stories shaping every sector.</p>
          </div>
          <Link to="/news" className="view-all-link">View All News <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg></Link>
        </div>
        <div className="news-stats-bar">
          <div className="news-stat-pill"><svg viewBox="0 0 24 24" stroke="var(--accent)" fill="none" strokeWidth="1.5"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" /><polyline points="14 2 14 8 20 8" /><path d="M2 15h10" /><path d="M2 19h10" /></svg><span className="news-stat-num">12</span><span className="news-stat-text">articles this week</span></div>
          <div className="news-stat-divider"></div>
          <div className="news-stat-pill"><svg viewBox="0 0 24 24" stroke="var(--emerald)" fill="none" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg><span className="news-stat-num">5</span><span className="news-stat-text">categories covered</span></div>
          <div className="news-stat-divider"></div>
          <div className="news-stat-pill"><svg viewBox="0 0 24 24" stroke="var(--azure)" fill="none" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg><span className="news-stat-num">~4 min</span><span className="news-stat-text">avg read</span></div>
        </div>
        <div className="news-v2-layout">
          <Link to="/news-article?id=small-biz-directory-growth" className="news-hero">
            <div className="news-hero-content">
              <div className="news-hero-tag-row">
                <span className="news-tag-v2 news-tag-v2--accent">Business Spotlight</span>
                <span className="news-trending-pill"><svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.5"><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></svg>Trending</span>
              </div>
              <h3 className="news-hero-title">Small Businesses See 40% Growth Through Digital Directory Listings in 2026</h3>
              <p className="news-hero-excerpt">A new industry report reveals that small and medium businesses listed on verified directories experienced significantly higher customer acquisition rates compared to traditional advertising channels. The data, compiled from over 50,000 business profiles, shows directory presence has become a critical growth lever.</p>
              <div className="news-hero-footer">
                <div className="news-author-row"><div className="news-author-avatar" style={{background:'var(--accent-gradient)'}}>RP</div><div><div className="news-author-name">Rachel Park</div><div className="news-author-role">Senior Editor</div></div></div>
                <div className="news-hero-meta-pills">
                  <span className="news-meta-pill"><svg viewBox="0 0 24 24"><path d="M8 2v4" /><path d="M16 2v4" /><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18" /></svg>Mar 10, 2026</span>
                  <span className="news-meta-pill"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>6 min read</span>
                </div>
              </div>
            </div>
            <div className="news-hero-visual">
              <div className="news-hero-icon-wrap"><svg viewBox="0 0 24 24" stroke="#fff" fill="none" strokeWidth="1.5"><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></svg></div>
              <div className="news-hero-visual-label">Business</div>
            </div>
          </Link>
          <div className="news-grid-v2">
            {[
              { id:'suburban-real-estate-demand', color:'var(--emerald)', tag:'Real Estate', tagClass:'news-tag-v2--emerald', time:'4 min', title:'Remote Work Drives Surge in Suburban Commercial Real Estate Demand', excerpt:'Commercial property firms report a 35% increase in suburban office space inquiries as hybrid work models become the standard across industries.', author:'David Mitchell', date:'Mar 9, 2026', initials:'DM', bg:'linear-gradient(135deg,var(--emerald),var(--teal))' },
              { id:'telehealth-satisfaction', color:'var(--plum)', tag:'Healthcare', tagClass:'news-tag-v2--plum', time:'3 min', title:'Telehealth Platforms Report Record Patient Satisfaction Scores', excerpt:'Leading wellness platforms show 92% patient satisfaction rates as virtual consultations become mainstream across specialties.', author:'Sara Lopez', date:'Mar 8, 2026', initials:'SL', bg:'linear-gradient(135deg,var(--plum),var(--rose))' },
              { id:'online-learning-enterprise', color:'var(--azure)', tag:'Education', tagClass:'news-tag-v2--azure', time:'4 min', title:'Online Learning Platforms Partner with Fortune 500 for Corporate Training', excerpt:'Major education platforms announce enterprise partnerships to deliver upskilling programs reaching over 2 million professionals globally.', author:'Nina Kapoor', date:'Mar 7, 2026', initials:'NK', bg:'linear-gradient(135deg,var(--azure),var(--accent))' },
              { id:'ai-customer-reviews', color:'var(--coral)', tag:'Technology', tagClass:'news-tag-v2--coral', time:'5 min', title:'AI-Powered Tools Transform How Local Businesses Manage Customer Reviews', excerpt:'Automated sentiment analysis and smart response tools are helping businesses turn negative feedback into retention opportunities at scale.', author:'James Wu', date:'Mar 6, 2026', initials:'JW', bg:'linear-gradient(135deg,var(--coral),var(--amber))' },
            ].map((n,i) => (
              <Link to={`/news-article?id=${n.id}`} className="news-card-v2" key={i}>
                <div className="news-card-accent" style={{background:n.color}}></div>
                <div className="news-card-inner">
                  <div className="news-card-head"><span className={`news-tag-v2 ${n.tagClass}`}>{n.tag}</span><span className="news-read-pill">{n.time}</span></div>
                  <h4 className="news-card-title">{n.title}</h4>
                  <p className="news-card-excerpt">{n.excerpt}</p>
                  <div className="news-card-footer">
                    <div className="news-author-row news-author-row--sm"><div className="news-author-avatar news-author-avatar--sm" style={{background:n.bg}}>{n.initials}</div><div><div className="news-author-name">{n.author}</div><div className="news-author-role">{n.date}</div></div></div>
                    <div className="news-card-arrow"><svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
