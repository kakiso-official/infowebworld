import { useState } from 'react'
import AccountLayout from '../components/account/AccountLayout'

const savedBusinesses = [
  { id: 1, name: 'CloudGuard Technologies', category: 'Technology', rating: 4.8, reviews: 342, desc: 'Enterprise cloud security solutions with zero-trust architecture and real-time threat detection.', gradient: 'linear-gradient(135deg,var(--accent),var(--plum))', savedDate: 'Mar 10, 2026', tags: ['Cloud Security', 'Enterprise', 'Zero Trust'], price: '$$$$', verified: true, trending: true },
  { id: 2, name: 'TasteWise AI', category: 'Food & Dining', rating: 4.6, reviews: 189, desc: 'AI-powered food trend analytics and menu optimization for restaurants and food brands.', gradient: 'linear-gradient(135deg,var(--amber),var(--coral))', savedDate: 'Mar 8, 2026', tags: ['AI', 'Food Analytics', 'Trends'], price: '$$$', verified: true, trending: false },
  { id: 3, name: 'LexFlow Legal', category: 'Legal', rating: 4.7, reviews: 256, desc: 'Automated contract management and legal workflow platform for modern law firms.', gradient: 'linear-gradient(135deg,var(--plum),var(--rose))', savedDate: 'Mar 5, 2026', tags: ['Legal Tech', 'Contracts', 'Automation'], price: '$$$', verified: true, trending: false },
  { id: 4, name: 'UpSkill HQ', category: 'Education', rating: 4.5, reviews: 412, desc: 'AI-personalized corporate training and skill development platform with analytics.', gradient: 'linear-gradient(135deg,var(--azure),var(--accent))', savedDate: 'Mar 2, 2026', tags: ['EdTech', 'Training', 'AI'], price: '$$', verified: true, trending: true },
  { id: 5, name: 'NexaHealth AI', category: 'Healthcare', rating: 4.9, reviews: 167, desc: 'Predictive healthcare analytics and patient risk assessment powered by machine learning.', gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))', savedDate: 'Feb 28, 2026', tags: ['Healthcare', 'AI', 'Analytics'], price: '$$$$', verified: true, trending: true },
  { id: 6, name: 'EmbeddPay', category: 'Finance', rating: 4.6, reviews: 234, desc: 'Embedded finance infrastructure for SaaS platforms — payments, lending, and banking APIs.', gradient: 'linear-gradient(135deg,var(--emerald),var(--azure))', savedDate: 'Feb 25, 2026', tags: ['FinTech', 'Payments', 'API'], price: '$$$', verified: true, trending: false },
  { id: 7, name: 'CodeForge Studio', category: 'Technology', rating: 4.7, reviews: 198, desc: 'No-code platform for building internal tools and automations at enterprise scale.', gradient: 'linear-gradient(135deg,var(--accent),var(--azure))', savedDate: 'Feb 20, 2026', tags: ['No-Code', 'Internal Tools', 'Automation'], price: '$$', verified: true, trending: false },
  { id: 8, name: 'GreenRoute Logistics', category: 'Logistics', rating: 4.6, reviews: 145, desc: 'AI-optimized route planning and sustainable last-mile delivery solutions.', gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))', savedDate: 'Feb 15, 2026', tags: ['Logistics', 'Sustainability', 'AI'], price: '$$$', verified: false, trending: false },
  { id: 9, name: 'PropView Analytics', category: 'Real Estate', rating: 4.8, reviews: 312, desc: 'AI-powered property valuations and real estate market intelligence platform.', gradient: 'linear-gradient(135deg,var(--amber),var(--coral))', savedDate: 'Feb 10, 2026', tags: ['Real Estate', 'Valuations', 'AI'], price: '$$$', verified: true, trending: false },
  { id: 10, name: 'DataFort Security', category: 'Technology', rating: 4.5, reviews: 178, desc: 'Enterprise data protection, encryption, and compliance management solution.', gradient: 'linear-gradient(135deg,var(--teal),var(--emerald))', savedDate: 'Feb 5, 2026', tags: ['Data Security', 'Encryption', 'Compliance'], price: '$$$$', verified: true, trending: false },
]

const categories = ['All', ...new Set(savedBusinesses.map(b => b.category))]

