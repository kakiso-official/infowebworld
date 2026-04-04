'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from '../../components/CountryLink'
import { useCountry } from '../../config/country-context'
import { COUNTRY_LABELS } from '../../config/countries'
import type { CountryCode } from '../../config/countries'
import { HugeiconsIcon } from '@hugeicons/react'
import { LayerIcon, ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import type { Category } from '../../iww-hq/data/category-storage'
import { fetchCategoryListings } from '../../iww-hq/data/submissions-storage'
import type { RealSubmission } from '../../iww-hq/data/submissions-storage'
import {
  getSectorMeta, getSectorDemos,
  pickJustLanded, pickTopRated, pickEditorsChoice,
  pickRisingStars, pickMostReviewed, pickEnterprise,
  pickStartups, pickTrending, pickCompare,
} from './sector-demo-data'

import SectorHero from './components/SectorHero'
import SectorSection, { CardGrid } from './components/SectorSection'
import CategoryCard from './components/CategoryCard'
import SectorCta from './components/SectorCta'

const BASE = 'https://infowebworld.com'

export default function SectorLanding({ category, allCategories, initialListings }: { category: Category; allCategories: Category[]; initialListings?: RealSubmission[] }) {
  const country = useCountry()
  const countryName = COUNTRY_LABELS[country as CountryCode] || 'India'
  const meta = getSectorMeta(category.slug)
  const demos = useMemo(() => getSectorDemos(category.slug), [category.slug])

  /* Use server-provided listings or fetch client-side as fallback */
  const [listings, setListings] = useState<RealSubmission[]>(initialListings ?? [])
  useEffect(() => {
    if (initialListings?.length) return
    fetchCategoryListings(category.id, 1).then(res => setListings(res.data))
  }, [category.id, initialListings])

  const l2Cats = useMemo(() =>
    allCategories.filter(c => c.parentId === category.id && c.level === 2)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
  , [allCategories, category.id])

  const l3Cats = useMemo(() => {
    const ids = new Set(l2Cats.map(c => c.id))
    return allCategories.filter(c => c.parentId && ids.has(c.parentId) && c.level === 3)
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [allCategories, l2Cats])

  const l2WithCounts = useMemo(() =>
    l2Cats.map(c => ({
      name: c.name, slug: c.slug, listingCount: c.listingCount,
      childCount: allCategories.filter(x => x.parentId === c.id && x.level === 3).length,
      icon: c.icon,
    }))
  , [l2Cats, allCategories])

  const sectorName = category.name
  const shortName = sectorName.split('&')[0].trim()
  const pageUrl = `${BASE}/${country}/${category.slug}`

  /* ── JSON-LD Structured Data ── */
  const faqs = [
    { q: `What is ${sectorName}?`, a: meta.description },
    { q: `How to find the best ${sectorName} companies in ${countryName}?`, a: `Browse verified ${sectorName} companies on InfoWebWorld. Compare services, read reviews and connect directly with providers in ${countryName}.` },
    { q: `Is it free to list my ${shortName} business?`, a: 'Yes, InfoWebWorld offers free business listing with optional premium plans for enhanced visibility, verified badges and SEO backlinks.' },
    { q: `How are ${sectorName} companies ranked?`, a: 'Rankings are based on verified reviews, user satisfaction scores, market presence and listing completeness. Our team verifies every listing.' },
    { q: `Can I compare ${shortName} solutions?`, a: `Yes! Use our comparison tools to evaluate ${shortName} solutions side by side across features, pricing, reviews and satisfaction scores.` },
  ]

  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Categories', item: `${BASE}/${country}/categories` },
      { '@type': 'ListItem', position: 3, name: sectorName },
    ],
  }

  const collectionLd = {
    '@context': 'https://schema.org', '@type': 'CollectionPage',
    name: sectorName,
    description: meta.seoDescription,
    url: pageUrl,
    isPartOf: { '@type': 'WebSite', name: 'InfoWebWorld', url: BASE },
    about: { '@type': 'Thing', name: sectorName, description: meta.description },
    numberOfItems: l2Cats.length + l3Cats.length,
  }

  const faqLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <section className="sl-page" style={{ '--sl-color': meta.color, '--sl-pastel': meta.pastel, '--sl-pastel-light': meta.pastelLight } as React.CSSProperties}>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <SectorHero category={category} meta={meta} sectorName={sectorName} shortName={shortName} l2Cats={l2Cats} l3Cats={l3Cats} demos={demos} listings={listings} sectorSlug={category.slug} />

      <SectorSection title="Just Landed" subtitle={`New companies recently listed in ${shortName}`} iconKey="rocket" viewAll={`/${category.slug}`}>
        <CardGrid items={pickJustLanded(demos)} />
      </SectorSection>

      <SectorSection title={`Top Rated in ${shortName}`} subtitle="Highest satisfaction scores from verified reviews" iconKey="star" viewAll={`/${category.slug}`} alt>
        <CardGrid items={pickTopRated(demos)} ranked />
      </SectorSection>

      <SectorSection title="Editor's Choice" subtitle={`Hand-picked ${shortName} solutions by our expert team`} iconKey="award">
        <CardGrid items={pickEditorsChoice(demos)} />
      </SectorSection>

      <SectorSection title="Popular Categories" subtitle={`Explore ${sectorName} by category`} iconKey="grid" viewAll="/categories" alt>
        <div className="sl-cats-grid">
          {l2WithCounts.map(c => <CategoryCard key={c.slug} cat={c} color={meta.color} sectorSlug={category.slug} />)}
        </div>
      </SectorSection>

      <SectorSection title="Rising Stars" subtitle="New entrants making waves with rapid adoption" iconKey="trendingUp">
        <CardGrid items={pickRisingStars(demos)} />
      </SectorSection>

      <SectorSection title="Most Reviewed" subtitle="Trusted by the community with the most user reviews" iconKey="users" viewAll={`/${category.slug}`} alt>
        <CardGrid items={pickMostReviewed(demos)} ranked />
      </SectorSection>

      <SectorSection title="Best for Enterprise" subtitle={`Enterprise-grade ${shortName} solutions with dedicated support`} iconKey="building">
        <CardGrid items={pickEnterprise(demos)} />
      </SectorSection>

      <SectorSection title="Best for Startups & SMBs" subtitle="Affordable and agile solutions built for growing teams" iconKey="rocket" alt>
        <CardGrid items={pickStartups(demos)} />
      </SectorSection>

      <SectorSection title="Trending This Week" subtitle="Most-viewed and fastest-growing this week" iconKey="trendingUp">
        <CardGrid items={pickTrending(demos)} />
      </SectorSection>

      <SectorSection title="Compare Top Solutions" subtitle={`Side-by-side comparison of leading ${shortName} tools`} iconKey="grid" viewAll={`/${category.slug}`} alt>
        <CardGrid items={pickCompare(demos)} ranked />
      </SectorSection>

      {/* Subcategory chips */}
      <div className="sl-section">
        <div className="sl-section-inner">
          <div className="sl-section-header">
            <div className="sl-section-left">
              <span className="sl-section-icon"><HugeiconsIcon icon={LayerIcon} size={20} color="var(--sl-color)" strokeWidth={2} /></span>
              <div>
                <h2 className="sl-section-title">Explore All Subcategories</h2>
                <p className="sl-section-sub">Dive deeper into {sectorName}</p>
              </div>
            </div>
          </div>
          <div className="sl-chips">
            {l3Cats.map(c => <Link key={c.id} href={`/${category.slug}/${c.slug}`} className="sl-chip">{c.name}</Link>)}
          </div>
        </div>
      </div>

      <SectorCta shortName={shortName} color={meta.color} />

      <div className="sl-back">
        <Link href="/categories" className="sl-back-link">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={14} color="var(--sl-color)" strokeWidth={2} /> Back to All Categories
        </Link>
      </div>
    </section>
  )
}
