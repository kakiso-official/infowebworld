import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import SharedLayout from '../components/shared/SharedLayout'
import { allArticles, categoryMeta } from '../data/articles'
import '../styles/news-article.css'

export default function NewsArticlePage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const articleId = params.get('id')

  const article = useMemo(() => allArticles.find(a => a.id === articleId), [articleId])

  /* Extract headings from body for TOC */
  const headings = useMemo(() => {
    if (!article?.body) return []
    const matches = [...article.body.matchAll(/<h2>(.*?)<\/h2>/g)]
    return matches.map((m, i) => ({ id: `heading-${i}`, text: m[1] }))
  }, [article])

  /* Related articles: same category, excluding current */
  const related = useMemo(() => {
    if (!article) return []
    return allArticles
      .filter(a => a.id !== article.id && a.category === article.category)
      .slice(0, 3)
      .concat(
        allArticles
          .filter(a => a.id !== article.id && a.category !== article.category)
          .slice(0, 3 - allArticles.filter(a => a.id !== article.id && a.category === article.category).length)
      )
      .slice(0, 3)
  }, [article])

  /* Scroll to top on article change */
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [articleId])

  /* Inject heading IDs into rendered HTML */
  const bodyHtml = useMemo(() => {
    if (!article?.body) return ''
    let idx = 0
    return article.body.replace(/<h2>/g, () => `<h2 id="heading-${idx++}">`)
  }, [article])

  const scrollToHeading = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href)
  }

  if (!article) {
    return (
      <SharedLayout>
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-800)', marginBottom: 8 }}>Article not found</h2>
          <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--gray-400)', marginBottom: 20 }}>The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/news" style={{ fontSize: 13, fontWeight: 500, color: 'var(--accent)' }}>Back to News</Link>
        </div>
      </SharedLayout>
    )
  }

  const catMeta = categoryMeta[article.category] || {}

  return (
    <SharedLayout>
      <div className="na-page">
        <div className="s-container">
          {/* Breadcrumb */}
          <nav className="na-breadcrumb">
            <Link to="/">Home</Link>
            <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
            <Link to="/news">News</Link>
            <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
            <span>{article.tag}</span>
          </nav>

          {/* Hero */}
          <div className="na-hero">
            <div className="na-hero-bg" style={{ background: catMeta.gradient }} />
            <div className="na-hero-content">
              <span className={`nws-tag ${article.tagClass} na-hero-tag`}>{article.tag}</span>
              <h1>{article.title}</h1>
              <p className="na-hero-excerpt">{article.excerpt}</p>
              <div className="na-meta">
                <div className="na-author">
                  <div className="na-avatar" style={{ background: article.avatarBg }}>{article.initials}</div>
                  <div className="na-author-info">
                    <span className="na-author-name">{article.author}</span>
                    <span className="na-author-role">{article.authorRole || 'Staff Writer'}</span>
                  </div>
                </div>
                <div className="na-meta-sep" />
                <div className="na-meta-item">
                  <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  {article.date}
                </div>
                <div className="na-meta-item">
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  {article.readTime} read
                </div>
              </div>
            </div>
          </div>

          {/* Content + Sidebar */}
          <div className="na-layout">
            {/* Article Body */}
            <div className="na-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

            {/* Sidebar */}
            <aside className="na-sidebar">
              {/* Author Card */}
              <div className="na-author-card">
                <div className="na-author-card-header">
                  <div className="na-author-card-avatar" style={{ background: article.avatarBg }}>{article.initials}</div>
                  <div>
                    <div className="na-author-card-name">{article.author}</div>
                    <div className="na-author-card-role">{article.authorRole || 'Staff Writer'}</div>
                  </div>
                </div>
                <p className="na-author-card-bio">{article.authorBio || 'Contributing writer at InfoWebWorld.'}</p>
                <button className="na-author-card-link" onClick={() => navigate(`/search?q=${encodeURIComponent(article.author)}`)}>
                  View all articles
                  <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </button>
              </div>

              {/* Table of Contents */}
              {headings.length > 0 && (
                <div className="na-toc">
                  <div className="na-toc-title">
                    <svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                    In this article
                  </div>
                  {headings.map(h => (
                    <button key={h.id} className="na-toc-item" onClick={() => scrollToHeading(h.id)}>{h.text}</button>
                  ))}
                </div>
              )}

              {/* Newsletter */}
              <div className="na-newsletter">
                <div className="na-newsletter-title">Stay in the loop</div>
                <p className="na-newsletter-desc">Get the latest industry insights delivered to your inbox every week.</p>
                <form className="na-newsletter-form" onSubmit={e => e.preventDefault()}>
                  <input className="na-newsletter-input" type="email" placeholder="Your email" />
                  <button className="na-newsletter-btn" type="submit">Subscribe</button>
                </form>
              </div>
            </aside>
          </div>

          {/* Share + Tags */}
          <div style={{ maxWidth: 780 }}>
            <div className="na-share">
              <span className="na-share-label">Share</span>
              <button className="na-share-btn" aria-label="Share on Twitter" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}>
                <svg viewBox="0 0 24 24"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
              </button>
              <button className="na-share-btn" aria-label="Share on LinkedIn" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}>
                <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
              </button>
              <button className="na-share-btn" aria-label="Copy link" onClick={copyLink}>
                <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
              </button>
              <button className="na-share-btn" aria-label="Share via email" onClick={() => window.open(`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(window.location.href)}`)}>
                <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              </button>
            </div>
            <div className="na-tags">
              <Link to={`/search?q=${encodeURIComponent(article.tag)}`} className="na-tag-pill">{article.tag}</Link>
              <Link to={`/search?q=${encodeURIComponent(article.category)}`} className="na-tag-pill">{categoryMeta[article.category]?.label || article.category}</Link>
              <Link to="/news" className="na-tag-pill">All News</Link>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="s-container">
            <div className="na-related">
              <h2 className="na-related-title">Related Articles</h2>
              <div className="na-related-grid">
                {related.map(r => (
                  <Link to={`/news-article?id=${r.id}`} className="na-related-card" key={r.id}>
                    <div className="na-related-visual">
                      <div className="na-related-visual-bg" style={{ background: r.color }} />
                      <div className="na-related-visual-content">
                        <span className={`nws-tag ${r.tagClass} na-related-tag`}>{r.tag}</span>
                        <h3>{r.title}</h3>
                      </div>
                    </div>
                    <div className="na-related-card-footer">
                      <div className="na-related-card-meta">
                        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        {r.readTime} read
                      </div>
                      <div className="na-related-card-arrow">
                        <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </SharedLayout>
  )
}
