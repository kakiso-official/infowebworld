import { plans } from '../../../data/dashboard/billingData'

export default function CurrentPlan() {
  return (
    <div className="db-plan">
      <div className="db-plan-badge">
        <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
        Current Plan
      </div>
      <div className="db-plan-name">Pro Plan</div>
      <div className="db-plan-price">$29/month &middot; Billed monthly &middot; Next billing: Apr 1, 2026</div>
      <div className="db-plan-features">
        {plans[1].features.map(f => (
          <div className="db-plan-feature" key={f}>
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
            {f}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="db-btn db-btn--primary">Upgrade to Enterprise</button>
        <button className="db-btn db-btn--outline">Cancel Subscription</button>
      </div>
    </div>
  )
}
