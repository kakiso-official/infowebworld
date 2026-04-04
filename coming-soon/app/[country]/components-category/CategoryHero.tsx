'use client'
import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import Link from '../../components/CountryLink'
import { useCountry } from '../../config/country-context'
import { COUNTRY_LABELS, ROUTE_TO_GEO_SLUG, ROUTE_TO_ISO } from '../../config/countries'
import type { CountryCode } from '../../config/countries'
import type { Category } from '../../iww-hq/data/category-storage'
import {
  getLocationCountries,
  getStates,
  getCities,
  lookupLocationCountry,
  getAllStatesArray,
  getAllCitiesArray,
  toSlug,
  type GeoCountry,
  type GeoState,
  type GeoCity,
} from '../../lib/geo-slugs'
import { I, ic } from './icons'

type Props = {
  category: Category
  sectorSlug?: string
  locationCountry: GeoCountry | null
  locationState: GeoState | null
  locationCity: GeoCity | null
  onLocationCountryChange: (val: GeoCountry | null) => void
  onStateChange: (val: GeoState | null) => void
  onCityChange: (val: GeoCity | null) => void
  onLocationChange?: (country: GeoCountry | null, state: GeoState | null, city: GeoCity | null) => void
}

/* ── Location search result types ── */
type LocResult = {
  type: 'country' | 'state' | 'city'
  name: string
  slug: string
  meta: string // e.g. "Gujarat, India" for a city
  isoCode?: string
  stateCode?: string
  countrySlug?: string
  stateSlug?: string
}

