'use client'
import { useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons'
import type { Category } from '../iww-hq/data/category-storage'

type Props = {
  category: Category
  sectorSlug?: string
  sectorName?: string
  /** Full ancestor chain from root → current's parent. Drives the breadcrumb so
      L4 pages show Home / Sector / L2 / L3 / Current, L3 shows Home / Sector /
      L2 / Current, etc. — without missing intermediate levels. */
  ancestors?: Category[]
  /** Aggregate avg rating across every listing in the category tree. */
  avgRating?: number
  /** Total approved review count across the same tree. */
  totalReviews?: number
  /** Active listing count (passed through to keep the count in sync w/ filters). */
  totalListings?: number
  /** Applied ?country= filter's display name → country-aware H1 + description
      ("Top X Companies in <Country>"). Empty on the unfiltered base page. */
  countryName?: string
  /** Whether Gemini SEO content exists — controls Buyer's Guide / FAQs link visibility. */
  hasGuide?: boolean
}

/* Top markets surfaced as inline filter chips inside the hero description.
   Each links to the same category page with a ?country= filter that
   CategoryPage already parses and applies to the listings query. */
const TOP_COUNTRIES: { name: string; slug: string }[] = [
  { name: 'USA', slug: 'united-states' },
  { name: 'UK', slug: 'united-kingdom' },
  { name: 'India', slug: 'india' },
  { name: 'Australia', slug: 'australia' },
  { name: 'UAE', slug: 'united-arab-emirates' },
  { name: 'Canada', slug: 'canada' },
]

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

function Stars({ value }: { value: number }) {
  const full = Math.floor(value)
  const half = value - full >= 0.5
  return (
    <span className="cd-hero-stars" aria-label={`${value.toFixed(1)} out of 5`}>
      {[0, 1, 2, 3, 4].map(i => {
        if (i < full) {
          return <FontAwesomeIcon key={i} icon={faStar} className="cd-hero-star cd-hero-star--on" />
        }
        if (i === full && half) {
          return <FontAwesomeIcon key={i} icon={faStarHalfStroke} className="cd-hero-star cd-hero-star--on" />
        }
        return <FontAwesomeIcon key={i} icon={faStar} className="cd-hero-star cd-hero-star--off" />
      })}
    </span>
  )
}

/* Sector-aware name qualifier — must match the one in
   app/[...segments]/page.tsx so the H1 and the page title agree.
   Prepends "AI & ML" to ambiguous category names inside the ai-ml sector
   (e.g. "Software" → "AI & ML Software") so users don't confuse the page
   with the broader /software-saas sector. */
function qualifyCategoryName(name: string, sectorSlug?: string): string {
  if (!name) return name
  const lc = name.toLowerCase()
  if (sectorSlug === 'ai-ml') {
    if (/\b(ai|ml|a\.i\.|m\.l\.|artificial[- ]intelligence|machine[- ]learning|llm|gpt|neural|deep[- ]learning|generative|nlp)\b/.test(lc)) return name
    return `AI & ML ${name}`
  }
  return name
}

/* Build the descriptive paragraph. Real data: listing count + category name +
   parent sector. Country chips are interpolated inline at the natural spot. */
function buildDescription(name: string, parentName: string, listingCount: number, country?: string): string {
  const sector = parentName ? ` ${parentName.toLowerCase()}` : ''
  const count = listingCount > 0 ? `${listingCount}+ ` : ''
  const where = country ? `in ${country}` : 'worldwide'
  return (
    `Find top ${name.toLowerCase()} companies ${where} offering reliable, ` +
    `high-quality solutions across budgets. Explore ${count}firms delivering real project outcomes ` +
    `and verified client satisfaction. InfoWebWorld provides a curated list of leading${sector} ` +
    `companies, helping you compare hourly rates, reviews, industry expertise, and locations ` +
    `like the {COUNTRIES} — filter by specialisations to make smarter, faster choices for your project.`
  )
}

export default function CategoryHero({
  category: c,
  sectorSlug,
  sectorName,
  ancestors = [],
  avgRating = 0,
  totalReviews = 0,
  totalListings,
  countryName = '',
  hasGuide = false,
}: Props) {
  const [expanded, setExpanded] = useState(false)

  const listingCount = totalListings ?? c.listingCount ?? 0
  const today = new Date()
  const dateStr = `${MONTHS[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`

  /* Sector-qualified name — used in H1 + description so an L2 like
     "Software" inside ai-ml renders as "AI & ML Software" and doesn't get
     confused with the /software-saas sector. */
  const qualifiedName = qualifyCategoryName(c.name, sectorSlug)

  /* Split the description at the {COUNTRIES} marker so the country chips
     can render inline as real links inside the paragraph. */
  const descTemplate = c.description || buildDescription(qualifiedName, c.parentName || sectorName || '', listingCount, countryName)
  const [descBefore, descAfter] = descTemplate.includes('{COUNTRIES}')
    ? descTemplate.split('{COUNTRIES}')
    : [descTemplate, '']
  const showExpand = (descBefore.length + descAfter.length) > 280 && !expanded
  const beforeText = showExpand ? descBefore.slice(0, 200) : descBefore
  const afterText = showExpand ? '' : descAfter

  return (
    <header className="cd-hero">
      {/* Brand watermark — InfoWebWorld's 4-quadrant window mark in its
          signature colors (mustard / coral / sky / lime). Decorative only,
          hidden from screen readers, sits behind content. */}
      <svg
        className="cd-hero-watermark"
        viewBox="0 0 250 250"
        aria-hidden="true"
        focusable="false"
      >
        <polygon fill="#FEB801" points="117.62 76.04 76.04 76.04 76.04 125 49.89 125 49.89 49.89 117.62 49.89 117.62 76.04" />
        <polygon fill="#F25022" points="173.96 117.62 173.96 76.04 132.38 76.04 132.38 49.89 200.11 49.89 200.11 117.62 173.96 117.62" />
        <polygon fill="#01A4EF" points="76.04 125 76.04 173.96 125 173.96 125 200.11 49.89 200.11 49.89 125 76.04 125" />
        <polygon fill="#7FBA00" points="125 173.96 173.96 173.96 173.96 132.38 200.11 132.38 200.11 200.11 125 200.11 125 173.96" />
      </svg>

      {/* Breadcrumb — Home / [every ancestor in order] / Current.
          L1 (sector) links to /{slug}, L2+ link to /{sector}/{slug}. If
          `ancestors` wasn't passed (legacy callers), fall back to the
          sectorSlug + immediate parent shown previously. */}
      <nav className="cd-breadcrumb" aria-label="Breadcrumb">
        <Link href="/" className="cd-breadcrumb-link">Home</Link>
        <span className="cd-breadcrumb-sep">/</span>
        {ancestors.length > 0 ? ancestors.map(a => (
          <span key={a.id}>
            <Link
              href={a.level === 1 ? `/${a.slug}` : `/${sectorSlug || ''}/${a.slug}`}
              className="cd-breadcrumb-link"
            >
              {a.name}
            </Link>
            <span className="cd-breadcrumb-sep">/</span>
          </span>
        )) : (
          <>
            {sectorSlug && sectorName && (
              <>
                <Link href={`/${sectorSlug}`} className="cd-breadcrumb-link">{sectorName}</Link>
                <span className="cd-breadcrumb-sep">/</span>
              </>
            )}
            {c.parentName && c.parentSlug && sectorSlug && (
              <>
                <Link href={`/${sectorSlug}/${c.parentSlug}`} className="cd-breadcrumb-link">{c.parentName}</Link>
                <span className="cd-breadcrumb-sep">/</span>
              </>
            )}
          </>
        )}
        <span className="cd-breadcrumb-current">{c.name}</span>
      </nav>

      {/* H1 — Top {Category} Companies [in {Country}] (sector-qualified).
          Lead + wording MATCH the <title> from buildCategoryMeta so Google
          doesn't rewrite the SERP title to this heading. */}
      <h1 className="cd-hero-title">Top {qualifiedName} Companies{countryName ? ` in ${countryName}` : ''}</h1>

      {/* Description with inline country chips + read-more toggle */}
      <p className="cd-hero-desc">
        {beforeText}
        {!showExpand && (
          <>
            <span className="cd-hero-countries">
              {TOP_COUNTRIES.map((cn, i) => (
                <span key={cn.slug}>
                  <Link
                    href={`/${sectorSlug || c.parentSlug || ''}/${c.slug}?country=${cn.slug}`}
                    className="cd-hero-country"
                  >
                    {cn.name}
                  </Link>
                  {i < TOP_COUNTRIES.length - 2 ? ', ' : i === TOP_COUNTRIES.length - 2 ? ', and ' : ''}
                </span>
              ))}
            </span>
            {afterText}
          </>
        )}
        {showExpand && (
          <>
            …
            <button type="button" className="cd-hero-expand" onClick={() => setExpanded(true)}>
              Read Full Description
            </button>
          </>
        )}
      </p>

      {/* Rating row — aggregate stars + "X out of 5, based on N real reviews" */}
      <div className="cd-hero-rate">
        <Stars value={avgRating > 0 ? avgRating : 0} />
        {totalReviews > 0 ? (
          <span className="cd-hero-rate-text">
            <strong>{avgRating.toFixed(1)}</strong> out of 5, based on <strong>{totalReviews.toLocaleString()}</strong> real reviews.
          </span>
        ) : (
          <span className="cd-hero-rate-text cd-hero-rate-text--empty">
            No reviews yet — be the first.
          </span>
        )}
      </div>

      {/* Meta row — author byline + last updated + Buyer's Guide + FAQs.
          The "By InfoWebWorld Editorial · Reviewed by" line is an E-E-A-T
          signal (Experience-Expertise-Authoritativeness-Trustworthiness)
          that Google + LLMs both read. <time> dateTime makes freshness
          machine-readable for AI answer engines. */}
      <div className="cd-hero-meta">
        <span className="cd-hero-byline">
          By <strong>InfoWebWorld Editorial</strong> · Reviewed by InfoWebWorld Team
        </span>
        <span className="cd-hero-meta-sep" aria-hidden="true">·</span>
        <span className="cd-hero-updated">
          Updated <time dateTime={today.toISOString()}>{dateStr}</time></span>
        {hasGuide && (
          <>
            <a href="#seo-guide" className="cd-hero-meta-link">Buyer&rsquo;s Guide</a>
            <a href="#seo-faq" className="cd-hero-meta-link">FAQs</a>
          </>
        )}
      </div>
    </header>
  )
}
