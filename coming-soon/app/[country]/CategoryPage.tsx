'use client'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from '../components/CountryLink'
import { useCountry } from '../config/country-context'
import { fetchCategoryBySlug, fetchLaunchedCategories, mapRow as mapCategoryRow } from '../iww-hq/data/category-storage'
import type { Category } from '../iww-hq/data/category-storage'
import { fetchCategoryListings, mapRow as mapSubmissionRow } from '../iww-hq/data/submissions-storage'
import type { RealSubmission } from '../iww-hq/data/submissions-storage'
import { fetchAllTagGroups } from '../iww-hq/data/tag-storage'
import type { TagGroup } from '../iww-hq/data/tag-storage'
import { parseSegments, type ParsedCategoryFilters } from './lib-category/parse-segments'
import { buildCategoryUrl } from './lib-category/build-url'
import { lookupLocationCountry, preloadCSC, type GeoCountry, type GeoState, type GeoCity } from '../lib/geo-slugs'
import { COUNTRY_LABELS, ROUTE_TO_GEO_SLUG, ROUTE_TO_ISO } from '../config/countries'
import type { CountryCode } from '../config/countries'

import dynamic from 'next/dynamic'
import { I, ic } from './components-category/icons'
import CategoryHero from './components-category/CategoryHero'
import SubcategoryChips from './components-category/SubcategoryChips'
import { RealListingCard } from './components-category/ListingCard'
import Pagination from './components-category/Pagination'
// CompactCta, PopularSearches, TrustSection replaced by cd-bottom-cta

/* Heavy / below-fold components — loaded on demand */
const SectorLanding = dynamic(() => import('./sector/SectorLanding'))
const FilterSidebar = dynamic(() => import('./components-category/FilterSidebar'))
const SeoSections = dynamic(() => import('./components-category/SeoSections'))
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
}