export default function AccountSavedPage() {
  const [filter, setFilter] = useState('All')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('recent')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = savedBusinesses
    .filter(b => filter === 'All' || b.category === filter)
    .filter(b => !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'reviews') return b.reviews - a.reviews
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0
    })

  return (
    <AccountLayout title="Saved Businesses" subtitle={`${savedBusinesses.length} bookmarked`}>
      {/* ═══ Category Stats ═══ */}
      <div className="db-stats" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Saved', value: savedBusinesses.length, gradient: 'linear-gradient(135deg,var(--accent),var(--plum))' },
          { label: 'Categories', value: [...new Set(savedBusinesses.map(b => b.category))].length, gradient: 'linear-gradient(135deg,var(--azure),var(--accent))' },
          { label: 'Avg. Rating', value: (savedBusinesses.reduce((a, b) => a + b.rating, 0) / savedBusinesses.length).toFixed(1), gradient: 'linear-gradient(135deg,var(--amber),var(--coral))' },
          { label: 'Trending', value: savedBusinesses.filter(b => b.trending).length, gradient: 'linear-gradient(135deg,var(--emerald),var(--teal))' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--r)', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--r-sm)', background: s.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{s.value}</span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ Toolbar ═══ */}
      <div className="db-card db-full">
        <div className="db-card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
            {categories.map(c => (
              <button key={c} className={`db-btn ${filter === c ? 'db-btn--primary' : 'db-btn--outline'}`} style={{ padding: '5px 12px', fontSize: 11 }} onClick={() => setFilter(c)}>
                {c} {c === 'All' ? `(${savedBusinesses.length})` : `(${savedBusinesses.filter(b => b.category === c).length})`}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', stroke: 'var(--gray-400)', fill: 'none', strokeWidth: 1.5 }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <input className="db-form-input" placeholder="Search saved..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: 30, width: 160, height: 32, fontSize: 12, margin: 0 }} />
            </div>
            <select className="db-form-select" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 120, height: 32, fontSize: 11, padding: '0 28px 0 10px', margin: 0 }}>
              <option value="recent">Recently Saved</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
              <option value="name">A-Z</option>
            </select>
            <div style={{ display: 'flex', border: '1px solid var(--gray-200)', borderRadius: 'var(--r-sm)', overflow: 'hidden' }}>
              <button onClick={() => setViewMode('grid')} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', background: viewMode === 'grid' ? 'var(--accent-soft)' : '#fff' }}>
                <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: viewMode === 'grid' ? 'var(--accent)' : 'var(--gray-400)', fill: 'none', strokeWidth: 1.5 }}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
              </button>
              <button onClick={() => setViewMode('list')} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderLeft: '1px solid var(--gray-200)', cursor: 'pointer', background: viewMode === 'list' ? 'var(--accent-soft)' : '#fff' }}>
                <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: viewMode === 'list' ? 'var(--accent)' : 'var(--gray-400)', fill: 'none', strokeWidth: 1.5 }}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="db-card-body" style={{ padding: 16 }}>
          {viewMode === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
              {filtered.map(b => (
                <div key={b.id} style={{ border: '1px solid var(--gray-200)', borderRadius: 'var(--r)', overflow: 'hidden', background: '#fff', transition: 'all .25s' }}>
                  {/* Color header */}
                  <div style={{ height: 6, background: b.gradient }} />
                  <div style={{ padding: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 'var(--r-sm)', background: b.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{b.name[0]}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)' }}>{b.name}</span>
                          {b.verified && <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'var(--accent)', fill: 'none', strokeWidth: 1.5, flexShrink: 0 }}><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 300, color: 'var(--gray-400)' }}>{b.category} &middot; {b.price}</div>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 350, color: 'var(--gray-600)', lineHeight: 1.55, margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{b.desc}</p>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
                      {b.tags.map(t => (
                        <span key={t} style={{ padding: '2px 8px', borderRadius: 10, background: 'var(--gray-100)', fontSize: 10, fontWeight: 400, color: 'var(--gray-500)' }}>{t}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--gray-100)', paddingTop: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, fill: 'var(--amber)', stroke: 'none' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-800)' }}>{b.rating}</span>
                        <span style={{ fontSize: 11, fontWeight: 300, color: 'var(--gray-400)' }}>({b.reviews})</span>
                        {b.trending && <span style={{ fontSize: 9, fontWeight: 600, padding: '1px 6px', borderRadius: 4, background: 'rgba(47,174,106,.08)', color: 'var(--emerald)', marginLeft: 4 }}>TRENDING</span>}
                      </div>
                      <button style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(239,107,74,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Remove from saved">
                        <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, fill: 'var(--coral)', stroke: 'none' }}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {filtered.map(b => (
                <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--r-sm)', background: b.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{b.name[0]}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-800)' }}>{b.name}</span>
                      {b.verified && <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: 'var(--accent)', fill: 'none', strokeWidth: 1.5 }}><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
                      {b.trending && <span style={{ fontSize: 9, fontWeight: 600, padding: '1px 6px', borderRadius: 4, background: 'rgba(47,174,106,.08)', color: 'var(--emerald)' }}>TRENDING</span>}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 300, color: 'var(--gray-400)' }}>{b.category} &middot; {b.price} &middot; Saved {b.savedDate}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    {b.tags.slice(0, 2).map(t => (
                      <span key={t} style={{ padding: '2px 7px', borderRadius: 10, background: 'var(--gray-100)', fontSize: 9, fontWeight: 400, color: 'var(--gray-500)' }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, fill: 'var(--amber)', stroke: 'none' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-800)' }}>{b.rating}</span>
                    <span style={{ fontSize: 10, fontWeight: 300, color: 'var(--gray-400)' }}>({b.reviews})</span>
                  </div>
                  <button style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(239,107,74,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }} title="Remove">
                    <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, fill: 'var(--coral)', stroke: 'none' }}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          {filtered.length === 0 && <div className="db-card-empty">No saved businesses matching this filter</div>}
        </div>
      </div>
    </AccountLayout>
  )
}