/* ── Dynamic SEO description generator ── */
function generateCategoryDesc(
  name: string,
  level: number,
  parentName: string | undefined,
  listingCount: number,
  subCount: number,
  locationCountryName: string,
  stateName: string,
  cityName: string,
): string {
  const year = new Date().getFullYear()
  const month = ['January','February','March','April','May','June','July','August','September','October','November','December'][new Date().getMonth()]

  // Build location fragments
  const fullLoc = cityName && stateName
    ? `${cityName}, ${stateName}, ${locationCountryName}`
    : cityName && locationCountryName
    ? `${cityName}, ${locationCountryName}`
    : stateName && locationCountryName
    ? `${stateName}, ${locationCountryName}`
    : locationCountryName || ''
  const shortLoc = cityName || stateName || locationCountryName || ''

  const inFull = fullLoc ? ` in ${fullLoc}` : ''
  const inShort = shortLoc ? ` in ${shortLoc}` : ''
  const forLoc = shortLoc ? ` for businesses in ${shortLoc}` : ''
  const nearYou = shortLoc ? ` near you in ${shortLoc}` : ''

  // Count fragments
  const count = listingCount > 0 ? listingCount : null
  const countBadge = count ? `${count}+` : ''
  const countVerified = count ? `${count}+ verified` : 'verified'
  const browseCount = count ? `Browse ${count}+ listings` : 'Browse listings'

  // Sector / parent fragments
  const sector = parentName || ''
  const inSector = sector ? ` in the ${sector} industry` : ''
  const sectorTag = sector ? ` — a key segment of ${sector}` : ''

  // Subcategory fragments
  const subText = subCount > 0 ? `, spanning ${subCount} specialized subcategories` : ''
  const subSentence = subCount > 0 ? ` Explore ${subCount} subcategories to narrow down exactly what you need.` : ''

  // Deterministic template picker
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0
  const pick = Math.abs(hash)

  if (level >= 3) {
    const templates = [
      `Looking for the best ${name} companies${inFull}? InfoWebWorld lists ${countVerified} ${name} providers${inSector} — each with detailed profiles, genuine user reviews, pricing transparency, and direct contact options. Whether you're a startup or an enterprise, compare solutions side by side and connect with the right partner. Last updated ${month} ${year}.`,

      `${name}${sectorTag}. ${browseCount}${inShort} with real customer reviews, feature breakdowns, and satisfaction scores. Every listing on InfoWebWorld is manually verified so you can shortlist, compare, and reach out to ${name} providers${forLoc} with confidence. Free to use, no sign-up required.`,

      `Find ${countVerified} ${name} solutions${inFull}. InfoWebWorld makes it easy to compare ${name} companies${inSector} by features, pricing, reviews, and ratings — all on one page. Read what real users say, check verified credentials, and request quotes directly. Your search for the right ${name} partner starts here. Updated ${month} ${year}.`,

      `The most comprehensive directory of ${name} providers${inFull}. ${countBadge ? `With ${countBadge} verified listings` : 'With verified listings'}${inSector}, InfoWebWorld helps you evaluate every option — from feature sets and integrations to pricing models and customer support. Compare, review, and choose the best ${name} solution for your needs.`,

      `Why waste hours researching ${name} companies? InfoWebWorld curates ${countVerified} providers${inShort}${inSector}, complete with user reviews, feature comparisons, and trust scores. Filter by location, budget, or specialization — then connect directly. No middlemen, no hidden fees. Updated for ${month} ${year}.`,

      `${name}${inFull} — your definitive comparison guide. We've gathered ${countVerified} providers${inSector} with honest reviews from real customers, transparent pricing, and detailed capability breakdowns. Whether you need a full-service agency or a specialized tool, find and compare the best ${name} options in minutes.`,
    ]
    return templates[pick % templates.length]
  }

  // L2 categories
  const templates = [
    `Explore the top ${name} companies${inFull}${subText}. InfoWebWorld brings you ${countVerified} listings with in-depth profiles, authentic user reviews, feature comparisons, and pricing details — everything you need to make a smart decision. Compare solutions across ${name}${inSector} and connect with trusted providers directly.${subSentence} Updated ${month} ${year}.`,

    `${name}${inFull} — discover ${countVerified} businesses${subText}. From emerging startups to established leaders${inSector}, every listing on InfoWebWorld is vetted for quality. Read real reviews, compare capabilities side by side, filter by ratings or budget, and request proposals — all for free.${subSentence} Last updated ${month} ${year}.`,

    `Your complete guide to ${name}${inShort}. ${browseCount}${subText}${inSector}, each with verified reviews, transparent pricing, and detailed feature breakdowns. InfoWebWorld helps businesses and individuals find the right ${name} partner — whether you're comparing enterprise platforms or boutique agencies.${subSentence}`,

    `Find and compare the best ${name} providers${inFull}. ${countBadge ? `${countBadge} verified companies` : 'Verified companies'}${subText} — all reviewed by real users. InfoWebWorld's ${name} directory${inSector} lets you filter by specialization, location, pricing, and ratings to build your shortlist in minutes.${subSentence} Updated for ${year}.`,

    `Need ${name} services${forLoc}? InfoWebWorld is the largest curated directory of ${name} providers${inSector}${subText}. Every listing includes verified reviews, feature matrices, pricing tiers, and direct contact — so you can evaluate, compare, and choose with zero guesswork.${subSentence} Trusted by thousands. Updated ${month} ${year}.`,

    `The definitive ${name} directory${inFull}. ${browseCount}${subText}${inSector} with side-by-side comparisons, satisfaction scores, and genuine user feedback. Whether you're scaling a team, launching a project, or switching providers — InfoWebWorld gives you the data to decide. Free, transparent, and always up to date.${subSentence}`,
  ]
  return templates[pick % templates.length]
}

