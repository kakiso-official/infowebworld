const STEP_TIPS = [
  {
    title: 'Make a great first impression',
    color: 'var(--accent)',
    tips: [
      'Use your official business name — avoid abbreviations',
      'Write a compelling tagline under 80 characters',
      'Your description is your elevator pitch — make it count',
      'Pick the most relevant category for better visibility',
    ],
    stat: { value: '73%', label: 'of users read descriptions before clicking' },
  },
  {
    title: 'Visuals sell your story',
    color: 'var(--azure)',
    tips: [
      'High-quality logos build instant trust',
      'Show your product in action with real screenshots',
      'Use 16:10 aspect ratio for consistent display',
      'A demo video increases engagement by 80%',
    ],
    stat: { value: '3x', label: 'more clicks on listings with 5+ photos' },
  },
  {
    title: 'Features that convert',
    color: 'var(--emerald)',
    tips: [
      'Lead with your strongest, most unique feature',
      'Focus on benefits, not just technical specs',
      'List integrations users actually search for',
      'Be transparent about pricing — users love clarity',
    ],
    stat: { value: '2.4x', label: 'more leads when features are detailed' },
  },
  {
    title: 'Build credibility',
    color: 'var(--coral)',
    tips: [
      'Company details help buyers verify legitimacy',
      'Adding social links boosts trust signals',
      'Funding info attracts enterprise buyers',
      'Location helps with local search ranking',
    ],
    stat: { value: '89%', label: 'of buyers check company background' },
  },
  {
    title: 'Maximize your ROI',
    color: 'var(--plum)',
    tips: [
      'Growth plan gives you dofollow SEO backlinks',
      'Featured listings get 5x more profile views',
      'Start small and upgrade as you grow',
      'Annual plans save you 20% — best value',
    ],
    stat: { value: '$4.2K', label: 'avg. annual value of a dofollow backlink' },
  },
  {
    title: 'Almost there!',
    color: 'var(--emerald)',
    tips: [
      'Double-check your business name and URL',
      'Make sure your email is correct for notifications',
      'You can edit everything after approval',
      'Listings go live within 24-48 hours',
    ],
    stat: { value: '24h', label: 'average review time for new listings' },
  },
]

const recentListings = [
  { name: 'NovaByte Analytics', cat: 'Technology', time: '12 min ago', color: 'var(--accent)' },
  { name: 'Harvest Kitchen', cat: 'Restaurant', time: '34 min ago', color: 'var(--coral)' },
  { name: 'Zenith Fitness Co', cat: 'Healthcare', time: '1 hour ago', color: 'var(--emerald)' },
]

export default function SubmitSidebar({ step, totalSteps }) {
  const tip = STEP_TIPS[step] || STEP_TIPS[0]
  const completedPct = Math.round(((step) / totalSteps) * 100)

  return (
    <aside className="sl-sidebar">
      {/* Progress card */}
      <div className="sl-sb-card sl-sb-progress">
        <div className="sl-sb-progress-ring">
          <svg viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="var(--gray-100)" strokeWidth="5" />
            <circle cx="40" cy="40" r="34" fill="none" stroke="var(--accent)" strokeWidth="5"
              strokeDasharray={`${2 * Math.PI * 34}`}
              strokeDashoffset={`${2 * Math.PI * 34 * (1 - completedPct / 100)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset .8s cubic-bezier(.16,1,.3,1)', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
            />
          </svg>
          <span className="sl-sb-progress-pct">{completedPct}%</span>
        </div>
        <div className="sl-sb-progress-info">
          <div className="sl-sb-progress-title">Step {step + 1} of {totalSteps}</div>
          <div className="sl-sb-progress-sub">{completedPct === 0 ? "Let's get started!" : completedPct === 100 ? 'Ready to submit!' : 'Keep going, you\'re doing great!'}</div>
        </div>
      </div>

      {/* Tips card */}
      <div className="sl-sb-card sl-sb-tips" key={step}>
        <h4 className="sl-sb-tips-title" style={{ color: tip.color }}>
          <svg viewBox="0 0 24 24" stroke={tip.color} fill="none" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          {tip.title}
        </h4>
        <ul className="sl-sb-tips-list">
          {tip.tips.map((t, i) => (
            <li key={i}>
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
              {t}
            </li>
          ))}
        </ul>
        <div className="sl-sb-stat">
          <div className="sl-sb-stat-value" style={{ color: tip.color }}>{tip.stat.value}</div>
          <div className="sl-sb-stat-label">{tip.stat.label}</div>
        </div>
      </div>

      {/* Recent listings */}
      <div className="sl-sb-card">
        <h4 className="sl-sb-recent-title">
          <svg viewBox="0 0 24 24" stroke="var(--emerald)" fill="none" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Recently Listed
        </h4>
        <div className="sl-sb-recent-list">
          {recentListings.map((r, i) => (
            <div className="sl-sb-recent-item" key={i}>
              <div className="sl-sb-recent-dot" style={{ background: r.color }}></div>
              <div className="sl-sb-recent-info">
                <span className="sl-sb-recent-name">{r.name}</span>
                <span className="sl-sb-recent-cat">{r.cat}</span>
              </div>
              <span className="sl-sb-recent-time">{r.time}</span>
            </div>
          ))}
        </div>
        <div className="sl-sb-recent-live">
          <span className="sl-sb-live-dot"></span>
          <span>12 businesses listed today</span>
        </div>
      </div>

      {/* Guarantees */}
      <div className="sl-sb-card sl-sb-guarantees">
        <div className="sl-sb-guarantee">
          <svg viewBox="0 0 24 24" stroke="var(--emerald)" fill="none" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>SSL Encrypted & Secure</span>
        </div>
        <div className="sl-sb-guarantee">
          <svg viewBox="0 0 24 24" stroke="var(--accent)" fill="none" strokeWidth="1.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>24-48hr Review Guarantee</span>
        </div>
        <div className="sl-sb-guarantee">
          <svg viewBox="0 0 24 24" stroke="var(--plum)" fill="none" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>Edit Anytime After Approval</span>
        </div>
        <div className="sl-sb-guarantee">
          <svg viewBox="0 0 24 24" stroke="var(--azure)" fill="none" strokeWidth="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <span>30-Day Money-Back Guarantee</span>
        </div>
      </div>

      {/* Help */}
      <div className="sl-sb-card sl-sb-help">
        <svg viewBox="0 0 24 24" stroke="var(--accent)" fill="none" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <div>
          <div className="sl-sb-help-title">Need help?</div>
          <div className="sl-sb-help-text">Our team is here to assist. Chat with us or email support@infowebworld.com</div>
        </div>
      </div>
    </aside>
  )
}
