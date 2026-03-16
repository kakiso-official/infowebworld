import { useState } from 'react'

const PLANS = [
  {
    id: 'free', name: 'Free', price: '$0', period: '', badge: null,
    iconBg: 'var(--gray-500)', icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /></svg>,
    features: [
      { text: 'Basic listing profile', yes: true },
      { text: 'Nofollow backlink', yes: true },
      { text: 'Up to 3 screenshots', yes: true },
      { text: 'Standard category placement', yes: true },
      { text: 'Dofollow backlink', yes: false },
      { text: 'Review responses', yes: false },
      { text: 'Analytics dashboard', yes: false },
      { text: 'Featured placement', yes: false },
    ]
  },
  {
    id: 'growth', name: 'Growth', price: '$240', period: '/year', badge: 'Most Popular', badgeClass: 'cl-plan-badge--popular',
    iconBg: 'var(--accent)', icon: <svg viewBox="0 0 24 24"><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></svg>,
    features: [
      { text: 'Everything in Free', yes: true },
      { text: 'Dofollow backlink (SEO boost)', yes: true },
      { text: 'Up to 10 screenshots', yes: true },
      { text: 'Review responses', yes: true },
      { text: 'Basic analytics', yes: true },
      { text: 'Priority support', yes: true },
      { text: 'Buyer intent data', yes: false },
      { text: 'Featured placement', yes: false },
    ]
  },
  {
    id: 'professional', name: 'Professional', price: '$599', period: '/year', badge: 'Best Value', badgeClass: 'cl-plan-badge--best',
    iconBg: 'var(--plum)', icon: <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>,
    features: [
      { text: 'Everything in Growth', yes: true },
      { text: 'Featured category placement', yes: true },
      { text: 'Buyer intent data & leads', yes: true },
      { text: 'Lead capture forms', yes: true },
      { text: 'Badge eligibility', yes: true },
      { text: 'Advanced analytics', yes: true },
      { text: 'Unlimited screenshots', yes: true },
      { text: 'Custom landing page', yes: false },
    ]
  },
  {
    id: 'enterprise', name: 'Enterprise', price: '$1,499', period: '/year', badge: null,
    iconBg: 'var(--emerald)', icon: <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg>,
    features: [
      { text: 'Everything in Professional', yes: true },
      { text: 'Custom landing page', yes: true },
      { text: 'API access', yes: true },
      { text: 'Dedicated account manager', yes: true },
      { text: 'White-glove onboarding', yes: true },
      { text: 'Custom integrations', yes: true },
      { text: 'Multi-language listing', yes: true },
      { text: 'Priority review moderation', yes: true },
    ]
  }
]

const roiData = {
  free: { traffic: '200-500', leads: '5-15', backlink: 'Nofollow' },
  growth: { traffic: '1K-3K', leads: '25-75', backlink: 'Dofollow' },
  professional: { traffic: '3K-8K', leads: '75-200', backlink: 'Dofollow' },
  enterprise: { traffic: '8K-20K', leads: '200-500', backlink: 'Dofollow' },
}

export default function StepPlan({ listing, selectedPlan, onSelectPlan, onContinue, onBack }) {
  const [plan, setPlan] = useState(selectedPlan || 'growth')
  const currentRoi = roiData[plan]

  const handleSelect = (id) => {
    setPlan(id)
    onSelectPlan(id)
  }

  return (
    <div className="cl-step-content">
      {/* Verified listing bar */}
      <div className="cl-selected">
        <div className="cl-selected-logo" style={{ background: `linear-gradient(135deg, ${listing.color}, ${listing.color}88)` }}>
          {listing.logo}
        </div>
        <div className="cl-selected-info">
          <div className="cl-selected-name">
            {listing.name}
            <span className="cl-selected-verified">
              <svg viewBox="0 0 24 24" fill="var(--emerald)" stroke="#fff" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Verified
            </span>
          </div>
          <div className="cl-selected-tagline">{listing.tagline}</div>
        </div>
      </div>

      <div className="cl-card">
        <div className="cl-card-header">
          <div className="cl-card-icon" style={{ background: 'rgba(108,114,241,.08)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div>
            <h3>Choose Your Plan</h3>
            <p>Select the plan that fits your goals. You can upgrade anytime.</p>
          </div>
        </div>

        {/* Plan cards */}
        <div className="cl-plans">
          {PLANS.map(p => (
            <div
              key={p.id}
              className={`cl-plan${plan === p.id ? ' selected' : ''}${p.badge === 'Most Popular' ? ' popular' : ''}`}
              onClick={() => handleSelect(p.id)}
            >
              {p.badge && <span className={`cl-plan-badge ${p.badgeClass}`}>{p.badge}</span>}
              <div className="cl-plan-icon" style={{ background: p.iconBg }}>{p.icon}</div>
              <div className="cl-plan-name">{p.name}</div>
              <div className="cl-plan-price">{p.price}{p.period && <span>{p.period}</span>}</div>
              <div className="cl-plan-period">{p.id === 'free' ? 'Forever free' : 'Billed annually'}</div>
              <ul className="cl-plan-features">
                {p.features.map((f, i) => (
                  <li key={i} className={f.yes ? 'yes' : 'no'}>
                    <svg viewBox="0 0 24 24">
                      {f.yes
                        ? <polyline points="20 6 9 17 4 12" />
                        : <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                      }
                    </svg>
                    {f.text}
                  </li>
                ))}
              </ul>
              <button className="cl-plan-select">
                {plan === p.id ? 'Selected' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>

        {/* ROI Calculator */}
        <div className="cl-roi">
          <div className="cl-roi-title">
            <svg viewBox="0 0 24 24"><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></svg>
            Estimated ROI for {PLANS.find(p => p.id === plan)?.name} Plan
          </div>
          <div className="cl-roi-grid">
            <div className="cl-roi-item">
              <div className="cl-roi-num" style={{ color: 'var(--accent)' }}>{currentRoi.traffic}</div>
              <div className="cl-roi-label">Monthly Visitors</div>
            </div>
            <div className="cl-roi-item">
              <div className="cl-roi-num" style={{ color: 'var(--emerald)' }}>{currentRoi.leads}</div>
              <div className="cl-roi-label">Monthly Leads</div>
            </div>
            <div className="cl-roi-item">
              <div className="cl-roi-num" style={{ color: currentRoi.backlink === 'Dofollow' ? 'var(--emerald)' : 'var(--gray-400)' }}>{currentRoi.backlink}</div>
              <div className="cl-roi-label">Backlink Type</div>
            </div>
          </div>
        </div>

        {/* Payment note for paid plans */}
        {plan !== 'free' && (
          <div className="cl-payment-note">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            <div>
              <div className="cl-payment-note-title">Payment after claiming</div>
              <div className="cl-payment-note-desc">You'll be redirected to complete payment after finishing the claim process. Your listing will be active on the free plan until payment is confirmed.</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="cl-form-actions">
          <button className="cl-btn-secondary" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <button className="cl-btn-primary" onClick={onContinue}>
            Continue with {PLANS.find(p => p.id === plan)?.name}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
