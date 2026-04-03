'use client'
import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import Link from '../../../components/CountryLink'
import { useCountry } from '../../../config/country-context'
import { COUNTRY_LABELS, ROUTE_TO_GEO_SLUG, ROUTE_TO_ISO } from '../../../config/countries'
import type { CountryCode } from '../../../config/countries'
import type { Category } from '../../../iww-hq/data/category-storage'
import {
  getLocationCountries,
  getStates,
  getCities,
  lookupLocationCountry,
  type GeoCountry,
  type GeoState,
  type GeoCity,
} from '../../../lib/geo-slugs'
import { I, ic } from './icons'

type Props = {
  category: Category
  locationCountry: GeoCountry | null
  locationState: GeoState | null
  locationCity: GeoCity | null
  onLocationCountryChange: (val: GeoCountry | null) => void
  onStateChange: (val: GeoState | null) => void
  onCityChange: (val: GeoCity | null) => void
}

/* ── Inline dropdown that looks like part of the heading ── */
function InlineSelect({ id, value, placeholder, items, onSelect, color, openId, onOpen }: {
  id: string
  value: string
  placeholder: string
  items: { slug: string; name: string }[]
  onSelect: (slug: string) => void
  color: string
  openId: string | null
  onOpen: (id: string | null) => void
}) {
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isOpen = openId === id

  useEffect(() => {
    if (!isOpen) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOpen(null)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [isOpen, onOpen])

  useEffect(() => { if (isOpen && inputRef.current) inputRef.current.focus() }, [isOpen])

  const filtered = search ? items.filter(i => i.name.toLowerCase().includes(search.toLowerCase())) : items

  return (
    <span className="cd-hero-inline-select" ref={ref}>
      <button
        type="button"
        className="cd-hero-inline-btn"
        style={{ borderColor: isOpen ? color : undefined }}
        onClick={() => { onOpen(isOpen ? null : id); setSearch('') }}
      >
        <span className="cd-hero-inline-value">{value || placeholder}</span>
        <I d={ic.chevronDown} size={16} color={color} sw={2.5} />
      </button>
      {isOpen && (
        <div className="cd-hero-inline-dropdown" style={{ zIndex: 9999 }}>
          <div className="cd-hero-inline-search-wrap">
            <I d={ic.search} size={13} color="var(--h-muted)" sw={2} />
            <input
              ref={inputRef}
              className="cd-hero-inline-search"
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="cd-hero-inline-list">
            {filtered.map(item => (
              <button
                key={item.slug}
                type="button"
                className={`cd-hero-inline-option${item.name === value ? ' cd-hero-inline-option--active' : ''}`}
                style={item.name === value ? { background: `${color}10`, color } : undefined}
                onClick={() => { onSelect(item.slug); onOpen(null); setSearch('') }}
              >
                {item.name}
              </button>
            ))}
            {filtered.length === 0 && <div className="cd-hero-inline-empty">{items.length === 0 ? `Select ${placeholder === 'City' ? 'state' : 'country'} first` : 'No results'}</div>}
          </div>
        </div>
      )}
    </span>
  )
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

export default function CategoryHero({ category: c, locationCountry, locationState, locationCity, onLocationCountryChange, onStateChange, onCityChange }: Props) {
  const siteCountry = useCountry()

  /* Only one dropdown open at a time */
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const handleOpen = useCallback((id: string | null) => setOpenDropdown(id), [])

  /* Resolve route country to a GeoCountry */
  const routeGeoCountry = useMemo(() => {
    const geoSlug = ROUTE_TO_GEO_SLUG[siteCountry as CountryCode]
    if (!geoSlug) return null
    return lookupLocationCountry(geoSlug)
  }, [siteCountry])

  /* effectiveCountry: explicit selection > route country fallback */
  const effectiveCountry = useMemo(() => {
    return locationCountry || routeGeoCountry
  }, [locationCountry, routeGeoCountry])

  /* Stable ISO code for state/city lookups */
  const effectiveIso = effectiveCountry?.isoCode || ROUTE_TO_ISO[siteCountry as CountryCode] || ''

  const countries = useMemo(() => {
    const arr: { slug: string; name: string }[] = []
    getLocationCountries().forEach(c => arr.push({ slug: c.slug, name: c.name }))
    arr.sort((a, b) => a.name.localeCompare(b.name))
    return arr
  }, [])

  const states = useMemo(() => {
    if (!effectiveIso) return []
    const arr: { slug: string; name: string; stateCode: string }[] = []
    getStates(effectiveIso).forEach(s => arr.push({ slug: s.slug, name: s.name, stateCode: s.stateCode }))
    arr.sort((a, b) => a.name.localeCompare(b.name))
    return arr
  }, [effectiveIso])

  const cities = useMemo(() => {
    if (!effectiveIso || !locationState) return []
    const arr: { slug: string; name: string }[] = []
    getCities(effectiveIso, locationState.stateCode).forEach(c => arr.push({ slug: c.slug, name: c.name }))
    arr.sort((a, b) => a.name.localeCompare(b.name))
    return arr
  }, [effectiveIso, locationState])

  const handleCountrySelect = (slug: string) => {
    const found = lookupLocationCountry(slug)
    if (found) onLocationCountryChange(found)
  }
  const handleStateSelect = (slug: string) => {
    if (!effectiveIso) return
    const s = getStates(effectiveIso).get(slug)
    if (s) onStateChange(s)
  }
  const handleCitySelect = (slug: string) => {
    if (!effectiveIso || !locationState) return
    const ct = getCities(effectiveIso, locationState.stateCode).get(slug)
    if (ct) onCityChange(ct)
  }

  const countryDisplayName = effectiveCountry?.name || COUNTRY_LABELS[siteCountry as CountryCode] || ''

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
            <Link href={`/category/${c.parentSlug}`}>{c.parentName}</Link>
          </>
        )}
        <span className="cd-breadcrumb-sep">&gt;</span>
        <span className="cd-breadcrumb-current">{c.name}</span>
      </nav>

      {/* Title with inline location dropdowns */}
      <h1 className="cd-hero-title">
        Best in {c.name}{' '}
        <InlineSelect
          id="country"
          value={countryDisplayName}
          placeholder="Country"
          items={countries}
          onSelect={handleCountrySelect}
          color="var(--h-accent)"
          openId={openDropdown}
          onOpen={handleOpen}
        />
        {', '}
        <InlineSelect
          id="state"
          value={locationState?.name || ''}
          placeholder="State"
          items={states}
          onSelect={handleStateSelect}
          color="#8B5CF6"
          openId={openDropdown}
          onOpen={handleOpen}
        />
        {', '}
        <InlineSelect
          id="city"
          value={locationCity?.name || ''}
          placeholder="City"
          items={cities}
          onSelect={handleCitySelect}
          color="#14B8A6"
          openId={openDropdown}
          onOpen={handleOpen}
        />
      </h1>

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
