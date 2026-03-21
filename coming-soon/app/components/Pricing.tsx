const check = <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4 12 14.01l-3-3" /></svg>

export default function Pricing() {
  return (
    <section className="pricing-section" id="pricing">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Pricing</div>
          <h2 className="section-title">Listing Plans for <em>Every Business</em></h2>
          <p className="section-desc">
            Lock in founding member pricing before launch. These rates will never be this low again.
          </p>
        </div>

        <div className="pricing-grid">
          {/* Founding Company */}
          <div className="pricing-card">
            <div className="pricing-badge" style={{ background: 'rgba(232,85,61,.08)', color: '#E8553D' }}>
              First 200 Only
            </div>
            <div className="pricing-name">Founding Company</div>
            <div className="pricing-desc">Be a founding member forever</div>
            <div className="pricing-price">
              <span className="pricing-currency">$</span>
              <span className="pricing-amount">240</span>
            </div>
            <div className="pricing-period">one-time payment</div>
            <div className="pricing-note">Lifetime listing — pay once, listed forever</div>
            <ul className="pricing-features">
              <li>{check} Permanent lifetime listing</li>
              <li>{check} Founding Member badge</li>
              <li>{check} Dofollow backlink</li>
              <li>{check} Priority placement in search</li>
              <li>{check} Verified business profile</li>
              <li>{check} Analytics dashboard</li>
              <li>{check} Unlimited photos &amp; media</li>
            </ul>
            <a href="#hero" className="pricing-cta">Claim Founding Spot</a>
          </div>

          {/* Early Adopter — Featured */}
          <div className="pricing-card pricing-card--featured">
            <div className="pricing-badge" style={{ background: 'rgba(67,97,238,.08)', color: '#4361EE' }}>
              First 1,000
            </div>
            <div className="pricing-name">Early Adopter</div>
            <div className="pricing-desc">Best value for growing businesses</div>
            <div className="pricing-price">
              <span className="pricing-currency">$</span>
              <span className="pricing-amount">140</span>
            </div>
            <div className="pricing-period">/year</div>
            <div className="pricing-note">42% off standard yearly price</div>
            <ul className="pricing-features">
              <li>{check} Full business listing</li>
              <li>{check} Dofollow backlink</li>
              <li>{check} Verified profile badge</li>
              <li>{check} Review management</li>
              <li>{check} Analytics dashboard</li>
              <li>{check} Lead generation tools</li>
              <li>{check} Priority support</li>
              <li>{check} Social media integration</li>
            </ul>
            <a href="#hero" className="pricing-cta pricing-cta--primary">Join as Early Adopter</a>
          </div>

          {/* Standard */}
          <div className="pricing-card">
            <div className="pricing-badge" style={{ background: 'rgba(47,174,106,.08)', color: '#2FAE6A' }}>
              Post-Launch
            </div>
            <div className="pricing-name">Standard</div>
            <div className="pricing-desc">Regular launch pricing</div>
            <div className="pricing-price">
              <span className="pricing-currency">$</span>
              <span className="pricing-amount">240</span>
            </div>
            <div className="pricing-period">/year</div>
            <div className="pricing-note">or $999 for lifetime access</div>
            <ul className="pricing-features">
              <li>{check} Full business listing</li>
              <li>{check} Dofollow backlink</li>
              <li>{check} Verified profile badge</li>
              <li>{check} Review management</li>
              <li>{check} Analytics dashboard</li>
              <li>{check} Lead generation tools</li>
            </ul>
            <a href="#hero" className="pricing-cta">Join Waitlist</a>
          </div>
        </div>

        {/* Portfolio / Incubator offer */}
        <div className="pricing-extra">
          <div className="pricing-extra-title">Incubators &amp; Portfolio Companies</div>
          <p className="pricing-extra-desc">
            Companies with <strong>5+ tools, apps, or startups</strong> get free listings for their entire portfolio.
            Contact us to set up your portfolio account.
          </p>
        </div>
      </div>
    </section>
  )
}
