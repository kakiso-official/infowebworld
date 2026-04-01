'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from '../../../components/CountryLink'
import { HugeiconsIcon } from '@hugeicons/react'
import { LayerIcon, ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import type { Category } from '../../../iww-hq/data/category-storage'
import { fetchCategoryListings } from '../../../iww-hq/data/submissions-storage'
import type { RealSubmission } from '../../../iww-hq/data/submissions-storage'
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

export default function SectorLanding({ category, allCategories }: { category: Category; allCategories: Category[] }) {
  const meta = getSectorMeta(category.slug)
  const demos = useMemo(() => getSectorDemos(category.slug), [category.slug])

  /* Fetch real listings for this L1 sector */
  const [listings, setListings] = useState<RealSubmission[]>([])
  useEffect(() => {
    fetchCategoryListings(category.id, 1).then(res => setListings(res.data))
  }, [category.id])

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

  return (
    <section className="sl-page" style={{ '--sl-color': meta.color, '--sl-pastel': meta.pastel, '--sl-pastel-light': meta.pastelLight } as React.CSSProperties}>

      <SectorHero category={category} meta={meta} sectorName={sectorName} shortName={shortName} l2Cats={l2Cats} l3Cats={l3Cats} demos={demos} listings={listings} />

      <SectorSection title="Just Landed" subtitle={`New companies recently listed in ${shortName}`} iconKey="rocket" viewAll={`/category/${category.slug}`}>
        <CardGrid items={pickJustLanded(demos)} />
      </SectorSection>

      <SectorSection title={`Top Rated in ${shortName}`} subtitle="Highest satisfaction scores from verified reviews" iconKey="star" viewAll={`/category/${category.slug}`} alt>
        <CardGrid items={pickTopRated(demos)} ranked />
      </SectorSection>

      <SectorSection title="Editor's Choice" subtitle={`Hand-picked ${shortName} solutions by our expert team`} iconKey="award">
        <CardGrid items={pickEditorsChoice(demos)} />
      </SectorSection>

      <SectorSection title="Popular Categories" subtitle={`Explore ${sectorName} by category`} iconKey="grid" viewAll="/categories" alt>
        <div className="sl-cats-grid">
          {l2WithCounts.map(c => <CategoryCard key={c.slug} cat={c} color={meta.color} />)}
        </div>
      </SectorSection>

      <SectorSection title="Rising Stars" subtitle="New entrants making waves with rapid adoption" iconKey="trendingUp">
        <CardGrid items={pickRisingStars(demos)} />
      </SectorSection>

      <SectorSection title="Most Reviewed" subtitle="Trusted by the community with the most user reviews" iconKey="users" viewAll={`/category/${category.slug}`} alt>
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

      <SectorSection title="Compare Top Solutions" subtitle={`Side-by-side comparison of leading ${shortName} tools`} iconKey="grid" viewAll={`/category/${category.slug}`} alt>
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
            {l3Cats.map(c => <Link key={c.id} href={`/category/${c.slug}`} className="sl-chip">{c.name}</Link>)}
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
