import { useState } from 'react'
import DashboardLayout from '../components/dashboard/DashboardLayout'

/* ── Sparkline ── */
function Spark({ data, color = 'var(--accent)', w = 70, h = 24 }) {
  const max = Math.max(...data), min = Math.min(...data)
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * (h - 4) - 2}`).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <polygon points={`${pts} ${w},${h} 0,${h}`} fill={color} opacity=".12" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Star component ── */
function Stars({ rating, size = 14 }) {
  return (
    <div className="db-stars">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} viewBox="0 0 24 24" className={s > rating ? 'empty' : ''} style={{ width: size, height: size }}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

/* ── Review Data ── */
const reviews = [
  { id: 1, name: 'Sarah Mitchell', initials: 'SM', bg: 'var(--emerald)', rating: 5, text: 'Absolutely fantastic service! The team was professional, responsive, and delivered beyond expectations. Their zero-trust implementation saved us from a potential breach just two weeks after deployment. Worth every penny.', date: 'Mar 14, 2026', time: '2:30 PM', replied: false, helpful: 24, source: 'Google', verified: true, sentiment: 'positive', tags: ['Professional', 'Responsive', 'Security'] },
  { id: 2, name: 'Jason Park', initials: 'JP', bg: 'var(--azure)', rating: 5, text: 'Incredible attention to detail. They took the time to understand our specific needs and delivered a solution that exceeded our expectations. The SOC 2 audit went flawlessly thanks to their preparation.', date: 'Mar 13, 2026', time: '11:45 AM', replied: false, helpful: 18, source: 'InfoWebWorld', verified: true, sentiment: 'positive', tags: ['Detail-oriented', 'SOC 2', 'Excellent'] },
  { id: 3, name: 'Maria Garcia', initials: 'MG', bg: 'var(--amber)', rating: 4, text: 'Great service overall. The initial consultation was thorough and the implementation was smooth. Documentation could be more detailed but the team was always available for questions. Would definitely use again.', date: 'Mar 12, 2026', time: '4:15 PM', replied: true, replyText: 'Thank you Maria! We appreciate the feedback on documentation — we\'re working on improving our knowledge base. Glad we could help!', replyDate: 'Mar 12, 2026', helpful: 12, source: 'Google', verified: true, sentiment: 'positive', tags: ['Thorough', 'Smooth'] },
  { id: 4, name: 'Mike Rodriguez', initials: 'MR', bg: 'var(--plum)', rating: 4, text: 'Good experience. Communication was excellent throughout the project. There were minor delays in the initial timeline but the team was transparent about it and the end result was impressive. Solid security partner.', date: 'Mar 11, 2026', time: '9:20 AM', replied: true, replyText: 'Thank you for the honest feedback, Mike. We\'ve adjusted our timeline estimation process to prevent delays. Glad the result met your expectations!', replyDate: 'Mar 11, 2026', helpful: 9, source: 'Yelp', verified: true, sentiment: 'positive', tags: ['Communication', 'Transparent'] },
  { id: 5, name: 'Emily Chen', initials: 'EC', bg: 'var(--coral)', rating: 5, text: 'Best in the business! I\'ve used several similar services but this one stands head and shoulders above the rest. Their penetration testing uncovered vulnerabilities our previous vendor missed entirely. Game changer for our security posture.', date: 'Mar 10, 2026', time: '1:00 PM', replied: true, replyText: 'Wow, thank you Emily! We take pride in being thorough with our pen testing. Happy to be your security partner!', replyDate: 'Mar 10, 2026', helpful: 31, source: 'Google', verified: true, sentiment: 'positive', tags: ['Best-in-class', 'Pen Testing'] },
  { id: 6, name: 'David Kim', initials: 'DK', bg: 'var(--teal)', rating: 3, text: 'Decent service but communication could be improved. Response times were inconsistent — sometimes within the hour, other times 24+ hours. The deliverables were good quality though and the final report was comprehensive.', date: 'Mar 8, 2026', time: '3:40 PM', replied: false, helpful: 6, source: 'InfoWebWorld', verified: true, sentiment: 'mixed', tags: ['Communication', 'Quality'] },
  { id: 7, name: 'Rachel Adams', initials: 'RA', bg: 'var(--rose)', rating: 5, text: 'Transformed our entire workflow. The team is knowledgeable, patient, and truly cares about delivering results. They didn\'t just fix problems — they educated our team so we could maintain the improvements ourselves.', date: 'Mar 7, 2026', time: '10:30 AM', replied: false, helpful: 22, source: 'Google', verified: true, sentiment: 'positive', tags: ['Knowledgeable', 'Patient', 'Educational'] },
  { id: 8, name: 'Tom Wilson', initials: 'TW', bg: 'var(--accent)', rating: 4, text: 'Solid work on a tight timeline. Appreciated the transparency and regular updates throughout the project. The compliance report was especially well-done and our auditors were impressed.', date: 'Mar 5, 2026', time: '5:15 PM', replied: true, replyText: 'Thanks Tom! We understand the pressure of tight timelines. Happy to hear the auditors were pleased!', replyDate: 'Mar 6, 2026', helpful: 14, source: 'Yelp', verified: false, sentiment: 'positive', tags: ['Timely', 'Transparent', 'Compliance'] },
  { id: 9, name: 'Lisa Nguyen', initials: 'LN', bg: 'var(--emerald)', rating: 5, text: 'Outstanding! From day one, the team demonstrated deep expertise in cloud security. They identified and remediated critical vulnerabilities across our AWS infrastructure in record time. Our CISO was extremely impressed.', date: 'Mar 4, 2026', time: '8:45 AM', replied: false, helpful: 28, source: 'Google', verified: true, sentiment: 'positive', tags: ['Cloud', 'AWS', 'Expert'] },
  { id: 10, name: 'Alex Rivera', initials: 'AR', bg: 'var(--azure)', rating: 2, text: 'The service was okay but overpriced for what we got. Expected more hands-on guidance during the implementation phase. The final report was thorough but the engagement felt rushed.', date: 'Mar 3, 2026', time: '2:10 PM', replied: false, helpful: 3, source: 'InfoWebWorld', verified: true, sentiment: 'negative', tags: ['Pricing', 'Rushed'] },
  { id: 11, name: 'Jennifer Lee', initials: 'JL', bg: 'var(--amber)', rating: 5, text: 'Phenomenal experience. The security assessment they conducted was the most thorough we\'ve ever seen. They even found issues in our CI/CD pipeline that nobody else caught. Already renewed for next year.', date: 'Mar 2, 2026', time: '11:20 AM', replied: true, replyText: 'Thank you Jennifer! CI/CD security is often overlooked — glad we could provide comprehensive coverage. Looking forward to year two!', replyDate: 'Mar 2, 2026', helpful: 19, source: 'Google', verified: true, sentiment: 'positive', tags: ['Thorough', 'CI/CD', 'Renewed'] },
  { id: 12, name: 'Chris Thompson', initials: 'CT', bg: 'var(--plum)', rating: 4, text: 'Very professional outfit. The team was well-organized and kept us informed at every step. The only area for improvement would be providing more actionable recommendations in the executive summary.', date: 'Mar 1, 2026', time: '4:30 PM', replied: true, replyText: 'Appreciate the feedback, Chris! We\'ve already updated our executive summary template based on your suggestion. Thanks!', replyDate: 'Mar 1, 2026', helpful: 11, source: 'Yelp', verified: true, sentiment: 'positive', tags: ['Professional', 'Organized'] },
]

const ratingDist = [
  { stars: 5, count: 186, pct: 62 },
  { stars: 4, count: 78, pct: 26 },
  { stars: 3, count: 24, pct: 8 },
  { stars: 2, count: 8, pct: 3 },
  { stars: 1, count: 4, pct: 1 },
]
const totalReviews = ratingDist.reduce((a, r) => a + r.count, 0)

/* Monthly review counts */
const monthlyReviews = [
  { month: 'Oct', count: 18, avg: 4.5 },
  { month: 'Nov', count: 22, avg: 4.6 },
  { month: 'Dec', count: 20, avg: 4.7 },
  { month: 'Jan', count: 26, avg: 4.7 },
  { month: 'Feb', count: 28, avg: 4.8 },
  { month: 'Mar', count: 32, avg: 4.8 },
]

/* Sentiment keywords */
const sentimentKeywords = [
  { word: 'professional', count: 48, sentiment: 'positive' },
  { word: 'responsive', count: 42, sentiment: 'positive' },
  { word: 'thorough', count: 38, sentiment: 'positive' },
  { word: 'knowledgeable', count: 35, sentiment: 'positive' },
  { word: 'communication', count: 28, sentiment: 'mixed' },
  { word: 'transparent', count: 24, sentiment: 'positive' },
  { word: 'timely', count: 22, sentiment: 'positive' },
  { word: 'expensive', count: 12, sentiment: 'negative' },
  { word: 'delayed', count: 8, sentiment: 'negative' },
  { word: 'excellent', count: 45, sentiment: 'positive' },
]

/* Review source breakdown */
const sourcesData = [
  { source: 'Google', count: 156, pct: 52, color: 'var(--accent)', avg: 4.9 },
  { source: 'InfoWebWorld', count: 78, pct: 26, color: 'var(--emerald)', avg: 4.7 },
  { source: 'Yelp', count: 42, pct: 14, color: 'var(--coral)', avg: 4.6 },
  { source: 'Facebook', count: 24, pct: 8, color: 'var(--azure)', avg: 4.5 },
]

/* Competitor comparison */
const competitors = [
  { name: 'You (CloudGuard)', rating: 4.8, reviews: 300, rank: 1, isYou: true },
  { name: 'SecureNet Pro', rating: 4.6, reviews: 245, rank: 2 },
  { name: 'CyberShield Corp', rating: 4.5, reviews: 312, rank: 3 },
  { name: 'TrustArmor', rating: 4.3, reviews: 198, rank: 4 },
  { name: 'DataFort Security', rating: 4.1, reviews: 167, rank: 5 },
]

export default function DashboardReviewsPage() {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedReply, setExpandedReply] = useState(null)

  const unrepliedCount = reviews.filter(r => !r.replied).length
  const avgRating = 4.8
  const maxMonthly = Math.max(...monthlyReviews.map(m => m.count))

  const filtered = reviews
    .filter(r => {
      if (filter === 'unreplied') return !r.replied
      if (filter === 'positive') return r.sentiment === 'positive'
      if (filter === 'negative') return r.sentiment === 'negative' || r.sentiment === 'mixed'
      if (['5', '4', '3', '2', '1'].includes(filter)) return r.rating === parseInt(filter)
      return true
    })
    .filter(r => !searchQuery || r.text.toLowerCase().includes(searchQuery.toLowerCase()) || r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
    .sort((a, b) => {
      if (sortBy === 'highest') return b.rating - a.rating
      if (sortBy === 'lowest') return a.rating - b.rating
      if (sortBy === 'helpful') return b.helpful - a.helpful
      return 0
    })

  /* Sentiment donut */
  const sentimentData = [
    { label: 'Positive', pct: 85, color: 'var(--emerald)' },
    { label: 'Mixed', pct: 10, color: 'var(--amber)' },
    { label: 'Negative', pct: 5, color: 'var(--coral)' },
  ]
  let sentAcc = 0

  return (
    <DashboardLayout title="Reviews" subtitle={`${unrepliedCount} awaiting reply`}>
      {/* ═══ Hero Banner ═══ */}
      <div className="db-welcome">
        <div className="db-welcome-bg" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ef6b4a 30%, #e11d48 60%, #8b5cf6 100%)' }} />
        <div className="db-welcome-content">
          <div className="db-welcome-text">
            <div className="db-welcome-title">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <svg viewBox="0 0 24 24" style={{ width: 24, height: 24, fill: '#facc15', stroke: 'none' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                4.8 Star Reputation — #{1} in Category
              </span>
            </div>
            <div className="db-welcome-desc">
              You&apos;ve earned <strong>{totalReviews} reviews</strong> with a <strong>92% positive sentiment</strong> score.
              {unrepliedCount > 0 && <> You have <strong>{unrepliedCount} reviews</strong> waiting for your response.</>}
              {' '}Your response rate is <strong>87%</strong> with an average reply time of <strong>4.2 hours</strong>.
            </div>
            <div className="db-welcome-actions">
              <button className="db-btn" style={{ background: '#fff', color: '#e11d48' }}>Request Reviews</button>
              <button className="db-btn" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', border: '1px solid rgba(255,255,255,.25)' }}>Share Review Page</button>
            </div>
          </div>
          <div className="db-welcome-stats-mini">
            <div className="db-welcome-stat-pill"><span className="db-welcome-stat-dot" style={{ background: '#facc15' }} /> 4.8 avg rating</div>
            <div className="db-welcome-stat-pill"><span className="db-welcome-stat-dot" style={{ background: '#4ade80' }} /> 92% positive</div>
            <div className="db-welcome-stat-pill"><span className="db-welcome-stat-dot" style={{ background: '#f87171' }} /> {unrepliedCount} need reply</div>
          </div>
        </div>
      </div>

      {/* ═══ Stats Row ═══ */}
      <div className="db-stats">
        {[
          { label: 'Total Reviews', value: totalReviews.toString(), change: '+32 this month', gradient: 'linear-gradient(135deg,var(--amber),var(--coral))', spark: [18,22,20,26,28,32], sparkColor: 'var(--amber)', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
          { label: 'Avg Rating', value: avgRating.toString(), change: '+0.2 vs last quarter', gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))', spark: [4.3,4.4,4.5,4.6,4.7,4.8], sparkColor: 'var(--emerald)', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
          { label: 'Response Rate', value: '87%', change: '+5% this month', gradient: 'linear-gradient(135deg,var(--accent),var(--plum))', spark: [72,75,78,80,83,87], sparkColor: 'var(--accent)', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
          { label: 'Sentiment Score', value: '92%', change: '+3% improvement', gradient: 'linear-gradient(135deg,var(--azure),var(--accent))', spark: [82,84,86,88,90,92], sparkColor: 'var(--azure)', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        ].map(s => (
          <div className="db-stat" key={s.label}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
              <div className="db-stat-icon" style={{ background: s.gradient }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon} /></svg>
              </div>
              <Spark data={s.spark} color={s.sparkColor} />
            </div>
            <div className="db-stat-value">{s.value}</div>
            <div className="db-stat-label">{s.label}</div>
            <div className="db-stat-change db-stat-change--up">
              <svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15" /></svg>
              {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* ═══ Rating Overview + Sentiment Analysis ═══ */}
      <div className="db-grid-2">
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              Rating Distribution
            </div>
            <span className="db-card-action">{totalReviews} total</span>
          </div>
          <div className="db-card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
              {/* Big score with ring */}
              <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
                <svg viewBox="0 0 110 110" width="110" height="110">
                  <circle cx="55" cy="55" r="48" fill="none" stroke="var(--gray-100)" strokeWidth="8" />
                  <circle cx="55" cy="55" r="48" fill="none" stroke="var(--amber)" strokeWidth="8" strokeDasharray={`${(avgRating / 5) * 301.6} ${301.6 - (avgRating / 5) * 301.6}`} strokeLinecap="round" transform="rotate(-90 55 55)" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1 }}>{avgRating}</span>
                  <Stars rating={5} size={11} />
                </div>
              </div>
              {/* Distribution bars */}
              <div style={{ flex: 1 }}>
                {ratingDist.map(r => (
                  <div key={r.stars} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-600)', width: 14, textAlign: 'right' }}>{r.stars}</span>
                    <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, fill: 'var(--amber)', stroke: 'none', flexShrink: 0 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    <div style={{ flex: 1, height: 8, background: 'var(--gray-100)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${r.pct}%`, background: r.stars >= 4 ? 'var(--amber)' : r.stars === 3 ? 'var(--gray-400)' : 'var(--coral)', borderRadius: 4, transition: 'width .8s ease' }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-700)', width: 32, textAlign: 'right' }}>{r.count}</span>
                    <span style={{ fontSize: 10, fontWeight: 300, color: 'var(--gray-400)', width: 28, textAlign: 'right' }}>{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Quick rating summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {[
                { label: '5-Star Rate', value: '62%', color: 'var(--emerald)' },
                { label: 'Recommend', value: '96%', color: 'var(--accent)' },
                { label: 'Repeat Clients', value: '78%', color: 'var(--amber)' },
              ].map(q => (
                <div key={q.label} style={{ background: 'var(--gray-50)', borderRadius: 'var(--r-sm)', padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: q.color }}>{q.value}</div>
                  <div style={{ fontSize: 10, fontWeight: 300, color: 'var(--gray-500)' }}>{q.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Sentiment Analysis
            </div>
          </div>
          <div className="db-card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
              {/* Sentiment donut */}
              <svg width="100" height="100" viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
                {sentimentData.map(s => {
                  const start = (sentAcc / 100) * 360
                  sentAcc += s.pct
                  const end = (sentAcc / 100) * 360
                  const sR = ((start - 90) * Math.PI) / 180, eR = ((end - 90) * Math.PI) / 180
                  const r = 40, cx = 50, cy = 50
                  const x1 = cx + r * Math.cos(sR), y1 = cy + r * Math.sin(sR)
                  const x2 = cx + r * Math.cos(eR), y2 = cy + r * Math.sin(eR)
                  return <path key={s.label} d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${end - start > 180 ? 1 : 0} 1 ${x2} ${y2} Z`} fill={s.color} opacity=".7" />
                })}
                <circle cx="50" cy="50" r="24" fill="#fff" />
                <text x="50" y="47" textAnchor="middle" fontSize="16" fontWeight="700" fill="var(--emerald)">92%</text>
                <text x="50" y="59" textAnchor="middle" fontSize="8" fill="var(--gray-400)" fontWeight="300">positive</text>
              </svg>
              <div style={{ flex: 1 }}>
                {sentimentData.map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 12.5, fontWeight: 400, color: 'var(--gray-700)' }}>{s.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>{s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Keyword cloud */}
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>Top Keywords</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {sentimentKeywords.map(k => (
                <span key={k.word} style={{
                  padding: '4px 10px', borderRadius: 12,
                  fontSize: Math.max(10, Math.min(13, 8 + k.count / 8)),
                  fontWeight: k.count > 30 ? 600 : 400,
                  background: k.sentiment === 'positive' ? 'rgba(47,174,106,.08)' : k.sentiment === 'negative' ? 'rgba(239,107,74,.08)' : 'rgba(245,158,11,.08)',
                  color: k.sentiment === 'positive' ? 'var(--emerald)' : k.sentiment === 'negative' ? 'var(--coral)' : 'var(--amber)',
                }}>
                  {k.word} <span style={{ fontWeight: 300, fontSize: 9, opacity: .7 }}>({k.count})</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Monthly Trend + Source Breakdown + Competitor ═══ */}
      <div className="db-grid-3" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        {/* Monthly Review Volume */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></svg>
              Monthly Trend
            </div>
          </div>
          <div className="db-card-body">
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, marginBottom: 12 }}>
              {monthlyReviews.map((m, i) => (
                <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--gray-600)' }}>{m.count}</span>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'stretch' }}>
                    <div style={{ height: `${(m.count / maxMonthly) * 80}px`, background: i === monthlyReviews.length - 1 ? 'var(--amber)' : 'var(--amber)', borderRadius: '3px 3px 0 0', opacity: i === monthlyReviews.length - 1 ? .85 : .35 }} />
                  </div>
                  <span style={{ fontSize: 9, color: 'var(--gray-400)', fontWeight: 300 }}>{m.month}</span>
                  <span style={{ fontSize: 8, color: 'var(--amber)', fontWeight: 500 }}>★ {m.avg}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--r-sm)', padding: '10px 14px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--gray-600)' }}>Growth Rate</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--emerald)' }}>+78% YoY</span>
            </div>
          </div>
        </div>

        {/* Source Breakdown */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" /></svg>
              Review Sources
            </div>
          </div>
          <div className="db-card-body" style={{ padding: '12px 20px' }}>
            {sourcesData.map(s => (
              <div key={s.source} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: s.color, opacity: .15, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: s.color }}>{s.source[0]}</span>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-700)' }}>{s.source}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-800)' }}>{s.count}</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--gray-100)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: 2, opacity: .6 }} />
                  </div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" style={{ width: 10, height: 10, fill: 'var(--amber)', stroke: 'none' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  {s.avg}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Competitor Comparison */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
              vs. Competitors
            </div>
          </div>
          <div className="db-card-body" style={{ padding: '8px 20px' }}>
            {competitors.map(c => (
              <div key={c.name} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0',
                borderBottom: '1px solid var(--gray-100)',
                ...(c.isYou ? { background: 'linear-gradient(90deg,rgba(108,114,241,.04),transparent)', margin: '0 -20px', padding: '10px 20px', borderRadius: 'var(--r-sm)' } : {})
              }}>
                <span style={{
                  width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, flexShrink: 0,
                  background: c.rank === 1 ? 'var(--amber)' : c.rank === 2 ? 'var(--gray-300)' : c.rank === 3 ? '#CD7F32' : 'var(--gray-200)',
                  color: c.rank <= 3 ? '#fff' : 'var(--gray-500)'
                }}>{c.rank}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 12.5, fontWeight: c.isYou ? 600 : 400, color: c.isYou ? 'var(--accent)' : 'var(--gray-700)' }}>
                    {c.name} {c.isYou && <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 4, background: 'var(--accent-soft)', color: 'var(--accent)', fontWeight: 600 }}>YOU</span>}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" style={{ width: 11, height: 11, fill: 'var(--amber)', stroke: 'none' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-800)' }}>{c.rating}</span>
                  <span style={{ fontSize: 10, fontWeight: 300, color: 'var(--gray-400)' }}>({c.reviews})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Review Performance Metrics ═══ */}
      <div className="db-card db-full">
        <div className="db-card-header">
          <div className="db-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            Response Performance
          </div>
        </div>
        <div className="db-card-body" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="db-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Current</th>
                <th>Last Month</th>
                <th>Target</th>
                <th>Status</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {[
                { metric: 'Avg. Response Time', curr: '4.2h', prev: '5.1h', target: '< 6h', status: 'on-track', spark: [8,7,6.5,6,5.5,5.1,4.8,4.2], up: true },
                { metric: 'Response Rate', curr: '87%', prev: '82%', target: '> 85%', status: 'on-track', spark: [72,75,78,80,82,84,86,87], up: true },
                { metric: 'Avg. Rating (New)', curr: '4.8', prev: '4.6', target: '> 4.5', status: 'exceeding', spark: [4.3,4.4,4.5,4.5,4.6,4.7,4.7,4.8], up: true },
                { metric: 'Review Volume', curr: '32/mo', prev: '28/mo', target: '> 25', status: 'exceeding', spark: [18,20,22,24,26,28,30,32], up: true },
                { metric: 'Negative Reviews', curr: '2', prev: '3', target: '< 5', status: 'on-track', spark: [6,5,5,4,4,3,3,2], up: true },
                { metric: '5-Star Ratio', curr: '62%', prev: '58%', target: '> 55%', status: 'exceeding', spark: [48,50,52,54,56,58,60,62], up: true },
              ].map(r => (
                <tr key={r.metric}>
                  <td className="db-table-name">{r.metric}</td>
                  <td style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{r.curr}</td>
                  <td>{r.prev}</td>
                  <td style={{ color: 'var(--gray-500)' }}>{r.target}</td>
                  <td>
                    <span className={`db-badge-pill ${r.status === 'exceeding' ? 'db-badge--active' : 'db-badge--pending'}`}>
                      {r.status === 'exceeding' ? 'Exceeding' : 'On Track'}
                    </span>
                  </td>
                  <td><Spark data={r.spark} color={r.up ? 'var(--emerald)' : 'var(--coral)'} w={60} h={20} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══ Reviews List ═══ */}
      <div className="db-card db-full">
        <div className="db-card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
            {[
              { key: 'all', label: 'All' },
              { key: 'unreplied', label: `Needs Reply (${unrepliedCount})` },
              { key: 'positive', label: 'Positive' },
              { key: 'negative', label: 'Critical' },
              { key: '5', label: '5★' },
              { key: '4', label: '4★' },
              { key: '3', label: '3★' },
              { key: '2', label: '2★' },
            ].map(f => (
              <button key={f.key} className={`db-btn ${filter === f.key ? 'db-btn--primary' : 'db-btn--outline'}`} style={{ padding: '5px 12px', fontSize: 11 }} onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', stroke: 'var(--gray-400)', fill: 'none', strokeWidth: 1.5 }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <input className="db-form-input" placeholder="Search reviews..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: 30, width: 170, height: 32, fontSize: 12, margin: 0 }} />
            </div>
            <select className="db-form-select" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 120, height: 32, fontSize: 11, padding: '0 28px 0 10px', margin: 0 }}>
              <option value="newest">Newest</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        <div className="db-card-body" style={{ padding: '0 20px' }}>
          {filtered.map(r => (
            <div className="db-review" key={r.id} style={{ padding: '20px 0' }}>
              {/* Review header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                <div className="db-review-avatar" style={{ background: r.bg, width: 44, height: 44, fontSize: 13 }}>{r.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
                    <span className="db-review-name" style={{ fontSize: 14 }}>{r.name}</span>
                    {r.verified && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 500, color: 'var(--emerald)', background: 'rgba(47,174,106,.08)', padding: '1px 7px', borderRadius: 4 }}>
                        <svg viewBox="0 0 24 24" style={{ width: 10, height: 10, stroke: 'var(--emerald)', fill: 'none', strokeWidth: 2 }}><polyline points="20 6 9 17 4 12" /></svg>
                        Verified
                      </span>
                    )}
                    <span style={{ fontSize: 10, fontWeight: 400, padding: '2px 7px', borderRadius: 4, background: 'var(--gray-100)', color: 'var(--gray-500)' }}>{r.source}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Stars rating={r.rating} size={13} />
                    <span className="db-review-date">{r.date} at {r.time}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  {!r.replied && <span className="db-badge-pill db-badge--pending" style={{ animation: 'an-pulse-ring 2s ease infinite' }}>Needs Reply</span>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 400, color: 'var(--gray-400)' }}>
                    <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: 'currentColor', fill: 'none', strokeWidth: 1.5 }}><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                    {r.helpful}
                  </div>
                </div>
              </div>

              {/* Review text */}
              <div className="db-review-text" style={{ fontSize: 13.5, lineHeight: 1.7, marginLeft: 56, marginBottom: 10 }}>{r.text}</div>

              {/* Tags */}
              <div style={{ marginLeft: 56, display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                {r.tags.map(t => (
                  <span key={t} style={{
                    padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 500,
                    background: r.sentiment === 'positive' ? 'rgba(47,174,106,.06)' : r.sentiment === 'negative' ? 'rgba(239,107,74,.06)' : 'rgba(245,158,11,.06)',
                    color: r.sentiment === 'positive' ? 'var(--emerald)' : r.sentiment === 'negative' ? 'var(--coral)' : 'var(--amber)',
                  }}>{t}</span>
                ))}
              </div>

              {/* Reply (if exists) */}
              {r.replied && r.replyText && (
                <div style={{ marginLeft: 56, background: 'linear-gradient(135deg,rgba(108,114,241,.03),rgba(139,92,246,.02))', border: '1px solid rgba(108,114,241,.1)', borderRadius: 'var(--r-sm)', padding: '14px 16px', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 8, fontWeight: 600, color: '#fff' }}>CG</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>CloudGuard Technologies</span>
                    <span style={{ fontSize: 10, fontWeight: 300, color: 'var(--gray-400)' }}>{r.replyDate}</span>
                  </div>
                  <p style={{ fontSize: 12.5, fontWeight: 350, color: 'var(--gray-600)', lineHeight: 1.6, margin: 0 }}>{r.replyText}</p>
                </div>
              )}

              {/* Actions */}
              <div style={{ marginLeft: 56, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <button className="db-btn db-btn--primary" style={{ padding: '6px 14px', fontSize: 11 }} onClick={(e) => { e.stopPropagation(); setExpandedReply(expandedReply === r.id ? null : r.id) }}>
                  <svg viewBox="0 0 24 24" style={{ width: 12, height: 12 }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  {r.replied ? 'Edit Reply' : 'Write Reply'}
                </button>
                <button className="db-review-action">
                  <svg viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                  Helpful ({r.helpful})
                </button>
                <button className="db-review-action">
                  <svg viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                  Share
                </button>
                <button className="db-review-action">
                  <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                  Feature
                </button>
                {r.sentiment !== 'positive' && (
                  <button className="db-review-action" style={{ color: 'var(--coral)' }}>
                    <svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                    Flag
                  </button>
                )}
              </div>

              {/* Reply editor */}
              {expandedReply === r.id && (
                <div style={{ marginLeft: 56, marginTop: 12, background: 'var(--gray-50)', borderRadius: 'var(--r)', padding: 16 }}>
                  <textarea className="db-form-textarea" placeholder="Write your reply..." defaultValue={r.replyText || ''} style={{ minHeight: 80, marginBottom: 10, background: '#fff' }} />
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button className="db-btn db-btn--primary" style={{ padding: '7px 16px', fontSize: 12 }}>
                      <svg viewBox="0 0 24 24" style={{ width: 13, height: 13 }}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                      Post Reply
                    </button>
                    <button className="db-btn db-btn--outline" style={{ padding: '7px 16px', fontSize: 12 }} onClick={() => setExpandedReply(null)}>Cancel</button>
                    <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 300, color: 'var(--gray-400)' }}>Replies are public and visible to all users</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <div className="db-card-empty">No reviews matching this filter</div>}
        </div>
      </div>

      {/* ═══ Review Highlights — Best & Worst ═══ */}
      <div className="db-grid-2">
        {/* Best Review */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title" style={{ color: 'var(--emerald)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
              Best Review This Month
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: 3 }}>
              <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: 'var(--emerald)', fill: 'none', strokeWidth: 1.5 }}><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
              31 helpful
            </span>
          </div>
          <div className="db-card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div className="db-review-avatar" style={{ background: 'var(--coral)', width: 36, height: 36, fontSize: 11 }}>EC</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-800)' }}>Emily Chen</div>
                <Stars rating={5} size={11} />
              </div>
            </div>
            <p style={{ fontSize: 12.5, fontWeight: 350, color: 'var(--gray-600)', lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>
              &ldquo;Best in the business! I&apos;ve used several similar services but this one stands head and shoulders above the rest. Their penetration testing uncovered vulnerabilities our previous vendor missed entirely.&rdquo;
            </p>
          </div>
        </div>

        {/* Most Actionable Feedback */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title" style={{ color: 'var(--amber)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              Most Actionable Feedback
            </div>
          </div>
          <div className="db-card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div className="db-review-avatar" style={{ background: 'var(--teal)', width: 36, height: 36, fontSize: 11 }}>DK</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-800)' }}>David Kim</div>
                <Stars rating={3} size={11} />
              </div>
              <span className="db-badge-pill db-badge--pending" style={{ marginLeft: 'auto' }}>Needs Reply</span>
            </div>
            <p style={{ fontSize: 12.5, fontWeight: 350, color: 'var(--gray-600)', lineHeight: 1.65, margin: 0, marginBottom: 12, fontStyle: 'italic' }}>
              &ldquo;Communication could be improved. Response times were inconsistent — sometimes within the hour, other times 24+ hours.&rdquo;
            </p>
            <div style={{ background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.15)', borderRadius: 'var(--r-sm)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'var(--amber)', fill: 'none', strokeWidth: 1.5, flexShrink: 0 }}><path d="M12 2L2 7l10 5 10-5-10-5z" /></svg>
              <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--gray-600)' }}>
                <strong style={{ color: 'var(--amber)' }}>Action item:</strong> Set up automated response acknowledgments to reduce perceived response time
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
