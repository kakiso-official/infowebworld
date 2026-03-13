import { Link } from 'react-router-dom'
import Navbar from '../components/shared/Navbar'
import Footer from '../components/shared/Footer'
import SubmitListingForm from '../components/submit-listing/SubmitListingForm'
import '../styles/submit-listing.css'

export default function SubmitListingPage() {
  return (
    <>
      <Navbar />

      {/* ===== HERO ===== */}
      <div className="sl-hero">
        <div className="container">
          <div className="sl-hero-inner">
            <div className="sl-hero-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
              FREE LISTING AVAILABLE
            </div>
            <h1>Get Your Business Listed on InfoWebWorld</h1>
            <p>
              Join 12,000+ businesses already growing through verified directory listings.
              Get discovered by qualified buyers, earn valuable backlinks, and build trust with authentic reviews.
            </p>
            <div className="sl-hero-stats">
              <div className="sl-hero-stat">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                <strong>12,000+</strong> businesses listed
              </div>
              <span className="sl-hero-stat-div" />
              <div className="sl-hero-stat">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                <strong>2.4M</strong> monthly visitors
              </div>
              <span className="sl-hero-stat-div" />
              <div className="sl-hero-stat">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>
                <strong>4.8/5</strong> avg. satisfaction
              </div>
              <span className="sl-hero-stat-div" />
              <div className="sl-hero-stat">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--azure)" strokeWidth="1.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                <strong>DA 50+</strong> dofollow backlinks
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FORM ===== */}
      <SubmitListingForm />

      <Footer />
    </>
  )
}
