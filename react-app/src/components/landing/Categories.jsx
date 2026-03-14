import { Link } from 'react-router-dom'

const cats = [
  { slug:'technology', name:'Technology & SaaS', desc:'Cloud platforms, dev tools, AI products, and enterprise software', count:'520+', iconBg:'rgba(108,114,241,.12)', color:'var(--accent)', icon:<><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>, badge:'Trending', img:'/images/Gusranda26 Author Portfolio _ Freepik.jpeg' },
  { slug:'restaurants', name:'Restaurants & Food', desc:'Dining, cafes, catering services, food delivery, and bakeries', count:'480+', iconBg:'rgba(239,107,74,.12)', color:'var(--coral)', icon:<><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></>, badge:'Trending', img:'/images/anthropomorphic-portrait-animal-dressed-human-clothes-doing-daily-activities.jpg' },
  { slug:'marketing', name:'Marketing & Creative', desc:'Digital agencies, branding, SEO, social media, and design studios', count:'420+', iconBg:'rgba(236,72,153,.12)', color:'var(--rose)', icon:<><path d="m3 11 18-5v12L3 13v-2z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></>, img:'/images/front-view-woman-reading-newspaper.jpg' },
  { slug:'healthcare', name:'Healthcare & Wellness', desc:'Clinics, therapists, fitness centers, pharmacies, and telehealth', count:'390+', iconBg:'rgba(47,174,106,.12)', color:'var(--emerald)', icon:<path d="M22 12h-4l-3 9L9 3l-3 9H2" />, img:'/images/Homeopathy Close Up.jpeg' },
  { slug:'homeservices', name:'Home Services & Trades', desc:'Plumbing, electrical, cleaning, landscaping, and renovations', count:'360+', iconBg:'rgba(245,158,11,.12)', color:'var(--amber)', icon:<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />, img:'/images/man-restroom-reading-newspaper.jpg' },
  { slug:'realestate', name:'Real Estate & Property', desc:'Agents, property management, commercial leasing, and appraisals', count:'350+', iconBg:'rgba(59,130,246,.12)', color:'var(--azure)', icon:<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>, img:'/images/Office 📍.jpeg' },
  { slug:'legal', name:'Legal & Financial', desc:'Law firms, accountants, tax advisors, insurance, and consulting', count:'310+', iconBg:'rgba(139,92,246,.12)', color:'var(--plum)', icon:<><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" /></>, img:'/images/#fitness #workout #gym #gymlife #health….jpeg' },
  { slug:'education', name:'Education & Training', desc:'Online courses, tutoring, corporate training, and certifications', count:'280+', iconBg:'rgba(20,184,166,.12)', color:'var(--teal)', icon:<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>, img:'/images/Gusranda26 Author Portfolio _ Freepik.jpeg' },
]

export default function Categories() {
  return (
    <section className="section fade-section">
      <div className="container">
        <div className="section-header-row">
          <div className="section-header">
            <div className="section-label">Explore</div>
            <h2 className="section-title">Browse by Industry</h2>
            <p className="section-subtitle">Discover top-rated businesses across the industries that matter most.</p>
          </div>
          <Link to="/category" className="view-all-link">View All Industries <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg></Link>
        </div>
        <div className="categories-grid">
          {cats.map(c => (
            <Link to={`/category?cat=${c.slug}`} className="cat-card" key={c.slug}>
              <div className="cat-card-top cat-card-top--img">
                <img src={c.img} alt={c.name} loading="lazy" />
                <div className="cat-card-overlay">
                  <span className="cat-icon-lg" style={{background:c.iconBg}}><svg viewBox="0 0 24 24" stroke={c.color}>{c.icon}</svg></span>
                  {c.badge && <span className="cat-badge cat-badge--hot">{c.badge}</span>}
                </div>
              </div>
              <div className="cat-card-body">
                <div className="cat-name">{c.name}</div>
                <div className="cat-desc">{c.desc}</div>
                <div className="cat-meta">
                  <span className="cat-count">{c.count} listings</span>
                  <span className="cat-arrow"><svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
