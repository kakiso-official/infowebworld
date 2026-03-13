import { Link } from 'react-router-dom'

export default function Cta() {
  return (
    <section className="cta-section fade-section">
      <div className="container">
        <div className="cta-box">
          <div className="cta-orb cta-orb--1"></div>
          <div className="cta-orb cta-orb--2"></div>
          <div className="cta-orb cta-orb--3"></div>
          <div className="cta-grid-bg"></div>
          <div className="cta-content">
            <div className="cta-badge"><span className="cta-badge-dot"></span>Limited Time Offer</div>
            <h2 className="cta-h2">List Your Business Today</h2>
            <p className="cta-sub">Join 2,500+ businesses already reaching thousands of qualified customers every month through verified listings and high-authority backlinks.</p>
            <div className="cta-trust">
              <div className="cta-trust-item"><svg viewBox="0 0 24 24" stroke="rgba(255,255,255,.5)" fill="none" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg><span>Verified Platform</span></div>
              <div className="cta-trust-item"><svg viewBox="0 0 24 24" stroke="rgba(255,255,255,.5)" fill="none" strokeWidth="1.5"><polyline points="20 6 9 17 4 12" /></svg><span>Cancel Anytime</span></div>
              <div className="cta-trust-item"><svg viewBox="0 0 24 24" stroke="rgba(255,255,255,.5)" fill="none" strokeWidth="1.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg><span>Dofollow Backlink</span></div>
            </div>
            <div className="cta-buttons">
              <Link to="/submit-listing" className="cta-btn-primary">Get Listed Now <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg></Link>
              <Link to="/pricing" className="cta-btn-glass">View Pricing Plans</Link>
            </div>
            <p className="cta-price">Starting at $99/year · No hidden fees · Setup in 5 minutes</p>
          </div>
        </div>
      </div>
    </section>
  )
}
