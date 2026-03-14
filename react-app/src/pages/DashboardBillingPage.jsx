import { useState } from 'react'
import DashboardLayout from '../components/dashboard/DashboardLayout'

const plans = [
  { name: 'Free', price: '$0/mo', features: ['Basic listing', '5 photos', 'Standard support', 'Monthly analytics'], current: false },
  { name: 'Pro', price: '$29/mo', features: ['Enhanced listing', 'Unlimited photos', 'Priority support', 'Advanced analytics', 'Lead management', 'Review responses', 'Badge & verification', 'Custom CTA buttons'], current: true },
  { name: 'Enterprise', price: '$99/mo', features: ['Multiple listings', 'API access', 'Dedicated manager', 'White-label reports', 'Custom integrations', 'SLA guarantee', 'Team accounts', 'Premium placement'], current: false },
]

const invoices = [
  { id: 'INV-2026-003', date: 'Mar 1, 2026', amount: '$29.00', status: 'paid' },
  { id: 'INV-2026-002', date: 'Feb 1, 2026', amount: '$29.00', status: 'paid' },
  { id: 'INV-2026-001', date: 'Jan 1, 2026', amount: '$29.00', status: 'paid' },
  { id: 'INV-2025-012', date: 'Dec 1, 2025', amount: '$29.00', status: 'paid' },
  { id: 'INV-2025-011', date: 'Nov 1, 2025', amount: '$29.00', status: 'paid' },
]

export default function DashboardBillingPage() {
  const [selectedPlan, setSelectedPlan] = useState('Pro')

  return (
    <DashboardLayout title="Billing & Plan" subtitle="Manage your subscription">
      {/* Current Plan */}
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

      {/* Plan Comparison */}
      <div className="db-card db-full" style={{ marginBottom: 24 }}>
        <div className="db-card-header">
          <div className="db-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
            Compare Plans
          </div>
        </div>
        <div className="db-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {plans.map(p => (
              <div key={p.name} style={{ padding: 20, borderRadius: 'var(--r)', border: p.current ? '2px solid var(--accent)' : '1px solid var(--gray-200)', background: p.current ? 'var(--accent-soft)' : '#fff', position: 'relative' }}>
                {p.current && <span style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#fff', fontSize: 10, fontWeight: 600, padding: '2px 10px', borderRadius: 10 }}>Current</span>}
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent)', marginBottom: 16 }}>{p.price}</div>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--gray-600)', marginBottom: 6 }}>
                    <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'var(--emerald)', fill: 'none', strokeWidth: 2, flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg>
                    {f}
                  </div>
                ))}
                <button className={`db-btn ${p.current ? 'db-btn--outline' : 'db-btn--primary'}`} style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
                  {p.current ? 'Current Plan' : `Choose ${p.name}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="db-grid-2" style={{ marginBottom: 24 }}>
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
              Payment Method
            </div>
            <span className="db-card-action">Update</span>
          </div>
          <div className="db-card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--gray-50)', borderRadius: 'var(--r-sm)' }}>
              <div style={{ width: 48, height: 32, borderRadius: 6, background: 'linear-gradient(135deg,#1a1f71,#2566af)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>VISA</span>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)' }}>Visa ending in 4242</div>
                <div style={{ fontSize: 11, fontWeight: 300, color: 'var(--gray-400)' }}>Expires 08/2028</div>
              </div>
              <span className="db-badge-pill db-badge--active" style={{ marginLeft: 'auto' }}>Default</span>
            </div>
          </div>
        </div>

        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
              Billing Address
            </div>
            <span className="db-card-action">Edit</span>
          </div>
          <div className="db-card-body">
            <div style={{ fontSize: 13, fontWeight: 400, color: 'var(--gray-700)', lineHeight: 1.8 }}>
              Aadil Parmar<br />
              CloudGuard Technologies<br />
              123 Business Ave, Suite 100<br />
              San Francisco, CA 94102<br />
              United States
            </div>
          </div>
        </div>
      </div>

      {/* Invoices */}
      <div className="db-card db-full">
        <div className="db-card-header">
          <div className="db-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
            Invoice History
          </div>
        </div>
        <div className="db-card-body" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="db-table">
            <thead>
              <tr><th>Invoice</th><th>Date</th><th>Amount</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td className="db-table-name">{inv.id}</td>
                  <td>{inv.date}</td>
                  <td>{inv.amount}</td>
                  <td><span className="db-badge-pill db-badge--active">Paid</span></td>
                  <td><button className="db-btn db-btn--outline" style={{ padding: '4px 12px', fontSize: 11 }}>Download</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