export default function CategoryPage({ segments, sectorSlug, initialData }: { segments?: string[]; sectorSlug?: string; initialData?: InitialData }) {
  const router = useRouter()
  const siteCountry = useCountry()
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
  const [notFound, setNotFound] = useState(false)
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

  /* ── Pre-load geo data for URL parsing + filters ── */
  const [geoReady, setGeoReady] = useState(false)
  useEffect(() => { preloadCSC().then(() => setGeoReady(true)) }, [])

  /* ── Parse URL segments into filter state ── */
  const [segmentsParsed, setSegmentsParsed] = useState(false)
  useEffect(() => {
    if (!segments?.length || !category || !geoReady) return
    const ltSlugs = new Set((category.listingTypes || []).map(lt => lt.slug))
    const tagSlugs = new Set(tagGroups.flatMap(g => g.tags).map(t => t.slug))
    const routeIso = ROUTE_TO_ISO[siteCountry]
    const routeGeo = ROUTE_TO_GEO_SLUG[siteCountry]
    const parsed = parseSegments(segments, ltSlugs, tagSlugs, routeIso, routeGeo)
    setLocationCountry(parsed.locationCountry)
    setLocationState(parsed.state)
    setLocationCity(parsed.city)
    if (parsed.listingType) setSelectedListingType(parsed.listingType)
    if (parsed.tags.length) setSelectedTags(new Set(parsed.tags))
    setSegmentsParsed(true)
  }, [segments, category, tagGroups, siteCountry, geoReady])

  /* ── Auto-select route country in location dropdown (not for global) ── */
  useEffect(() => {
    if (!geoReady || !segmentsParsed) return
    if (locationCountry) return          // URL already set a location
    if (siteCountry === 'global') return // global = no default country
    const geoSlug = ROUTE_TO_GEO_SLUG[siteCountry]
    if (!geoSlug) return
    const geo = lookupLocationCountry(geoSlug)
    if (geo) setLocationCountry(geo)
  }, [geoReady, segmentsParsed, siteCountry, locationCountry])

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
    const routeGeo = ROUTE_TO_GEO_SLUG[siteCountry]
    const url = buildCategoryUrl(merged, routeGeo, sectorSlug)
    const prefix = siteCountry === 'global' ? '' : `/${siteCountry}`
    router.push(`${prefix}${url}`, { scroll: false })
  }, [slug, locationCountry, locationState, locationCity, selectedListingType, selectedTags, siteCountry, sectorSlug, router])

  /* ── Data fetching — skip if server pre-loaded data ── */
  useEffect(() => {
    if (!slug) { setNotFound(true); return }
    // If server provided initial data, skip all client fetches
    if (initialData && category) return

    const catP = fetchCategoryBySlug(slug)
    const relP = fetchLaunchedCategories()
    const tagP = fetchAllTagGroups()

    catP.then(cat => {
      if (!cat) { setNotFound(true); return }
      setCategory(cat)
      fetchCategoryListings(cat.id, 1).then(res => { setListings(res.data); setListingTotal(res.total) })
    })
    relP.then(all => {
      setAllCats(all)
      catP.then(cat => {
        if (cat) setRelated(all.filter(c => c.id !== cat.id && ((cat.parentId && c.parentId === cat.parentId) || (!cat.parentId && c.level === cat.level))).slice(0, 9))
      })
    })
    tagP.then(setTagGroups)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

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
  // Resolve route country to GeoCountry using proper mapping
  const getRouteGeoCountry = (): GeoCountry | null => {
    const geoSlug = ROUTE_TO_GEO_SLUG[siteCountry as CountryCode]
    if (!geoSlug) return null
    return lookupLocationCountry(geoSlug)
  }

  const handleStateChange = (s: GeoState | null) => {
    // Auto-set country from route if not explicitly selected
    let country = locationCountry
    if (!country) {
      country = getRouteGeoCountry()
      if (country) setLocationCountry(country)
    }
    setLocationState(s); setLocationCity(null); setPage(1)
    pushFilters({ locationCountry: country, state: s, city: null })
  }
  const handleCityChange = (c: GeoCity | null) => {
    let country = locationCountry
    if (!country) {
      country = getRouteGeoCountry()
      if (country) setLocationCountry(country)
    }
    setLocationCity(c); setPage(1)
    pushFilters({ locationCountry: country, city: c })
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

  /* ── Not found / loading ── */
  if (notFound) {
    return (
      <section className="cd-page">
        <div className="cd-wrap">
          <div className="cd-not-found">
            <div className="cd-not-found-icon">
              <I d={ic.search} size={28} color="#E8553D" />
            </div>
            <h1>Category Not Found</h1>
            <p>This category doesn&apos;t exist or hasn&apos;t been launched yet.</p>
            <Link href="/categories" className="cd-not-found-btn">Browse Categories</Link>
          </div>
        </div>
      </section>
    )
  }
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
    return <SectorLanding category={category} allCategories={allCats} initialListings={listings} />
  }

  const c = category
  // Derive color: use DB value, or infer from sector slug
  const sectorColorMap: Record<string, string> = {
    'artificial-intelligence-ml': '#8B5CF6',
    'software-saas': '#3B82F6',
    'it-services-agencies': '#14B8A6',
    'startups-innovation': '#E8553D',
    'local-business': '#F59E0B',
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
  // Route country auto-selected (no state/city) doesn't count as a user filter
  const defaultGeo = ROUTE_TO_GEO_SLUG[siteCountry as CountryCode]
  const isDefaultLocationOnly = !!locationCountry && locationCountry.slug === defaultGeo && !locationState && !locationCity
  const hasAnyFilter = selectedTags.size > 0 || !!selectedListingType || (!!locationCountry && !isDefaultLocationOnly) || !!locationState || !!locationCity

  return (
    <section className="cd-page" style={{ '--cd-color': color } as React.CSSProperties}>
      {/* ── Decorative background shapes ── */}
      <div className="cd-shapes" aria-hidden="true">
        <div className="cd-shape cd-shape--1" style={{ background: color }} />
        <div className="cd-shape cd-shape--2" />
        <div className="cd-shape cd-shape--3" style={{ background: color }} />
        <div className="cd-shape cd-shape--4" />
        <div className="cd-shape cd-shape--5" />
      </div>

      <div className="cd-wrap">

        <CategoryHero
          category={c}
          sectorSlug={sectorSlug}
          sectorName={sectorSlug ? (allCats.find(x => x.slug === sectorSlug)?.name || '') : ''}
          locationCountry={locationCountry}
          locationState={locationState}
          locationCity={locationCity}
          onLocationCountryChange={handleLocationCountryChange}
          onStateChange={handleStateChange}
          onCityChange={handleCityChange}
          onLocationChange={handleLocationChange}
        />
        {subcats.length > 0 && <SubcategoryChips subcategories={subcats} sectorSlug={sectorSlug} />}

        {/* ── Table of Contents — only when Gemini content exists ── */}
        {initialData?.seoContent && (() => {
          const sc = initialData.seoContent
          const bg = sc.buyers_guide && (typeof sc.buyers_guide === 'string' ? (() => { try { return JSON.parse(sc.buyers_guide) } catch { return null } })() : sc.buyers_guide)
          const tocItems: { id: string; label: string; desc: string; icon: string }[] = []
          tocItems.push({ id: 'cd-listings', label: 'Top Companies', desc: 'Browse verified listings', icon: ic.building })
          if (sc.rich_description) tocItems.push({ id: 'seo-about', label: 'About', desc: 'Editorial overview', icon: ic.file })
          if (bg?.features) tocItems.push({ id: 'seo-guide', label: "Buyer's Guide", desc: 'What to look for', icon: ic.search })
          if (sc.use_cases) tocItems.push({ id: 'seo-usecases', label: 'Use Cases', desc: 'Real-world scenarios', icon: ic.grid })
          if (sc.comparisons) tocItems.push({ id: 'seo-compare', label: 'Alternatives', desc: 'Compare approaches', icon: ic.layers })
          if (sc.long_tail_keywords) tocItems.push({ id: 'seo-find', label: 'Find Best', desc: 'Search by need', icon: ic.tag })
          if (sc.complementary_categories) tocItems.push({ id: 'seo-explore', label: 'Related', desc: 'Adjacent categories', icon: ic.globe })
          if (sc.extended_faq) tocItems.push({ id: 'seo-faq', label: 'FAQ', desc: 'Common questions', icon: ic.helpCircle })
          return (
            <nav className="cd-toc" aria-label="Page contents" style={{ '--toc-c': color } as React.CSSProperties}>
              <div className="cd-toc-header">
                <h3 className="cd-toc-title">
                  <I d={ic.layers} size={14} color={color} sw={2} />
                  On this page
                  <span className="cd-toc-count">{tocItems.length}</span>
                </h3>
              </div>
              <div className="cd-toc-grid">
                {tocItems.map((item, i) => (
                  <a key={item.id} href={`#${item.id}`} className="cd-toc-item"
                    onClick={e => { e.preventDefault(); document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>
                    <span className="cd-toc-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="cd-toc-icon"><I d={item.icon} size={15} color={color} sw={2} /></span>
                    <span className="cd-toc-body">
                      <span className="cd-toc-label">{item.label}</span>
                      <span className="cd-toc-desc">{item.desc}</span>
                    </span>
                    <I d={ic.arrow} size={12} color="var(--cd-color, var(--h-accent))" sw={2} />
                  </a>
                ))}
              </div>
            </nav>
          )
        })()}

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
              effectiveIso={locationCountry?.isoCode || ROUTE_TO_ISO[siteCountry as CountryCode] || ''}
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
                filteredReal.map(item => <RealListingCard key={item.id} item={item} color={color} />)
              ) : hasAnyFilter ? (
                <div className="cd-empty">
                  <I d={ic.search} size={32} color="var(--h-muted)" sw={1.5} />
                  <p>No listings match your filters.</p>
                  <button onClick={clearFilters} className="cd-empty-btn" style={{ color }}>Clear all filters</button>
                </div>
              ) : (
                <div className="cd-first" style={{ '--first-c': color } as React.CSSProperties}>
                  {/* Floating shapes */}
                  <div className="cd-first-shapes">
                    <div className="cd-first-shape cd-first-shape--1" />
                    <div className="cd-first-shape cd-first-shape--2" />
                    <div className="cd-first-shape cd-first-shape--3" />
                    <div className="cd-first-shape cd-first-shape--4" />
                    <div className="cd-first-shape cd-first-shape--5" />
                  </div>
                  {/* Rocket icon — Hugeicons rocket */}
                  <div className="cd-first-icon">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 10.167L12.123 6.043c1.125-1.125 1.687-1.687 2.308-2.14a9.447 9.447 0 014.308-1.784C19.499 2 20.294 2 21.885 2c.083 0 .115.038.115.115 0 1.591 0 2.386-.119 3.145a9.447 9.447 0 01-1.784 4.308c-.454.62-1.016 1.183-2.14 2.308L13.832 16" />
                      <path d="M10.341 8.098c-1.703 0-3.843-.36-5.437.3C3.737 8.881 2.878 10 2 10.879l3.306 1.416c.876.376.34 1.481.196 2.207-.162.808-.153.838.43 1.42l2.146 2.146c.583.583.612.592 1.42.43.726-.145 1.831-.68 2.207.196L13.12 22c.878-.878 1.998-1.737 2.481-2.904.66-1.594.3-3.734.3-5.437" />
                      <path d="M12 20l-1 1M4 12l-1 1" />
                      <path d="M15 4.08a8.835 8.835 0 013.161 1.38A8.468 8.468 0 0119.92 9" />
                    </svg>
                  </div>
                  {/* Badge */}
                  <span className="cd-first-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13.728 3.444l1.76 3.549c.24.494.88.968 1.42 1.058l3.19.535c2.04.342 2.52 1.835 1.05 3.306l-2.48 2.5c-.42.424-.65 1.24-.52 1.825l.71 3.095c.56 2.45-.73 3.397-2.88 2.117l-2.99-1.785c-.54-.322-1.43-.322-1.98 0L8.018 21.43c-2.14 1.28-3.44.322-2.88-2.117l.71-3.095c.13-.585-.1-1.401-.52-1.825l-2.48-2.5c-1.46-1.471-.99-2.964 1.05-3.306l3.19-.535c.53-.09 1.17-.564 1.41-1.058l1.76-3.55c.96-1.925 2.52-1.925 3.48 0z" /></svg>
                    #1 Spot Available
                  </span>
                  {/* Heading */}
                  <h3 className="cd-first-heading">
                    Be the <em>First</em> to List in<br />{c.name}
                  </h3>
                  {/* Description */}
                  <p className="cd-first-desc">
                    No companies listed here yet. Claim the top spot, get a dofollow backlink, and be seen by every buyer searching this category.
                  </p>
                  {/* Perks */}
                  <div className="cd-first-perks">
                    <span className="cd-first-perk">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 2l.295.797c.29.783.435 1.175.721 1.46.286.286.677.432 1.461.722L20.4 5.2l-.797.295c-.784.29-1.175.435-1.461.721-.286.286-.431.677-.721 1.461L17 8.6l-.295-.797c-.29-.783-.435-1.175-.721-1.46-.286-.286-.677-.432-1.461-.722L13.6 5.2l.797-.295c.784-.29 1.175-.435 1.461-.721.286-.286.431-.677.721-1.461L17 2z" /><path d="M6 4l.221.597c.29.784.435 1.175.721 1.461.286.286.677.431 1.461.721L9.4 7l-.597.221c-.784.29-1.175.435-1.461.721-.286.286-.431.677-.721 1.461L6 10l-.221-.597c-.29-.784-.435-1.175-.721-1.461-.286-.286-.677-.431-1.461-.721L2.6 7l.597-.221c.784-.29 1.175-.435 1.461-.721.286-.286.431-.677.721-1.461L6 4z" /></svg>
                      Dofollow Backlink
                    </span>
                    <span className="cd-first-perk">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12V18" /><path d="M12 18c-1.674 0-3.13 1.012-3.882 2.505-.36.713.155 1.495.84 1.495h6.083c.685 0 1.2-.782.84-1.495C15.13 19.012 13.674 18 12 18z" /><path d="M12 12c3.866 0 7-3.117 7-6.962 0-.1-.002-.2-.006-.3-.043-1-.064-1.5-.741-2.119C17.575 2 16.825 2 15.324 2H8.676c-1.5 0-2.25 0-2.928.62-.672.618-.694 1.118-.736 2.118A7.115 7.115 0 005 5.038C5 8.883 8.134 12 12 12z" /></svg>
                      Verified Badge
                    </span>
                    <span className="cd-first-perk">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 21h14" /><path d="M14.915 7.611l-1.107-2.23c-.789-1.587-1.183-2.381-1.808-2.381s-1.019.794-1.808 2.382L9.085 7.61c-.504 1.015-.756 1.522-1.205 1.636a2.26 2.26 0 01-.095.019c-.458.07-.886-.299-1.741-1.037C4.012 6.476 3 5.6 2.38 5.95a1.1 1.1 0 00-.114.076C1.702 6.454 2.095 7.74 2.882 10.315l1.166 3.813c.423 1.384.635 2.076 1.17 2.474.535.398 1.255.398 2.693.398h8.178c1.438 0 2.158 0 2.693-.398.535-.398.747-1.09 1.17-2.474l1.166-3.813c.787-2.574 1.18-3.861.617-4.29a1.095 1.095 0 00-.115-.077c-.617-.349-1.629.527-3.66 2.28-.856.737-1.284 1.106-1.742 1.036a2.26 2.26 0 01-.095-.019c-.45-.114-.701-.621-1.205-1.635z" /></svg>
                      Top Placement
                    </span>
                  </div>
                  {/* CTA */}
                  <Link href={`/business?category=${encodeURIComponent(c.name)}`} className="cd-first-cta">
                    Get Listed Now
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
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
            countryName={COUNTRY_LABELS[siteCountry as CountryCode] || 'United States'}
            allCategories={allCats}
          />
        )}

        {/* ── Bottom CTA bar ── */}
        <div className="cd-bottom-cta" style={{ '--bc': color } as React.CSSProperties}>
          <div className="cd-bottom-cta-left">
            <span className="cd-bottom-cta-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13.728 3.444l1.76 3.549c.24.494.88.968 1.42 1.058l3.19.535c2.04.342 2.52 1.835 1.05 3.306l-2.48 2.5c-.42.424-.65 1.24-.52 1.825l.71 3.095c.56 2.45-.73 3.397-2.88 2.117l-2.99-1.785c-.54-.322-1.43-.322-1.98 0L8.018 21.43c-2.14 1.28-3.44.322-2.88-2.117l.71-3.095c.13-.585-.1-1.401-.52-1.825l-2.48-2.5c-1.46-1.471-.99-2.964 1.05-3.306l3.19-.535c.53-.09 1.17-.564 1.41-1.058l1.76-3.55c.96-1.925 2.52-1.925 3.48 0z" /></svg>
              {Math.max(0, 200 - c.listingCount)} founding spots left
            </span>
            <h3 className="cd-bottom-cta-heading">List your business in <em>{c.name}</em></h3>
            <p className="cd-bottom-cta-desc">Dofollow backlink · Verified badge · Top placement · From $99/yr</p>
          </div>
          <div className="cd-bottom-cta-right">
            <Link href={`/business?category=${encodeURIComponent(c.name)}`} className="cd-bottom-cta-btn">
              Get Listed
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
            <Link href="/categories" className="cd-bottom-cta-back">
              <I d={ic.arrowLeft} size={13} color="currentColor" sw={2} /> All categories
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
