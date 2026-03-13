import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

/* ===== INLINE SVG HELPERS ===== */
const StarFull = () => (
  <svg viewBox="0 0 24 24" fill="var(--gold)" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>
)
const StarHalf = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="none">
    <defs><clipPath id="sh"><rect x="0" y="0" width="12" height="24" /></clipPath></defs>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" fill="var(--gray-200)" />
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" fill="var(--gold)" clipPath="url(#sh)" />
  </svg>
)
const StarEmpty = () => (
  <svg viewBox="0 0 24 24" fill="var(--gray-200)" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>
)

function Stars({ rating }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.3 && rating % 1 <= 0.7
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <span className="cmp-product-stars">
      {Array.from({ length: full }, (_, i) => <StarFull key={`f${i}`} />)}
      {half && <StarHalf />}
      {Array.from({ length: empty }, (_, i) => <StarEmpty key={`e${i}`} />)}
    </span>
  )
}

const CheckMark = () => (
  <span className="cmp-check yes"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg></span>
)
const CrossMark = () => (
  <span className="cmp-check no"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></span>
)
const CrownIcon = ({ size = 14 }) => (
  <span className="cmp-cell-crown"><svg viewBox="0 0 24 24" style={{ width: size, height: size }}><path d="M2 20h20L19 8l-5 6-2-8-2 8-5-6z" /></svg></span>
)
const CrownBig = () => (
  <svg viewBox="0 0 24 24"><path d="M2 20h20L19 8l-5 6-2-8-2 8-5-6z" /></svg>
)
const ChevronDown = () => (
  <svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
)

/* ===== PRODUCT DATA ===== */
const products = [
  {
    id: 'cloudsync',
    name: 'CloudSync Pro',
    category: 'Cloud Storage',
    iconBg: 'var(--azure)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg>,
    rating: 4.6,
    reviews: 234,
    satisfaction: 92,
    recommend: 89,
    founded: '2018',
    pricing: 'From $29/mo',
    scores: { 'Ease of Use': 8.8, Setup: 8.2, Support: 9.0, 'Meets Req.': 9.3, Direction: 8.7, Admin: 8.5 },
    features: { 'Multi-cloud Support': true, 'AI-Powered Analytics': true, 'Real-time Sync': true, 'API Access': true, 'Custom Integrations': true, 'Role-based Access': true, 'SOC 2 Compliance': true, '24/7 Support': true, 'Mobile App': true, 'White-label Option': false },
    pros: ['Excellent multi-cloud support', 'Strong compliance features', 'Great customer support'],
    cons: ['Higher pricing for small teams', 'No white-label option'],
    pricingPlans: [
      { name: 'Starter', price: '$29', period: '/mo' },
      { name: 'Professional', price: '$79', period: '/mo', popular: true },
      { name: 'Enterprise', price: 'Custom', period: '' }
    ],
    reviewDist: [60, 22, 10, 5, 3],
    quote: 'Seamless sync across all devices. The team collaboration features are a game-changer for our distributed workforce.',
    quoteName: 'James Kim',
    quoteRole: 'CTO at DataLayer',
    quoteInitials: 'JK'
  },
  {
    id: 'novabyte',
    name: 'NovaByte Analytics',
    category: 'Data Analytics',
    iconBg: 'var(--plum)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /><polyline points="6 10 10 7 14 12 18 6" /></svg>,
    rating: 4.8,
    reviews: 189,
    satisfaction: 95,
    recommend: 93,
    founded: '2019',
    pricing: 'From $79/mo',
    scores: { 'Ease of Use': 9.1, Setup: 8.5, Support: 9.3, 'Meets Req.': 9.5, Direction: 9.0, Admin: 8.8 },
    features: { 'Multi-cloud Support': false, 'AI-Powered Analytics': true, 'Real-time Sync': true, 'API Access': true, 'Custom Integrations': true, 'Role-based Access': true, 'SOC 2 Compliance': true, '24/7 Support': true, 'Mobile App': true, 'White-label Option': false },
    pros: ['Best-in-class AI analytics', 'Intuitive dashboard builder', 'Excellent onboarding'],
    cons: ['No multi-cloud support', 'Premium pricing tier'],
    pricingPlans: [
      { name: 'Starter', price: '$79', period: '/mo' },
      { name: 'Business', price: '$149', period: '/mo', popular: true },
      { name: 'Enterprise', price: 'Custom', period: '' }
    ],
    reviewDist: [65, 20, 9, 4, 2],
    quote: 'The AI insights saved our team 20+ hours a week. Dashboard customization is incredibly powerful and intuitive.',
    quoteName: 'Sarah Chen',
    quoteRole: 'Head of Data',
    quoteInitials: 'SC'
  },
  {
    id: 'codeforge',
    name: 'CodeForge IDE',
    category: 'DevOps',
    iconBg: 'var(--teal)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="14" y1="4" x2="10" y2="20" /></svg>,
    rating: 4.9,
    reviews: 421,
    satisfaction: 96,
    recommend: 96,
    founded: '2020',
    pricing: 'Free tier available',
    scores: { 'Ease of Use': 9.4, Setup: 9.2, Support: 9.5, 'Meets Req.': 9.6, Direction: 9.3, Admin: 9.1 },
    features: { 'Multi-cloud Support': false, 'AI-Powered Analytics': true, 'Real-time Sync': true, 'API Access': true, 'Custom Integrations': true, 'Role-based Access': true, 'SOC 2 Compliance': false, '24/7 Support': true, 'Mobile App': true, 'White-label Option': true },
    pros: ['Free tier available', 'AI copilot is best-in-class', 'Massive extension marketplace', 'White-label option'],
    cons: ['No SOC 2 compliance', 'Limited multi-cloud support'],
    pricingPlans: [
      { name: 'Free', price: 'Free', period: '', free: true },
      { name: 'Pro', price: '$19', period: '/mo', popular: true },
      { name: 'Enterprise', price: '$49', period: '/mo' }
    ],
    reviewDist: [72, 18, 6, 3, 1],
    quote: 'Best IDE I\'ve ever used. The AI copilot feels like having a senior engineer pair-programming with you at all times.',
    quoteName: 'Alex Rivera',
    quoteRole: 'Senior Engineer',
    quoteInitials: 'AR'
  }
]

