import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import SharedLayout from '../components/shared/SharedLayout'
import { allArticles, categoryMeta } from '../data/articles'
import '../styles/search.css'

/* Mock business data for search results */
const businesses = [
  { id: 'cloudguard', name: 'CloudGuard Technologies', desc: 'Enterprise cloud security solutions with zero-trust architecture and real-time threat detection.', category: 'technology', rating: 4.8, reviews: 342, verified: true, tags: ['Cloud Security', 'Zero Trust', 'Enterprise'] },
  { id: 'tastewise', name: 'TasteWise AI', desc: 'AI-powered restaurant ordering and menu optimization platform for modern dining.', category: 'food', rating: 4.6, reviews: 189, verified: true, tags: ['Restaurant Tech', 'AI Ordering', 'Menu Analytics'] },
  { id: 'lexflow', name: 'LexFlow Legal', desc: 'Automated contract review and legal document analysis powered by machine learning.', category: 'legal', rating: 4.7, reviews: 256, verified: true, tags: ['Legal Tech', 'Contract Review', 'AI'] },
  { id: 'upskillhq', name: 'UpSkill HQ', desc: 'Corporate training platform with personalized learning paths and AI-driven content.', category: 'education', rating: 4.5, reviews: 412, verified: true, tags: ['E-Learning', 'Corporate Training', 'Upskilling'] },
  { id: 'propview', name: 'PropView Analytics', desc: 'AI-powered property valuation and real estate market intelligence platform.', category: 'realestate', rating: 4.4, reviews: 178, verified: true, tags: ['PropTech', 'Valuation', 'Market Data'] },
  { id: 'homepro', name: 'HomePro Connect', desc: 'Marketplace connecting homeowners with verified contractors and service professionals.', category: 'home', rating: 4.3, reviews: 523, verified: true, tags: ['Home Services', 'Contractors', 'Marketplace'] },
  { id: 'attriai', name: 'AttriAI', desc: 'Multi-touch marketing attribution platform using machine learning for accurate ROI tracking.', category: 'marketing', rating: 4.7, reviews: 231, verified: true, tags: ['Attribution', 'Marketing Analytics', 'AI'] },
  { id: 'vitallink', name: 'VitalLink Health', desc: 'Wearable health data integration for clinics and chronic disease management programs.', category: 'healthcare', rating: 4.6, reviews: 187, verified: true, tags: ['Digital Health', 'Wearables', 'Patient Data'] },
  { id: 'embeddpay', name: 'EmbeddPay', desc: 'Banking-as-a-service platform enabling SaaS companies to embed financial products.', category: 'finance', rating: 4.5, reviews: 298, verified: true, tags: ['Embedded Finance', 'BaaS', 'Fintech'] },
  { id: 'greenlist', name: 'GreenList Directory', desc: 'Sustainability-focused business directory connecting eco-conscious consumers with green companies.', category: 'business', rating: 4.4, reviews: 156, verified: false, tags: ['Sustainability', 'Green Business', 'Directory'] },
  { id: 'cyberguard', name: 'CyberGuard SMB', desc: 'Affordable cybersecurity solutions designed specifically for small and medium businesses.', category: 'technology', rating: 4.3, reviews: 445, verified: true, tags: ['Cybersecurity', 'SMB', 'Threat Protection'] },
  { id: 'remotely', name: 'Remotely.io', desc: 'All-in-one remote work platform with AI meeting assistant, async tools, and team analytics.', category: 'technology', rating: 4.8, reviews: 672, verified: true, tags: ['Remote Work', 'Collaboration', 'AI Assistant'] },
]

const categoryIcons = {
  technology: [<path key="a" d="M16 18l6-6-6-6" />, <path key="b" d="M8 6l-6 6 6 6" />],
  food: [<path key="a" d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />, <path key="b" d="M7 2v20" />],
  legal: [<path key="a" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />],
  education: [<path key="a" d="M22 10v6M2 10l10-5 10 5-10 5z" />, <path key="b" d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />],
  realestate: [<path key="a" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />, <path key="b" d="M9 22V12h6v10" />],
  home: [<path key="a" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />],
  marketing: [<path key="a" d="M3 11l18-5v12L3 13v-2z" />],
  healthcare: [<path key="a" d="M22 12h-4l-3 9L9 3l-3 9H2" />],
  finance: [<line key="a" x1="12" y1="1" x2="12" y2="23" />, <path key="b" d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />],
  business: [<path key="a" d="M23 6l-9.5 9.5-5-5L1 18" />, <path key="b" d="M17 6h6v6" />],
}

