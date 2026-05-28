'use client'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { mapRow as mapCategoryRow } from './iww-hq/data/category-storage'
import type { Category } from './iww-hq/data/category-storage'
import { fetchCategoryListings, mapRow as mapSubmissionRow } from './iww-hq/data/submissions-storage'
import type { RealSubmission } from './iww-hq/data/submissions-storage'
import type { TagGroup } from './iww-hq/data/tag-storage'
import type { ParsedCategoryFilters } from './lib-category/parse-segments'
import { buildCategoryUrl } from './lib-category/build-url'
import { lookupLocationCountry, lookupState, lookupCity, preloadCSC, type GeoCountry, type GeoState, type GeoCity } from './lib/geo-slugs'

import dynamic from 'next/dynamic'
import { I, ic } from './components-category/icons'
import CategoryHero from './components-category/CategoryHero'
import SubcategoryList from './components-category/SubcategoryList'
import { RealListingCard } from './components-category/ListingCard'
import Pagination from './components-category/Pagination'

/* Heavy / below-fold components — loaded on demand with loading placeholders */
const SectorLanding = dynamic(() => import('./sector/SectorLanding'), { loading: () => <div style={{ minHeight: '100vh' }} />, ssr: true })
const FilterSidebar = dynamic(() => import('./components-category/FilterSidebar'), { ssr: false })
const SeoSections = dynamic(() => import('./components-category/SeoSections'), { loading: () => <div style={{ minHeight: 200 }} />, ssr: true })
// TrustSection removed — replaced by bottom CTA
// FaqAccordion removed — Gemini extended_faq replaces it
// PopularSearches removed — replaced by bottom CTA

/* ── No demo listings — only real DB listings shown ── */

const ITEMS_PER_PAGE = 10

/* eslint-disable @typescript-eslint/no-explicit-any */
type InitialData = {
  category: any
  allCategories: any[]
  tagGroups: any[]
  listings: any[]
  listingTotal: number
  seoContent?: any
  avgRating?: number
  totalReviews?: number
}

