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
    id: 'growth', name: 'Growth', price: '$240', period: '/year', badge: 'Most Popular', badgeClass: 'sl-plan-badge--popular',
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
    id: 'professional', name: 'Professional', price: '$599', period: '/year', badge: 'Best Value', badgeClass: 'sl-plan-badge--best',
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

export { PLANS }

export default function StepPlan({ form, up }) {
  const currentRoi = roiData[form.plan] || roiData.growth

  return (
    <div className="sl-section">
      <div className="sl-section-header">
        <div className="sl-section-icon" style={{ background: 'var(--accent)' }}>
          <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
        </div>
        <div className="sl-section-info">
          <div className="sl-section-title">Choose Your Listing Plan</div>
          <div className="sl-section-desc">Select the plan that fits your goals. Upgrade or downgrade anytime.</div>
        </div>
      </div>

      <div className="sl-plans">
        {PLANS.map(plan => (
          <div
            key={plan.id}
            className={`sl-plan${form.plan === plan.id ? ' selected' : ''}${plan.badge === 'Most Popular' ? ' popular' : ''}`}
            onClick={() => up('plan', plan.id)}
          >
            {plan.badge && <span className={`sl-plan-badge ${plan.badgeClass}`}>{plan.badge}</span>}
            <div className="sl-plan-icon" style={{ background: plan.iconBg }}>{plan.icon}</div>
            <div className="sl-plan-name">{plan.name}</div>
            <div className="sl-plan-price">{plan.price}{plan.period && <span>{plan.period}</span>}</div>
            <div className="sl-plan-period">{plan.id === 'free' ? 'Forever free' : 'Billed annually'}</div>
            <ul className="sl-plan-features">
              {plan.features.map((f, i) => (
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
            <button className="sl-plan-select">
              {form.plan === plan.id ? 'Selected' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>

      {/* ROI Calculator */}
      <div className="sl-roi">
        <div className="sl-roi-title">
          <svg viewBox="0 0 24 24"><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></svg>
          Estimated ROI for {PLANS.find(p => p.id === form.plan)?.name} Plan
        </div>
        <div className="sl-roi-grid">
          <div className="sl-roi-item">
            <div className="sl-roi-item-num" style={{ color: 'var(--accent)' }}>{currentRoi.traffic}</div>
            <div className="sl-roi-item-label">Monthly Visitors</div>
          </div>
          <div className="sl-roi-item">
            <div className="sl-roi-item-num" style={{ color: 'var(--emerald)' }}>{currentRoi.leads}</div>
            <div className="sl-roi-item-label">Monthly Leads</div>
          </div>
          <div className="sl-roi-item">
            <div className="sl-roi-item-num" style={{ color: currentRoi.backlink === 'Dofollow' ? 'var(--emerald)' : 'var(--gray-400)' }}>{currentRoi.backlink}</div>
            <div className="sl-roi-item-label">Backlink Type</div>
          </div>
        </div>
      </div>
    </div>
  )
}
