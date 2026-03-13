import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const [email, setEmail] = useState('')

  return (
    <footer className="s-footer">
      <div className="s-container">
        <div className="s-footer-grid">
          <div className="s-footer-brand">
            <div className="s-footer-brand-logo"><img src="/logo/infowebworld-logo.png" alt="InfoWebWorld" /></div>
            <p className="s-footer-brand-desc">The trusted global directory for discovering, comparing, and reviewing businesses across every industry. From local services to enterprise solutions.</p>
            <div className="s-footer-newsletter">
              <div className="s-footer-newsletter-wrap">
                <svg className="s-footer-newsletter-icon" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
                <button>Subscribe</button>
              </div>
              <span className="s-footer-newsletter-hint">Weekly industry insights. No spam.</span>
            </div>
          </div>
          <div>
            <div className="s-footer-col-title">Platform</div>
            <ul className="s-footer-links">
              <li><Link to="/search">Browse Listings</Link></li>
              <li><Link to="/category">Categories</Link></li>
              <li><Link to="/comparison">Comparisons</Link></li>
              <li><Link to="/news">News</Link></li>
              <li><Link to="/best-of">Trending</Link></li>
              <li><Link to="/write-review">Write a Review</Link></li>
            </ul>
          </div>
          <div>
            <div className="s-footer-col-title">Company</div>
            <ul className="s-footer-links">
              <li><Link to="/about">About</Link></li>
              <li><a href="#">Careers</a></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><a href="#">Press</a></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <div className="s-footer-col-title">For Businesses</div>
            <ul className="s-footer-links">
              <li><Link to="/submit-listing">Get Listed</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/dashboard">Vendor Dashboard</Link></li>
              <li><Link to="/submit-listing">Claim Your Listing</Link></li>
              <li><a href="#">Advertising</a></li>
              <li><a href="#">API Access</a></li>
            </ul>
          </div>
        </div>
        <div className="s-footer-bottom">
          <div className="s-footer-bottom-left">
            <span className="s-footer-copy">2026 InfoWebWorld. All rights reserved.</span>
            <div className="s-footer-legal"><a href="#">Terms</a><a href="#">Privacy</a><a href="#">Cookies</a></div>
          </div>
          <div className="s-footer-bottom-right">
            <div className="s-footer-socials">
              <a href="#" aria-label="Twitter"><svg viewBox="0 0 24 24"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg></a>
              <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg></a>
              <a href="#" aria-label="GitHub"><svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg></a>
              <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg></a>
            </div>
            <div className="s-footer-lang">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              <span>English (US)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
