'use client'
import './styles/categories.css'
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
import LocalBusinessCard from './components-category/LocalBusinessCard'
import Pagination from './components-category/Pagination'

/* Heavy / below-fold components — loaded on demand with loading placeholders */
const SectorLanding = dynamic(() => import('./sector/SectorLanding'), { loading: () => <div style={{ minHeight: '100vh' }} />, ssr: true })
const SeoSections = dynamic(() => import('./components-category/SeoSections'), { loading: () => <div style={{ minHeight: 200 }} />, ssr: true })
import CategoryFilterBar, { type FilterOption, type FilterField } from './components-category/CategoryFilterBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
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

export default function CategoryPage({ segments, sectorSlug, initialData, routeCountry }: { segments?: string[]; sectorSlug?: string; initialData?: InitialData; routeCountry?: { slug: string; name: string; count: number } | null }) {
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
  const [sortBy, setSortBy] = useState<string>('newest')
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
    // Load CSC eagerly so the Locations dropdown can resolve country names.
    if (hasGeoParams || listings.length > 0) {
      preloadCSC().then(() => setGeoReady(true))
    }
  }, [hasGeoParams, listings.length, geoReady])

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

  /* Build a map of every tag slug → its group meta + label, so the filter
     below can decide which scraped JSON field to match against. */
  const tagSlugMeta = useMemo(() => {
    const map = new Map<string, { groupSlug: string; groupName: string; label: string }>()
    for (const g of tagGroups) {
      const gs = (g.slug || '').toLowerCase()
      const gn = (g.name || '').toLowerCase()
      for (const t of g.tags) {
        if (t.slug) map.set(t.slug, { groupSlug: gs, groupName: gn, label: t.name })
      }
    }
    return map
  }, [tagGroups])

  /* ── Filtering (client-side over the loaded listings) ── */
  const filteredReal = useMemo(() => {
    let r = [...listings]

    /* Listing type — match by slug (from listing_types JOIN). */
    if (selectedListingType) r = r.filter(i => i.listingTypeSlug === selectedListingType)

    /* Tags — try the real submission_tags slugs first (proper relation).
       For scraped listings that don't have submission_tags rows, fall back
       to matching the tag's *label* against the relevant scraped JSON
       field on the listing (industries/pricing/sizes/compliance/etc.). */
    if (selectedTags.size > 0) {
      /* Map a tag group's slug/name to the listing fields its tags should
         match against. The lookup is permissive — multiple keys map to the
         same fields so DB naming variants ("pricing" / "pricing-model" /
         "pricing model") all work. */
      const fieldsForGroup = (groupSlug: string, groupName: string) => (i: RealSubmission): string[] => {
        const k = (groupSlug + ' ' + groupName).toLowerCase()
        if (/(pricing|monetiz|billing|business[-\s]?model)/.test(k)) {
          return [i.pricingModel, ...i.pricingTiers.map(p => p.name || ''), ...i.pricingTiers.map(p => p.period || '')]
        }
        if (/(company[-\s]?size|team[-\s]?size|target[-\s]?company|employees)/.test(k)) {
          return [i.employees, ...i.targetCompanySizes]
        }
        if (/(industr|vertical|sector)/.test(k)) {
          return i.industriesServed
        }
        if (/(use[-\s]?case|workflow|scenario)/.test(k)) {
          return i.useCases
        }
        if (/(language|locale)/.test(k)) {
          return i.languages
        }
        if (/(compliance|certification|regulator)/.test(k)) {
          return i.compliance
        }
        if (/(tech[-\s]?stack|technolog|integration|stack)/.test(k)) {
          return [...i.features, ...i.integrations.map(x => x.name || '')]
        }
        if (/(feature|capabilit|functional)/.test(k)) {
          return [...i.features, ...i.keyFeatures.map(kf => kf.name || '')]
        }
        if (/(support|channel)/.test(k)) {
          return i.supportChannels
        }
        if (/(training)/.test(k)) {
          return i.trainingOptions
        }
        /* Unknown group → check every text-bearing field. */
        return [
          ...i.features, ...i.industriesServed, ...i.useCases,
          ...i.targetCompanySizes, ...i.languages, ...i.compliance,
          ...i.headerTags, ...i.pros, ...i.supportChannels, ...i.trainingOptions,
          i.pricingModel, i.employees,
          ...i.pricingTiers.map(p => p.name || ''),
          ...i.integrations.map(x => x.name || ''),
          ...i.keyFeatures.map(kf => kf.name || ''),
        ]
      }
      r = r.filter(i => {
        for (const tagSlug of selectedTags) {
          /* First — exact submission_tags relation. */
          if (i.tagSlugs.includes(tagSlug)) return true
          /* Fallback — label substring match in the right scraped field. */
          const meta = tagSlugMeta.get(tagSlug)
          if (!meta) continue
          const fields = fieldsForGroup(meta.groupSlug, meta.groupName)(i)
          const labelLc = meta.label.toLowerCase().trim()
          if (!labelLc) continue
          for (const f of fields) {
            if (f && String(f).toLowerCase().includes(labelLc)) return true
          }
        }
        return false
      })
    }

    /* Location — match only at the DEEPEST specified level, because real
       listings often have city + country set but state blank (or vice
       versa). Requiring all three to match exactly would zero-out matches
       that should clearly count (e.g. Paris listing has city="Paris" but
       no state populated). Tries each level with case + punctuation
       normalization so "Île-de-France" matches "Ile-de-France" etc. */
    const norm = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
    if (locationCity?.name) {
      const want = norm(locationCity.name)
      r = r.filter(i => norm(i.city) === want)
    } else if (locationState?.name) {
      const want = norm(locationState.name)
      r = r.filter(i => norm(i.state) === want)
    } else if (locationCountry?.name) {
      const want = norm(locationCountry.name)
      r = r.filter(i => norm(i.country) === want)
    }

    /* Sort */
    if (sortBy === 'name-az') r.sort((a, b) => a.companyName.localeCompare(b.companyName))
    else if (sortBy === 'name-za') r.sort((a, b) => b.companyName.localeCompare(a.companyName))
    else if (sortBy === 'rated') r.sort((a, b) => b.reviewAvg - a.reviewAvg)
    else if (sortBy === 'reviewed') r.sort((a, b) => b.reviewCount - a.reviewCount)
    return r
  }, [listings, selectedListingType, selectedTags, tagSlugMeta, locationCountry, locationState, locationCity, sortBy])

  /* Specializations dropdown options — pulled from the category's
     listing_types (the same set the old sidebar showed). */
  const serviceOptions: FilterOption[] = useMemo(() => {
    return (category?.listingTypes || []).map(lt => ({ value: lt.slug, label: lt.name }))
  }, [category])

  const SORT_OPTIONS: FilterOption[] = [
    { value: 'newest', label: 'Most Relevant' },
    { value: 'rated', label: 'Highest Rated' },
    { value: 'reviewed', label: 'Most Reviewed' },
    { value: 'name-az', label: 'Name A-Z' },
    { value: 'name-za', label: 'Name Z-A' },
  ]

  /* Dynamic filter bar fields — Locations is rendered separately via the
     special LocationFilterDropdown (cascading Country/State/City).
     Specializations + tag groups + Sort are rendered as generic dropdowns. */
  const filterFields: FilterField[] = useMemo(() => {
    const fields: FilterField[] = []
    if (serviceOptions.length > 0) {
      fields.push({
        key: 'specializations',
        label: 'Specializations',
        options: serviceOptions,
        value: selectedListingType,
        onChange: (v) => handleListingTypeChange(Array.isArray(v) ? v[0] || '' : v),
      })
    }
    /* One multi-select dropdown per tag group from the DB (Pricing,
       Languages, Industries, etc.). Skip groups whose name/slug duplicates
       the primary Locations field (the geo lookup already covers that). */
    const LOCATION_LIKE = /^(locations?|countries|countries\s*served|geographic|geography|markets?|regions?)$/i
    for (const g of tagGroups) {
      if (!g.tags || g.tags.length === 0) continue
      if (LOCATION_LIKE.test(g.name) || LOCATION_LIKE.test(g.slug)) continue
      fields.push({
        key: `tg-${g.slug}`,
        label: g.name,
        options: g.tags.map(t => ({ value: t.slug, label: t.name })),
        value: Array.from(selectedTags).filter(s => g.tags.some(t => t.slug === s)),
        multi: true,
        onChange: (next) => {
          /* Replace this group's tag slugs in the global selectedTags set
             with the new selection, leaving other groups untouched. */
          const ownSlugs = new Set(g.tags.map(t => t.slug))
          const merged = new Set<string>()
          for (const s of selectedTags) if (!ownSlugs.has(s)) merged.add(s)
          for (const s of (Array.isArray(next) ? next : [next])) if (s) merged.add(s)
          setSelectedTags(merged); setPage(1)
          pushFilters({ tags: Array.from(merged) })
        },
      })
    }
    fields.push({
      key: 'sort',
      label: 'Sort',
      options: SORT_OPTIONS,
      value: sortBy,
      searchable: false,
      onChange: (v) => { setSortBy(Array.isArray(v) ? v[0] || 'newest' : v); setPage(1) },
    })
    return fields
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceOptions, selectedListingType, tagGroups, selectedTags, sortBy])

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
          /* On a ?country= page, show that country's listing count (resolved
             server-side); otherwise the whole-tree total. */
          totalListings={routeCountry ? routeCountry.count : listingTotal}
          /* Server-resolved country name → country-aware H1 in the SSR HTML
             (locationCountry only resolves client-side after CSC loads). */
          countryName={routeCountry?.name || locationCountry?.name || ''}
          hasGuide={!!initialData?.seoContent}
        />
        {subcats.length > 0 && <SubcategoryList subcategories={subcats} sectorSlug={sectorSlug} />}

        {/* Horizontal filter bar — Locations is a cascading Country/State/City
            dropdown driven by the full CSC dataset; the rest are dynamic
            dropdowns built from real DB data (Specializations + tag groups +
            Sort). */}
        <CategoryFilterBar
          location={{
            country: locationCountry,
            state: locationState,
            city: locationCity,
            onChange: handleLocationChange,
          }}
          fields={filterFields}
        />

        {/* Listings grid + pagination */}
        <div className="cd-layout" id="cd-listings">
          <div>
            {/* Compact result count above the listings. */}
            <div className="cd-toolbar">
              <span className="cd-toolbar-count">
                Top in {category?.name || 'Category'} — {new Date().toLocaleString('en-US', { month: 'long' })} {new Date().getFullYear()} (<strong>{totalCount}</strong>)
              </span>
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
                /* Local-businesses sector → Yelp-style card by default; an admin
                   can flip a single listing to the standard RealListingCard via
                   the design toggle (item.lbDesignMode === 'classic'). Every
                   other sector is untouched. */
                sectorSlug === 'local-businesses'
                  ? filteredReal.map(item => item.lbDesignMode === 'classic'
                      ? <RealListingCard key={item.id} item={item} color={color} sectorSlug={sectorSlug} />
                      : <LocalBusinessCard key={item.id} item={item} />)
                  : filteredReal.map(item => <RealListingCard key={item.id} item={item} color={color} sectorSlug={sectorSlug || ''} />)
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
