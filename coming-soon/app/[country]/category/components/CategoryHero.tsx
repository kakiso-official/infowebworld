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

      {/* Description */}
      <p className="cd-hero-desc">
        {c.description || `Discover and compare the best ${c.name} businesses and software. Read verified reviews, compare features, and find the right solution.`}
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
