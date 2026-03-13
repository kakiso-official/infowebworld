import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/auth.css'

export default function SignUpPage() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="auth-wrapper">

      {/* Left: Brand Panel */}
      <div className="auth-brand auth-brand--signup">
        <div className="auth-brand-orb auth-brand-orb--1"></div>
        <div className="auth-brand-orb auth-brand-orb--2"></div>
        <div className="auth-brand-grid"></div>
        <div className="auth-brand-content">
          <div className="auth-brand-badge">
            <span className="auth-brand-badge-dot"></span>
            Free forever. No credit card.
          </div>
          <h1>Join 50,000+ professionals discovering the best businesses</h1>
          <p>Create your free account to save listings, write reviews, and get personalized recommendations.</p>

          <div className="auth-benefits">
            <div className="auth-benefit">
              <div className="auth-benefit-icon" style={{background:'rgba(108,114,241,.12)'}}>
                <svg viewBox="0 0 24 24" stroke="var(--accent)"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                <div className="auth-benefit-title">Write Verified Reviews</div>
                <div className="auth-benefit-desc">Share your experience and help others make better decisions</div>
              </div>
            </div>
            <div className="auth-benefit">
              <div className="auth-benefit-icon" style={{background:'rgba(47,174,106,.12)'}}>
                <svg viewBox="0 0 24 24" stroke="var(--emerald)"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
              </div>
              <div>
                <div className="auth-benefit-title">Save &amp; Compare Businesses</div>
                <div className="auth-benefit-desc">Build your shortlist and compare side-by-side with detailed matrices</div>
              </div>
            </div>
            <div className="auth-benefit">
              <div className="auth-benefit-icon" style={{background:'rgba(59,130,246,.12)'}}>
                <svg viewBox="0 0 24 24" stroke="var(--azure)"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </div>
              <div>
                <div className="auth-benefit-title">Get Personalized Alerts</div>
                <div className="auth-benefit-desc">Be the first to know about new businesses in your categories</div>
              </div>
            </div>
          </div>

          <div className="auth-testimonial">
            <p className="auth-testimonial-text">"Within a week of listing on InfoWebWorld, we received 12 qualified leads. The platform pays for itself."</p>
            <div className="auth-testimonial-author">
              <div className="auth-testimonial-avatar auth-testimonial-avatar--alt">EW</div>
              <div>
                <div className="auth-testimonial-name">Elena Wu</div>
                <div className="auth-testimonial-role">VP of Operations, FreshBite Catering</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Sign Up Form */}
      <div className="auth-form-panel auth-form-panel--signup">
        <div className="auth-card auth-card--signup">
          <h2>Create your account</h2>
          <p className="auth-subtitle">Free forever. No credit card required.</p>

          <div className="auth-toggle">
            <button className={`auth-toggle-btn${activeTab === 0 ? ' active' : ''}`} onClick={() => setActiveTab(0)}>I want to discover</button>
            <button className={`auth-toggle-btn${activeTab === 1 ? ' active' : ''}`} onClick={() => setActiveTab(1)}>I want to list my business</button>
          </div>

          <div className="auth-social">
            <button className="auth-social-btn">
              <svg viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button className="auth-social-btn">
              <svg viewBox="0 0 24 24" fill="var(--gray-900)"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </button>
            <button className="auth-social-btn">
              <svg viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </button>
          </div>

          <div className="auth-divider"><span>or sign up with email</span></div>

          <div className="auth-row">
            <div className="auth-field">
              <label>First Name</label>
              <input type="text" className="auth-input" placeholder="John" />
            </div>
            <div className="auth-field">
              <label>Last Name</label>
              <input type="text" className="auth-input" placeholder="Doe" />
            </div>
          </div>
          <div className="auth-field">
            <label>Work Email</label>
            <input type="email" className="auth-input" placeholder="john@company.com" />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input type="password" className="auth-input" placeholder="8+ characters, mix of letters & numbers" />
            <div className="auth-pw-strength">
              <div className="auth-pw-bar"></div>
              <div className="auth-pw-bar"></div>
              <div className="auth-pw-bar"></div>
              <div className="auth-pw-bar"></div>
            </div>
          </div>

          <button className="auth-btn">
            Create Account
            <svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>

          <div className="auth-terms">
            By creating an account, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
          </div>

          <div className="auth-footer-link">
            Already have an account? <Link to="/signin">Sign In</Link>
          </div>
        </div>
      </div>

    </div>
  )
}
