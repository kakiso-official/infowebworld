'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getPublishedPosts } from '../iww-hq/data/blog-storage'
import type { BlogPost } from '../iww-hq/data/blog-types'

export default function BlogListing() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [cat, setCat] = useState('All')

  useEffect(() => { setPosts(getPublishedPosts()) }, [])

  const cats = ['All', ...Array.from(new Set(posts.map(p => p.category)))]
  const filtered = cat === 'All' ? posts : posts.filter(p => p.category === cat)

  return (
    <section className="blog-listing">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Blog</div>
          <h1 className="blog-listing-heading">Insights &amp; <em>Updates</em></h1>
          <p className="section-desc">Business tips, industry news, and growth strategies from the InfoWebWorld team.</p>
        </div>

        {/* Category filters */}
        {cats.length > 1 && (
          <div className="blog-cats">
            {cats.map(c => (
              <button key={c} className={`blog-cat-pill${cat === c ? ' blog-cat-pill--active' : ''}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="blog-empty">
            <p className="blog-empty-title">No articles yet</p>
            <p className="blog-empty-desc">Check back soon — we&apos;re working on great content.</p>
          </div>
        ) : (
          <div className="blog-grid">
            {filtered.map(post => (
              <Link key={post.id} href={`/blog/post?slug=${post.slug}`} className="blog-card">
                {post.coverImage && (
                  <div className="blog-card-img-wrap">
                    <img src={post.coverImage} alt={post.title} className="blog-card-img" loading="lazy" />
                  </div>
                )}
                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    <span className="blog-card-cat">{post.category}</span>
                    <span className="blog-card-date">{new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <h2 className="blog-card-title">{post.title}</h2>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                  <span className="blog-card-read">Read article</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
