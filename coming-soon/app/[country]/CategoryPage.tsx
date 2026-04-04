'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from '../components/CountryLink'
import { useCountry } from '../config/country-context'
import { fetchCategoryBySlug, fetchLaunchedCategories } from '../iww-hq/data/category-storage'
import type { Category } from '../iww-hq/data/category-storage'
import { fetchCategoryListings } from '../iww-hq/data/submissions-storage'
import type { RealSubmission } from '../iww-hq/data/submissions-storage'
import { fetchAllTagGroups } from '../iww-hq/data/tag-storage'
import type { TagGroup } from '../iww-hq/data/tag-storage'
import { parseSegments, type ParsedCategoryFilters } from './lib-category/parse-segments'
import { buildCategoryUrl } from './lib-category/build-url'
import { lookupLocationCountry, type GeoCountry, type GeoState, type GeoCity } from '../lib/geo-slugs'
import { COUNTRY_LABELS, ROUTE_TO_GEO_SLUG, ROUTE_TO_ISO, ROOT_COUNTRY } from '../config/countries'
import type { CountryCode } from '../config/countries'

import SectorLanding from './sector/SectorLanding'
import { I, ic } from './components-category/icons'
import CategoryHero from './components-category/CategoryHero'
import SubcategoryChips from './components-category/SubcategoryChips'
import FilterSidebar from './components-category/FilterSidebar'
import { DemoListingCard, RealListingCard, type DemoListing } from './components-category/ListingCard'
import Pagination from './components-category/Pagination'
import CompactCta from './components-category/CompactCta'
import TrustSection from './components-category/TrustSection'
import FaqAccordion from './components-category/FaqAccordion'
import PopularSearches from './components-category/PopularSearches'

/* ── Sample listings ── */
const sampleListings: DemoListing[] = [
  { name: 'CloudSync Pro', tagline: 'Enterprise cloud storage and real-time sync for distributed teams', description: 'CloudSync Pro is an enterprise-grade cloud storage platform designed to help distributed teams collaborate in real-time. The platform enables seamless file synchronization across devices with end-to-end encryption, granular access controls, and automated backup scheduling for mission-critical data.', logoIcon: 'cloud', logoColor: '#3B82F6', score: '4.6', stars: 4, reviews: '234', cat: 'Cloud Storage', listingType: 'SaaS Platform', verified: true, features: ['Real-time file sync', 'Team collaboration', 'End-to-end encryption'], website: '#', tags: ['enterprise', 'subscription-saas', 'medium-51-200'] },
  { name: 'NovaByte Analytics', tagline: 'AI-powered business intelligence and data visualization', description: 'NovaByte Analytics is an AI-powered business intelligence platform that transforms raw data into actionable insights. The platform offers custom dashboards, predictive analytics, and automated reporting to help organizations make data-driven decisions faster and more accurately.', logoIcon: 'pieChart', logoColor: '#8B5CF6', score: '4.8', stars: 5, reviews: '189', cat: 'Data Analytics', listingType: 'SaaS Platform', verified: true, features: ['AI-powered insights', 'Custom dashboards', 'Data connectors'], website: '#', tags: ['enterprise', 'subscription-saas', 'large-201-1000'] },
  { name: 'CodeForge IDE', tagline: 'Cloud-based IDE with AI code completion and collaboration', description: 'CodeForge IDE is a cloud-based integrated development environment featuring AI-powered code completion, real-time pair programming, and built-in Git workflows. The platform supports 40+ programming languages and integrates with popular CI/CD pipelines for seamless deployment.', logoIcon: 'code', logoColor: '#14B8A6', score: '4.9', stars: 5, reviews: '421', cat: 'DevOps', listingType: 'Developer Tool', verified: true, features: ['AI code completion', 'Real-time collaboration', 'Git integration'], website: '#', tags: ['startup', 'freemium', 'small-2-10'] },
  { name: 'ShieldVault Security', tagline: 'Enterprise-grade cybersecurity with zero-trust architecture', description: 'ShieldVault Security is an enterprise cybersecurity platform built on zero-trust architecture. It provides real-time threat detection, vulnerability scanning, compliance monitoring, and incident response automation to protect organizations against evolving cyber threats.', logoIcon: 'shield', logoColor: '#2FAE6A', score: '4.5', stars: 4, reviews: '312', cat: 'Cybersecurity', listingType: 'Enterprise Solution', verified: true, features: ['Zero-trust architecture', 'Threat detection', 'Compliance dashboard'], website: '#', tags: ['enterprise', 'custom-pricing', 'large-201-1000'] },
  { name: 'FlowStack CRM', tagline: 'Modern CRM with workflow automation and AI lead scoring', description: 'FlowStack CRM is a modern customer relationship management platform that combines workflow automation with AI-powered lead scoring. The platform helps sales teams prioritize prospects, automate follow-ups, and manage the entire sales pipeline from lead to close.', logoIcon: 'trendingUp', logoColor: '#EC4899', score: '4.7', stars: 5, reviews: '156', cat: 'CRM', listingType: 'SaaS Platform', verified: true, features: ['AI lead scoring', 'Pipeline automation', 'Email campaigns'], website: '#', tags: ['healthcare', 'subscription-saas', 'medium-51-200'] },
  { name: 'PixelBoard Design', tagline: 'Collaborative design platform for product teams and agencies', description: 'PixelBoard Design is a collaborative design platform built for product teams and creative agencies. It offers real-time multiplayer editing, design system management, interactive prototyping, and developer handoff tools — all in one unified workspace.', logoIcon: 'monitor', logoColor: '#F59E0B', score: '4.7', stars: 5, reviews: '287', cat: 'Design Tools', listingType: 'SaaS Platform', verified: true, features: ['Real-time collaboration', 'Design systems', 'Prototyping'], website: '#', tags: ['startup', 'freemium', 'small-2-10'] },
  { name: 'MetrikHQ', tagline: 'Product analytics with session replay and feature flag management', description: 'MetrikHQ is a product analytics platform that combines session replay, feature flag management, and funnel analysis to help product teams understand user behavior. Track events, visualize user journeys, and run A/B experiments — all without writing complex queries.', logoIcon: 'barChart', logoColor: '#6366F1', score: '4.4', stars: 4, reviews: '198', cat: 'Analytics', listingType: 'Developer Tool', verified: true, features: ['Session replay', 'Feature flags', 'Funnel analysis'], website: '#', tags: ['healthcare', 'freemium', 'medium-51-200'] },
  { name: 'BridgeComm', tagline: 'Unified team messaging, video calls, and project boards', description: 'BridgeComm is a unified team communication platform that brings messaging, HD video conferencing, and project management boards into a single workspace. Built for hybrid teams, it offers threaded conversations, screen sharing, and integrations with 100+ business tools.', logoIcon: 'messageCircle', logoColor: '#0EA5E9', score: '4.5', stars: 4, reviews: '342', cat: 'Team Communication', listingType: 'Enterprise Solution', verified: true, features: ['Team messaging', 'HD video calls', 'Project boards'], website: '#', tags: ['enterprise', 'subscription-saas', 'large-201-1000'] },
]

