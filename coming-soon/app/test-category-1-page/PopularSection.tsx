'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faStarHalfStroke, faArrowRight } from '@fortawesome/free-solid-svg-icons'

/* ═══════════════════════════════════════════════════════════════════════
   Most Popular AI Categories — left rail of L2 tabs + 3×3 grid of
   real listings for the active L2. All data passed in from the server
   page (page.tsx → getPopularByL2). Zero mock content.
   ═══════════════════════════════════════════════════════════════════════ */

export type PopProduct = {
  slug: string
  name: string
  logoUrl: string | null
  rating: number
  reviews: number
  listingMode: 'product' | 'company'
}
export type PopL2 = {
  slug: string
  name: string
  products: PopProduct[]
}

/* Pick 2-character monogram for the logo fallback. Multi-word names
   → first letter of the first two words; single-word → first two chars.
   Stripped of dots / dashes so "remove.bg" → "RB", "D-ID" → "DI". */
function initialsOf(name: string): string {
  const cleaned = name.replace(/[.·_-]/g, ' ').trim()
  const words = cleaned.split(/\s+/).filter(Boolean)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return cleaned.slice(0, 2).toUpperCase()
}

function listingHref(p: PopProduct): string {
  return (p.listingMode === 'company' ? '/profile/' : '/company/') + p.slug
}

/* Logo with onError fallback to a monogram tile. Real logos are tried
   first; the moment the image fails we swap to the lavender monogram
   so cards never render a broken <img>. */
function LogoOrMonogram({ url, name }: { url: string | null; name: string }) {
  const [errored, setErrored] = useState(false)
  if (url && !errored) {
    return (
      <img
        src={url}
        alt={`${name} logo`}
        className="tcat-pop-card-logo-img"
        loading="lazy"
        decoding="async"
        onError={() => setErrored(true)}
      />
    )
  }
  return (
    <span className="tcat-pop-card-mark" aria-hidden="true">
      {initialsOf(name)}
    </span>
  )
}

/* 5-star strip using FA icons.
     • on  → faStar (filled, lavender accent)
     • half→ faStarHalfStroke (left filled, right outlined — same colour)
     • off → faStar (very pale lavender = empty)
   Math.floor + (rating - floor >= 0.5) decides full/half split. */
function Stars({ value }: { value: number }) {
  const full = Math.floor(value)
  const half = value - full >= 0.5
  return (
    <span className="tcat-pop-stars" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map(i => {
        if (i < full) {
          return <FontAwesomeIcon key={i} icon={faStar} className="tcat-pop-star tcat-pop-star--on" />
        }
        if (i === full && half) {
          return <FontAwesomeIcon key={i} icon={faStarHalfStroke} className="tcat-pop-star tcat-pop-star--on" />
        }
        return <FontAwesomeIcon key={i} icon={faStar} className="tcat-pop-star tcat-pop-star--off" />
      })}
    </span>
  )
}

export default function PopularSection({ cats }: { cats: PopL2[] }) {
  /* No real listings to show → don't render the section at all.
     Honest empty state — no curated placeholder cards. */
  const [activeSlug, setActiveSlug] = useState<string>(cats[0]?.slug || '')
  const active = useMemo(
    () => cats.find(c => c.slug === activeSlug) || cats[0],
    [cats, activeSlug],
  )

  if (!cats.length || !active) return null

  return (
    <section className="tcat-pop" aria-labelledby="tcat-pop-h">
      <div className="tcat-pop-inner">
        {/* ── Left rail — heading + L2 list ── */}
        <aside className="tcat-pop-left">
          <h2 id="tcat-pop-h" className="tcat-pop-title">
            Most Popular<br />AI Categories
          </h2>
          <ul className="tcat-pop-cats" role="tablist">
            {cats.map(c => {
              const on = c.slug === active.slug
              return (
                <li key={c.slug} role="presentation">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={on}
                    className={'tcat-pop-cat' + (on ? ' tcat-pop-cat--on' : '')}
                    onClick={() => setActiveSlug(c.slug)}
                  >
                    {c.name}
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>

        {/* ── Right area — see-all link + product grid, OR empty-state
              mascot + CTA pill when the active L2 has no listings yet. */}
        <div className="tcat-pop-right">
          {active.products.length > 0 ? (
            <>
              <div className="tcat-pop-head">
                <Link href={`/ai-ml/${active.slug}`} className="tcat-pop-seeall">
                  See all {active.name}
                  <FontAwesomeIcon icon={faArrowRight} className="tcat-pop-seeall-ico" />
                </Link>
              </div>

              <div className="tcat-pop-grid">
                {active.products.map(p => (
                  <Link
                    key={p.slug}
                    href={listingHref(p)}
                    className="tcat-pop-card"
                    aria-label={`${p.name} — ${p.rating.toFixed(1)} stars (${p.reviews.toLocaleString()} reviews)`}
                  >
                    <div className="tcat-pop-card-meta">
                      <h3 className="tcat-pop-card-name">{p.name}</h3>
                      <div className="tcat-pop-card-rate">
                        <Stars value={p.rating} />
                        <span className="tcat-pop-card-count">({p.reviews.toLocaleString()})</span>
                      </div>
                    </div>
                    <div className="tcat-pop-card-logo">
                      <LogoOrMonogram url={p.logoUrl} name={p.name} />
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="tcat-pop-empty">
              <img
                src="/illustrations/builder-bot.png"
                alt=""
                aria-hidden="true"
                className="tcat-pop-empty-bot"
                draggable={false}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
              <p className="tcat-pop-empty-line">
                No tools listed in <strong>{active.name}</strong> yet.
              </p>
              <Link
                href={`/business?category=${encodeURIComponent(active.slug)}`}
                className="tcat-pop-empty-link"
              >
                List the first one
                <FontAwesomeIcon icon={faArrowRight} className="tcat-pop-empty-link-ico" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