export default function CategoryHero({ category: c, sectorSlug, locationCountry, locationState, locationCity, onLocationCountryChange, onStateChange, onCityChange, onLocationChange }: Props) {
  const siteCountry = useCountry()
  const [locQuery, setLocQuery] = useState('')
  const [locOpen, setLocOpen] = useState(false)
  const locRef = useRef<HTMLDivElement>(null)
  const locInputRef = useRef<HTMLInputElement>(null)

  /* Resolve route country to a GeoCountry */
  const routeGeoCountry = useMemo(() => {
    const geoSlug = ROUTE_TO_GEO_SLUG[siteCountry as CountryCode]
    if (!geoSlug) return null
    return lookupLocationCountry(geoSlug)
  }, [siteCountry])

  const effectiveCountry = useMemo(() => locationCountry || routeGeoCountry, [locationCountry, routeGeoCountry])
  const effectiveIso = effectiveCountry?.isoCode || ROUTE_TO_ISO[siteCountry as CountryCode] || ''

  /* ── Debounced search query ── */
  const [debouncedQ, setDebouncedQ] = useState('')
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(locQuery.trim().toLowerCase()), 200)
    return () => clearTimeout(t)
  }, [locQuery])

  /* ── Pre-build state name index (once, cached) ── */
  const stateIndex = useMemo(() => {
    const idx = new Map<string, string>() // "ISO:stateCode" → stateName
    getAllStatesArray().forEach(s => idx.set(`${s.isoCode}:${s.stateCode}`, s.name))
    return idx
  }, [])

  const countryNameByIso = useMemo(() => {
    const m = new Map<string, string>()
    getLocationCountries().forEach(c => m.set(c.isoCode, c.name))
    return m
  }, [])

  /* ── Location search results — ALL countries, states, cities ── */
  const locResults = useMemo((): LocResult[] => {
    const q = debouncedQ
    if (!q || q.length < 2) return []

    const ql = q.toLowerCase()
    const countries: LocResult[] = []
    const states: LocResult[] = []
    const cities: LocResult[] = []

    // ─ Countries (250 — instant)
    getLocationCountries().forEach(c => {
      if (c.name.toLowerCase().includes(ql)) {
        countries.push({ type: 'country', name: c.name, slug: c.slug, meta: '', isoCode: c.isoCode })
      }
    })
    countries.sort((a, b) => {
      const ap = a.name.toLowerCase().startsWith(ql) ? 0 : 1
      const bp = b.name.toLowerCase().startsWith(ql) ? 0 : 1
      return ap - bp || a.name.localeCompare(b.name)
    })

    // ─ States (~5K — instant). Effective country first, then rest.
    const allSt = getAllStatesArray()
    const localStates: LocResult[] = []
    const otherStates: LocResult[] = []
    for (const s of allSt) {
      if (localStates.length + otherStates.length >= 30) break
      if (s.name.toLowerCase().includes(ql)) {
        const cSlug = lookupLocationCountry(toSlug(s.countryName))?.slug
        const item: LocResult = { type: 'state', name: s.name, slug: s.slug, meta: s.countryName, isoCode: s.isoCode, stateCode: s.stateCode, countrySlug: cSlug }
        if (s.isoCode === effectiveIso) localStates.push(item); else otherStates.push(item)
      }
    }
    localStates.sort((a, b) => (a.name.toLowerCase().startsWith(ql) ? 0 : 1) - (b.name.toLowerCase().startsWith(ql) ? 0 : 1) || a.name.localeCompare(b.name))
    states.push(...localStates, ...otherStates)

    // ─ Cities (~148K — cached array, ~10ms scan). Collect local + global separately.
    const allCities = getAllCitiesArray()
    const localCities: typeof allCities[number][] = []
    const globalCities: typeof allCities[number][] = []
    for (const ct of allCities) {
      if (localCities.length >= 15 && globalCities.length >= 15) break
      if (ct.name.toLowerCase().includes(ql)) {
        if (ct.countryCode === effectiveIso) { if (localCities.length < 15) localCities.push(ct) }
        else { if (globalCities.length < 15) globalCities.push(ct) }
      }
    }
    // Sort each: prefix first, then alpha
    const sortCities = (arr: typeof allCities) => arr.sort((a, b) => {
      const ap = a.name.toLowerCase().startsWith(ql) ? 0 : 1
      const bp = b.name.toLowerCase().startsWith(ql) ? 0 : 1
      return ap - bp || a.name.localeCompare(b.name)
    })
    sortCities(localCities)
    sortCities(globalCities)
    const merged = [...localCities, ...globalCities]

    for (const ct of merged.slice(0, 15)) {
      const cName = countryNameByIso.get(ct.countryCode) || ct.countryCode
      const sName = stateIndex.get(`${ct.countryCode}:${ct.stateCode}`) || ct.stateCode
      const cSlug = lookupLocationCountry(toSlug(cName))?.slug
      cities.push({
        type: 'city', name: ct.name, slug: toSlug(ct.name),
        meta: `${sName}, ${cName}`,
        isoCode: ct.countryCode, stateCode: ct.stateCode,
        stateSlug: toSlug(sName), countrySlug: cSlug,
      })
    }

    // Deduplicate
    const seen = new Set<string>()
    const dedup = (arr: LocResult[]) => arr.filter(r => {
      const k = `${r.type}:${r.name}:${r.meta}`
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })

    return [...dedup(countries).slice(0, 6), ...dedup(states).slice(0, 8), ...dedup(cities).slice(0, 10)]
  }, [debouncedQ, effectiveIso, stateIndex, countryNameByIso])

  /* ── Handle selection — resolve all 3 levels, push once ── */
  const handleLocSelect = useCallback((r: LocResult) => {
    let country: GeoCountry | null = null
    let state: GeoState | null = null
    let city: GeoCity | null = null

    // Resolve country
    if (r.countrySlug) {
      country = lookupLocationCountry(r.countrySlug)
    } else if (r.isoCode) {
      getLocationCountries().forEach(c => { if (c.isoCode === r.isoCode) country = c })
    }

    // Resolve state (for state/city selections)
    if (r.type === 'state' || r.type === 'city') {
      if (r.isoCode && r.type === 'state') {
        state = getStates(r.isoCode).get(r.slug) || null
      } else if (r.isoCode && r.stateSlug) {
        state = getStates(r.isoCode).get(r.stateSlug) || null
      }
    }

    // Resolve city
    if (r.type === 'city' && r.isoCode && r.stateCode) {
      city = getCities(r.isoCode, r.stateCode).get(r.slug) || null
    }

    // Single atomic update — URL pushes once with all values
    if (onLocationChange) {
      onLocationChange(country, state, city)
    } else {
      // Fallback: use individual handlers
      if (country) onLocationCountryChange(country)
      if (state) onStateChange(state)
      if (city) onCityChange(city)
    }

    setLocQuery('')
    setLocOpen(false)
  }, [onLocationChange, onLocationCountryChange, onStateChange, onCityChange])

  /* ── Close on outside click or Escape ── */
  useEffect(() => {
    if (!locOpen) return
    const onClick = (e: MouseEvent) => {
      if (locRef.current && !locRef.current.contains(e.target as Node)) setLocOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLocOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey) }
  }, [locOpen])

  /* ── Location display text ── */
  const countryDisplayName = effectiveCountry?.name || COUNTRY_LABELS[siteCountry as CountryCode] || ''
  const locationText = [locationCity?.name, locationState?.name, countryDisplayName].filter(Boolean).join(', ')

  /* ── Clear location ── */
  const clearLocation = () => {
    if (onLocationChange) {
      onLocationChange(null, null, null)
    } else {
      onLocationCountryChange(null)
    }
  }

  return (
    <div className="cd-hero">
      {/* Breadcrumb */}
      <nav className="cd-breadcrumb">
        <Link href="/">Home</Link>
        <span className="cd-breadcrumb-sep">&gt;</span>
        <Link href="/categories">Categories</Link>
        {c.parentName && c.parentSlug && (
          <>
            <span className="cd-breadcrumb-sep">&gt;</span>
            <Link href={c.level === 3 && sectorSlug ? `/${sectorSlug}/${c.parentSlug}` : `/${c.parentSlug}`}>{c.parentName}</Link>
          </>
        )}
        <span className="cd-breadcrumb-sep">&gt;</span>
        <span className="cd-breadcrumb-current">{c.name}</span>
      </nav>

      {/* Title with location text */}
      <h1 className="cd-hero-title">
        Best in {c.name} in {locationText}
      </h1>

      {/* Location search bar */}
      <div className="cd-loc-search" ref={locRef}>
        <div className="cd-loc-bar">
          <I d={ic.search} size={16} color="var(--h-muted)" sw={2} />
          <input
            ref={locInputRef}
            className="cd-loc-input"
            placeholder="Search country, state, or city..."
            value={locQuery}
            onChange={e => { setLocQuery(e.target.value); setLocOpen(true) }}
            onFocus={() => { if (locQuery.length >= 2) setLocOpen(true) }}
          />
          {(locationCity || locationState || locationCountry) && (
            <button type="button" className="cd-loc-clear" onClick={clearLocation} title="Clear location">
              <I d={ic.x} size={14} color="var(--h-muted)" sw={2} />
            </button>
          )}
        </div>
        {locOpen && debouncedQ.length >= 2 && locResults.length === 0 && (
          <div className="cd-loc-dropdown">
            <div className="cd-loc-empty">No locations found for &ldquo;{debouncedQ}&rdquo;</div>
          </div>
        )}
        {locOpen && locResults.length > 0 && (
          <div className="cd-loc-dropdown">
            {/* Countries */}
            {locResults.some(r => r.type === 'country') && (
              <>
                <div className="cd-loc-group-label">Countries</div>
                {locResults.filter(r => r.type === 'country').map(r => (
                  <button key={`c-${r.slug}`} type="button" className="cd-loc-option" onClick={() => handleLocSelect(r)}>
                    <span className="cd-loc-option-name">{r.name}</span>
                  </button>
                ))}
              </>
            )}
            {/* States */}
            {locResults.some(r => r.type === 'state') && (
              <>
                <div className="cd-loc-group-label">States</div>
                {locResults.filter(r => r.type === 'state').map(r => (
                  <button key={`s-${r.slug}-${r.isoCode}`} type="button" className="cd-loc-option" onClick={() => handleLocSelect(r)}>
                    <span className="cd-loc-option-name">{r.name}</span>
                    <span className="cd-loc-option-meta">{r.meta}</span>
                  </button>
                ))}
              </>
            )}
            {/* Cities */}
            {locResults.some(r => r.type === 'city') && (
              <>
                <div className="cd-loc-group-label">Cities</div>
                {locResults.filter(r => r.type === 'city').map(r => (
                  <button key={`ct-${r.slug}-${r.stateCode}`} type="button" className="cd-loc-option" onClick={() => handleLocSelect(r)}>
                    <span className="cd-loc-option-name">{r.name}</span>
                    <span className="cd-loc-option-meta">{r.meta}</span>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Description — dynamic per category + location */}
      <p className="cd-hero-desc">
        {c.description || generateCategoryDesc(
          c.name,
          c.level,
          c.parentName,
          c.listingCount,
          c.subcategories?.length ?? 0,
          countryDisplayName,
          locationState?.name || '',
          locationCity?.name || '',
        )}
      </p>

      {/* Stat pills */}
      <div className="cd-hero-pills">
        <span className="cd-hero-pill">
          <strong style={{ color: 'var(--h-accent)' }}>{c.listingCount || 0}</strong> companies
        </span>
        {(c.subcategories?.length ?? 0) > 0 && (
          <span className="cd-hero-pill">
            <strong style={{ color: '#8B5CF6' }}>{c.subcategories!.length}</strong> subcategories
          </span>
        )}
      </div>
    </div>
  )
}