export default function CategoryPage({ segments, sectorSlug, initialData }: { segments?: string[]; sectorSlug?: string; initialData?: InitialData }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const slug = segments?.[0] || null

  /* ── Process server-provided initial data ── */
  const initCat = useMemo(() => {
    if (!initialData?.category) return null
    const raw = initialData.category
    const cat = mapCategoryRow(raw)
    if (typeof raw.activeListings === 'number') cat.listingCount = raw.activeListings
    if (raw.parent) { cat.parentName = String(raw.parent.name || ''); cat.parentSlug = String(raw.parent.slug || '') }
    if (Array.isArray(raw.subcategories)) cat.subcategories = raw.subcategories.map((s: Record<string, unknown>) => mapCategoryRow(s))
    if (Array.isArray(raw.listingTypes)) cat.listingTypes = raw.listingTypes.map((lt: Record<string, unknown>) => ({ id: String(lt.id), name: String(lt.name), slug: String(lt.slug) }))
    return cat
  }, [initialData])
  const initAllCats = useMemo(() => initialData?.allCategories?.map((r: Record<string, unknown>) => mapCategoryRow(r)) ?? [], [initialData])
  const initListings = useMemo(() => initialData?.listings?.map((r: Record<string, unknown>) => mapSubmissionRow(r)) ?? [], [initialData])
  const initTagGroups = useMemo(() => (initialData?.tagGroups ?? []) as TagGroup[], [initialData])

  /* ── State — pre-populated from server data when available ── */
  const [category, setCategory] = useState<Category | null>(initCat)
  const [allCats, setAllCats] = useState<Category[]>(initAllCats)
  const [related, setRelated] = useState<Category[]>(() => {
    if (!initCat || !initAllCats.length) return []
    return initAllCats.filter(c => c.id !== initCat.id && ((initCat.parentId && c.parentId === initCat.parentId) || (!initCat.parentId && c.level === initCat.level))).slice(0, 9)
  })
  const [listings, setListings] = useState<RealSubmission[]>(initListings)
  const [listingTotal, setListingTotal] = useState(initialData?.listingTotal ?? 0)
  const [tagGroups, setTagGroups] = useState<TagGroup[]>(initTagGroups)
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [selectedListingType, setSelectedListingType] = useState<string>('')
  const [sortBy, setSortBy] = useState<'newest' | 'name-az' | 'name-za'>('newest')
  const [sortOpen, setSortOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)

  /* Close sort dropdown on outside click */
  useEffect(() => {
    if (!sortOpen) return
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [sortOpen])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)

  /* ── Location state ── */
  const [locationCountry, setLocationCountry] = useState<GeoCountry | null>(null)
  const [locationState, setLocationState] = useState<GeoState | null>(null)
  const [locationCity, setLocationCity] = useState<GeoCity | null>(null)

  /* ── Pre-load geo data ONLY when needed (sidebar open or URL has geo params) ── */
  const [geoReady, setGeoReady] = useState(false)
  const hasGeoParams = searchParams.has('country') || searchParams.has('state') || searchParams.has('city')
  useEffect(() => {
    if (geoReady) return
    // Load immediately if URL has geo filters, otherwise defer until sidebar opens
    if (hasGeoParams || sidebarOpen) {
      preloadCSC().then(() => setGeoReady(true))
    }
  }, [hasGeoParams, sidebarOpen, geoReady])

  /* ── Parse filters from URL search params (?country=X&state=Y&city=Z&type=X&tags=X,Y) ── */
  const [filtersParsed, setFiltersParsed] = useState(false)
  useEffect(() => {
    if (!category) return
    // Non-geo params can be parsed immediately without CSC
    const qType = searchParams.get('type')
    const qTags = searchParams.get('tags')
    if (qType) setSelectedListingType(qType)
    if (qTags) setSelectedTags(new Set(qTags.split(',').filter(Boolean)))

    // Geo params need CSC loaded first
    if (!geoReady) { if (!hasGeoParams) setFiltersParsed(true); return }
    const qCountry = searchParams.get('country')
    const qState = searchParams.get('state')
    const qCity = searchParams.get('city')

    if (qCountry) {
      const geo = lookupLocationCountry(qCountry)
      if (geo) {
        setLocationCountry(geo)
        if (qState) {
          const st = lookupState(geo.isoCode, qState)
          if (st) {
            setLocationState(st)
            if (qCity) {
              const ct = lookupCity(geo.isoCode, st.stateCode, qCity)
              if (ct) setLocationCity(ct)
            }
          }
        }
      }
    }
    setFiltersParsed(true)
  }, [geoReady, category, searchParams, hasGeoParams])

  /* ── Push URL on filter change ── */
  const pushFilters = useCallback((overrides: Partial<ParsedCategoryFilters>) => {
    if (!slug) return
    const current: ParsedCategoryFilters = {
      categorySlug: slug,
      locationCountry,
      state: locationState,
      city: locationCity,
      listingType: selectedListingType || null,
      tags: Array.from(selectedTags),
    }
    const merged = { ...current, ...overrides }
    // If country removed, clear state + city
    if (!merged.locationCountry) { merged.state = null; merged.city = null }
    // If state removed, clear city
    if (!merged.state) { merged.city = null }
    const url = buildCategoryUrl(merged, undefined, sectorSlug)
    router.push(url, { scroll: false })
  }, [slug, locationCountry, locationState, locationCity, selectedListingType, selectedTags, sectorSlug, router])

  /* Re-fetch listings on page change */
  useEffect(() => {
    if (!category || page === 1) return
    fetchCategoryListings(category.id, page).then(res => { setListings(res.data); setListingTotal(res.total) })
  }, [category, page])

  /* SEO meta tags and JSON-LD are handled server-side in [...segments]/page.tsx */

  /* ── Handlers ── */
  const toggleTag = (s: string) => {
    const next = new Set(selectedTags); next.has(s) ? next.delete(s) : next.add(s)
    setSelectedTags(next); setPage(1)
    pushFilters({ tags: Array.from(next) })
  }
  const clearFilters = () => {
    setSelectedTags(new Set()); setSelectedListingType(''); setPage(1)
    setLocationCountry(null); setLocationState(null); setLocationCity(null)
    pushFilters({ locationCountry: null, state: null, city: null, listingType: null, tags: [] })
  }
  const toggleAccordion = (id: string) => { setOpenAccordions(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n }) }
  const handleListingTypeChange = (s: string) => { setSelectedListingType(s); setPage(1); pushFilters({ listingType: s || null }) }
  const handleLocationCountryChange = (c: GeoCountry | null) => {
    setLocationCountry(c); setLocationState(null); setLocationCity(null); setPage(1)
    pushFilters({ locationCountry: c, state: null, city: null })
  }
  const handleStateChange = (s: GeoState | null) => {
    setLocationState(s); setLocationCity(null); setPage(1)
    pushFilters({ locationCountry, state: s, city: null })
  }
  const handleCityChange = (c: GeoCity | null) => {
    setLocationCity(c); setPage(1)
    pushFilters({ locationCountry, city: c })
  }
  /* ── Atomic location change (country+state+city at once) — used by search bar ── */
  const handleLocationChange = useCallback((country: GeoCountry | null, state: GeoState | null, city: GeoCity | null) => {
    setLocationCountry(country); setLocationState(state); setLocationCity(city); setPage(1)
    pushFilters({ locationCountry: country, state, city })
  }, [pushFilters])

  /* ── Apply all sidebar filters at once ── */
  const handleApplyFilters = useCallback((filters: {
    locationCountry: GeoCountry | null; locationState: GeoState | null; locationCity: GeoCity | null
    listingType: string; tags: Set<string>
  }) => {
    setLocationCountry(filters.locationCountry)
    setLocationState(filters.locationState)
    setLocationCity(filters.locationCity)
    setSelectedListingType(filters.listingType)
    setSelectedTags(filters.tags)
    setPage(1)
    pushFilters({
      locationCountry: filters.locationCountry,
      state: filters.locationState,
      city: filters.locationCity,
      listingType: filters.listingType || null,
      tags: Array.from(filters.tags),
    })
  }, [pushFilters])

  /* ── Filtering (real listings only) ── */
  const filteredReal = useMemo(() => {
    let r = [...listings]
    if (selectedListingType) r = r.filter(i => i.listingTypeSlug === selectedListingType)
    if (sortBy === 'name-az') r.sort((a, b) => a.companyName.localeCompare(b.companyName))
    else if (sortBy === 'name-za') r.sort((a, b) => b.companyName.localeCompare(a.companyName))
    return r
  }, [listings, selectedListingType, sortBy])

  /* faqs + popularSearches removed — Gemini content covers these */

  /* ── Loading skeleton — only shown briefly during client-side navigation.
     Unknown routes 404 server-side via notFound() in [...segments]/page.tsx. */
  if (!category) return (
    <section className="cd-page">
      <div className="cd-wrap cd-skeleton-wrap">
        {/* Hero skeleton */}
        <div className="cd-sk-hero">
          <div className="cd-sk-line cd-sk-line--sm" />
          <div className="cd-sk-line cd-sk-line--lg" />
          <div className="cd-sk-line cd-sk-line--md" />
        </div>
        {/* Layout skeleton */}
        <div className="cd-sk-layout">
          <div className="cd-sk-sidebar">
            <div className="cd-sk-block" /><div className="cd-sk-block cd-sk-block--short" /><div className="cd-sk-block" />
          </div>
          <div className="cd-sk-content">
            <div className="cd-sk-card" /><div className="cd-sk-card" /><div className="cd-sk-card" />
          </div>
        </div>
      </div>
    </section>
  )

  /* ── L1 Sector → dedicated landing page ── */
  if (category.level === 1) {
    return <SectorLanding category={category} allCategories={allCats} seoContent={initialData?.seoContent} />
  }

  const c = category
  // Derive color: use DB value, or infer from sector slug
  const sectorColorMap: Record<string, string> = {
    'ai-ml': '#8B5CF6',
    'software-saas': '#3B82F6',
    'it-services-agencies': '#14B8A6',
    'startups-innovation': '#E8553D',
    'local-businesses': '#F59E0B',
    'professional-services': '#2FAE6A',
  }
  const color = (c.color && c.color !== '#E8553D' ? c.color : null)
    || (sectorSlug ? sectorColorMap[sectorSlug] : null)
    || c.color
    || '#E8553D'
  const subcats = c.subcategories || []
  const hasListings = listings.length > 0
  const isL3 = c.level === 3
  const showFilters = true
  const ltFromCat = c.listingTypes || []
  const sidebarLTs = ltFromCat
  const getLTCount = (s: string) => listings.filter(l => l.listingTypeSlug === s).length
  const totalCount = filteredReal.length
  const totalPages = Math.max(1, Math.ceil(listingTotal / ITEMS_PER_PAGE))
  const hasAnyFilter = selectedTags.size > 0 || !!selectedListingType || !!locationCountry || !!locationState || !!locationCity

  /* Sector-palette scope: every section inside picks up --c1..--c4-dark from
     app/styles/test-category-1-page.css via the .tcat-<slug> rule. Pure white
     background; no decorative blobs. */
  const sectorClass = sectorSlug ? `tcat-${sectorSlug}` : ''

  return (
    <section className={'cd-page ' + sectorClass} style={{ '--cd-color': color } as React.CSSProperties}>
      <div className="cd-wrap">

        <CategoryHero
          category={c}
          sectorSlug={sectorSlug}
          sectorName={sectorSlug ? (allCats.find(x => x.slug === sectorSlug)?.name || '') : ''}
          /* Walk up the parent chain from the current category. `allCats`
             contains every category in the sector tree (L1→L5), so we can
             reconstruct the full ancestor list client-side without an
             extra DB call. Order: oldest first (root → current's parent). */
          ancestors={(() => {
            const chain: Category[] = []
            let cur: Category | null = c
            while (cur && cur.parentId) {
              const parent = allCats.find(x => x.id === cur!.parentId)
              if (!parent) break
              chain.unshift(parent)
              cur = parent
            }
            return chain
          })()}
          avgRating={initialData?.avgRating ?? 0}
          totalReviews={initialData?.totalReviews ?? 0}
          totalListings={listingTotal}
          hasGuide={!!initialData?.seoContent}
        />
        {subcats.length > 0 && <SubcategoryList subcategories={subcats} sectorSlug={sectorSlug} />}

        {/* Main layout: listings only (no sidebar in grid) */}
        <div className="cd-layout" id="cd-listings">

          {/* Filter drawer — slides from right, 35% width */}
          {showFilters && (
            <FilterSidebar
              color={color}
              isL3={showFilters}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              listingTypes={sidebarLTs}
              selectedListingType={selectedListingType}
              onListingTypeChange={handleListingTypeChange}
              tagGroups={tagGroups}
              selectedTags={selectedTags}
              onToggleTag={toggleTag}
              openAccordions={openAccordions}
              onToggleAccordion={toggleAccordion}
              onClearFilters={clearFilters}
              hasAnyFilter={hasAnyFilter}
              getListingTypeCount={getLTCount}
              totalAllCount={listings.length}
              totalFilteredCount={totalCount}
              hasListings={hasListings}
              demoTagCounts={new Map()}
              locationCountry={locationCountry}
              locationState={locationState}
              locationCity={locationCity}
              onLocationCountryChange={handleLocationCountryChange}
              onStateChange={handleStateChange}
              onCityChange={handleCityChange}
              onApplyFilters={handleApplyFilters}
              effectiveIso={locationCountry?.isoCode || ''}
            />
          )}

          {/* Center: toolbar + listings + pagination */}
          <div>
            {/* Toolbar */}
            <div className="cd-toolbar">
              <span className="cd-toolbar-count">
                Top in {category?.name || 'Category'} - {new Date().toLocaleString('en-US', { month: 'long' })} {new Date().getFullYear()} (<strong>{totalCount}</strong>)
              </span>
              <div className="cd-toolbar-right">
              {showFilters && (
                <button className="cd-filter-btn" onClick={() => setSidebarOpen(true)} type="button">
                  <I d={ic.sliders} size={14} color={color} sw={2} />
                  Filters
                  {hasAnyFilter && (
                    <span className="cd-filter-badge" style={{ background: color }}>
                      {selectedTags.size + (selectedListingType ? 1 : 0) + (locationCountry ? 1 : 0) + (locationState ? 1 : 0) + (locationCity ? 1 : 0)}
                    </span>
                  )}
                </button>
              )}
              <div className="cd-sort" ref={sortRef}>
                <button className="cd-sort-btn" onClick={() => setSortOpen(o => !o)} type="button">
                  Sort: {{ newest: 'Most relevant', 'name-az': 'Name A-Z', 'name-za': 'Name Z-A' }[sortBy]}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 200ms', transform: sortOpen ? 'rotate(180deg)' : 'none' }}><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {sortOpen && (
                  <div className="cd-sort-dropdown">
                    {([['newest', 'Most relevant'], ['name-az', 'Name A-Z'], ['name-za', 'Name Z-A']] as const).map(([val, label]) => (
                      <button key={val} type="button"
                        className={`cd-sort-option${sortBy === val ? ' cd-sort-option--active' : ''}`}
                        onClick={() => { setSortBy(val); setSortOpen(false); setPage(1) }}>
                        {label}
                        {sortBy === val && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              </div>
            </div>

            {/* AI Summary */}
            {initialData?.seoContent?.ai_summary && (
              <div className="cd-ai-summary">
                <div className="cd-ai-summary-footer">
                  <svg className="cd-ai-summary-icon" width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M10 7l-.516 1.394C8.808 10.222 8.47 11.136 7.803 11.803 7.136 12.47 6.222 12.808 4.394 13.484L3 14l1.394.516c1.828.676 2.742 1.014 3.409 1.681.667.667 1.005 1.581 1.681 3.409L10 21l.516-1.394c.676-1.828 1.014-2.742 1.681-3.409.667-.667 1.581-1.005 3.409-1.681L17 14l-1.394-.516c-1.828-.676-2.742-1.014-3.409-1.681-.667-.667-1.005-1.581-1.681-3.409L10 7z" stroke="url(#aiStar)" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M18 3l-.221.597c-.29.784-.435 1.175-.721 1.461-.286.286-.677.431-1.461.721L15 6l.597.221c.784.29 1.175.435 1.461.721.286.286.431.677.721 1.461L18 9l.221-.597c.29-.784.435-1.175.721-1.461.286-.286.677-.431 1.461-.721L21 6l-.597-.221c-.784-.29-1.175-.435-1.461-.721-.286-.286-.431-.677-.721-1.461L18 3z" stroke="url(#aiStar)" strokeWidth="1.5" strokeLinejoin="round" />
                    <defs><linearGradient id="aiStar" x1="3" y1="3" x2="21" y2="21"><stop stopColor="#7C3AED" /><stop offset="1" stopColor="#3B82F6" /></linearGradient></defs>
                  </svg>
                  <span className="cd-ai-summary-label">Summarized by AI</span>
                </div>
                <p className="cd-ai-summary-text">{initialData.seoContent.ai_summary}</p>
              </div>
            )}

            {/* Listing cards */}
            <div>
              {filteredReal.length > 0 ? (
                filteredReal.map(item => <RealListingCard key={item.id} item={item} color={color} sectorSlug={sectorSlug || ''} />)
              ) : hasAnyFilter ? (
                <div className="cd-empty">
                  <I d={ic.search} size={32} color="var(--h-muted)" sw={1.5} />
                  <p>No listings match your filters.</p>
                  <button onClick={clearFilters} className="cd-empty-btn" style={{ color }}>Clear all filters</button>
                </div>
              ) : (
                /* Mascot empty state — matches L1's .tcat-pop-empty pattern.
                   Single muted line + lavender pill CTA, no boxes / no shapes. */
                <div className="cd-empty-bot">
                  <img
                    src="/illustrations/builder-bot.png"
                    alt=""
                    aria-hidden="true"
                    className="cd-empty-bot-img"
                    draggable={false}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  />
                  <p className="cd-empty-bot-line">
                    No companies listed in <strong>{c.name}</strong> yet.
                  </p>
                  <Link href={`/business?category=${encodeURIComponent(c.name)}`} className="cd-empty-bot-cta">
                    List the first one
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </Link>
                </div>
              )}
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} color={color} />
          </div>

        </div>

        {/* Gemini-generated SEO content sections */}
        {initialData?.seoContent && (
          <SeoSections
            seoContent={initialData.seoContent}
            categoryName={c.name}
            categorySlug={c.slug}
            sectorSlug={sectorSlug || ''}
            countryName={locationCountry?.name || ''}
            allCategories={allCats}
          />
        )}

        {/* ── Compact bottom CTA — slim, pure white, single line on wide ── */}
        <div className="cd-cta">
          <div className="cd-cta-text">
            <strong>List your business in {c.name}.</strong>{' '}
            <span className="cd-cta-sub">Dofollow backlink · Verified badge · Top placement · From $99/yr</span>
          </div>
          <div className="cd-cta-actions">
            <Link href={`/business?category=${encodeURIComponent(c.name)}`} className="cd-cta-btn">
              Get Listed
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
            <Link href="/categories" className="cd-cta-back">
              <I d={ic.arrowLeft} size={12} color="currentColor" sw={2} /> All categories
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
