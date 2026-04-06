import { I, ic } from './icons'

export default function TrustSection({ color }: { color: string }) {
  const items = [
    { icon: 'shield' as const, title: 'Verified Listings', desc: 'Every business is manually reviewed and verified by our team before going live.' },
    { icon: 'star' as const, title: 'Real Reviews', desc: 'All reviews are authenticated — no fake testimonials, no paid placements.' },
    { icon: 'barChart' as const, title: 'Transparent Metrics', desc: 'Satisfaction scores and comparisons based on real, verified user data.' },
  ]

  return (
    <div className="cd-trust">
      <h3 className="cd-trust-title">Why Trust <em>InfoWebWorld</em></h3>
      <div className="cd-trust-grid">
        {items.map((t, i) => (
          <div key={i} className="cd-trust-card">
            <div className="cd-trust-icon" style={{ background: `${color}08` }}>
              <I d={ic[t.icon]} size={22} color={color} />
            </div>
            <h4>{t.title}</h4>
            <p>{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
