'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import Link from '../../../components/CountryLink'
import { useCountry } from '../../../config/country-context'
import { COUNTRY_LABELS } from '../../../config/countries'
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
function InlineSelect({ value, placeholder, items, onSelect, color }: {
  value: string
  placeholder: string
  items: { slug: string; name: string }[]
  onSelect: (slug: string) => void
  color: string
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  useEffect(() => { if (open && inputRef.current) inputRef.current.focus() }, [open])

  const filtered = search ? items.filter(i => i.name.toLowerCase().includes(search.toLowerCase())) : items

  return (
    <span className="cd-hero-inline-select" ref={ref}>
      <button
        type="button"
        className="cd-hero-inline-btn"
        style={{ borderColor: open ? color : undefined }}
        onClick={() => { setOpen(!open); setSearch('') }}
      >
        <span className="cd-hero-inline-value">{value || placeholder}</span>
        <I d={ic.chevronDown} size={16} color={color} sw={2.5} />
      </button>
      {open && (
        <div className="cd-hero-inline-dropdown">
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
                onClick={() => { onSelect(item.slug); setOpen(false); setSearch('') }}
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

  // Auto-set country from site prefix if none selected
  const siteCountryLabel = COUNTRY_LABELS[siteCountry as CountryCode] || 'India'
  const effectiveCountry = locationCountry || lookupLocationCountry(siteCountryLabel.toLowerCase().replace(/\s+/g, '-'))

  const countries = useMemo(() => {
    const arr: { slug: string; name: string }[] = []
    getLocationCountries().forEach(c => arr.push({ slug: c.slug, name: c.name }))
    arr.sort((a, b) => a.name.localeCompare(b.name))
    return arr
  }, [])

  const states = useMemo(() => {
    if (!effectiveCountry) return []
    const arr: { slug: string; name: string; stateCode: string }[] = []
    getStates(effectiveCountry.isoCode).forEach(s => arr.push({ slug: s.slug, name: s.name, stateCode: s.stateCode }))
    arr.sort((a, b) => a.name.localeCompare(b.name))
    return arr
  }, [effectiveCountry])

  const cities = useMemo(() => {
    if (!effectiveCountry || !locationState) return []
    const arr: { slug: string; name: string }[] = []
    getCities(effectiveCountry.isoCode, locationState.stateCode).forEach(c => arr.push({ slug: c.slug, name: c.name }))
    arr.sort((a, b) => a.name.localeCompare(b.name))
    return arr
  }, [effectiveCountry, locationState])

  const handleCountrySelect = (slug: string) => {
    const c = Array.from(getLocationCountries().values()).find(c => c.slug === slug)
    if (c) onLocationCountryChange(c)
  }
  const handleStateSelect = (slug: string) => {
    if (!effectiveCountry) return
    const s = Array.from(getStates(effectiveCountry.isoCode).values()).find(s => s.slug === slug)
    if (s) onStateChange(s)
  }
  const handleCitySelect = (slug: string) => {
    if (!effectiveCountry || !locationState) return
    const ct = Array.from(getCities(effectiveCountry.isoCode, locationState.stateCode).values()).find(c => c.slug === slug)
    if (ct) onCityChange(ct)
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
          value={effectiveCountry?.name || siteCountryLabel}
          placeholder="Country"
          items={countries}
          onSelect={handleCountrySelect}
          color="var(--h-accent)"
        />
        {', '}
        <InlineSelect
          value={locationState?.name || ''}
          placeholder="State"
          items={states.length > 0 ? states : []}
          onSelect={handleStateSelect}
          color="#8B5CF6"
        />
        {', '}
        <InlineSelect
          value={locationCity?.name || ''}
          placeholder="City"
          items={cities.length > 0 ? cities : []}
          onSelect={handleCitySelect}
          color="#14B8A6"
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
