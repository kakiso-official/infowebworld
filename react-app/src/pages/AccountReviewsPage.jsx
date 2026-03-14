import { useState } from 'react'
import { Link } from 'react-router-dom'
import AccountLayout from '../components/account/AccountLayout'

const myReviews = [
  { id: 1, business: 'CloudGuard Technologies', category: 'Technology', rating: 5, text: 'Best remote work platform we\'ve ever used. The AI meeting assistant is a game-changer for our distributed team. Setup was effortless and the team was onboarded within a day.', date: 'Mar 12, 2026', helpful: 24, gradient: 'linear-gradient(135deg,var(--accent),var(--plum))', replied: true, replyFrom: 'CloudGuard Technologies', replyText: 'Thank you so much, Aadil! We\'re thrilled the AI meeting assistant is making a difference for your team. Your feedback means the world to us!', replyDate: 'Mar 13, 2026', status: 'published' },
  { id: 2, business: 'EmbeddPay', category: 'Finance', rating: 4, text: 'Great embedded finance solution. Integration was smooth and their support team is excellent. Only minor issue was documentation for edge cases could be more detailed.', date: 'Mar 8, 2026', helpful: 18, gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))', replied: true, replyFrom: 'EmbeddPay Team', replyText: 'Thanks for the honest feedback! We\'re working on expanding our documentation. Glad the integration went smoothly!', replyDate: 'Mar 9, 2026', status: 'published' },
  { id: 3, business: 'PropView Analytics', category: 'Real Estate', rating: 5, text: 'Their AI valuations are incredibly accurate. Saved us thousands on property assessments. The dashboard is intuitive and the API is well-documented.', date: 'Feb 28, 2026', helpful: 31, gradient: 'linear-gradient(135deg,var(--amber),var(--coral))', replied: false, status: 'published' },
  { id: 4, business: 'TasteWise AI', category: 'Food & Dining', rating: 5, text: 'Revolutionary food analytics platform. Their trend prediction model is scary-accurate — predicted the matcha trend in our market 3 months before it hit.', date: 'Feb 22, 2026', helpful: 15, gradient: 'linear-gradient(135deg,var(--coral),var(--amber))', replied: true, replyFrom: 'TasteWise AI', replyText: 'We love hearing about real-world predictions! Would you be open to a case study feature?', replyDate: 'Feb 23, 2026', status: 'published' },
  { id: 5, business: 'LexFlow Legal', category: 'Legal', rating: 4, text: 'Solid legal tech platform. Contract automation saved us hours of manual work. The AI clause suggestions are impressive, though occasionally needs human review for complex terms.', date: 'Feb 15, 2026', helpful: 12, gradient: 'linear-gradient(135deg,var(--plum),var(--rose))', replied: false, status: 'published' },
  { id: 6, business: 'UpSkill HQ', category: 'Education', rating: 5, text: 'The best corporate training platform we\'ve used. AI-personalized learning paths keep our team engaged. Completion rates went from 40% to 92%.', date: 'Feb 8, 2026', helpful: 22, gradient: 'linear-gradient(135deg,var(--azure),var(--accent))', replied: true, replyFrom: 'UpSkill HQ', replyText: 'That completion rate jump is incredible! Thank you for being a champion of continuous learning!', replyDate: 'Feb 9, 2026', status: 'published' },
  { id: 7, business: 'SecureNet Pro', category: 'Technology', rating: 3, text: 'Decent network security tool but the UI feels dated compared to competitors. Core functionality is solid but the learning curve is steeper than necessary.', date: 'Jan 30, 2026', helpful: 8, gradient: 'linear-gradient(135deg,var(--gray-400),var(--gray-500))', replied: true, replyFrom: 'SecureNet Pro', replyText: 'Thank you for the candid feedback. We have a major UI overhaul coming in Q2 that addresses these concerns!', replyDate: 'Jan 31, 2026', status: 'published' },
  { id: 8, business: 'DataFort Security', category: 'Technology', rating: 5, text: 'Enterprise-grade data protection with a surprisingly simple setup. Their team walked us through every step and the monitoring dashboard is excellent.', date: 'Jan 22, 2026', helpful: 19, gradient: 'linear-gradient(135deg,var(--teal),var(--emerald))', replied: false, status: 'published' },
  { id: 9, business: 'GreenRoute Logistics', category: 'Logistics', rating: 4, text: 'Impressive route optimization — cut our delivery costs by 23%. The sustainability tracking feature is a great bonus for ESG reporting.', date: 'Jan 14, 2026', helpful: 14, gradient: 'linear-gradient(135deg,var(--emerald),var(--azure))', replied: false, status: 'published' },
  { id: 10, business: 'NexaHealth AI', category: 'Healthcare', rating: 5, text: 'Game-changing healthcare analytics. Their predictive models helped us identify at-risk patients 3x faster. HIPAA compliance is baked in from day one.', date: 'Jan 5, 2026', helpful: 26, gradient: 'linear-gradient(135deg,var(--rose),var(--coral))', replied: true, replyFrom: 'NexaHealth AI', replyText: 'So glad our platform is making a real difference in patient outcomes. That\'s why we do what we do!', replyDate: 'Jan 6, 2026', status: 'published' },
  { id: 11, business: 'CodeForge Studio', category: 'Technology', rating: 4, text: 'Great no-code platform for internal tools. Saved our team weeks of development time. Would love more complex database relationship support.', date: 'Dec 28, 2025', helpful: 11, gradient: 'linear-gradient(135deg,var(--accent),var(--azure))', replied: false, status: 'published' },
  { id: 12, business: 'LegalMind Pro', category: 'Legal', rating: 5, text: 'AI-powered legal research that actually delivers. Cut our research time in half and the case law citations are always accurate and relevant.', date: 'Dec 18, 2025', helpful: 20, gradient: 'linear-gradient(135deg,var(--plum),var(--accent))', replied: true, replyFrom: 'LegalMind Pro', replyText: 'Accuracy is our #1 priority. Thank you for trusting us with your legal research!', replyDate: 'Dec 19, 2025', status: 'published' },
]

