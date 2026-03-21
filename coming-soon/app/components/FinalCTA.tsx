'use client'
import Link from 'next/link'

export default function FinalCTA() {
  return (
    <section className="final-cta-section">
      <div className="container">
        <div className="final-cta-inner">
          <div className="section-tag">Don&apos;t Miss Out</div>
          <h2 className="section-title">The Pioneer Tier Is <em>72% Full</em></h2>
          <p className="section-desc">
            Lock in your founding member pricing before spots run out. Join 2,847+ businesses already on the waitlist.
          </p>
          <form className="final-cta-form" onSubmit={e => e.preventDefault()}>
            <input type="email" className="final-input" placeholder="Enter your email" required />
            <button type="submit" className="final-btn">Join Waitlist</button>
          </form>
          <div style={{ marginTop: '1rem' }}>
            <Link href="/get-listed" className="final-listed-link">
              or <strong>Get Listed Now</strong> &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
