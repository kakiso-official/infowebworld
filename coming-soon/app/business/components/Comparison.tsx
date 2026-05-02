const Ck = () => (
  <svg viewBox="0 0 20 20" className="cmp-ck">
    <circle cx="10" cy="10" r="10" />
    <path d="M6 10.5l2.5 2.5L14 7.5" />
  </svg>
)

type V = boolean | string

const Cell = ({ value }: { value: V }) => {
  if (value === true) return <Ck />
  if (value === false) return <span className="cmp-no">&mdash;</span>
  return <span className="cmp-partial">{value}</span>
}

const features: { name: string; iww: V; g2: V; ph: V; ai: V }[] = [
  { name: 'Lead Generation', iww: true, g2: 'Expensive PPC-style leads', ph: 'Pay-per-lead model', ai: false },
  { name: 'Dofollow Backlinks', iww: true, g2: false, ph: false, ai: 'Limited / inconsistent' },
  { name: 'AEO Citations (AI Engine Optimization)', iww: true, g2: false, ph: false, ai: 'Some visibility but unstructured' },
  { name: 'Verified Reviews ', iww: true, g2: true, ph: true, ai: 'Weak / spam-prone' },
 
  { name: 'Community Engagement', iww: true, g2: 'Limited (review-focused only)', ph: 'Limited', ai: 'Passive browsing only' },
  { name: 'Thousands of Categories', iww: true, g2: true, ph: true, ai: 'Mostly AI-only narrow categories' },
  { name: 'Multi-Country Directory (12+)', iww: true, g2: 'US-heavy', ph: 'US/Europe focused', ai: 'Mostly global but unstructured' },
  { name: 'Daily News Feed', iww: true, g2: false, ph: false, ai: false },
  { name: 'Analytics Dashboard', iww: true, g2: true, ph: 'Limited', ai: false },
  { name: 'Support', iww: true, g2: 'Enterprise-tier support', ph: 'Ticket-based', ai: false },
]

export default function Comparison() {
  return (
    <section className="cmp-section" id="compare">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Compare</div>
          <h2 className="cmp-heading">
            How We Stack Up Against <em>Others</em>
          </h2>
          <p className="section-desc">
            See why InfoWebWorld is the best choice for businesses that want real results.
          </p>
        </div>

        <div className="cmp-wrap">
          {/* Header */}
          <div className="cmp-row cmp-row--header">
            <div className="cmp-cell cmp-cell--feature">Features & Benefits</div>
            <div className="cmp-cell cmp-cell--hero" data-label="IWW">InfoWebWorld</div>
            <div className="cmp-cell" data-label="G2">G2</div>
             <div className="cmp-cell" data-label="PH">Capterra</div> 
            <div className="cmp-cell" data-label="AI">AI Dirs</div>
          </div>

          {/* Feature rows */}
          {features.map(f => (
            <div key={f.name} className="cmp-row">
              <div className="cmp-cell cmp-cell--feature">{f.name}</div>
              <div className="cmp-cell cmp-cell--hero" data-label="InfoWebWorld"><Cell value={f.iww} /></div>
              <div className="cmp-cell" data-label="G2"><Cell value={f.g2} /></div>
              <div className="cmp-cell" data-label="Product Hunt"><Cell value={f.ph} /></div> 
              <div className="cmp-cell" data-label="AI Directories"><Cell value={f.ai} /></div>
            </div>
          ))}
        </div>

        <div className="cmp-footer">
          <span className="cmp-footer-score">10/10</span>
          <span className="cmp-footer-text">
            InfoWebWorld checks every box. The closest competitor scores 3*.
          </span>
        </div>
      </div>
    </section>
  )
}
