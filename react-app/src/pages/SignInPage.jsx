import { Link } from 'react-router-dom'
import '../styles/auth.css'

export default function SignInPage() {
  return (
    <div className="auth-wrapper">

      {/* Left: Brand Panel */}
      <div className="auth-brand">
        <div className="auth-brand-orb auth-brand-orb--1"></div>
        <div className="auth-brand-orb auth-brand-orb--2"></div>
        <div className="auth-brand-grid"></div>
        <div className="auth-brand-content">
          <div className="auth-brand-badge">
            <span className="auth-brand-badge-dot"></span>
            Trusted by 2,500+ businesses
          </div>
          <h1>Discover, compare, and review businesses across every industry</h1>
          <p>Sign in to save listings, write verified reviews, and get personalized recommendations for your business needs.</p>

          <div className="auth-stats">
            <div>
              <span className="auth-stat-num">50K+</span>
              <span className="auth-stat-text">Active users</span>
            </div>
            <div>
              <span className="auth-stat-num">2,500+</span>
              <span className="auth-stat-text">Businesses listed</span>
            </div>
            <div>
              <span className="auth-stat-num">25K+</span>
              <span className="auth-stat-text">Verified reviews</span>
            </div>
          </div>

          <div className="auth-testimonial">
            <p className="auth-testimonial-text">"InfoWebWorld helped me find the perfect project management tool for my team in under 30 minutes. The verified reviews made the decision easy."</p>
            <div className="auth-testimonial-author">
              <div className="auth-testimonial-avatar">DK</div>
              <div>
                <div className="auth-testimonial-name">David Kim</div>
                <div className="auth-testimonial-role">Engineering Manager at Stripe</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Sign In Form */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Sign in to your InfoWebWorld account</p>

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

          <div className="auth-divider"><span>or continue with email</span></div>

          <div className="auth-field">
            <label>Email Address</label>
            <input type="email" className="auth-input" placeholder="john@company.com" />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input type="password" className="auth-input" placeholder="Enter your password" />
          </div>

          <div className="auth-options">
            <label className="auth-check"><input type="checkbox" /> Remember me</label>
            <a href="#" className="auth-forgot">Forgot password?</a>
          </div>

          <button className="auth-btn">
            Sign In
            <svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>

          <button className="auth-magic">
            <svg viewBox="0 0 24 24"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8L19 13"/><path d="M15 9h0"/><path d="M17.8 6.2L19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2L11 5"/></svg>
            Send Magic Link Instead
          </button>

          <div className="auth-footer-link">
            Don't have an account? <Link to="/signup">Sign Up Free</Link>
          </div>
        </div>
      </div>

    </div>
  )
}
