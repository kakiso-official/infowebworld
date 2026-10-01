import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNewspaper } from '@fortawesome/free-solid-svg-icons'
import type { HomeBlogPost } from './latest-blog-data'
import BlogCoverImage from './BlogCoverImage'

/* ════════════════════════════════════════════════════════════════════════
   "Latest From the InfoWebWorld Blog" homepage section.

   Server component — receives the already-fetched/cached posts from
   app/page.tsx (see latest-blog-data.ts). Renders nothing when there is no
   published content yet, so a fresh/empty blog never leaves a half-built
   section on the homepage.
   ════════════════════════════════════════════════════════════════════════ */

export interface LatestBlogSectionProps {
  posts: HomeBlogPost[]
}

const dateFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

/** Formats an ISO date string deterministically in UTC so server and
 *  client render identical markup regardless of the viewer's timezone. */
function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return dateFmt.format(d)
}

export default function LatestBlogSection({ posts }: LatestBlogSectionProps) {
  if (!posts || posts.length === 0) return null

  return (
    <section className="hm-blog" aria-labelledby="hm-blog-h">
      <div className="hm-blog-inner">
        <header className="hm-blog-head">
          <h2 id="hm-blog-h" className="hm-blog-title-h2">Latest From the InfoWebWorld Blog</h2>
          <p className="hm-blog-sub">
            Explore guides, insights, and news that help you list, compare, and choose
            businesses with confidence.
          </p>
        </header>

        <div className="hm-blog-grid">
          {posts.map((post, i) => {
            const dateLabel = formatDate(post.publishedAt)
            const metaLabel = dateLabel
              ? `${dateLabel} · ${post.readTime} min read`
              : `${post.readTime} min read`

            return (
              <article
                key={post.slug}
                className={'hm-blog-card' + (i === 2 ? ' hm-blog-card--wide' : '')}
              >
                <div className="hm-blog-media">
                  <div className="hm-blog-img hm-blog-img--ph" aria-hidden="true">
                    <FontAwesomeIcon icon={faNewspaper} className="hm-blog-ph-icon" />
                  </div>
                  {post.coverImage ? (
                    <BlogCoverImage src={post.coverImage} alt={post.title} />
                  ) : null}
                  {post.category ? (
                    <span className="hm-blog-pill">{post.category}</span>
                  ) : null}
                </div>

                <div className="hm-blog-body">
                  <h3 className="hm-blog-card-title">
                    <Link href={`/blog/${post.slug}`} className="hm-blog-link">
                      {post.title}
                    </Link>
                  </h3>
                  {post.excerpt ? (
                    <p className="hm-blog-excerpt">{post.excerpt}</p>
                  ) : null}
                  <p className="hm-blog-meta">{metaLabel}</p>
                </div>
              </article>
            )
          })}
        </div>

        <div className="hm-blog-cta">
          <Link href="/blog" className="hm-blog-cta-btn">Read all articles</Link>
        </div>
      </div>
    </section>
  )
}
