import { Link } from 'react-router-dom'

const StarSvg = ({filled=true}) => <svg viewBox="0 0 24 24" fill={filled?"var(--gold)":"none"} stroke="var(--gold)" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
const Stars5 = () => <>{[1,2,3,4,5].map(i=><StarSvg key={i}/>)}</>

const LikeSvg = () => <svg viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
const DislikeSvg = () => <svg viewBox="0 0 24 24"><path d="M10 15V19a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" /><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" /></svg>
const SaveSvg = () => <svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
const ShareSvg = () => <svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>

function ActionBar({likes, dislikes}) {
  return (
    <div className="listing-actions">
      <button className="listing-act listing-act--like" aria-label="Like" onClick={e => e.currentTarget.classList.toggle('active')}>
        <LikeSvg />{likes != null && <span className="listing-act-count">{likes}</span>}
      </button>
      <button className="listing-act listing-act--dislike" aria-label="Dislike" onClick={e => e.currentTarget.classList.toggle('active')}>
        <DislikeSvg />{dislikes != null && <span className="listing-act-count">{dislikes}</span>}
      </button>
      <button className="listing-act listing-act--save" aria-label="Save" onClick={e => e.currentTarget.classList.toggle('active')}>
        <SaveSvg />
      </button>
      <button className="listing-act listing-act--share" aria-label="Share" onClick={e => e.currentTarget.classList.toggle('active')}>
        <ShareSvg />
      </button>
    </div>
  )
}

