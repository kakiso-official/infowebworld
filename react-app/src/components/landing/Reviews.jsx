import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const StarSvg = ({filled=true}) => <svg viewBox="0 0 24 24" fill={filled?"var(--gold)":"none"} stroke="var(--gold)" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
const Stars5 = () => <>{[1,2,3,4,5].map(i=><StarSvg key={i}/>)}</>
const VerifiedBadge = () => <span className="review-verified-badge"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg> Verified</span>
const ThumbSvg = () => <svg viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>

const heroReviews = [
  {
    biz: 'the-garden-table', bizName: 'The Garden Table', bizCat: 'Restaurant & Cafe',
    iconBg: 'rgba(239,107,74,.1)', iconColor: 'var(--coral)',
    iconPath: <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></>,
    title: '"An absolutely transformative dining experience"',
    text: 'The Garden Table exceeded every expectation. The seasonal tasting menu was exquisite, and the service was impeccable. From the moment we walked in, the ambiance felt warm yet sophisticated. Already booked our next visit.',
    name: 'Sarah Mitchell', initials: 'SM', avatarBg: 'var(--accent-gradient)',
    role: 'Food blogger · 1 hour ago', helpful: 42,
  },
  {
    biz: 'cloudsync-pro', bizName: 'CloudSync Pro', bizCat: 'Technology & SaaS',
    iconBg: 'rgba(108,114,241,.1)', iconColor: 'var(--accent)',
    iconPath: <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />,
    title: '"Migrated our entire stack in a weekend"',
    text: 'CloudSync Pro made what we thought would be a month-long migration into a weekend project. The automation tools are incredible, and their support team was available 24/7 during the transition. Our uptime has been 99.99% since.',
    name: 'James Kim', initials: 'JK', avatarBg: 'linear-gradient(135deg,var(--plum),var(--rose))',
    role: 'CTO at DataLayer · 3 hours ago', helpful: 67,
  },
  {
    biz: 'brightpath-academy', bizName: 'BrightPath Academy', bizCat: 'Education & Training',
    iconBg: 'rgba(20,184,166,.1)', iconColor: 'var(--teal)',
    iconPath: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>,
    title: '"Career-changing courses with real mentors"',
    text: 'Completed three certifications in six months. The instructors are actual industry professionals, not just lecturers. The career support team helped me land a role at a Fortune 500 company within weeks of finishing.',
    name: 'Aisha Patel', initials: 'AP', avatarBg: 'linear-gradient(135deg,var(--teal),var(--azure))',
    role: 'Product Designer · 5 hours ago', helpful: 38,
  },
  {
    biz: 'precisionfix-plumbing', bizName: 'PrecisionFix Plumbing', bizCat: 'Home Services',
    iconBg: 'rgba(245,158,11,.1)', iconColor: 'var(--amber)',
    iconPath: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
    title: '"Lifesavers at midnight — absolutely professional"',
    text: 'Called at 11pm with a burst pipe flooding our kitchen. They arrived in 30 minutes, had everything fixed within the hour, and the pricing was completely fair. No hidden fees, just honest work.',
    name: 'Laura Thompson', initials: 'LT', avatarBg: 'linear-gradient(135deg,var(--emerald),var(--teal))',
    role: 'Homeowner · 8 hours ago', helpful: 51,
  },
]

