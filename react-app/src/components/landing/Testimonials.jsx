import { Link } from 'react-router-dom'

const StarSvg = () => <svg viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
const Stars5 = () => <>{[1,2,3,4,5].map(i=><StarSvg key={i}/>)}</>
const QuoteSvg = ({stroke="var(--gray-200)"}) => <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" /></svg>
const TrendUp = () => <svg viewBox="0 0 24 24" stroke="var(--emerald)" fill="none" strokeWidth="1.5"><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></svg>

export default function Testimonials() {
  return (
    <section className="section testimonials fade-section">
      <div className="container">
        <div className="section-header-row">
          <div className="section-header">
            <div className="section-label">Testimonials</div>
            <h2 className="section-title">Loved by Professionals</h2>
            <p className="section-subtitle">Hear from business owners who grew their reach and revenue through InfoWebWorld.</p>
          </div>
          <Link to="/write-review" className="view-all-link">Share Your Story <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg></Link>
        </div>
        <div className="test-proof-bar">
          <div className="test-proof-item"><svg viewBox="0 0 24 24" stroke="var(--gold)" fill="none" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg><span className="test-proof-num">4.9</span><span className="test-proof-text">avg. rating</span></div>
          <div className="test-proof-divider"></div>
          <div className="test-proof-item"><svg viewBox="0 0 24 24" stroke="var(--accent)" fill="none" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="M20 8v6M23 11h-6" /></svg><span className="test-proof-num">2,500+</span><span className="test-proof-text">businesses listed</span></div>
          <div className="test-proof-divider"></div>
          <div className="test-proof-item"><svg viewBox="0 0 24 24" stroke="var(--emerald)" fill="none" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg><span className="test-proof-num">95%</span><span className="test-proof-text">would recommend</span></div>
        </div>
        <div className="test-hero">
          <div className="test-hero-quote">
            <svg className="test-hero-quote-icon" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" /></svg>
            <p className="test-hero-text">InfoWebWorld helped us reach corporate clients we never had access to before. Within three months, our catering inquiries tripled and we expanded into two new cities. The ROI has been incredible.</p>
            <div className="test-hero-stars"><Stars5 /></div>
          </div>
          <div className="test-hero-right">
            <div className="test-hero-img">
              <img src="/images/man-restroom-reading-newspaper.jpg" alt="Business owner testimonial" loading="lazy" />
            </div>
            <div className="test-hero-author">
              <div className="test-avatar test-avatar--lg" style={{background:'var(--accent-gradient)'}}>EW</div>
              <div>
                <div className="test-name">Elena Wu</div>
                <div className="test-role">VP of Operations, FreshBite Catering</div>
                <div className="test-result"><TrendUp /><span>3x more inquiries in 90 days</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className="testimonials-grid">
          {[
            { text:"Listing our agency on InfoWebWorld was the best marketing investment we made. The dofollow backlinks boosted our SEO, and we now get 40+ qualified leads every month.", name:"David Martinez", role:"Founder, UrbanNest Realty", initials:"DM", bg:"linear-gradient(135deg,var(--emerald),var(--teal))", result:"+40 leads/mo" },
            { text:"The verified review system gave our platform instant credibility. Parents and students trust our courses because they can see authentic feedback from real learners.", name:"Rachel Lee", role:"Director, BrightPath Academy", initials:"RL", bg:"linear-gradient(135deg,var(--amber),var(--coral))", result:"+62% enrollments" },
            { text:"As a solo practitioner, I needed visibility fast. Within weeks of listing, I was getting consultations from clients who found me through InfoWebWorld search. Game changer for small firms.", name:"James Kowalski", role:"Partner, Summit Legal Group", initials:"JK", bg:"linear-gradient(135deg,var(--azure),var(--accent))", result:"+28 clients/mo" },
          ].map((t,i) => (
            <div className="test-card" key={i}>
              <div className="test-card-top"><div className="test-stars"><Stars5 /></div><svg className="test-card-quote" viewBox="0 0 24 24" fill="none" stroke="var(--gray-200)" strokeWidth="1"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" /></svg></div>
              <p className="test-text">{t.text}</p>
              <div className="test-card-footer">
                <div className="test-author">
                  <div className="test-avatar" style={{background:t.bg}}>{t.initials}</div>
                  <div><div className="test-name">{t.name}</div><div className="test-role">{t.role}</div></div>
                </div>
                <div className="test-result test-result--sm"><TrendUp /><span>{t.result}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
