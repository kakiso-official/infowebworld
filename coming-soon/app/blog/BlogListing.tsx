'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { BlogPost } from '@/lib/blog'

/* Client component for category filtering + the magazine hero. All posts are
   passed in from the static server page (app/blog/page.tsx) — no client fetch. */
type ListPost = Omit<BlogPost, 'body'>

const fmtDate = (p: ListPost) =>
  new Date(p.publishedAt || p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function BlogListing({ posts }: { posts: ListPost[] }) {
  const [cat, setCat] = useState('All')

  const cats = ['All', ...Array.from(new Set(posts.map(p => p.category)))]
  const isAll = cat === 'All'

  /* Magazine layout on "All": one big feature + a Latest list + a grid. */
  const featured = isAll ? (posts.find(p => p.featured) || posts[0] || null) : null
  const rest = featured ? posts.filter(p => p.slug !== featured.slug) : posts
  const side = isAll ? rest.slice(0, 3) : []
  const grid = isAll ? rest.slice(3) : posts.filter(p => p.category === cat)

  return (
    <section className="blog-listing">
      <div className="container">
        <header className="blog-head">
          <span className="blog-eyebrow">The InfoWebWorld Blog</span>
          <h1 className="blog-listing-heading">Insights &amp; <em>Updates</em></h1>
          <p className="blog-listing-sub">Guides, comparisons and original data to help you choose the right software, agencies and professionals.</p>
        </header>

        {cats.length > 1 && (
          <div className="blog-cats">
            {cats.map(c => (
              <button key={c} className={`blog-cat-pill${cat === c ? ' blog-cat-pill--active' : ''}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
        )}

        {/* Magazine hero — feature + Latest list */}
        {isAll && featured && (
          <div className="blog-hero">
            <Link href={`/blog/${featured.slug}`} className="blog-hero-main">
              <div className="blog-hero-main-img">
                <span className="blog-hero-badge">Featured</span>
                {featured.coverImage && <img src={featured.coverImage} alt={featured.title} />}
              </div>
              <div className="blog-hero-main-body">
                <div className="blog-hero-main-meta">
                  <span className="blog-card-cat">{featured.category}</span>
                  <span className="blog-card-date">{fmtDate(featured)} &middot; {featured.readTime} min read</span>
                </div>
                <h2 className="blog-hero-main-title">{featured.title}</h2>
                <p className="blog-hero-main-excerpt">{featured.excerpt}</p>
                <span className="blog-hero-main-read">Read article &rarr;</span>
              </div>
            </Link>

            {side.length > 0 && (
              <div className="blog-hero-side">
                <span className="blog-hero-side-label">Latest</span>
                {side.map(p => (
                  <Link key={p.id} href={`/blog/${p.slug}`} className="blog-hero-row">
                    {p.coverImage && <div className="blog-hero-row-thumb"><img src={p.coverImage} alt={p.title} /></div>}
                    <div className="blog-hero-row-body">
                      <span className="blog-hero-row-cat">{p.category}</span>
                      <span className="blog-hero-row-title">{p.title}</span>
                      <span className="blog-hero-row-meta">{fmtDate(p)} &middot; {p.readTime} min</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Grid */}
        {grid.length > 0 && (
          <>
            {isAll && <h2 className="blog-grid-head">More articles</h2>}
            <div className="blog-grid">
              {grid.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="blog-card">
                  {post.coverImage && (
                    <div className="blog-card-img-wrap">
                      <img src={post.coverImage} alt={post.title} className="blog-card-img" loading="lazy" />
                    </div>
                  )}
                  <div className="blog-card-body">
                    <div className="blog-card-meta">
                      <span className="blog-card-cat">{post.category}</span>
                      <span className="blog-card-date">{fmtDate(post)} &middot; {post.readTime} min</span>
                    </div>
                    <h2 className="blog-card-title">{post.title}</h2>
                    <p className="blog-card-excerpt">{post.excerpt}</p>
                    <div className="blog-card-footer">
                      <span className="blog-card-author">By {post.author}</span>
                      <span className="blog-card-read">Read &rarr;</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {!featured && grid.length === 0 && (
          <div className="blog-empty">
            <p className="blog-empty-title">No articles yet</p>
            <p className="blog-empty-desc">Check back soon — we&apos;re working on great content.</p>
          </div>
        )}
      </div>
    </section>
  )
}
