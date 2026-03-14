import { useState } from 'react'

const faqs = [
  { q: 'Can I switch plans at any time?', a: 'Absolutely! You can upgrade, downgrade, or cancel your plan at any time. When upgrading, you\'ll only pay the prorated difference. When downgrading, the remaining credit is applied to your next billing cycle.' },
  { q: 'Is there a free trial for paid plans?', a: 'Yes! Both Pro and Business plans come with a 14-day free trial. No credit card required to start. You\'ll get full access to all features during the trial period.' },
  { q: 'What happens to my listing if I cancel?', a: 'Your listing stays active on the Free plan. You\'ll keep your reviews and basic profile, but premium features like analytics, featured placement, and priority support will be deactivated.' },
  { q: 'Do you offer discounts for nonprofits?', a: 'Yes! We offer 50% off on Pro and Business plans for verified nonprofit organizations. Contact our team with your nonprofit documentation and we\'ll set it up for you.' },
  { q: 'How does the "Verified Badge" work?', a: 'The Verified Badge is available on the Business plan. Our team manually verifies your business credentials, license, and physical address. Once verified, a badge appears on your listing to build trust with customers.' },
  { q: 'Can I manage multiple business listings?', a: 'Yes! Pro users can manage up to 3 listings, and Business users get unlimited listings under one account. Each listing can be customized independently with its own branding and media.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex), PayPal, and bank transfers for annual Business plans. All payments are processed securely through Stripe.' },
  { q: 'Is there an API for integrations?', a: 'Business plan includes full API access for integrating reviews, analytics, and listing data into your own systems. Pro plan offers read-only API access for basic integrations.' },
]

export default function PricingFAQ() {
  const [open, setOpen] = useState(null)

  return (
    <div className="container">
      <div className="pr-faq fade-in">
        <div className="pr-faq-header">
          <h2 className="pr-faq-title">
            <svg viewBox="0 0 24 24" stroke="var(--accent)" fill="none" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
            Frequently Asked Questions
          </h2>
          <p className="pr-faq-sub">Everything you need to know about our plans.</p>
        </div>
        <div className="pr-faq-grid">
          {faqs.map((f, i) => (
            <div className={`pr-faq-item${open === i ? ' pr-faq-item--open' : ''}`} key={i} onClick={() => setOpen(open === i ? null : i)}>
              <div className="pr-faq-q">
                <span>{f.q}</span>
                <svg viewBox="0 0 24 24" className="pr-faq-chevron"><path d="m6 9 6 6 6-6"/></svg>
              </div>
              <div className="pr-faq-a">
                <p>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