export default function Reviews() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % heroReviews.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const r = heroReviews[current]

  return (
    <section className="section fade-section">
      <div className="container">
        <div className="section-header-row">
          <div className="section-header">
            <div className="section-label">Community</div>
            <h2 className="section-title">Recent Reviews</h2>
            <p className="section-subtitle">Real feedback from verified customers across every industry.</p>
          </div>
          <Link to="/write-review" className="view-all-link">Write a Review <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg></Link>
        </div>
        <div className="review-stats-bar">
          <div className="review-stat-pill"><StarSvg /><span className="review-stat-num">4.8</span><span className="review-stat-text">average rating</span></div>
          <div className="review-stat-divider"></div>
          <div className="review-stat-pill"><svg viewBox="0 0 24 24" stroke="var(--accent)" fill="none" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg><span className="review-stat-num">25,400+</span><span className="review-stat-text">reviews posted</span></div>
          <div className="review-stat-divider"></div>
          <div className="review-stat-pill"><svg viewBox="0 0 24 24" stroke="var(--emerald)" fill="none" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg><span className="review-stat-num">98%</span><span className="review-stat-text">verified</span></div>
        </div>
        <div className="reviews-layout">
          {/* Spotlight hero review */}
          <Link to={`/listing?biz=${r.biz}`} className="review-spotlight">
            <div className="review-spotlight-accent"></div>
            <div className="review-spotlight-body">
              <div className="review-spotlight-top">
                <div className="review-spotlight-quote">"</div>
                <div className="review-stars review-stars--lg"><Stars5 /></div>
              </div>
              <h3 className="review-spotlight-title review-hero-fade" key={`title-${current}`}>{r.title}</h3>
              <p className="review-spotlight-text review-hero-fade" key={`text-${current}`}>{r.text}</p>
              <div className="review-spotlight-footer review-hero-fade" key={`meta-${current}`}>
                <div className="review-spotlight-biz">
                  <div className="review-biz-icon" style={{background:r.iconBg}}><svg viewBox="0 0 24 24" stroke={r.iconColor} fill="none" strokeWidth="1.5">{r.iconPath}</svg></div>
                  <div><div className="review-biz-name">{r.bizName}</div><div className="review-biz-cat">{r.bizCat}</div></div>
                </div>
                <div className="review-spotlight-sep"></div>
                <div className="review-author">
                  <div className="review-avatar" style={{background:r.avatarBg}}>{r.initials}</div>
                  <div><div className="review-name">{r.name} <VerifiedBadge /></div><div className="review-meta">{r.role}</div></div>
                </div>
                <div className="review-spotlight-sep review-spotlight-sep--mobile-hide"></div>
                <div className="review-helpful"><ThumbSvg />{r.helpful} found this helpful</div>
              </div>
            </div>
          </Link>
          <div className="review-hero-dots">
            {heroReviews.map((_, i) => (
              <button key={i} className={`review-hero-dot${i === current ? ' active' : ''}`} onClick={e => { e.preventDefault(); setCurrent(i) }} aria-label={`Review ${i + 1}`} />
            ))}
          </div>
          <div className="reviews-grid-v2">
            {[
              { biz:'cloudsync-pro', bizName:'CloudSync Pro', bizCat:'Technology & SaaS', iconBg:'rgba(108,114,241,.1)', iconColor:'var(--accent)', iconPath:<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />, text:'"Migrating our entire infrastructure to CloudSync was seamless. Their support team is responsive and incredibly knowledgeable."', name:'James Kim', role:'CTO at DataLayer · 3h ago', initials:'JK', avatarBg:'linear-gradient(135deg,var(--plum),var(--rose))', helpful:28, stars:5 },
              { biz:'brightpath-academy', bizName:'BrightPath Academy', bizCat:'Education & Training', iconBg:'rgba(20,184,166,.1)', iconColor:'var(--teal)', iconPath:<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>, text:'"Completed three certifications in six months. The courses are well-structured, instructors engaging, and the career support is genuinely helpful."', name:'Aisha Patel', role:'Product Designer · 5h ago', initials:'AP', avatarBg:'linear-gradient(135deg,var(--teal),var(--azure))', helpful:19, stars:5 },
              { biz:'urbannest-realty', bizName:'UrbanNest Realty', bizCat:'Real Estate & Property', iconBg:'rgba(59,130,246,.1)', iconColor:'var(--azure)', iconPath:<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>, text:'"Found our dream home in under two weeks. Our agent was proactive, transparent about pricing, and handled everything professionally."', name:'Marcus Rivera', role:'First-time buyer · 6h ago', initials:'MR', avatarBg:'linear-gradient(135deg,var(--coral),var(--amber))', helpful:34, stars:4 },
              { biz:'precisionfix-plumbing', bizName:'PrecisionFix Plumbing', bizCat:'Home Services', iconBg:'rgba(245,158,11,.1)', iconColor:'var(--amber)', iconPath:<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />, text:'"Called at 11pm with a burst pipe. They arrived in 30 minutes, fixed everything, and the pricing was completely fair."', name:'Laura Thompson', role:'Homeowner · 8h ago', initials:'LT', avatarBg:'linear-gradient(135deg,var(--emerald),var(--teal))', helpful:51, stars:5 },
            ].map((r,i) => (
              <Link to={`/listing?biz=${r.biz}`} className="review-card-v2" key={i}>
                <div className="review-card-top">
                  <div className="review-biz-info">
                    <div className="review-biz-icon" style={{background:r.iconBg}}><svg viewBox="0 0 24 24" stroke={r.iconColor} fill="none" strokeWidth="1.5">{r.iconPath}</svg></div>
                    <div><div className="review-biz-name">{r.bizName}</div><div className="review-biz-cat">{r.bizCat}</div></div>
                  </div>
                  <div className="review-stars">{Array.from({length:5},(_, si) => <StarSvg key={si} filled={si < r.stars} />)}</div>
                </div>
                <p className="review-text-v2">{r.text}</p>
                <div className="review-card-footer">
                  <div className="review-author">
                    <div className="review-avatar" style={{background:r.avatarBg}}>{r.initials}</div>
                    <div><div className="review-name">{r.name} <VerifiedBadge /></div><div className="review-meta">{r.role}</div></div>
                  </div>
                  <div className="review-helpful-sm"><ThumbSvg />{r.helpful}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