const ITEMS_PER_PAGE = 10

export default function CategoryPage({ segments, sectorSlug }: { segments?: string[]; sectorSlug?: string }) {
  const router = useRouter()
  const siteCountry = useCountry()
  const slug = segments?.[0] || null

  /* ── State ── */
  const [category, setCategory] = useState<Category | null>(null)
  const [allCats, setAllCats] = useState<Category[]>([])
  const [related, setRelated] = useState<Category[]>([])
  const [notFound, setNotFound] = useState(false)
  const [listings, setListings] = useState<RealSubmission[]>([])
  const [listingTotal, setListingTotal] = useState(0)
  const [tagGroups, setTagGroups] = useState<TagGroup[]>([])
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [selectedListingType, setSelectedListingType] = useState<string>('')
  const [sortBy, setSortBy] = useState<'newest' | 'name-az' | 'name-za'>('newest')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)

  /* ── Location state ── */
  const [locationCountry, setLocationCountry] = useState<GeoCountry | null>(null)
  const [locationState, setLocationState] = useState<GeoState | null>(null)
  const [locationCity, setLocationCity] = useState<GeoCity | null>(null)

  /* ── Parse URL segments into filter state ── */
  const [segmentsParsed, setSegmentsParsed] = useState(false)
  useEffect(() => {
    if (!segments?.length || !category) return
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
  }, [segments, category, tagGroups, siteCountry])

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
    const prefix = siteCountry === ROOT_COUNTRY ? '' : `/${siteCountry}`
    router.push(`${prefix}${url}`, { scroll: false })
  }, [slug, locationCountry, locationState, locationCity, selectedListingType, selectedTags, siteCountry, sectorSlug, router])

  /* ── Hide server-side hero once client has mounted ── */
  useEffect(() => {
    const el = document.querySelector('.cd-server-hero')
    if (el) (el as HTMLElement).style.display = 'none'
  }, [])

  /* ── Data fetching — ALL in parallel ── */
  useEffect(() => {
    if (!slug) { setNotFound(true); return }
    // Fire all 3 API calls simultaneously
    const catP = fetchCategoryBySlug(slug)
    const relP = fetchLaunchedCategories()
    const tagP = fetchAllTagGroups()

    catP.then(cat => {
      if (!cat) { setNotFound(true); return }
      setCategory(cat)
      // Fetch listings as soon as we have the category ID
      fetchCategoryListings(cat.id, 1).then(res => { setListings(res.data); setListingTotal(res.total) })
    })
    relP.then(all => {
      setAllCats(all)
      catP.then(cat => {
        if (cat) setRelated(all.filter(c => c.id !== cat.id && ((cat.parentId && c.parentId === cat.parentId) || (!cat.parentId && c.level === cat.level))).slice(0, 9))
      })
    })
    tagP.then(setTagGroups)
  }, [slug])

  /* Re-fetch listings on page change */
  useEffect(() => {
    if (!category || page === 1) return
    fetchCategoryListings(category.id, page).then(res => { setListings(res.data); setListingTotal(res.total) })
  }, [category, page])

  /* ── SEO meta tags ── */
  useEffect(() => {
    if (!category) return
    document.title = `${category.seoTitle || category.name} | InfoWebWorld`
    const setMeta = (n: string, v: string) => {
      let el = document.querySelector(`meta[name="${n}"]`) || document.querySelector(`meta[property="${n}"]`)
      if (!el) { el = document.createElement('meta'); el.setAttribute(n.startsWith('og:') ? 'property' : 'name', n); document.head.appendChild(el) }
      el.setAttribute('content', v)
    }
    setMeta('description', category.seoDescription || category.description)
    if (category.seoKeywords.length) setMeta('keywords', category.seoKeywords.join(', '))
    setMeta('og:title', category.seoTitle || category.name)
    setMeta('og:description', category.seoDescription || category.description)
    if (category.seoOgImage || category.coverImage) setMeta('og:image', category.seoOgImage || category.coverImage)
  }, [category])

  /* ── JSON-LD ── */
  useEffect(() => {
    if (!category) return
    const items: { '@type': string; position: number; name: string; item?: string }[] = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://infowebworld.com' },
      { '@type': 'ListItem', position: 2, name: 'Categories', item: 'https://infowebworld.com/categories' },
    ]
    let pos = 3
    if (category.parentName && category.parentSlug) {
      const parentUrl = category.level === 3 && sectorSlug
        ? `https://infowebworld.com/${sectorSlug}/${category.parentSlug}`
        : `https://infowebworld.com/${category.parentSlug}`
      items.push({ '@type': 'ListItem', position: pos++, name: category.parentName, item: parentUrl })
    }
    items.push({ '@type': 'ListItem', position: pos, name: category.name })

    const desc = category.seoDescription || category.description || `Explore top ${category.name} businesses on InfoWebWorld.`
    const faqEntries = [
      { q: `What is ${category.name}?`, a: desc },
      { q: `How to find the best ${category.name} companies?`, a: `Browse verified ${category.name} companies on InfoWebWorld, compare services, read reviews, and connect directly.` },
      { q: `Is it free to list my ${category.name} business?`, a: 'Yes, InfoWebWorld offers free business listing with optional premium plans for enhanced visibility.' },
      { q: `How are ${category.name} companies ranked?`, a: 'Rankings are based on verified reviews, user satisfaction scores, and market presence. Our team verifies every listing.' },
      { q: `Can I compare ${category.name} solutions?`, a: `Yes! Use our comparison tools to evaluate ${category.name} solutions side by side across features, pricing, and satisfaction scores.` },
    ]

    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.id = 'schema-category-breadcrumb'
    s1.text = JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items })
    document.head.appendChild(s1)

    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.id = 'schema-category-faq'
    s2.text = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqEntries.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) })
    document.head.appendChild(s2)

    return () => { document.getElementById('schema-category-breadcrumb')?.remove(); document.getElementById('schema-category-faq')?.remove() }
  }, [category])

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

  /* ── Filtering ── */
  const filteredDemo = useMemo(() => {
    let r = [...sampleListings]
    if (selectedListingType) r = r.filter(i => i.listingType.toLowerCase().replace(/\s+/g, '-') === selectedListingType)
    if (selectedTags.size > 0) {
      const byGroup = new Map<string, Set<string>>()
      for (const ts of selectedTags) for (const g of tagGroups) { if (g.tags.find(t => t.slug === ts)) { if (!byGroup.has(g.id)) byGroup.set(g.id, new Set()); byGroup.get(g.id)!.add(ts); break } }
      r = r.filter(i => { for (const [, gt] of byGroup) if (!Array.from(gt).some(t => i.tags.includes(t))) return false; return true })
    }
    if (sortBy === 'name-az') r.sort((a, b) => a.name.localeCompare(b.name))
    else if (sortBy === 'name-za') r.sort((a, b) => b.name.localeCompare(a.name))
    return r
  }, [selectedListingType, selectedTags, sortBy, tagGroups])

  const filteredReal = useMemo(() => {
    let r = [...listings]
    if (selectedListingType) r = r.filter(i => i.listingTypeSlug === selectedListingType)
    if (sortBy === 'name-az') r.sort((a, b) => a.companyName.localeCompare(b.companyName))
    else if (sortBy === 'name-za') r.sort((a, b) => b.companyName.localeCompare(a.companyName))
    return r
  }, [listings, selectedListingType, sortBy])

  const demoLTCounts = useMemo(() => { const m = new Map<string, number>(); sampleListings.forEach(i => { const s = i.listingType.toLowerCase().replace(/\s+/g, '-'); m.set(s, (m.get(s) || 0) + 1) }); return m }, [])
  const demoLTs = useMemo(() => { const m = new Map<string, string>(); sampleListings.forEach(i => { const s = i.listingType.toLowerCase().replace(/\s+/g, '-'); if (!m.has(s)) m.set(s, i.listingType) }); return Array.from(m.entries()).map(([slug, name]) => ({ slug, name })) }, [])
  const demoTagCounts = useMemo(() => { const m = new Map<string, number>(); sampleListings.forEach(i => i.tags.forEach(t => m.set(t, (m.get(t) || 0) + 1))); return m }, [])

  /* ── Pagination (before early returns — Rules of Hooks) ── */
  const demoPaginated = useMemo(() => {
    const s = (page - 1) * ITEMS_PER_PAGE
    return filteredDemo.slice(s, s + ITEMS_PER_PAGE)
  }, [filteredDemo, page])

  const faqs = useMemo(() => {
    if (!category) return []
    const n = category.name, d = category.description || `${n} encompasses businesses and solutions that help organizations succeed.`
    return [
      { q: `What is ${n}?`, a: d },
      { q: `How do I find the best ${n} companies?`, a: `Browse verified ${n} companies on InfoWebWorld. Use filters to narrow by listing type, features, and tags.` },
      { q: `Is it free to list my ${n} business?`, a: 'Yes, InfoWebWorld offers a free listing option. Premium plans are available for enhanced visibility and a verified badge.' },
      { q: `How are ${n} companies ranked?`, a: 'Rankings are based on verified reviews, satisfaction scores, and market presence. Our team verifies every listing.' },
      { q: `Can I compare ${n} solutions?`, a: `Yes! Compare ${n} solutions across features, pricing, satisfaction scores, and more.` },
    ]
  }, [category])

  const popularSearches = useMemo(() => {
    if (!category) return []
    const pills: { name: string; href: string }[] = []
    const sp = sectorSlug ? `/${sectorSlug}` : ''
    for (const sc of (category.subcategories || []).slice(0, 8)) pills.push({ name: sc.name, href: `${sp}/${sc.slug}` })
    for (const lt of (category.listingTypes || []).slice(0, 4)) pills.push({ name: lt.name, href: `${sp}/${category.slug}?type=${lt.slug}` })
    return pills
  }, [category])

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
    return <SectorLanding category={category} allCategories={allCats} />
  }

  const c = category
  const color = c.color || '#E8553D'
  const subcats = c.subcategories || []
  const hasListings = c.listingCount > 0 || listings.length > 0
  const isL3 = c.level === 3
  const showFilters = true
  const ltFromCat = c.listingTypes || []
  const sidebarLTs = ltFromCat.length > 0 ? ltFromCat : demoLTs.map(lt => ({ id: lt.slug, name: lt.name, slug: lt.slug }))
  const getLTCount = (s: string) => hasListings ? listings.filter(l => l.listingTypeSlug === s).length : demoLTCounts.get(s) || 0
  const totalCount = hasListings ? filteredReal.length : filteredDemo.length
  const totalPages = hasListings ? Math.max(1, Math.ceil(listingTotal / ITEMS_PER_PAGE)) : Math.max(1, Math.ceil(filteredDemo.length / ITEMS_PER_PAGE))
  const hasAnyFilter = selectedTags.size > 0 || !!selectedListingType || !!locationCountry

  return (
    <section className="cd-page">
      <div className="cd-wrap">

        <CategoryHero
          category={c}
          sectorSlug={sectorSlug}
          locationCountry={locationCountry}
          locationState={locationState}
          locationCity={locationCity}
          onLocationCountryChange={handleLocationCountryChange}
          onStateChange={handleStateChange}
          onCityChange={handleCityChange}
          onLocationChange={handleLocationChange}
        />
        <SubcategoryChips subcategories={subcats} sectorSlug={sectorSlug} />

        {/* Filter pills row (mobile) */}
        {showFilters && (
          <button
            className="cd-filter-btn"
            onClick={() => setSidebarOpen(true)}
          >
            <I d={ic.sliders} size={14} color={color} sw={2} />
            All filters
            {hasAnyFilter && (
              <span className="cd-filter-badge" style={{ background: color }}>
                {selectedTags.size + (selectedListingType ? 1 : 0) + (locationCountry ? 1 : 0) + (locationState ? 1 : 0) + (locationCity ? 1 : 0)}
              </span>
            )}
          </button>
        )}

        {/* Main layout: sidebar + listings */}
        <div className={showFilters ? 'cd-layout cd-layout--with-filters' : 'cd-layout'}>

          {/* Left filter sidebar (L2+L3, desktop only) */}
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
              totalAllCount={hasListings ? listings.length : sampleListings.length}
              totalFilteredCount={totalCount}
              hasListings={hasListings}
              demoTagCounts={demoTagCounts}
              locationCountry={locationCountry}
              locationState={locationState}
              locationCity={locationCity}
              onLocationCountryChange={handleLocationCountryChange}
              onStateChange={handleStateChange}
              onCityChange={handleCityChange}
              effectiveIso={locationCountry?.isoCode || ROUTE_TO_ISO[siteCountry as CountryCode] || ''}
            />
          )}

          {/* Center: toolbar + listings + pagination */}
          <div>
            {/* Toolbar */}
            <div className="cd-toolbar">
              <span className="cd-toolbar-count">
                Companies (<strong>{totalCount}</strong>)
                {!hasListings && <span className="cd-toolbar-demo">(Preview)</span>}
              </span>
              <label className="cd-toolbar-sort">
                Sort by:
                <select
                  className="cd-toolbar-select"
                  value={sortBy}
                  onChange={e => { setSortBy(e.target.value as typeof sortBy); setPage(1) }}
                >
                  <option value="newest">Most relevant</option>
                  <option value="name-az">Name A-Z</option>
                  <option value="name-za">Name Z-A</option>
                </select>
              </label>
            </div>

            {/* Listing cards */}
            <div>
              {!hasListings ? (
                demoPaginated.length > 0 ? (
                  demoPaginated.map((item, i) => <DemoListingCard key={i} item={item} isPreview allItems={sampleListings} />)
                ) : (
                  <div className="cd-empty">
                    <I d={ic.search} size={32} color="var(--h-muted)" sw={1.5} />
                    <p>No listings match your filters.</p>
                    <button onClick={clearFilters} className="cd-empty-btn" style={{ color }}>Clear all filters</button>
                  </div>
                )
              ) : (
                filteredReal.length > 0 ? (
                  filteredReal.map(item => <RealListingCard key={item.id} item={item} color={color} />)
                ) : (
                  <div className="cd-empty">
                    <I d={ic.search} size={32} color="var(--h-muted)" sw={1.5} />
                    <p>No listings match your filters.</p>
                    <button onClick={clearFilters} className="cd-empty-btn" style={{ color }}>Clear all filters</button>
                  </div>
                )
              )}
            </div>

            {/* Preview fade */}
            {!hasListings && demoPaginated.length > 0 && (
              <div className="cd-preview-fade">
                <p className="cd-preview-text">Preview of how <strong>{c.name}</strong> will look on InfoWebWorld</p>
                <Link href={`/business?category=${encodeURIComponent(c.name)}`} className="cd-preview-btn" style={{ background: color, borderColor: color }}>
                  <I d={ic.plus} size={15} color="#fff" sw={2.5} /> Be the First to List Here
                </Link>
              </div>
            )}

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} color={color} />
          </div>

        </div>

        <CompactCta categoryName={c.name} spotsLeft={200 - c.listingCount} color={color} />
        <PopularSearches searches={popularSearches} />
        <FaqAccordion faqs={faqs} />
        <TrustSection color={color} />

        <Link href="/categories" className="cd-back-link" style={{ color }}>
          <I d={ic.arrowLeft} size={14} color={color} sw={2} /> Back to Categories
        </Link>
      </div>
    </section>
  )
}