export default function Featured() {
  return (
    <section className="section featured fade-section">
      <div className="container">
        <div className="section-header-row">
          <div className="section-header">
            <div className="section-label">Curated</div>
            <h2 className="section-title">Featured Listings</h2>
            <p className="section-subtitle">Hand-picked businesses with verified reviews</p>
          </div>
          <Link to="/search" className="view-all-link">View All Businesses <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg></Link>
        </div>
        <div className="featured-masonry">

          {/* 1. CloudSync Pro - TALL + IMAGE */}
          <div className="listing-card listing-card--tall">
            <Link to="/listing?biz=cloudsync-pro" className="listing-link">
              <div className="listing-top listing-top--img">
                <img src="/images/Gusranda26 Author Portfolio _ Freepik.jpeg" alt="CloudSync Pro" loading="lazy" />
                <span className="listing-badge listing-badge--featured">Featured</span>
              </div>
              <div className="listing-body">
                <div className="listing-meta-row">
                  <span className="listing-category" style={{background:'rgba(108,114,241,.08)',color:'var(--accent)'}}>Technology &amp; SaaS</span>
                  <span className="listing-price">$29/mo</span>
                </div>
                <div className="listing-title">CloudSync Pro</div>
                <div className="listing-tagline">Enterprise cloud management platform for modern teams. Seamless deployment, real-time monitoring, and auto-scaling infrastructure.</div>
                <div className="listing-rating-row">
                  <div className="listing-stars"><Stars5 /></div>
                  <span className="listing-score">4.8</span>
                  <span className="listing-reviews">(412 reviews)</span>
                </div>
              </div>
            </Link>
            <ActionBar likes={124} dislikes={8} />
          </div>

          {/* 2. The Garden Table - SHORT */}
          <div className="listing-card listing-card--short">
            <Link to="/listing?biz=the-garden-table" className="listing-link">
              <div className="listing-top" style={{background:'linear-gradient(135deg,rgba(239,107,74,.14),rgba(245,158,11,.08))'}}>
                <div className="listing-icon-wrap">
                  <svg viewBox="0 0 24 24" stroke="var(--coral)"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></svg>
                </div>
                <span className="listing-badge listing-badge--verified">Verified</span>
              </div>
              <div className="listing-body">
                <div className="listing-meta-row">
                  <span className="listing-category" style={{background:'rgba(239,107,74,.08)',color:'var(--coral)'}}>Restaurant &amp; Cafe</span>
                  <span className="listing-price">$$$</span>
                </div>
                <div className="listing-title">The Garden Table</div>
                <div className="listing-tagline">Award-winning farm-to-table dining with seasonal menus.</div>
                <div className="listing-rating-row">
                  <div className="listing-stars"><Stars5 /></div>
                  <span className="listing-score">4.9</span>
                  <span className="listing-reviews">(287)</span>
                </div>
              </div>
            </Link>
            <ActionBar likes={89} dislikes={3} />
          </div>

          {/* 3. MindBridge Wellness - REGULAR + IMAGE */}
          <div className="listing-card">
            <Link to="/listing?biz=mindbridge-wellness" className="listing-link">
              <div className="listing-top listing-top--img">
                <img src="/images/Homeopathy Close Up.jpeg" alt="MindBridge Wellness" loading="lazy" />
                <span className="listing-badge listing-badge--new">New</span>
              </div>
              <div className="listing-body">
                <div className="listing-meta-row">
                  <span className="listing-category" style={{background:'rgba(47,174,106,.08)',color:'var(--emerald)'}}>Healthcare</span>
                  <span className="listing-price">Free consult</span>
                </div>
                <div className="listing-title">MindBridge Wellness</div>
                <div className="listing-tagline">Holistic mental health platform connecting patients with certified therapists.</div>
                <div className="listing-rating-row">
                  <div className="listing-stars"><Stars5 /></div>
                  <span className="listing-score">4.7</span>
                  <span className="listing-reviews">(198)</span>
                </div>
              </div>
            </Link>
            <ActionBar likes={67} dislikes={5} />
          </div>

          {/* 4. UrbanNest Realty - SHORT */}
          <div className="listing-card listing-card--short">
            <Link to="/listing?biz=urbannest-realty" className="listing-link">
              <div className="listing-top" style={{background:'linear-gradient(135deg,rgba(59,130,246,.14),rgba(108,114,241,.08))'}}>
                <div className="listing-icon-wrap">
                  <svg viewBox="0 0 24 24" stroke="var(--azure)"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                </div>
                <span className="listing-badge listing-badge--featured">Featured</span>
              </div>
              <div className="listing-body">
                <div className="listing-meta-row">
                  <span className="listing-category" style={{background:'rgba(59,130,246,.08)',color:'var(--azure)'}}>Real Estate</span>
                  <span className="listing-price">Commission</span>
                </div>
                <div className="listing-title">UrbanNest Realty</div>
                <div className="listing-tagline">Full-service property management and residential sales across 30+ cities. Trusted by over 5,000 homeowners for buying, selling, and renting.</div>
                <div className="listing-rating-row">
                  <div className="listing-stars"><Stars5 /></div>
                  <span className="listing-score">4.6</span>
                  <span className="listing-reviews">(345)</span>
                </div>
              </div>
            </Link>
            <ActionBar likes={203} dislikes={12} />
          </div>

          {/* 5. BrightPath Academy - TALL */}
          <div className="listing-card listing-card--tall">
            <Link to="/listing?biz=brightpath-academy" className="listing-link">
              <div className="listing-top" style={{background:'linear-gradient(135deg,rgba(20,184,166,.14),rgba(59,130,246,.08))'}}>
                <div className="listing-icon-wrap">
                  <svg viewBox="0 0 24 24" stroke="var(--teal)"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                </div>
                <span className="listing-badge listing-badge--verified">Verified</span>
              </div>
              <div className="listing-body">
                <div className="listing-meta-row">
                  <span className="listing-category" style={{background:'rgba(20,184,166,.08)',color:'var(--teal)'}}>Education</span>
                  <span className="listing-price">$15/mo</span>
                </div>
                <div className="listing-title">BrightPath Academy</div>
                <div className="listing-tagline">Online learning platform with 500+ courses from industry professionals.</div>
                <div className="listing-rating-row">
                  <div className="listing-stars"><Stars5 /></div>
                  <span className="listing-score">4.8</span>
                  <span className="listing-reviews">(523)</span>
                </div>
              </div>
            </Link>
            <ActionBar likes={156} dislikes={6} />
          </div>

          {/* 6. CreativeForge Studio - SHORT */}
          <div className="listing-card listing-card--short">
            <Link to="/listing?biz=creativeforge-studio" className="listing-link">
              <div className="listing-top" style={{background:'linear-gradient(135deg,rgba(236,72,153,.14),rgba(239,107,74,.08))'}}>
                <div className="listing-icon-wrap">
                  <svg viewBox="0 0 24 24" stroke="var(--rose)"><path d="m3 11 18-5v12L3 13v-2z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>
                </div>
                <span className="listing-badge listing-badge--new">New</span>
              </div>
              <div className="listing-body">
                <div className="listing-meta-row">
                  <span className="listing-category" style={{background:'rgba(236,72,153,.08)',color:'var(--rose)'}}>Marketing</span>
                  <span className="listing-price">Custom</span>
                </div>
                <div className="listing-title">CreativeForge Studio</div>
                <div className="listing-tagline">Brand strategy, design, and digital marketing agency for growing businesses.</div>
                <div className="listing-rating-row">
                  <div className="listing-stars"><Stars5 /></div>
                  <span className="listing-score">4.5</span>
                  <span className="listing-reviews">(267)</span>
                </div>
              </div>
            </Link>
            <ActionBar likes={45} dislikes={2} />
          </div>

          {/* 7. PrecisionFix Plumbing - TALL, DESKTOP ONLY */}
          <div className="listing-card listing-card--tall listing-card--desktop-only">
            <Link to="/listing?biz=precisionfix-plumbing" className="listing-link">
              <div className="listing-top" style={{background:'linear-gradient(135deg,rgba(245,158,11,.14),rgba(239,107,74,.08))'}}>
                <div className="listing-icon-wrap">
                  <svg viewBox="0 0 24 24" stroke="var(--amber)"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
                </div>
                <span className="listing-badge listing-badge--verified">Verified</span>
              </div>
              <div className="listing-body">
                <div className="listing-meta-row">
                  <span className="listing-category" style={{background:'rgba(245,158,11,.08)',color:'var(--amber)'}}>Home Services</span>
                  <span className="listing-price">From $75</span>
                </div>
                <div className="listing-title">PrecisionFix Plumbing</div>
                <div className="listing-tagline">24/7 emergency plumbing, renovations, and maintenance for homes and offices.</div>
                <div className="listing-rating-row">
                  <div className="listing-stars"><Stars5 /></div>
                  <span className="listing-score">4.9</span>
                  <span className="listing-reviews">(178)</span>
                </div>
              </div>
            </Link>
            <ActionBar likes={92} dislikes={4} />
          </div>

          {/* 8. Summit Legal Group - REGULAR + IMAGE, DESKTOP ONLY */}
          <div className="listing-card listing-card--desktop-only">
            <Link to="/listing?biz=summit-legal" className="listing-link">
              <div className="listing-top listing-top--img">
                <img src="/images/Office 📍.jpeg" alt="Summit Legal Group" loading="lazy" />
                <span className="listing-badge listing-badge--featured">Featured</span>
              </div>
              <div className="listing-body">
                <div className="listing-meta-row">
                  <span className="listing-category" style={{background:'rgba(139,92,246,.08)',color:'var(--plum)'}}>Legal &amp; Financial</span>
                  <span className="listing-price">Consultation</span>
                </div>
                <div className="listing-title">Summit Legal Group</div>
                <div className="listing-tagline">Award-winning law firm specializing in business law, intellectual property, and corporate mergers. Trusted by Fortune 500 companies and startups alike.</div>
                <div className="listing-rating-row">
                  <div className="listing-stars"><Stars5 /></div>
                  <span className="listing-score">4.7</span>
                  <span className="listing-reviews">(312)</span>
                </div>
              </div>
            </Link>
            <ActionBar likes={187} dislikes={9} />
          </div>

          {/* 9. Evergreen Fitness Co - TALL + IMAGE, DESKTOP ONLY */}
          <div className="listing-card listing-card--tall listing-card--desktop-only">
            <Link to="/listing?biz=evergreen-fitness" className="listing-link">
              <div className="listing-top listing-top--img">
                <img src="/images/#fitness #workout #gym #gymlife #health….jpeg" alt="Evergreen Fitness Co" loading="lazy" />
                <span className="listing-badge listing-badge--new">New</span>
              </div>
              <div className="listing-body">
                <div className="listing-meta-row">
                  <span className="listing-category" style={{background:'rgba(20,184,166,.08)',color:'var(--teal)'}}>Fitness &amp; Wellness</span>
                  <span className="listing-price">$49/mo</span>
                </div>
                <div className="listing-title">Evergreen Fitness Co</div>
                <div className="listing-tagline">Boutique gym with personal training, group classes, and nutrition coaching.</div>
                <div className="listing-rating-row">
                  <div className="listing-stars"><Stars5 /></div>
                  <span className="listing-score">4.8</span>
                  <span className="listing-reviews">(234)</span>
                </div>
              </div>
            </Link>
            <ActionBar likes={78} dislikes={2} />
          </div>

          {/* 10. NovaByte Analytics - SHORT, DESKTOP ONLY */}
          <div className="listing-card listing-card--short listing-card--desktop-only">
            <Link to="/listing?biz=novabyte-analytics" className="listing-link">
              <div className="listing-top" style={{background:'linear-gradient(135deg,rgba(59,130,246,.14),rgba(139,92,246,.08))'}}>
                <div className="listing-icon-wrap">
                  <svg viewBox="0 0 24 24" stroke="var(--azure)"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4z" /></svg>
                </div>
                <span className="listing-badge listing-badge--verified">Verified</span>
              </div>
              <div className="listing-body">
                <div className="listing-meta-row">
                  <span className="listing-category" style={{background:'rgba(59,130,246,.08)',color:'var(--azure)'}}>Data &amp; Analytics</span>
                  <span className="listing-price">$99/mo</span>
                </div>
                <div className="listing-title">NovaByte Analytics</div>
                <div className="listing-tagline">Real-time business intelligence dashboards for data-driven decisions.</div>
                <div className="listing-rating-row">
                  <div className="listing-stars"><Stars5 /></div>
                  <span className="listing-score">4.6</span>
                  <span className="listing-reviews">(189)</span>
                </div>
              </div>
            </Link>
            <ActionBar likes={63} dislikes={3} />
          </div>

          {/* 11. Bloom Florist & Events - TALL, DESKTOP ONLY */}
          <div className="listing-card listing-card--tall listing-card--desktop-only">
            <Link to="/listing?biz=bloom-florist" className="listing-link">
              <div className="listing-top" style={{background:'linear-gradient(135deg,rgba(236,72,153,.14),rgba(245,158,11,.08))'}}>
                <div className="listing-icon-wrap">
                  <svg viewBox="0 0 24 24" stroke="var(--rose)"><path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m7.5 0a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 4.5V15" /></svg>
                </div>
                <span className="listing-badge listing-badge--new">New</span>
              </div>
              <div className="listing-body">
                <div className="listing-meta-row">
                  <span className="listing-category" style={{background:'rgba(236,72,153,.08)',color:'var(--rose)'}}>Events &amp; Flowers</span>
                  <span className="listing-price">From $45</span>
                </div>
                <div className="listing-title">Bloom Florist &amp; Events</div>
                <div className="listing-tagline">Luxury floral arrangements, wedding decor, and full-service event planning. Crafting memorable experiences with hand-picked seasonal blooms.</div>
                <div className="listing-rating-row">
                  <div className="listing-stars"><Stars5 /></div>
                  <span className="listing-score">4.9</span>
                  <span className="listing-reviews">(156)</span>
                </div>
              </div>
            </Link>
            <ActionBar likes={134} dislikes={1} />
          </div>

          {/* 12. TrueNorth Accounting - REGULAR, DESKTOP ONLY */}
          <div className="listing-card listing-card--desktop-only">
            <Link to="/listing?biz=truenorth-accounting" className="listing-link">
              <div className="listing-top" style={{background:'linear-gradient(135deg,rgba(139,92,246,.14),rgba(59,130,246,.08))'}}>
                <div className="listing-icon-wrap">
                  <svg viewBox="0 0 24 24" stroke="var(--plum)"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                </div>
                <span className="listing-badge listing-badge--verified">Verified</span>
              </div>
              <div className="listing-body">
                <div className="listing-meta-row">
                  <span className="listing-category" style={{background:'rgba(139,92,246,.08)',color:'var(--plum)'}}>Financial Services</span>
                  <span className="listing-price">From $150</span>
                </div>
                <div className="listing-title">TrueNorth Accounting</div>
                <div className="listing-tagline">Full-service bookkeeping, tax planning, and CFO advisory for small businesses.</div>
                <div className="listing-rating-row">
                  <div className="listing-stars"><Stars5 /></div>
                  <span className="listing-score">4.8</span>
                  <span className="listing-reviews">(274)</span>
                </div>
              </div>
            </Link>
            <ActionBar likes={112} dislikes={7} />
          </div>

          {/* 13. SparkClean Pro - SHORT, DESKTOP ONLY */}
          <div className="listing-card listing-card--short listing-card--desktop-only">
            <Link to="/listing?biz=sparkclean-pro" className="listing-link">
              <div className="listing-top" style={{background:'linear-gradient(135deg,rgba(20,184,166,.14),rgba(47,174,106,.08))'}}>
                <div className="listing-icon-wrap">
                  <svg viewBox="0 0 24 24" stroke="var(--teal)"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /></svg>
                </div>
                <span className="listing-badge listing-badge--featured">Featured</span>
              </div>
              <div className="listing-body">
                <div className="listing-meta-row">
                  <span className="listing-category" style={{background:'rgba(20,184,166,.08)',color:'var(--teal)'}}>Cleaning</span>
                  <span className="listing-price">From $60</span>
                </div>
                <div className="listing-title">SparkClean Pro</div>
                <div className="listing-tagline">Professional residential and commercial cleaning with eco-friendly products.</div>
                <div className="listing-rating-row">
                  <div className="listing-stars"><Stars5 /></div>
                  <span className="listing-score">4.7</span>
                  <span className="listing-reviews">(321)</span>
                </div>
              </div>
            </Link>
            <ActionBar likes={98} dislikes={5} />
          </div>

          {/* 14. Harbor View Hotel - REGULAR, DESKTOP ONLY */}
          <div className="listing-card listing-card--desktop-only">
            <Link to="/listing?biz=harbor-view-hotel" className="listing-link">
              <div className="listing-top" style={{background:'linear-gradient(135deg,rgba(108,114,241,.14),rgba(20,184,166,.08))'}}>
                <div className="listing-icon-wrap">
                  <svg viewBox="0 0 24 24" stroke="var(--accent)"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" /><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" /><path d="M12 4v6" /><path d="M2 20h20" /></svg>
                </div>
                <span className="listing-badge listing-badge--featured">Featured</span>
              </div>
              <div className="listing-body">
                <div className="listing-meta-row">
                  <span className="listing-category" style={{background:'rgba(108,114,241,.08)',color:'var(--accent)'}}>Hospitality</span>
                  <span className="listing-price">$189/night</span>
                </div>
                <div className="listing-title">Harbor View Hotel</div>
                <div className="listing-tagline">Boutique waterfront hotel with rooftop dining and spa services.</div>
                <div className="listing-rating-row">
                  <div className="listing-stars"><Stars5 /></div>
                  <span className="listing-score">4.9</span>
                  <span className="listing-reviews">(467)</span>
                </div>
              </div>
            </Link>
            <ActionBar likes={245} dislikes={11} />
          </div>

          {/* 15. Pixel & Code Studio - TALL, DESKTOP ONLY */}
          <div className="listing-card listing-card--tall listing-card--desktop-only">
            <Link to="/listing?biz=pixel-code-studio" className="listing-link">
              <div className="listing-top" style={{background:'linear-gradient(135deg,rgba(245,158,11,.14),rgba(236,72,153,.08))'}}>
                <div className="listing-icon-wrap">
                  <svg viewBox="0 0 24 24" stroke="var(--amber)"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="14" y1="4" x2="10" y2="20" /></svg>
                </div>
                <span className="listing-badge listing-badge--new">New</span>
              </div>
              <div className="listing-body">
                <div className="listing-meta-row">
                  <span className="listing-category" style={{background:'rgba(245,158,11,.08)',color:'var(--amber)'}}>Web Development</span>
                  <span className="listing-price">Custom</span>
                </div>
                <div className="listing-title">Pixel &amp; Code Studio</div>
                <div className="listing-tagline">Full-stack web development agency building high-performance websites, e-commerce platforms, and custom web applications for startups and enterprises.</div>
                <div className="listing-rating-row">
                  <div className="listing-stars"><Stars5 /></div>
                  <span className="listing-score">4.7</span>
                  <span className="listing-reviews">(198)</span>
                </div>
              </div>
            </Link>
            <ActionBar likes={87} dislikes={4} />
          </div>

        </div>
      </div>
    </section>
  )
}
