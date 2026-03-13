import { Link } from 'react-router-dom'

const STAR_PATH = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"

export default function ListingSidebar() {
  return (
    <>
      {/* Quick Facts */}
      <div className="ls-side-card">
        <div className="ls-side-title">Quick Facts</div>
        <div className="ls-facts">
          <div className="ls-fact">
            <span className="ls-fact-label">
              <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
              Founded
            </span>
            <span className="ls-fact-val">2019</span>
          </div>
          <div className="ls-fact">
            <span className="ls-fact-label">
              <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Headquarters
            </span>
            <span className="ls-fact-val">San Francisco, CA</span>
          </div>
          <div className="ls-fact">
            <span className="ls-fact-label">
              <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
              Company Size
            </span>
            <span className="ls-fact-val">150-250</span>
          </div>
          <div className="ls-fact">
            <span className="ls-fact-label">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              Response Time
            </span>
            <span className="ls-fact-val">&lt; 2 hours</span>
          </div>
          <div className="ls-fact">
            <span className="ls-fact-label">
              <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
              Funding
            </span>
            <span className="ls-fact-val">Series B ($42M)</span>
          </div>
          <div className="ls-fact">
            <span className="ls-fact-label">
              <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
              Starting Price
            </span>
            <span className="ls-fact-val">$29/mo</span>
          </div>
          <div className="ls-fact">
            <span className="ls-fact-label">
              <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Free Trial
            </span>
            <span className="ls-fact-val">14 days</span>
          </div>
          <div className="ls-fact">
            <span className="ls-fact-label">
              <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              Deployment
            </span>
            <span className="ls-fact-val">Cloud SaaS</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="ls-side-card ls-side-cta">
        <div className="ls-side-cta-title">Get a Free Demo</div>
        <div className="ls-side-cta-desc">See how CloudSync Pro can transform your cloud infrastructure. Talk to an expert.</div>
        <a href="#" className="ls-side-cta-btn">Request Demo
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>

      {/* Similar Tools */}
      <div className="ls-side-card">
        <div className="ls-side-title">Similar Tools</div>
        <Link to="/listing?biz=novabyte" className="ls-similar-item">
          <div className="ls-similar-logo" style={{background:'linear-gradient(135deg,#8B5CF6,#A78BFA)'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <span className="ls-similar-name">NovaByte Analytics</span>
          <span className="ls-similar-score"><svg viewBox="0 0 24 24"><path d={STAR_PATH}/></svg>4.8</span>
        </Link>
        <Link to="/listing?biz=flowstack" className="ls-similar-item">
          <div className="ls-similar-logo" style={{background:'linear-gradient(135deg,#14B8A6,#2DD4BF)'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <span className="ls-similar-name">FlowStack</span>
          <span className="ls-similar-score"><svg viewBox="0 0 24 24"><path d={STAR_PATH}/></svg>4.7</span>
        </Link>
        <Link to="/listing?biz=pipelinehq" className="ls-similar-item">
          <div className="ls-similar-logo" style={{background:'linear-gradient(135deg,#F59E0B,#FBBF24)'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          </div>
          <span className="ls-similar-name">PipelineHQ</span>
          <span className="ls-similar-score"><svg viewBox="0 0 24 24"><path d={STAR_PATH}/></svg>4.5</span>
        </Link>
        <Link to="/listing?biz=shieldvault" className="ls-similar-item">
          <div className="ls-similar-logo" style={{background:'linear-gradient(135deg,#EF4444,#F87171)'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <span className="ls-similar-name">ShieldVault Security</span>
          <span className="ls-similar-score"><svg viewBox="0 0 24 24"><path d={STAR_PATH}/></svg>4.5</span>
        </Link>
        <Link to="/listing?biz=metrik" className="ls-similar-item">
          <div className="ls-similar-logo" style={{background:'linear-gradient(135deg,#EC4899,#F472B6)'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
          </div>
          <span className="ls-similar-name">Metrik PM</span>
          <span className="ls-similar-score"><svg viewBox="0 0 24 24"><path d={STAR_PATH}/></svg>4.3</span>
        </Link>
      </div>

      {/* Tags */}
      <div className="ls-side-card">
        <div className="ls-side-title">Tags</div>
        <div className="ls-side-tags">
          <Link to="/search?q=cloud" className="ls-side-tag">Cloud</Link>
          <Link to="/search?q=saas" className="ls-side-tag">SaaS</Link>
          <Link to="/search?q=backup" className="ls-side-tag">Backup</Link>
          <Link to="/search?q=sync" className="ls-side-tag">Data Sync</Link>
          <Link to="/search?q=infrastructure" className="ls-side-tag">Infrastructure</Link>
          <Link to="/search?q=devops" className="ls-side-tag">DevOps</Link>
          <Link to="/search?q=multi-cloud" className="ls-side-tag">Multi-Cloud</Link>
          <Link to="/search?q=enterprise" className="ls-side-tag">Enterprise</Link>
          <Link to="/search?q=api" className="ls-side-tag">API</Link>
          <Link to="/search?q=automation" className="ls-side-tag">Automation</Link>
        </div>
      </div>
    </>
  )
}