const trendingSearches = [
  'Cloud security solutions', 'AI ordering systems', 'Legal automation tools',
  'Corporate training platforms', 'PropTech startups', 'Remote work tools 2026',
  'Embedded finance', 'Sustainable businesses', 'Marketing attribution',
  'Health wearable integration',
]

const allCategories = Object.entries(categoryMeta).map(([key, val]) => ({
  key,
  label: val.label,
  gradient: val.gradient,
  count: businesses.filter(b => b.category === key).length + allArticles.filter(a => a.category === key).length,
}))

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const initialQ = params.get('q') || ''

  const [query, setQuery] = useState(initialQ)
  const [activeTab, setActiveTab] = useState('all')
  const [sortBy, setSortBy] = useState('relevance')
  const [selectedCats, setSelectedCats] = useState([])

  useEffect(() => {
    const q = params.get('q') || ''
    setQuery(q)
  }, [params])

  /* Filter logic */
  const q = query.toLowerCase().trim()

  const filteredBiz = useMemo(() => {
    if (!q) return businesses
    return businesses.filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.desc.toLowerCase().includes(q) ||
      b.category.includes(q) ||
      b.tags.some(t => t.toLowerCase().includes(q))
    )
  }, [q])

  const filteredNews = useMemo(() => {
    if (!q) return allArticles
    return allArticles.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.category.includes(q) ||
      a.tag.toLowerCase().includes(q)
    )
  }, [q])

  const filteredCats = useMemo(() => {
    if (!q) return allCategories
    return allCategories.filter(c =>
      c.label.toLowerCase().includes(q) || c.key.includes(q)
    )
  }, [q])

  /* Apply category filter */
  const finalBiz = selectedCats.length > 0 ? filteredBiz.filter(b => selectedCats.includes(b.category)) : filteredBiz
  const finalNews = selectedCats.length > 0 ? filteredNews.filter(a => selectedCats.includes(a.category)) : filteredNews

  /* Sort */
  const sortedBiz = useMemo(() => {
    const arr = [...finalBiz]
    if (sortBy === 'rating') arr.sort((a, b) => b.rating - a.rating)
    if (sortBy === 'reviews') arr.sort((a, b) => b.reviews - a.reviews)
    return arr
  }, [finalBiz, sortBy])

  const sortedNews = useMemo(() => {
    const arr = [...finalNews]
    if (sortBy === 'date') arr.sort((a, b) => new Date(b.date) - new Date(a.date))
    return arr
  }, [finalNews, sortBy])

  const totalResults = sortedBiz.length + sortedNews.length + filteredCats.length

  const handleSearch = (e) => {
    e.preventDefault()
    setParams(query ? { q: query } : {})
  }

  const clearQuery = () => {
    setQuery('')
    setParams({})
  }

  const setSearchQuery = (text) => {
    setQuery(text)
    setParams({ q: text })
  }

  const toggleCat = (key) => {
    setSelectedCats(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  const hasQuery = q.length > 0

  /* Category counts for filters */
  const catCounts = useMemo(() => {
    const counts = {}
    allCategories.forEach(c => {
      counts[c.key] = filteredBiz.filter(b => b.category === c.key).length + filteredNews.filter(a => a.category === c.key).length
    })
    return counts
  }, [filteredBiz, filteredNews])

  return (
    <SharedLayout>
      <div className="sp-page">
        {/* Hero */}
        <div className="sp-hero">
          <div className="sp-hero-bg" />
          <div className="sp-hero-content">
            <h1>{hasQuery ? 'Search Results' : 'Discover Everything'}</h1>
            <p className="sp-hero-sub">{hasQuery ? `Showing results for "${query}"` : 'Search businesses, news, categories, and more'}</p>

            <form className="sp-search-wrap" onSubmit={handleSearch}>
              <svg className="sp-search-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <input
                className="sp-search-input"
                type="text"
                placeholder="Search businesses, articles, categories..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoFocus
              />
              {query && (
                <button type="button" className="sp-search-clear" onClick={clearQuery}>
                  <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              )}
              <button type="submit" className="sp-search-btn">Search</button>
            </form>

            <div className="sp-quick-filters">
              {['Technology', 'Healthcare', 'Finance', 'Real Estate', 'Education'].map(tag => (
                <button key={tag} className={`sp-quick-tag${q === tag.toLowerCase() ? ' active' : ''}`} onClick={() => setSearchQuery(tag)}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="s-container">
          {/* No query: Show suggestions */}
          {!hasQuery && (
            <div className="sp-suggestions">
              <div className="sp-suggest-section">
                <h3 className="sp-suggest-title">
                  <svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                  Trending Searches
                </h3>
                <div className="sp-trending-list">
                  {trendingSearches.map((s, i) => (
                    <button key={s} className="sp-trending-item" onClick={() => setSearchQuery(s)}>
                      <span className="sp-trending-num">{i + 1}</span>
                      <span className="sp-trending-text">{s}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="sp-suggest-section">
                <h3 className="sp-suggest-title">
                  <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
                  Popular Categories
                </h3>
                <div className="sp-popular-cats">
                  {allCategories.map(c => (
                    <Link key={c.key} to={`/category?cat=${c.key}`} className="sp-popular-cat">
                      <div className="sp-popular-cat-icon" style={{ background: c.gradient }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          {categoryIcons[c.key]}
                        </svg>
                      </div>
                      <span className="sp-popular-cat-name">{c.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Has query: Show results */}
          {hasQuery && (
            <>
              <div className="sp-results-header">
                <div className="sp-results-count">
                  Found <strong>{totalResults}</strong> results for "<strong>{query}</strong>"
                </div>
                <div className="sp-results-sort">
                  <span className="sp-sort-label">Sort by</span>
                  <select className="sp-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="relevance">Relevance</option>
                    <option value="rating">Top Rated</option>
                    <option value="reviews">Most Reviews</option>
                    <option value="date">Newest</option>
                  </select>
                </div>
              </div>

              <div className="sp-layout">
                {/* Filters Sidebar */}
                <aside className="sp-filters">
                  <div className="sp-filter-group">
                    <div className="sp-filter-title">
                      <svg viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                      Category
                    </div>
                    {allCategories.map(c => (
                      <button key={c.key} className="sp-filter-option" onClick={() => toggleCat(c.key)}>
                        <span className={`sp-filter-check${selectedCats.includes(c.key) ? ' active' : ''}`}>
                          <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                        </span>
                        {c.label}
                        <span className="sp-filter-count">{catCounts[c.key] || 0}</span>
                      </button>
                    ))}
                    {selectedCats.length > 0 && (
                      <button className="sp-filter-clear" onClick={() => setSelectedCats([])}>
                        Clear filters
                      </button>
                    )}
                  </div>
                </aside>

                {/* Results */}
                <div className="sp-results">
                  {/* Tabs */}
                  <div className="sp-tabs">
                    <button className={`sp-tab${activeTab === 'all' ? ' active' : ''}`} onClick={() => setActiveTab('all')}>
                      All <span className="sp-tab-count">{totalResults}</span>
                    </button>
                    <button className={`sp-tab${activeTab === 'businesses' ? ' active' : ''}`} onClick={() => setActiveTab('businesses')}>
                      Businesses <span className="sp-tab-count">{sortedBiz.length}</span>
                    </button>
                    <button className={`sp-tab${activeTab === 'news' ? ' active' : ''}`} onClick={() => setActiveTab('news')}>
                      News <span className="sp-tab-count">{sortedNews.length}</span>
                    </button>
                    <button className={`sp-tab${activeTab === 'categories' ? ' active' : ''}`} onClick={() => setActiveTab('categories')}>
                      Categories <span className="sp-tab-count">{filteredCats.length}</span>
                    </button>
                  </div>

                  {/* Business Results */}
                  {(activeTab === 'all' || activeTab === 'businesses') && sortedBiz.length > 0 && (
                    <>
                      {activeTab === 'all' && <h3 style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)', margin: '16px 0 10px', textTransform: 'uppercase', letterSpacing: '.04em' }}>Businesses</h3>}
                      {sortedBiz.map(biz => {
                        const meta = categoryMeta[biz.category] || {}
                        return (
                          <Link to={`/listing?id=${biz.id}`} className="sp-biz-card" key={biz.id}>
                            <div className="sp-biz-icon" style={{ background: meta.gradient }}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                {categoryIcons[biz.category]}
                              </svg>
                            </div>
                            <div className="sp-biz-content">
                              <div className="sp-biz-top">
                                <span className="sp-biz-name">{biz.name}</span>
                                <span className="sp-biz-rating">
                                  <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                  {biz.rating}
                                  <span>({biz.reviews})</span>
                                </span>
                                {biz.verified && <span className="sp-biz-verified">Verified</span>}
                              </div>
                              <p className="sp-biz-desc">{biz.desc}</p>
                              <div className="sp-biz-tags">
                                {biz.tags.map(t => <span key={t} className="sp-biz-tag">{t}</span>)}
                              </div>
                            </div>
                            <div className="sp-biz-arrow">
                              <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </div>
                          </Link>
                        )
                      })}
                    </>
                  )}

                  {/* News Results */}
                  {(activeTab === 'all' || activeTab === 'news') && sortedNews.length > 0 && (
                    <>
                      {activeTab === 'all' && <h3 style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)', margin: '20px 0 10px', textTransform: 'uppercase', letterSpacing: '.04em' }}>News & Articles</h3>}
                      {sortedNews.map(article => (
                        <Link to={`/news-article?id=${article.id}`} className="sp-news-card" key={article.id}>
                          <div className="sp-news-visual">
                            <div className="sp-news-visual-bg" style={{ background: article.color }} />
                            <div className="sp-news-visual-icon">
                              <svg viewBox="0 0 24 24" stroke={article.color} strokeLinecap="round" strokeLinejoin="round">
                                {categoryIcons[article.category]}
                              </svg>
                            </div>
                          </div>
                          <div className="sp-news-content">
                            <div className="sp-news-top">
                              <span className={`nws-tag ${article.tagClass}`}>{article.tag}</span>
                            </div>
                            <h3 className="sp-news-title">{article.title}</h3>
                            <p className="sp-news-excerpt">{article.excerpt}</p>
                            <div className="sp-news-meta">
                              <span className="sp-news-meta-item">{article.author}</span>
                              <span className="sp-news-meta-item">
                                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                {article.readTime}
                              </span>
                              <span className="sp-news-meta-item">{article.date}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </>
                  )}

                  {/* Category Results */}
                  {(activeTab === 'all' || activeTab === 'categories') && filteredCats.length > 0 && (
                    <>
                      {activeTab === 'all' && <h3 style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)', margin: '20px 0 10px', textTransform: 'uppercase', letterSpacing: '.04em' }}>Categories</h3>}
                      {filteredCats.map(c => (
                        <Link to={`/category?cat=${c.key}`} className="sp-cat-card" key={c.key}>
                          <div className="sp-cat-icon" style={{ background: c.gradient }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              {categoryIcons[c.key]}
                            </svg>
                          </div>
                          <div className="sp-cat-info">
                            <div className="sp-cat-name">{c.label}</div>
                            <div className="sp-cat-count">{c.count} listings & articles</div>
                          </div>
                          <div className="sp-cat-arrow">
                            <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                          </div>
                        </Link>
                      ))}
                    </>
                  )}

                  {/* Empty state */}
                  {totalResults === 0 && (
                    <div className="sp-empty">
                      <div className="sp-empty-icon">
                        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                      </div>
                      <h3>No results found</h3>
                      <p>We couldn't find anything matching "{query}". Try different keywords or browse our categories.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </SharedLayout>
  )
}
