import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const CHECK_PATH = "M20 6 9 17 4 12"

export default function ListingOverview() {
  const [expanded, setExpanded] = useState(false)
  const screenshotsRef = useRef(null)

  useEffect(() => {
    const container = screenshotsRef.current
    if (!container) return
    container.setAttribute('tabindex', '0')
    const handler = (e) => {
      if (e.key === 'ArrowRight') container.scrollBy({ left: 200, behavior: 'smooth' })
      if (e.key === 'ArrowLeft') container.scrollBy({ left: -200, behavior: 'smooth' })
    }
    container.addEventListener('keydown', handler)
    return () => container.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      {/* ===== OVERVIEW SECTION ===== */}
      <div id="ls-overview" className="ls-section fade-in visible">
        <div className="ls-section-title">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          Overview
        </div>
        <div
          className="ls-desc"
          style={expanded ? {} : { maxHeight: '4.8em', overflow: 'hidden' }}
        >
          CloudSync Pro is an enterprise-grade cloud infrastructure platform that enables seamless data synchronization across multi-cloud environments. Built for teams that demand reliability, it offers automated backup scheduling, real-time file mirroring, and intelligent conflict resolution. The platform supports AWS, Azure, and Google Cloud natively, with custom connector support for private clouds. Trusted by over 2,400 companies globally, CloudSync Pro reduces cloud management complexity by up to 60% while maintaining SOC 2 Type II and ISO 27001 compliance. The intuitive dashboard provides real-time visibility into sync status, storage usage, and performance metrics across all connected environments.
        </div>
        <span
          className="ls-desc-more"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show less' : 'Read more'}
        </span>
      </div>

      {/* Key Highlights */}
      <div className="ls-section fade-in visible">
        <div className="ls-section-title">
          <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          Key Highlights
        </div>
        <div className="ls-highlights">
          <div className="ls-highlight">
            <div className="ls-highlight-val">99.99%</div>
            <div className="ls-highlight-label">Uptime SLA</div>
          </div>
          <div className="ls-highlight">
            <div className="ls-highlight-val">2,400+</div>
            <div className="ls-highlight-label">Companies</div>
          </div>
          <div className="ls-highlight">
            <div className="ls-highlight-val">3 Clouds</div>
            <div className="ls-highlight-label">Native Support</div>
          </div>
        </div>
      </div>

      {/* Satisfaction Scores */}
      <div className="ls-section fade-in visible">
        <div className="ls-section-title">
          <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Satisfaction Scores
        </div>
        <div className="ls-sat-bars">
          <div className="ls-sat-item">
            <span className="ls-sat-label">Ease of Use</span>
            <div className="ls-sat-track"><div className="ls-sat-fill" style={{width:'89%',background:'var(--emerald)'}}></div></div>
            <span className="ls-sat-val">8.9</span>
          </div>
          <div className="ls-sat-item">
            <span className="ls-sat-label">Ease of Setup</span>
            <div className="ls-sat-track"><div className="ls-sat-fill" style={{width:'82%',background:'var(--azure)'}}></div></div>
            <span className="ls-sat-val">8.2</span>
          </div>
          <div className="ls-sat-item">
            <span className="ls-sat-label">Quality of Support</span>
            <div className="ls-sat-track"><div className="ls-sat-fill" style={{width:'91%',background:'var(--accent)'}}></div></div>
            <span className="ls-sat-val">9.1</span>
          </div>
          <div className="ls-sat-item">
            <span className="ls-sat-label">Meets Requirements</span>
            <div className="ls-sat-track"><div className="ls-sat-fill" style={{width:'93%',background:'var(--plum)'}}></div></div>
            <span className="ls-sat-val">9.3</span>
          </div>
          <div className="ls-sat-item">
            <span className="ls-sat-label">Product Direction</span>
            <div className="ls-sat-track"><div className="ls-sat-fill" style={{width:'87%',background:'var(--teal)'}}></div></div>
            <span className="ls-sat-val">8.7</span>
          </div>
          <div className="ls-sat-item">
            <span className="ls-sat-label">Admin Ease</span>
            <div className="ls-sat-track"><div className="ls-sat-fill" style={{width:'85%',background:'var(--amber)'}}></div></div>
            <span className="ls-sat-val">8.5</span>
          </div>
        </div>
      </div>

      {/* Screenshots */}
      <div className="ls-section fade-in visible">
        <div className="ls-section-title">
          <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          Screenshots
        </div>
        <div className="ls-screenshots" ref={screenshotsRef}>
          <div className="ls-screenshot">Dashboard Overview</div>
          <div className="ls-screenshot">Sync Configuration</div>
          <div className="ls-screenshot">Analytics &amp; Metrics</div>
          <div className="ls-screenshot">Team Management</div>
          <div className="ls-screenshot">Backup Scheduler</div>
        </div>
      </div>

      {/* ===== FEATURES SECTION ===== */}
      <div id="ls-features" className="ls-section fade-in visible">
        <div className="ls-section-title">
          <svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
          Features
        </div>
        <div className="ls-features">
          {[
            'Real-time multi-cloud synchronization across AWS, Azure, GCP',
            'Automated backup scheduling with custom retention policies',
            'Intelligent conflict resolution with version history',
            'SOC 2 Type II and ISO 27001 certified security',
            'REST API with webhooks for custom integrations',
            'Team collaboration with RBAC and audit logs',
            'Real-time analytics dashboard with custom alerts',
            'Zero-downtime migration tools for cloud transfers',
            'End-to-end encryption (AES-256) at rest and in transit',
            'Disaster recovery with one-click rollback',
          ].map((text, i) => (
            <div className="ls-feature" key={i}>
              <svg viewBox="0 0 24 24"><polyline points={CHECK_PATH}/></svg>
              <span className="ls-feature-text">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations */}
      <div className="ls-section fade-in visible">
        <div className="ls-section-title">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9"/></svg>
          Integrations
        </div>
        <div className="ls-integrations">
          <a href="#" className="ls-integration">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-10A7 7 0 105.5 15H7"/></svg>
            AWS
          </a>
          <a href="#" className="ls-integration">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
            Microsoft Azure
          </a>
          <a href="#" className="ls-integration">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
            Google Cloud
          </a>
          <a href="#" className="ls-integration">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>
            Slack
          </a>
          <a href="#" className="ls-integration">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
            Datadog
          </a>
          <a href="#" className="ls-integration">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            Zapier
          </a>
          <a href="#" className="ls-integration">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            Jira
          </a>
          <a href="#" className="ls-integration">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
            GitHub
          </a>
          <a href="#" className="ls-integration">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            PagerDuty
          </a>
        </div>
      </div>

      {/* ===== PRICING SECTION ===== */}
      <div id="ls-pricing" className="ls-section fade-in visible">
        <div className="ls-section-title">
          <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          Pricing Plans
        </div>
        <div className="ls-pricing-grid">
          {/* Starter */}
          <div className="ls-plan">
            <div className="ls-plan-name">Starter</div>
            <div className="ls-plan-price">$29<span>/mo</span></div>
            <div className="ls-plan-desc">For small teams getting started with cloud sync.</div>
            <ul className="ls-plan-features">
              <li><svg viewBox="0 0 24 24"><polyline points={CHECK_PATH}/></svg>Up to 5 users</li>
              <li><svg viewBox="0 0 24 24"><polyline points={CHECK_PATH}/></svg>100 GB storage</li>
              <li><svg viewBox="0 0 24 24"><polyline points={CHECK_PATH}/></svg>2 cloud connections</li>
              <li><svg viewBox="0 0 24 24"><polyline points={CHECK_PATH}/></svg>Daily backups</li>
              <li><svg viewBox="0 0 24 24"><polyline points={CHECK_PATH}/></svg>Email support</li>
            </ul>
            <a href="#" className="ls-plan-btn ls-plan-btn-outline">Start Free Trial</a>
          </div>
          {/* Professional */}
          <div className="ls-plan popular">
            <div className="ls-plan-name">Professional</div>
            <div className="ls-plan-price">$79<span>/mo</span></div>
            <div className="ls-plan-desc">For growing teams that need advanced features.</div>
            <ul className="ls-plan-features">
              <li><svg viewBox="0 0 24 24"><polyline points={CHECK_PATH}/></svg>Up to 25 users</li>
              <li><svg viewBox="0 0 24 24"><polyline points={CHECK_PATH}/></svg>1 TB storage</li>
              <li><svg viewBox="0 0 24 24"><polyline points={CHECK_PATH}/></svg>Unlimited clouds</li>
              <li><svg viewBox="0 0 24 24"><polyline points={CHECK_PATH}/></svg>Hourly backups</li>
              <li><svg viewBox="0 0 24 24"><polyline points={CHECK_PATH}/></svg>Priority support</li>
              <li><svg viewBox="0 0 24 24"><polyline points={CHECK_PATH}/></svg>API access</li>
            </ul>
            <a href="#" className="ls-plan-btn ls-plan-btn-primary">Start Free Trial</a>
          </div>
          {/* Enterprise */}
          <div className="ls-plan">
            <div className="ls-plan-name">Enterprise</div>
            <div className="ls-plan-price">Custom</div>
            <div className="ls-plan-desc">For large organizations with compliance needs.</div>
            <ul className="ls-plan-features">
              <li><svg viewBox="0 0 24 24"><polyline points={CHECK_PATH}/></svg>Unlimited users</li>
              <li><svg viewBox="0 0 24 24"><polyline points={CHECK_PATH}/></svg>Unlimited storage</li>
              <li><svg viewBox="0 0 24 24"><polyline points={CHECK_PATH}/></svg>Custom connectors</li>
              <li><svg viewBox="0 0 24 24"><polyline points={CHECK_PATH}/></svg>Real-time sync</li>
              <li><svg viewBox="0 0 24 24"><polyline points={CHECK_PATH}/></svg>Dedicated CSM</li>
              <li><svg viewBox="0 0 24 24"><polyline points={CHECK_PATH}/></svg>SSO &amp; SCIM</li>
              <li><svg viewBox="0 0 24 24"><polyline points={CHECK_PATH}/></svg>SLA guarantee</li>
            </ul>
            <a href="#" className="ls-plan-btn ls-plan-btn-outline">Contact Sales</a>
          </div>
        </div>
      </div>

      {/* ===== ALTERNATIVES SECTION ===== */}
      <div id="ls-alternatives" className="ls-section fade-in visible">
        <div className="ls-section-title">
          <svg viewBox="0 0 24 24"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M21 3l-7 7"/><path d="M3 3l7 7"/></svg>
          Top Alternatives
        </div>
        <div className="ls-alts">
          <Link to="/listing?biz=novabyte" className="ls-alt">
            <div className="ls-alt-logo" style={{background:'linear-gradient(135deg,#8B5CF6,#A78BFA)'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <div className="ls-alt-info">
              <div className="ls-alt-name">NovaByte Analytics</div>
              <div className="ls-alt-cat">Data Analytics Platform</div>
              <div className="ls-alt-rating">
                <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
                <span className="ls-alt-score">4.8</span>
                <span className="ls-alt-reviews">(287 reviews)</span>
              </div>
            </div>
          </Link>
          <Link to="/listing?biz=flowstack" className="ls-alt">
            <div className="ls-alt-logo" style={{background:'linear-gradient(135deg,#14B8A6,#2DD4BF)'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div className="ls-alt-info">
              <div className="ls-alt-name">FlowStack</div>
              <div className="ls-alt-cat">Workflow Automation</div>
              <div className="ls-alt-rating">
                <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
                <span className="ls-alt-score">4.7</span>
                <span className="ls-alt-reviews">(198 reviews)</span>
              </div>
            </div>
          </Link>
          <Link to="/listing?biz=pipelinehq" className="ls-alt">
            <div className="ls-alt-logo" style={{background:'linear-gradient(135deg,#F59E0B,#FBBF24)'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33"/></svg>
            </div>
            <div className="ls-alt-info">
              <div className="ls-alt-name">PipelineHQ</div>
              <div className="ls-alt-cat">DevOps Pipeline Management</div>
              <div className="ls-alt-rating">
                <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
                <span className="ls-alt-score">4.5</span>
                <span className="ls-alt-reviews">(156 reviews)</span>
              </div>
            </div>
          </Link>
          <Link to="/listing?biz=shieldvault" className="ls-alt">
            <div className="ls-alt-logo" style={{background:'linear-gradient(135deg,#EF4444,#F87171)'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div className="ls-alt-info">
              <div className="ls-alt-name">ShieldVault Security</div>
              <div className="ls-alt-cat">Cloud Security Platform</div>
              <div className="ls-alt-rating">
                <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
                <span className="ls-alt-score">4.5</span>
                <span className="ls-alt-reviews">(134 reviews)</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  )
}
