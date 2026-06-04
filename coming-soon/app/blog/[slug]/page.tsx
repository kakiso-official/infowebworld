import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { marked } from 'marked'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import BlogReaderInteractions from '../post/BlogReaderInteractions'
import BlogToc, { type TocItem } from '../BlogToc'
import { getPublishedPostBySlug, getAllPublishedSlugs, getRelatedPosts } from '@/lib/blog'

/* Fully static post pages. generateStaticParams pre-builds one HTML page per
   published markdown file; dynamicParams=false → unknown slugs 404. */
export const dynamicParams = false

export function generateStaticParams() {
  return getAllPublishedSlugs().map(slug => ({ slug }))
}

const SITE = 'https://www.infowebworld.com'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPublishedPostBySlug(slug)
  if (!post) return { title: 'Post Not Found | InfoWebWorld' }
  const url = `${SITE}/blog/${post.slug}`
  const img = post.seo.ogImage || post.coverImage
  return {
    title: `${post.seo.metaTitle || post.title} | InfoWebWorld Blog`,
    description: post.seo.metaDescription || post.excerpt,
    keywords: post.seo.keywords.length ? post.seo.keywords : undefined,
    alternates: { canonical: post.seo.canonicalUrl || url },
    robots: post.seo.noIndex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: post.seo.metaTitle || post.title,
      description: post.seo.metaDescription || post.excerpt,
      url, type: 'article',
      images: img ? [{ url: img }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo.metaTitle || post.title,
      description: post.seo.metaDescription || post.excerpt,
      images: img ? [img] : undefined,
    },
  }
}

/* Add stable ids to h2/h3 headings and collect a table of contents. */
function buildToc(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = []
  const used = new Set<string>()
  const out = html.replace(/<h([23])(?:\s[^>]*)?>([\s\S]*?)<\/h\1>/g, (full, lvl: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, '').trim()
    if (!text) return full
    const base = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'section'
    let id = base, n = 1
    while (used.has(id)) id = `${base}-${++n}`
    used.add(id)
    toc.push({ id, text, level: Number(lvl) })
    return `<h${lvl} id="${id}">${inner}</h${lvl}>`
  })
  return { html: out, toc }
}

export default async function BlogPostRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPublishedPostBySlug(slug)
  if (!post) notFound()

  const related = getRelatedPosts(post.slug, post.category, 3)
  const rawHtml = marked.parse(post.body || '', { async: false }) as string
  const { html, toc } = buildToc(rawHtml)
  const hasToc = toc.length >= 2
  const url = `${SITE}/blog/${post.slug}`
  const dateLabel = new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const initial = (post.author || 'I').charAt(0).toUpperCase()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.seo.metaTitle || post.title,
    description: post.seo.metaDescription || post.excerpt,
    author: { '@type': 'Person', name: post.author },
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    image: post.seo.ogImage || post.coverImage || undefined,
    url,
    publisher: {
      '@type': 'Organization', name: 'InfoWebWorld', url: SITE,
      logo: { '@type': 'ImageObject', url: `${SITE}/logo/infowebworldlogo-logoforlightbackgrounds.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title },
    ],
  }

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="blog-reader-section">
        <div className="bp-wrap">
          {/* Anchored, centered header */}
          <header className="bp-head">
            <Link href="/blog" className="bp-back">&larr; Back to Blog</Link>
            <span className="bp-cat">{post.category}</span>
            <h1 className="bp-title">{post.title}</h1>
            <div className="bp-byline">
              <span className="bp-avatar">{initial}</span>
              <div className="bp-byline-info">
                <span className="bp-byline-name">{post.author}</span>
                <span className="bp-byline-meta">{dateLabel} &middot; {post.readTime} min read</span>
              </div>
            </div>
          </header>

          {post.coverImage && (
            <div className="bp-cover"><img src={post.coverImage} alt={post.title} /></div>
          )}

          {/* Two-column: sticky ToC card + article */}
          <div className={'bp-layout' + (hasToc ? '' : ' bp-layout--single')}>
            {hasToc && (
              <aside className="bp-aside">
                <BlogToc items={toc} />
              </aside>
            )}

            <div className="bp-main">
              {/* progress bar + share + view tracking */}
              <BlogReaderInteractions slug={post.slug} title={post.title} />

              <div className="blog-body" dangerouslySetInnerHTML={{ __html: html }} />

              {post.tags.length > 0 && (
                <div className="blog-article-tags">
                  {post.tags.map(t => <span key={t} className="blog-article-tag">{t}</span>)}
                </div>
              )}

              <div className="bp-bio">
                <span className="bp-bio-avatar">{initial}</span>
                <div>
                  <span className="bp-bio-name">{post.author}</span>
                  <p className="bp-bio-text">Part of the InfoWebWorld team — helping buyers find, compare and review the best software, agencies and professionals across 80+ industries.</p>
                </div>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <section className="bp-recommended">
              <h2 className="bp-rec-head">Recommended Articles</h2>
              <div className="blog-grid">
                {related.map(r => (
                  <Link key={r.id} href={`/blog/${r.slug}`} className="blog-card">
                    {r.coverImage && (
                      <div className="blog-card-img-wrap">
                        <img src={r.coverImage} alt={r.title} className="blog-card-img" loading="lazy" />
                      </div>
                    )}
                    <div className="blog-card-body">
                      <div className="blog-card-meta">
                        <span className="blog-card-cat">{r.category}</span>
                        <span className="blog-card-date">{r.readTime} min</span>
                      </div>
                      <h3 className="blog-card-title">{r.title}</h3>
                      <p className="blog-card-excerpt">{r.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
      <Footer />
    </>
  )
}
