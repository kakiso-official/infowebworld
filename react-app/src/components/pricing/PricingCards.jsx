import { Link } from 'react-router-dom'

const CheckIcon = () => <svg viewBox="0 0 24 24" stroke="var(--emerald)" fill="none" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
const XIcon = () => <svg viewBox="0 0 24 24" stroke="var(--gray-300)" fill="none" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>

const plans = [
  {
    id: 'free',
    name: 'Free',
    desc: 'Get started and explore the platform at no cost.',
    monthly: 0,
    annual: 0,
    cta: 'Get Started Free',
    ctaStyle: 'outline',
    icon: <><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></>,
    color: 'var(--gray-500)',
    features: [
      { text: 'Basic business listing', has: true },
      { text: 'Up to 5 photos', has: true },
      { text: 'Customer reviews', has: true },
      { text: 'Business hours & contact', has: true },
      { text: 'Category placement', has: true },
      { text: 'Analytics dashboard', has: false },
      { text: 'Featured placement', has: false },
      { text: 'Priority support', has: false },
      { text: 'Verified badge', has: false },
      { text: 'Custom branding', has: false },
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    desc: 'Everything you need to stand out and grow faster.',
    monthly: 29,
    annual: 23,
    cta: 'Start Pro Trial',
    ctaStyle: 'solid',
    popular: true,
    icon: <><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></>,
    color: 'var(--accent)',
    features: [
      { text: 'Enhanced business listing', has: true },
      { text: 'Unlimited photos & videos', has: true },
      { text: 'Customer reviews + replies', has: true },
      { text: 'Business hours & contact', has: true },
      { text: 'Priority category placement', has: true },
      { text: 'Analytics dashboard', has: true },
      { text: 'Featured placement', has: true },
      { text: 'Priority support', has: true },
      { text: 'Verified badge', has: false },
      { text: 'Custom branding', has: false },
    ]
  },
  {
    id: 'business',
    name: 'Business',
    desc: 'For established businesses that want maximum visibility.',
    monthly: 79,
    annual: 63,
    cta: 'Start Business Trial',
    ctaStyle: 'dark',
    icon: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3"/></>,
    color: 'var(--plum)',
    features: [
      { text: 'Premium business listing', has: true },
      { text: 'Unlimited photos & videos', has: true },
      { text: 'Customer reviews + replies', has: true },
      { text: 'Business hours & contact', has: true },
      { text: 'Top category placement', has: true },
      { text: 'Advanced analytics & reports', has: true },
      { text: 'Featured + homepage placement', has: true },
      { text: 'Dedicated account manager', has: true },
      { text: 'Verified badge', has: true },
      { text: 'Custom branding', has: true },
    ]
  },
]

export default function PricingCards({ annual }) {
  return (
    <div className="container">
      <div className="pr-cards">
        {plans.map(plan => (
          <div className={`pr-card${plan.popular ? ' pr-card--popular' : ''}`} key={plan.id}>
            {plan.popular && (
              <div className="pr-card-ribbon">
                <svg viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Most Popular
              </div>
            )}
            <div className="pr-card-top">
              <div className="pr-card-icon" style={{ color: plan.color, background: plan.color === 'var(--gray-500)' ? 'var(--gray-100)' : `color-mix(in srgb, ${plan.color} 8%, transparent)` }}>
                <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.5">{plan.icon}</svg>
              </div>
              <h3 className="pr-card-name">{plan.name}</h3>
              <p className="pr-card-desc">{plan.desc}</p>
            </div>

            <div className="pr-card-price">
              {plan.monthly === 0 ? (
                <div className="pr-price-free">Free</div>
              ) : (
                <>
                  <span className="pr-price-dollar">$</span>
                  <span className="pr-price-amount">{annual ? plan.annual : plan.monthly}</span>
                  <span className="pr-price-period">/mo</span>
                </>
              )}
              {plan.monthly > 0 && annual && (
                <div className="pr-price-billed">Billed ${plan.annual * 12}/year · Save ${(plan.monthly - plan.annual) * 12}/yr</div>
              )}
              {plan.monthly === 0 && <div className="pr-price-billed">No credit card required</div>}
            </div>

            <Link to="/submit-listing" className={`pr-card-cta pr-card-cta--${plan.ctaStyle}`}>
              {plan.cta}
              <svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>

            <div className="pr-card-features">
              {plan.features.map((f, i) => (
                <div className={`pr-feature${f.has ? '' : ' pr-feature--no'}`} key={i}>
                  {f.has ? <CheckIcon /> : <XIcon />}
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
