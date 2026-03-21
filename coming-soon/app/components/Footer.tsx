import Link from 'next/link'

const bp = ''

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        {/* Top row: Logo + tagline */}
        <div className="footer-top">
          <div className="footer-brand">
            <img src={`${bp}/logo/infowebworld-logo.png`} alt="InfoWebWorld" className="footer-logo" />
            <p className="footer-tagline">
              The global business discovery platform. Search, compare, and review businesses across 80+ industries in 12 countries.
            </p>
          </div>

          <div className="footer-columns">
            <div className="footer-col">
              <h4 className="footer-col-title">Company</h4>
              <a href="#benefits" className="footer-col-link">Benefits</a>
              <a href="#pricing" className="footer-col-link">Pricing</a>
              <a href="#how-it-works" className="footer-col-link">How It Works</a>
              <a href="#compare" className="footer-col-link">Compare</a>
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">Get Started</h4>
              <Link href="/get-listed" className="footer-col-link">Get Listed</Link>
              <a href="#hero" className="footer-col-link">Join Waitlist</a>
              <a href="mailto:hello@infowebworld.com" className="footer-col-link">Contact Us</a>
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">Legal</h4>
              <a href="#" className="footer-col-link">Privacy Policy</a>
              <a href="#" className="footer-col-link">Terms of Service</a>
              <a href="#" className="footer-col-link">Cookie Policy</a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Bottom row: Copyright + social */}
        <div className="footer-bottom">
          <span className="footer-copy">&copy; {new Date().getFullYear()} InfoWebWorld. All rights reserved.</span>

          <div className="footer-social">
            <a href="#" aria-label="Twitter / X">
              <svg viewBox="0 0 24 24"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
            </a>
            <a href="#" aria-label="YouTube">
              <svg viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