/* ===== SECTION DEFINITIONS ===== */
const sections = [
  { id: 'overview', label: 'Overview', icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg> },
  { id: 'satisfaction', label: 'Satisfaction', icon: <svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg> },
  { id: 'features', label: 'Features', icon: <svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg> },
  { id: 'proscons', label: 'Pros & Cons', icon: <svg viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg> },
  { id: 'pricing', label: 'Pricing', icon: <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> },
  { id: 'reviews', label: 'Reviews', icon: <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> }
]

/* Helper: find the best value index for a row */
function bestIdx(vals, higher = true) {
  let best = higher ? -Infinity : Infinity
  let idx = 0
  vals.forEach((v, i) => {
    if ((higher && v > best) || (!higher && v < best)) { best = v; idx = i }
  })
  return idx
}

/* Color for satisfaction bars based on score */
function barColor(score) {
  if (score >= 9) return 'var(--emerald)'
  if (score >= 8) return 'var(--accent)'
  if (score >= 7) return 'var(--amber)'
  return 'var(--coral)'
}

/* Collapsible Section wrapper */
function Section({ id, title, icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  const bodyRef = useRef(null)
  const [maxH, setMaxH] = useState('none')

  useEffect(() => {
    if (bodyRef.current) {
      setMaxH(bodyRef.current.scrollHeight + 'px')
    }
  }, [open])

  return (
    <div className="cmp-section" id={`cmp-${id}`}>
      <div className="cmp-section-header" onClick={() => setOpen(!open)}>
        <div className="cmp-section-title">
          {icon}
          {title}
        </div>
        <span className={`cmp-section-toggle${open ? '' : ' collapsed'}`}>
          <ChevronDown />
        </span>
      </div>
      <div
        ref={bodyRef}
        className={`cmp-section-body${open ? '' : ' collapsed'}`}
        style={{ maxHeight: open ? maxH : 0 }}
      >
        {children}
      </div>
    </div>
  )
}

export default function ComparisonTable() {
  const [activeSection, setActiveSection] = useState('overview')
  const [highlightDiffs, setHighlightDiffs] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const sectionRefs = useRef({})

  // Scroll spy + scroll-to-top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)

      // Scroll spy
      let current = 'overview'
      for (const s of sections) {
        const el = document.getElementById(`cmp-${s.id}`)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 180) current = s.id
        }
      }
      setActiveSection(current)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const el = document.getElementById(`cmp-${id}`)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 120
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const overviewRows = [
    { label: 'Rating', icon: <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>, key: 'rating', values: products.map(p => p.rating), format: v => v.toFixed(1) },
    { label: 'Total Reviews', icon: <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>, key: 'reviews', values: products.map(p => p.reviews), format: v => v.toLocaleString() },
    { label: 'Satisfaction', icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>, key: 'satisfaction', values: products.map(p => p.satisfaction), format: v => `${v}%` },
    { label: 'Recommend', icon: <svg viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>, key: 'recommend', values: products.map(p => p.recommend), format: v => `${v}%` },
    { label: 'Founded', icon: <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>, key: 'founded', values: products.map(p => p.founded), format: v => v, higher: false, noBest: true },
    { label: 'Starting Price', icon: <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>, key: 'pricing', values: products.map(p => p.pricing), format: v => v, noBest: true }
  ]

  const satisfactionKeys = Object.keys(products[0].scores)
  const featureKeys = Object.keys(products[0].features)

  // Winner product
  const winner = products[2]

  return (
    <div className="container">
      {/* Section Jump Nav */}
      <div className="cmp-jump-nav">
        {sections.map(s => (
          <button
            key={s.id}
            className={`cmp-jump-btn${activeSection === s.id ? ' active' : ''}`}
            onClick={() => scrollToSection(s.id)}
          >
            {s.icon}
            {s.label}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <label className="cmp-highlight-toggle">
          <span className={`cmp-toggle-switch${highlightDiffs ? ' on' : ''}`} />
          Highlight differences
          <input type="checkbox" hidden checked={highlightDiffs} onChange={e => setHighlightDiffs(e.target.checked)} />
        </label>
      </div>

      {/* ===== DESKTOP TABLE VIEW ===== */}
      <div className="cmp-table-wrap">
        <div className="cmp-table-inner">

          {/* ===== STICKY PRODUCT HEADER ===== */}
          <div className="cmp-product-header">
            <div className="cmp-product-header-inner">
              <div className="cmp-product-label-col">
                <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Comparing</span>
              </div>
              {products.map((p, i) => (
                <div key={p.id} className={`cmp-product-col${i === 2 ? ' winner' : ''}`}>
                  {i === 2 && (
                    <span className="cmp-winner-crown"><CrownBig /></span>
                  )}
                  <div className="cmp-product-logo" style={{ background: p.iconBg }}>{p.icon}</div>
                  <span className="cmp-product-name">{p.name}</span>
                  <span className="cmp-product-cat">{p.category}</span>
                  <div className="cmp-product-rating">
                    <Stars rating={p.rating} />
                    <span className="cmp-product-score">{p.rating}</span>
                  </div>
                  <span className="cmp-product-reviews">{p.reviews} reviews</span>
                  {i === 2 && (
                    <span className="cmp-winner-badge">
                      <svg viewBox="0 0 24 24"><path d="M2 20h20L19 8l-5 6-2-8-2 8-5-6z" /></svg>
                      Winner
                    </span>
                  )}
                  <Link to="/listing" className="cmp-product-link">
                    View Profile
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* ===== OVERVIEW SECTION ===== */}
          <Section id="overview" title="Overview" icon={sections[0].icon}>
            {overviewRows.map(row => {
              const best = row.noBest ? -1 : bestIdx(row.values, row.higher !== false)
              return (
                <div className={`cmp-row${highlightDiffs && !row.noBest ? ' diff-highlight' : ''}`} key={row.key}>
                  <div className="cmp-row-label">
                    {row.icon && <span style={{ display: 'flex' }}>{row.icon}</span>}
                    {row.label}
                  </div>
                  {row.values.map((v, i) => (
                    <div key={i} className={`cmp-cell${i === best ? ' winner-cell' : ''}`}>
                      <span style={{ fontWeight: i === best ? 500 : 400 }}>{row.format(v)}</span>
                      {i === best && <CrownIcon />}
                    </div>
                  ))}
                </div>
              )
            })}
          </Section>

          {/* ===== SATISFACTION SCORES ===== */}
          <Section id="satisfaction" title="Satisfaction Scores" icon={sections[1].icon}>
            {satisfactionKeys.map(key => {
              const vals = products.map(p => p.scores[key])
              const best = bestIdx(vals)
              return (
                <div className={`cmp-row${highlightDiffs ? ' diff-highlight' : ''}`} key={key}>
                  <div className="cmp-row-label">{key}</div>
                  {vals.map((v, i) => (
                    <div key={i} className={`cmp-cell cmp-sat-cell${i === best ? ' winner-cell' : ''}`}>
                      <div className="cmp-sat-bar-wrap">
                        <div className="cmp-sat-track">
                          <div className="cmp-sat-fill" style={{ width: `${v * 10}%`, background: barColor(v) }} />
                        </div>
                        <span className="cmp-sat-val">{v.toFixed(1)}</span>
                        {i === best && <CrownIcon size={12} />}
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </Section>

          {/* ===== FEATURES ===== */}
          <Section id="features" title="Features" icon={sections[2].icon}>
            {featureKeys.map(key => {
              const vals = products.map(p => p.features[key])
              const trueCount = vals.filter(Boolean).length
              return (
                <div className={`cmp-row${highlightDiffs ? ' diff-highlight' : ''}`} key={key}>
                  <div className="cmp-row-label">{key}</div>
                  {vals.map((v, i) => (
                    <div key={i} className={`cmp-cell${v && trueCount < 3 ? ' winner-cell' : ''}`}>
                      {v ? <CheckMark /> : <CrossMark />}
                    </div>
                  ))}
                </div>
              )
            })}
            {/* Feature count summary row */}
            <div className="cmp-row" style={{ background: 'var(--gray-50)', borderTop: '1px solid var(--gray-200)' }}>
              <div className="cmp-row-label" style={{ fontWeight: 500 }}>Total Features</div>
              {products.map((p, i) => {
                const count = Object.values(p.features).filter(Boolean).length
                const total = Object.keys(p.features).length
                return (
                  <div key={i} className="cmp-feature-count">
                    <strong>{count}</strong> / {total}
                  </div>
                )
              })}
            </div>
          </Section>

          {/* ===== PROS & CONS ===== */}
          <Section id="proscons" title="Pros & Cons" icon={sections[3].icon}>
            <div className="cmp-row" style={{ borderBottom: 'none' }}>
              <div className="cmp-row-label" style={{ alignSelf: 'flex-start', paddingTop: 14 }}>Highlights</div>
              {products.map((p, i) => (
                <div key={i} className={`cmp-cell cmp-proscons-cell${i === 2 ? ' winner-cell' : ''}`}>
                  {p.pros.map((pro, pi) => (
                    <div className="cmp-pro-item" key={pi}>
                      <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                      {pro}
                    </div>
                  ))}
                  <div className="cmp-proscons-divider" />
                  {p.cons.map((con, ci) => (
                    <div className="cmp-con-item" key={ci}>
                      <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      {con}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Section>

          {/* ===== PRICING ===== */}
          <Section id="pricing" title="Pricing" icon={sections[4].icon}>
            {['Starter', 'Popular Plan', 'Enterprise'].map((label, planIdx) => (
              <div className="cmp-row" key={label}>
                <div className="cmp-row-label">{label}</div>
                {products.map((p, i) => {
                  const plan = p.pricingPlans[planIdx]
                  return (
                    <div key={i} className={`cmp-cell cmp-price-cell${plan.free ? ' winner-cell' : ''}`}>
                      {plan.free ? (
                        <span className="cmp-price-free">{plan.price}</span>
                      ) : (
                        <span className="cmp-price-val">{plan.price}<span>{plan.period}</span></span>
                      )}
                      <span className="cmp-price-label">{plan.name}</span>
                      {plan.popular && <span className="cmp-price-popular">Most Popular</span>}
                      {plan.free && <CrownIcon />}
                    </div>
                  )
                })}
              </div>
            ))}
          </Section>

          {/* ===== REVIEWS SUMMARY ===== */}
          <Section id="reviews" title="Reviews Summary" icon={sections[5].icon}>
            <div className="cmp-row" style={{ borderBottom: 'none' }}>
              <div className="cmp-row-label" style={{ alignSelf: 'flex-start', paddingTop: 14 }}>Rating & Distribution</div>
              {products.map((p, i) => {
                const best = i === 2
                return (
                  <div key={i} className={`cmp-cell cmp-review-cell${best ? ' winner-cell' : ''}`}>
                    <div className="cmp-review-big">
                      <span className="cmp-review-big-score">{p.rating}</span>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                        <span className="cmp-review-big-stars">
                          {Array.from({ length: 5 }, (_, si) => (
                            si < Math.floor(p.rating) ? <StarFull key={si} /> : <StarEmpty key={si} />
                          ))}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 300, color: 'var(--gray-400)' }}>{p.reviews} reviews</span>
                      </div>
                      {best && <CrownIcon />}
                    </div>
                    <div className="cmp-review-bars">
                      {p.reviewDist.map((pct, si) => (
                        <div className="cmp-rev-bar" key={si}>
                          <span className="cmp-rev-bar-label">{5 - si}</span>
                          <div className="cmp-rev-bar-track"><div className="cmp-rev-bar-fill" style={{ width: `${pct}%` }} /></div>
                          <span className="cmp-rev-bar-pct">{pct}%</span>
                        </div>
                      ))}
                    </div>
                    <div className="cmp-review-quote">
                      <div className="cmp-review-quote-text">{p.quote}</div>
                      <div className="cmp-review-quote-author">
                        <span className="cmp-review-avatar">{p.quoteInitials}</span>
                        <div>
                          <div className="cmp-review-author-info">{p.quoteName}</div>
                          <div className="cmp-review-author-role">{p.quoteRole}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Section>

          {/* ===== VERDICT ===== */}
          <div className="cmp-verdict">
            <div className="cmp-verdict-crown"><CrownBig /></div>
            <div className="cmp-verdict-title">
              Overall Winner: <span className="cmp-verdict-winner">CodeForge IDE</span>
            </div>
            <p className="cmp-verdict-summary">
              CodeForge IDE takes the top spot with the highest rating (4.9), best satisfaction score (96%),
              and the most verified reviews (421). Its free tier and competitive pricing make it an exceptional value for teams of all sizes.
            </p>
            <div className="cmp-verdict-pills">
              <span className="cmp-verdict-pill">
                <svg viewBox="0 0 24 24" fill="var(--gold)" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>
                Rating: <strong>{winner.rating}</strong>
              </span>
              <span className="cmp-verdict-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
                Satisfaction: <strong>{winner.satisfaction}%</strong>
              </span>
              <span className="cmp-verdict-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                Reviews: <strong>{winner.reviews}</strong>
              </span>
              <span className="cmp-verdict-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                Price: <strong>Free tier</strong>
              </span>
            </div>
            <div className="cmp-verdict-actions">
              <Link to="/listing" className="cmp-verdict-link">
                View Full Profile
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
              <Link to="/category" className="cmp-verdict-link-outline">
                Browse All Products
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ===== MOBILE CARD VIEW ===== */}
      <div className="cmp-mobile-cards">
        {products.map((p, i) => {
          const featureCount = Object.values(p.features).filter(Boolean).length
          const featureTotal = Object.keys(p.features).length
          return (
            <div key={p.id} className={`cmp-mobile-card${i === 2 ? ' winner' : ''}`}>
              <div className="cmp-mobile-card-head">
                <div className="cmp-mobile-card-logo" style={{ background: p.iconBg }}>{p.icon}</div>
                <div className="cmp-mobile-card-info">
                  <div className="cmp-mobile-card-name">
                    {p.name}
                    {i === 2 && <CrownIcon size={12} />}
                  </div>
                  <div className="cmp-mobile-card-cat">{p.category}</div>
                  <div className="cmp-mobile-card-rating">
                    <Stars rating={p.rating} />
                    <span className="cmp-mobile-card-score">{p.rating}</span>
                    <span className="cmp-mobile-card-reviews">({p.reviews})</span>
                  </div>
                </div>
              </div>

              <div className="cmp-mobile-card-grid">
                <div className="cmp-mobile-stat">
                  <div className="cmp-mobile-stat-label">Satisfaction</div>
                  <div className="cmp-mobile-stat-val">{p.satisfaction}%</div>
                </div>
                <div className="cmp-mobile-stat">
                  <div className="cmp-mobile-stat-label">Recommend</div>
                  <div className="cmp-mobile-stat-val">{p.recommend}%</div>
                </div>
                <div className="cmp-mobile-stat">
                  <div className="cmp-mobile-stat-label">Features</div>
                  <div className="cmp-mobile-stat-val">{featureCount}/{featureTotal}</div>
                </div>
                <div className="cmp-mobile-stat">
                  <div className="cmp-mobile-stat-label">Reviews</div>
                  <div className="cmp-mobile-stat-val">{p.reviews}</div>
                </div>
              </div>

              <div className="cmp-mobile-card-features">
                {Object.entries(p.features).map(([key, val]) => (
                  <span key={key} className={`cmp-mobile-feature ${val ? 'yes' : 'no'}`}>
                    {val
                      ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    }
                    {key}
                  </span>
                ))}
              </div>

              <div className="cmp-mobile-card-footer">
                <div className="cmp-mobile-card-price">
                  {p.pricingPlans[0].free
                    ? <span style={{ color: 'var(--emerald)' }}>Free</span>
                    : <>{p.pricingPlans[0].price}<span>{p.pricingPlans[0].period}</span></>
                  }
                </div>
                <Link to="/listing" className="cmp-mobile-card-link">
                  View Profile
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Scroll to top FAB */}
      <button
        className={`cmp-scroll-top${showScrollTop ? ' visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15" /></svg>
      </button>
    </div>
  )
}
