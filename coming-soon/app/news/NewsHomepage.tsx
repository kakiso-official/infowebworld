'use client'

import { useState } from 'react'
import type { NewsArticle, NewsCategory } from '../../lib/news'
import { relativeNewsTime, withNewsUtm } from '../../lib/news'

/** Standard rel attribute for every outbound link. NOTE: we
    intentionally omit `noreferrer` so the publisher's analytics see
    `infowebworld.com/news` as the referrer (and learn that we're
    driving traffic). UTM params on the URL itself reinforce that. */
const REL = 'noopener nofollow'

/* ─────────────────────────────────────────────────────────────
   Times-of-India-style news layout.

   Top strip: 1 lead story (big image + headline + dek) + a stack of
   4 side stories (no image, red category eyebrow + headline).
   Below: one section per category — title with red underline + grid
   of cards. Compact, dense, magazine-style.

   All article links open the original publisher in a new tab with
   `rel={REL}` — InfoWebWorld is an
   aggregator surface, not a host.
   ───────────────────────────────────────────────────────────── */

type Section = {
  key: NewsCategory
  label: string
  articles: NewsArticle[]
}

/** <img> with onError fallback to a tiled placeholder — keeps the
    layout intact when an article image 404s or hotlinking is blocked. */
function SmartNewsImg({ src, alt }: { src: string; alt: string }) {
  const [broken, setBroken] = useState(false)
  if (broken || !src) {
    return <div className="nws-img-fallback" aria-hidden="true" />
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setBroken(true)}
      loading="lazy"
    />
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="nws-eyebrow">{children}</span>
}

function MetaRow({ source, publishedAt }: { source: string; publishedAt: string }) {
  return (
    <div className="nws-meta">
      <span className="nws-meta-src">{source}</span>
      <span aria-hidden="true">·</span>
      <time>{relativeNewsTime(publishedAt)}</time>
    </div>
  )
}

/* ── Hero strip: lead + 4 side stories ───────────────────── */

function NewsHero({ articles }: { articles: NewsArticle[] }) {
  const [lead, ...rest] = articles
  if (!lead) return null
  const sides = rest.slice(0, 4)

  return (
    <div className="nws-hero">
      <a
        href={withNewsUtm(lead.url)}
        target="_blank"
        rel={REL}
        className="nws-hero-lead"
      >
        <div className="nws-hero-lead-img">
          {lead.image
            ? <SmartNewsImg src={lead.image} alt="" />
            : <div className="nws-img-fallback" aria-hidden="true" />}
        </div>
        <Eyebrow>{lead.source.name}</Eyebrow>
        <h2 className="nws-hero-lead-title">{lead.title}</h2>
        {lead.description && <p className="nws-hero-lead-desc">{lead.description}</p>}
        <MetaRow source={lead.source.name} publishedAt={lead.publishedAt} />
      </a>

      <ul className="nws-hero-side">
        {sides.map(a => (
          <li key={a.url}>
            <a href={withNewsUtm(a.url)} target="_blank" rel={REL} className="nws-hero-side-link">
              <Eyebrow>{a.source.name}</Eyebrow>
              <span className="nws-hero-side-title">{a.title}</span>
              <MetaRow source={a.source.name} publishedAt={a.publishedAt} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── Generic category section ───────────────────────────── */

function NewsCard({ article, size }: { article: NewsArticle; size?: 'compact' | 'wide' }) {
  const hasImage = !!article.image
  return (
    <a
      href={withNewsUtm(article.url)}
      target="_blank"
      rel={REL}
      className={[
        'nws-card',
        size === 'wide' ? 'nws-card--wide' : '',
        hasImage ? '' : 'nws-card--text',
      ].filter(Boolean).join(' ')}
    >
      {hasImage && (
        <div className="nws-card-img">
          <SmartNewsImg src={article.image!} alt="" />
        </div>
      )}
      <div className="nws-card-body">
        <Eyebrow>{article.source.name}</Eyebrow>
        <h3 className="nws-card-title">{article.title}</h3>
        {(size === 'wide' || !hasImage) && article.description && (
          <p className="nws-card-desc">{article.description}</p>
        )}
        <MetaRow source={article.source.name} publishedAt={article.publishedAt} />
      </div>
    </a>
  )
}

function NewsListItem({ article }: { article: NewsArticle }) {
  return (
    <li className="nws-list-item">
      <a href={withNewsUtm(article.url)} target="_blank" rel={REL}>
        <span className="nws-list-bullet" aria-hidden="true" />
        <span className="nws-list-body">
          <Eyebrow>{article.source.name}</Eyebrow>
          <span className="nws-list-title">{article.title}</span>
        </span>
      </a>
    </li>
  )
}

function CategorySection({ section }: { section: Section }) {
  const { label, articles } = section
  if (articles.length === 0) return null

  // Layout: 1 wide card + 3 compact cards as the main column, plus a
  // tight overflow list as the right column. When the category has too
  // few articles to fill the list (< 4 overflow), we collapse the body
  // to a single column so the right side doesn't sit empty.
  const [wide, ...rest] = articles
  const compact = rest.slice(0, 3)
  const list = rest.slice(3, 8)
  const showList = list.length >= 2

  return (
    <section className="nws-sec">
      <header className="nws-sec-head">
        <h2 className="nws-sec-title">{label}</h2>
      </header>
      <div className={`nws-sec-body${showList ? '' : ' nws-sec-body--single'}`}>
        <div className="nws-sec-wide">
          <NewsCard article={wide} size="wide" />
        </div>
        {showList && (
          <ul className="nws-sec-list">
            {list.map(a => <NewsListItem key={a.url} article={a} />)}
          </ul>
        )}
        {compact.length > 0 && (
          <div className="nws-sec-compact-row">
            {compact.map(a => <NewsCard key={a.url} article={a} />)}
          </div>
        )}
      </div>
    </section>
  )
}

/* ── Page ────────────────────────────────────────────────── */

export default function NewsHomepage({
  sections,
  setupNeeded,
}: {
  sections: Section[]
  setupNeeded: boolean
}) {
  const topSection = sections.find(s => s.key === 'general')
  const otherSections = sections.filter(s => s.key !== 'general')

  return (
    <main className="nws-page">
      <div className="nws-wrap">
        <header className="nws-mast">
          <h1 className="nws-mast-title">Today&rsquo;s Headlines</h1>
          <p className="nws-mast-sub">
            Top news from business, technology, sports, entertainment, and the world &mdash; refreshed every hour.
          </p>
        </header>

        {setupNeeded && (
          <div className="nws-notice">
            <strong>Headlines unavailable.</strong> Couldn&rsquo;t reach the news feeds right now. Please refresh in a few minutes &mdash; this usually self-resolves within an hour.
          </div>
        )}

        {topSection && topSection.articles.length > 0 && (
          <NewsHero articles={topSection.articles} />
        )}

        {otherSections.map(s => (
          <CategorySection key={s.key} section={s} />
        ))}

        <div className="nws-foot">
          <p>
            InfoWebWorld News is an aggregator. All articles link to their original publishers.
            Source attribution shown on every story. We do not host or modify third-party content.
          </p>
        </div>
      </div>
    </main>
  )
}