const ratingDist = { 5: 8, 4: 3, 3: 1, 2: 0, 1: 0 }
const totalHelpful = myReviews.reduce((a, r) => a + r.helpful, 0)

export default function AccountReviewsPage() {
  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const [sortBy, setSortBy] = useState('newest')

  const filtered = myReviews
    .filter(r => {
      if (filter === 'replied') return r.replied
      if (filter === 'unreplied') return !r.replied
      if (['5','4','3'].includes(filter)) return r.rating === parseInt(filter)
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'helpful') return b.helpful - a.helpful
      if (sortBy === 'highest') return b.rating - a.rating
      if (sortBy === 'lowest') return a.rating - b.rating
      return 0
    })

  const avgRating = (myReviews.reduce((a, r) => a + r.rating, 0) / myReviews.length).toFixed(1)

  return (
    <AccountLayout title="My Reviews" subtitle={`${myReviews.length} reviews written`}>
      {/* ═══ Stats ═══ */}
      <div className="db-grid-2" style={{ marginBottom: 24 }}>
        {/* Rating Summary */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              My Rating Summary
            </div>
          </div>
          <div className="db-card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 40, fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1 }}>{avgRating}</div>
                <div className="db-stars" style={{ justifyContent: 'center', margin: '6px 0' }}>
                  {[1,2,3,4,5].map(s => <svg key={s} viewBox="0 0 24 24" style={{ width: 14, height: 14 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>)}
                </div>
                <div style={{ fontSize: 12, fontWeight: 300, color: 'var(--gray-400)' }}>avg. given</div>
              </div>
              <div style={{ flex: 1 }}>
                {[5,4,3,2,1].map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-600)', width: 14, textAlign: 'right' }}>{s}</span>
                    <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, fill: 'var(--amber)', stroke: 'none', flexShrink: 0 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    <div style={{ flex: 1, height: 6, background: 'var(--gray-100)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${((ratingDist[s] || 0) / myReviews.length) * 100}%`, background: 'var(--amber)', borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray-500)', width: 16, textAlign: 'right' }}>{ratingDist[s] || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="db-card">
          <div className="db-card-header">
            <div className="db-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /></svg>
              Your Impact
            </div>
          </div>
          <div className="db-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Total Helpful Votes', value: totalHelpful.toString(), icon: '👍', color: 'var(--accent)' },
                { label: 'Business Replies', value: myReviews.filter(r => r.replied).length.toString(), icon: '💬', color: 'var(--emerald)' },
                { label: 'Reviews This Month', value: '3', icon: '📝', color: 'var(--amber)' },
                { label: 'Categories Covered', value: [...new Set(myReviews.map(r => r.category))].length.toString(), icon: '📂', color: 'var(--plum)' },
              ].map(s => (
                <div key={s.label} style={{ padding: '14px', background: 'var(--gray-50)', borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-900)' }}>{s.value}</div>
                    <div style={{ fontSize: 10, fontWeight: 300, color: 'var(--gray-400)' }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Reviews List ═══ */}
      <div className="db-card db-full">
        <div className="db-card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
            {[
              { key: 'all', label: `All (${myReviews.length})` },
              { key: 'replied', label: 'Got Replies' },
              { key: 'unreplied', label: 'No Reply' },
              { key: '5', label: '5★' },
              { key: '4', label: '4★' },
              { key: '3', label: '3★' },
            ].map(f => (
              <button key={f.key} className={`db-btn ${filter === f.key ? 'db-btn--primary' : 'db-btn--outline'}`} style={{ padding: '5px 12px', fontSize: 11 }} onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <select className="db-form-select" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 130, height: 32, fontSize: 11, padding: '0 28px 0 10px', margin: 0 }}>
              <option value="newest">Newest First</option>
              <option value="helpful">Most Helpful</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
            <Link to="/write-review" className="db-btn db-btn--primary" style={{ fontSize: 11, padding: '5px 14px' }}>
              <svg viewBox="0 0 24 24" style={{ width: 12, height: 12 }}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Write Review
            </Link>
          </div>
        </div>

        <div className="db-card-body" style={{ padding: '0 20px' }}>
          {filtered.map(r => (
            <div key={r.id} style={{ padding: '18px 0', borderBottom: '1px solid var(--gray-100)', cursor: 'pointer' }}
              onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--r-sm)', background: r.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{r.business[0]}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)' }}>{r.business}</span>
                    <span style={{ fontSize: 10, fontWeight: 400, padding: '1px 7px', borderRadius: 4, background: 'var(--gray-100)', color: 'var(--gray-500)' }}>{r.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="db-stars">
                      {[1,2,3,4,5].map(s => <svg key={s} viewBox="0 0 24 24" className={s > r.rating ? 'empty' : ''} style={{ width: 13, height: 13 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>)}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 300, color: 'var(--gray-400)' }}>{r.date}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 400, color: 'var(--gray-400)' }}>
                    <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: 'currentColor', fill: 'none', strokeWidth: 1.5 }}><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" /></svg>
                    {r.helpful}
                  </div>
                  {r.replied && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 500, color: 'var(--emerald)', background: 'rgba(47,174,106,.08)', padding: '2px 7px', borderRadius: 4 }}>
                      <svg viewBox="0 0 24 24" style={{ width: 10, height: 10, stroke: 'var(--emerald)', fill: 'none', strokeWidth: 2 }}><polyline points="20 6 9 17 4 12" /></svg>
                      Replied
                    </span>
                  )}
                  <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: 'var(--gray-300)', fill: 'none', strokeWidth: 1.5, transition: 'transform .2s', transform: expandedId === r.id ? 'rotate(180deg)' : 'rotate(0)' }}><polyline points="6 9 12 15 18 9" /></svg>
                </div>
              </div>

              {/* Review text */}
              <p style={{ fontSize: 13, fontWeight: 350, color: 'var(--gray-600)', lineHeight: 1.6, margin: 0, marginLeft: 56, ...(expandedId !== r.id ? { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}) }}>{r.text}</p>

              {/* Expanded content */}
              {expandedId === r.id && (
                <div style={{ marginLeft: 56, marginTop: 14 }}>
                  {/* Business reply */}
                  {r.replied && (
                    <div style={{ background: 'linear-gradient(135deg,rgba(47,174,106,.03),rgba(20,184,166,.02))', border: '1px solid rgba(47,174,106,.12)', borderRadius: 'var(--r-sm)', padding: '14px 16px', marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: r.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: 8, fontWeight: 600, color: '#fff' }}>{r.business[0]}</span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-800)' }}>{r.replyFrom}</span>
                        <span style={{ fontSize: 10, fontWeight: 300, color: 'var(--gray-400)' }}>{r.replyDate}</span>
                      </div>
                      <p style={{ fontSize: 12.5, fontWeight: 350, color: 'var(--gray-600)', lineHeight: 1.6, margin: 0 }}>{r.replyText}</p>
                    </div>
                  )}
                  {!r.replied && (
                    <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--r-sm)', padding: '12px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'var(--gray-400)', fill: 'none', strokeWidth: 1.5, flexShrink: 0 }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--gray-500)' }}>The business hasn&apos;t replied to this review yet</span>
                    </div>
                  )}
                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="db-btn db-btn--outline" style={{ padding: '6px 14px', fontSize: 11 }}>
                      <svg viewBox="0 0 24 24" style={{ width: 12, height: 12 }}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      Edit Review
                    </button>
                    <button className="db-review-action">
                      <svg viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                      Share
                    </button>
                    <button className="db-review-action" style={{ marginLeft: 'auto', color: 'var(--coral)' }}>
                      <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <div className="db-card-empty">No reviews matching this filter</div>}
        </div>
      </div>
    </AccountLayout>
  )
}
