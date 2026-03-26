import Link from "next/link";

export default function NotFound() {
  return (
    <div className="nf-wrap">
      {/* Floating shapes background */}
      <div className="nf-shapes" aria-hidden="true">
        <div className="nf-shape nf-shape-1" />
        <div className="nf-shape nf-shape-2" />
        <div className="nf-shape nf-shape-3" />
        <div className="nf-shape nf-shape-4" />
        <div className="nf-shape nf-shape-5" />
      </div>

      <div className="nf-content">
        {/* Logo */}
        <Link href="/" className="nf-logo-link">
          <img
            src="/logo/infowebworld-logo.png"
            alt="InfoWebWorld"
            className="nf-logo"
          />
        </Link>

        {/* Big 404 number */}
        <div className="nf-number-wrap">
          <span className="nf-digit nf-digit-4a">4</span>
          <span className="nf-digit nf-digit-0">
            <span className="nf-globe">
              <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60" cy="60" r="56" stroke="currentColor" strokeWidth="3" />
                <ellipse cx="60" cy="60" rx="28" ry="56" stroke="currentColor" strokeWidth="2.5" />
                <path d="M8 42h104M8 78h104" stroke="currentColor" strokeWidth="2" />
                <path d="M4 60h112" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
              </svg>
            </span>
          </span>
          <span className="nf-digit nf-digit-4b">4</span>
        </div>

        {/* Message */}
        <h1 className="nf-title">Page not found</h1>
        <p className="nf-subtitle">
          This page doesn&apos;t exist, was moved, or you may have typed the URL incorrectly.
          Let&apos;s get you back on track.
        </p>

        {/* CTA Buttons */}
        <div className="nf-actions">
          <Link href="/" className="nf-btn nf-btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Back to Home
          </Link>
          <Link href="/business" className="nf-btn nf-btn-secondary">
            Get Listed
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        {/* Quick links */}
        <div className="nf-links">
          <span className="nf-links-label">Or try:</span>
          <Link href="/blog" className="nf-link">Blog</Link>
          <span className="nf-dot" />
          <Link href="/business" className="nf-link">Get Listed</Link>
          <span className="nf-dot" />
          <Link href="/#pricing" className="nf-link">Pricing</Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="nf-bottom">
        <p>&copy; {new Date().getFullYear()} InfoWebWorld. All rights reserved.</p>
      </div>
    </div>
  );
}
