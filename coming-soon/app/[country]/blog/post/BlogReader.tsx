'use client'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from '../../../components/CountryLink'
import { marked } from 'marked'
import { fetchPostBySlug, fetchPublishedPosts } from '../../../iww-hq/data/blog-storage'
import { trackBlogView } from '../../../iww-hq/data/visitor-tracking'
import type { BlogPost } from '../../../iww-hq/data/blog-types'

export default function BlogReader({ slug: slugProp }: { slug?: string }) {
  const params = useSearchParams()
  // Support prop, ?slug=x (query), and /blog/x (clean URL path)
  const slug = slugProp || params.get('slug') || (typeof window !== 'undefined' ? window.location.pathname.replace(/^\/(infowebworld\/)?blog\//, '').replace(/\/$/, '') || null : null)
  const [post, setPost] = useState<BlogPost | null>(null)
  const [related, setRelated] = useState<BlogPost[]>([])
  const [notFound, setNotFound] = useState(false)
  const [progress, setProgress] = useState(0)
  const [copied, setCopied] = useState(false)
  const startTime = useRef(Date.now())
  const articleRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!slug) { setNotFound(true); return }
    // Fetch full post (with body) + related posts in parallel
    Promise.all([
      fetchPostBySlug(slug),
      fetchPublishedPosts(),
    ]).then(([p, posts]) => {
      if (p) {
        setPost(p)
        trackBlogView(p.slug)
        setRelated(posts.filter(x => x.id !== p.id && x.category === p.category).slice(0, 3))
      } else { setNotFound(true) }
    })
  }, [slug])

  /* Track read time on unmount */
  useEffect(() => {
    return () => {
      if (post) {
        const secs = Math.round((Date.now() - startTime.current) / 1000)
        if (secs > 5) trackBlogView(post.slug, secs)
      }
    }
  }, [post])

  /* Reading progress bar */
  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.scrollHeight - window.innerHeight
      const scrolled = -rect.top
      setProgress(Math.min(100, Math.max(0, (scrolled / total) * 100)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Client-side SEO */
  useEffect(() => {
    if (!post) return
    document.title = `${post.seo.metaTitle || post.title} | InfoWebWorld Blog`
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`)
      if (!el) { el = document.createElement('meta'); el.setAttribute(name.startsWith('og:') ? 'property' : 'name', name); document.head.appendChild(el) }
      el.setAttribute('content', content)
    }
    setMeta('description', post.seo.metaDescription || post.excerpt)
    if (post.seo.keywords.length) setMeta('keywords', post.seo.keywords.join(', '))
    setMeta('og:title', post.seo.metaTitle || post.title)
    setMeta('og:description', post.seo.metaDescription || post.excerpt)
    if (post.seo.ogImage || post.coverImage) setMeta('og:image', post.seo.ogImage || post.coverImage)
  }, [post])

  /* ── JSON-LD Structured Data (Article + BreadcrumbList) ── */
  useEffect(() => {
    if (!post) return

    const postUrl = `https://infowebworld.com/blog/${post.slug}`
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.seo.metaTitle || post.title,
      description: post.seo.metaDescription || post.excerpt,
      author: { '@type': 'Person', name: post.author },
      datePublished: post.publishedAt || post.createdAt,
      dateModified: post.updatedAt || post.publishedAt || post.createdAt,
      image: post.seo.ogImage || post.coverImage || undefined,
      url: postUrl,
      publisher: {
        '@type': 'Organization',
        name: 'InfoWebWorld',
        url: 'https://infowebworld.com',
        logo: { '@type': 'ImageObject', url: 'https://infowebworld.com/logo/infowebworldlogo-logoforlightbackgrounds.png' },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    }

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://infowebworld.com' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://infowebworld.com/blog' },
        { '@type': 'ListItem', position: 3, name: post.title },
      ],
    }

    const scriptArticle = document.createElement('script')
    scriptArticle.type = 'application/ld+json'
    scriptArticle.id = 'schema-blog-article'
    scriptArticle.text = JSON.stringify(articleSchema)
    document.head.appendChild(scriptArticle)

    const scriptBreadcrumb = document.createElement('script')
    scriptBreadcrumb.type = 'application/ld+json'
    scriptBreadcrumb.id = 'schema-blog-breadcrumb'
    scriptBreadcrumb.text = JSON.stringify(breadcrumbSchema)
    document.head.appendChild(scriptBreadcrumb)

    return () => {
      document.getElementById('schema-blog-article')?.remove()
      document.getElementById('schema-blog-breadcrumb')?.remove()
    }
  }, [post])

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const handleCopy = () => {
    if (post) { navigator.clipboard.writeText(shareUrl); trackBlogView(post.slug, undefined, true); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }
  const handleTwitter = () => {
    if (post) { trackBlogView(post.slug, undefined, true); window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`, '_blank') }
  }
  const handleLinkedIn = () => {
    if (post) { trackBlogView(post.slug, undefined, true); window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank') }
  }

  if (notFound) {
    return (
      <section className="blog-reader-section">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h1 className="blog-listing-heading">Post Not Found</h1>
          <p style={{ color: 'var(--h-body)', marginBottom: '1.5rem' }}>This article doesn&apos;t exist or has been unpublished.</p>
          <Link href="/blog" className="blog-back-link">Back to Blog</Link>
        </div>
      </section>
    )
  }

  if (!post) return null

  const html = marked.parse(post.body || '', { async: false }) as string

  return (
    <>
      {/* Reading progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 100, background: 'var(--h-border)' }}>
        <div style={{ height: '100%', background: '#E8553D', transition: 'width .1s', width: `${progress}%` }} />
      </div>

      <section className="blog-reader-section" ref={articleRef}>
        <div className="container">
          <article className="blog-article">
            <Link href="/blog" className="blog-back-link">&larr; Back to Blog</Link>

            {post.coverImage && (
              <div className="blog-article-cover">
                <img src={post.coverImage} alt={post.title} />
              </div>
            )}

            <div className="blog-article-meta">
              <span className="blog-card-cat">{post.category}</span>
              <span className="blog-article-dot">&middot;</span>
              <span>{post.readTime} min read</span>
            </div>

            <h1 className="blog-article-title">{post.title}</h1>

            <p className="blog-article-author">
              By <strong>{post.author}</strong> &middot; {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            {/* Share bar */}
            <div style={{ display: 'flex', gap: '.4rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <button onClick={handleTwitter} style={{ display: 'flex', alignItems: 'center', gap: '.3rem', padding: '.3rem .7rem', borderRadius: 999, border: '1.5px solid var(--h-border)', background: '#fff', fontSize: '.62rem', fontWeight: 700, color: 'var(--h-body)', cursor: 'pointer', fontFamily: "var(--font-nunito)", transition: 'all .2s' }}>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                Share on X
              </button>
              <button onClick={handleLinkedIn} style={{ display: 'flex', alignItems: 'center', gap: '.3rem', padding: '.3rem .7rem', borderRadius: 999, border: '1.5px solid var(--h-border)', background: '#fff', fontSize: '.62rem', fontWeight: 700, color: 'var(--h-body)', cursor: 'pointer', fontFamily: "var(--font-nunito)", transition: 'all .2s' }}>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                LinkedIn
              </button>
              <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '.3rem', padding: '.3rem .7rem', borderRadius: 999, border: '1.5px solid var(--h-border)', background: copied ? 'rgba(47,174,106,.08)' : '#fff', fontSize: '.62rem', fontWeight: 700, color: copied ? '#2FAE6A' : 'var(--h-body)', cursor: 'pointer', fontFamily: "var(--font-nunito)", transition: 'all .2s' }}>
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>

            <div className="blog-body" dangerouslySetInnerHTML={{ __html: html }} />

            {post.tags.length > 0 && (
              <div className="blog-article-tags">
                {post.tags.map(t => <span key={t} className="blog-article-tag">{t}</span>)}
              </div>
            )}
          </article>

          {/* Related posts */}
          {related.length > 0 && (
            <div style={{ maxWidth: 720, margin: '3rem auto 0' }}>
              <h3 style={{ fontFamily: "var(--font-bricolage), 'Bricolage Grotesque', sans-serif", fontSize: '1.1rem', fontWeight: 800, color: 'var(--h-heading)', marginBottom: '1rem' }}>Related Articles</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '.85rem' }}>
                {related.map(r => (
                  <Link key={r.id} href={`/blog/${r.slug}`} className="blog-card" style={{ borderRadius: 16 }}>
                    {r.coverImage && (
                      <div className="blog-card-img-wrap" style={{ aspectRatio: '16/10' }}>
                        <img src={r.coverImage} alt={r.title} className="blog-card-img" />
                      </div>
                    )}
                    <div className="blog-card-body" style={{ padding: '.85rem' }}>
                      <span className="blog-card-cat" style={{ marginBottom: '.3rem', display: 'inline-block' }}>{r.category}</span>
                      <h4 className="blog-card-title" style={{ fontSize: '.82rem' }}>{r.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
