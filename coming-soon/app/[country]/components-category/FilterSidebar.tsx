'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { I, ic } from './icons'
import type { TagGroup } from '../../iww-hq/data/tag-storage'
import FilterModal from './FilterModal'
import {
  getLocationCountries,
  getStates,
  getCities,
  preloadCSC,
  type GeoCountry,
  type GeoState,
  type GeoCity,
} from '../../lib/geo-slugs'

const PREVIEW_COUNT = 5

/* ── Custom select dropdown (replaces native <select>) ── */
function CustomSelect({ value, placeholder, options, disabled, onChange, color }: {
  value: string; placeholder: string; disabled?: boolean; color?: string
  options: { value: string; label: string }[]
  onChange: (val: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  const filtered = search
    ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : options
  const selectedLabel = options.find(o => o.value === value)?.label || placeholder

  return (
    <div className="cd-cs" ref={ref}>
      <button type="button" className={`cd-cs-btn${disabled ? ' cd-cs-btn--disabled' : ''}`}
        onClick={() => !disabled && setOpen(o => !o)}>
        <span className={value ? 'cd-cs-val' : 'cd-cs-ph'}>{selectedLabel}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 200ms', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open && (
        <div className="cd-cs-drop">
          {options.length > 8 && (
            <div className="cd-cs-search">
              <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} autoFocus />
            </div>
          )}
          <div className="cd-cs-list">
            <button type="button" className={`cd-cs-opt${!value ? ' cd-cs-opt--active' : ''}`}
              onClick={() => { onChange(''); setOpen(false); setSearch('') }}>
              {placeholder}
            </button>
            {filtered.map(o => (
              <button key={o.value} type="button"
                className={`cd-cs-opt${value === o.value ? ' cd-cs-opt--active' : ''}`}
                style={value === o.value && color ? { color } : undefined}
                onClick={() => { onChange(o.value); setOpen(false); setSearch('') }}>
                {o.label}
                {value === o.value && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

type Props = {
  color: string
  isL3: boolean
  isOpen: boolean
  onClose: () => void
  listingTypes: { slug: string; name: string }[]
  selectedListingType: string
  onListingTypeChange: (slug: string) => void
  tagGroups: TagGroup[]
  selectedTags: Set<string>
  onToggleTag: (slug: string) => void
  openAccordions: Set<string>
  onToggleAccordion: (id: string) => void
  onClearFilters: () => void
  hasAnyFilter: boolean
  getListingTypeCount: (slug: string) => number
  totalAllCount: number
  totalFilteredCount: number
  hasListings: boolean
  demoTagCounts: Map<string, number>
  locationCountry: GeoCountry | null
  locationState: GeoState | null
  locationCity: GeoCity | null
  onLocationCountryChange: (val: GeoCountry | null) => void
  onStateChange: (val: GeoState | null) => void
  onCityChange: (val: GeoCity | null) => void
  /** ISO code of the effective country (route fallback when locationCountry is null) */
  effectiveIso: string
}

/* ── Location dropdowns ── */
function LocationSection(p: Props & { effectiveIso: string }) {
  const [geoReady, setGeoReady] = useState(() => getLocationCountries().size > 0)
  useEffect(() => {
    if (geoReady) return
    preloadCSC().then(() => setGeoReady(true))
  }, [geoReady])
  const countries = useMemo(() => {
    if (!geoReady) return []
    const arr: GeoCountry[] = []
    getLocationCountries().forEach(c => arr.push(c))
    arr.sort((a, b) => a.name.localeCompare(b.name))
    return arr
  }, [geoReady])
  const states = useMemo(() => {
    if (!p.effectiveIso) return []
    const arr: GeoState[] = []
    getStates(p.effectiveIso).forEach(s => arr.push(s))
    arr.sort((a, b) => a.name.localeCompare(b.name))
    return arr
  }, [p.effectiveIso])
  const cities = useMemo(() => {
    if (!p.effectiveIso || !p.locationState) return []
    const arr: GeoCity[] = []
    getCities(p.effectiveIso, p.locationState.stateCode).forEach(c => arr.push(c))
    arr.sort((a, b) => a.name.localeCompare(b.name))
    return arr
  }, [p.effectiveIso, p.locationState])

  return (
    <div className="cd-fs-section">
      <h4 className="cd-fs-heading">
        <I d={ic.mapPin} size={14} color={p.color} sw={2} />
        Location
      </h4>
      <CustomSelect
        value={p.locationCountry?.slug || ''}
        placeholder="All Countries"
        color={p.color}
        options={countries.map(c => ({ value: c.slug, label: c.name }))}
        onChange={val => {
          if (!val) { p.onLocationCountryChange(null); return }
          const c = countries.find(c => c.slug === val); if (c) p.onLocationCountryChange(c)
        }}
      />
      <CustomSelect
        value={p.locationState?.slug || ''}
        placeholder={p.effectiveIso ? 'All States' : 'Select country first'}
        disabled={!p.effectiveIso}
        color={p.color}
        options={states.map(s => ({ value: s.slug, label: s.name }))}
        onChange={val => {
          if (!val) { p.onStateChange(null); return }
          const s = states.find(s => s.slug === val); if (s) p.onStateChange(s)
        }}
      />
      <CustomSelect
        value={p.locationCity?.slug || ''}
        placeholder={p.locationState ? 'All Cities' : 'Select state first'}
        disabled={!p.locationState}
        color={p.color}
        options={cities.map(c => ({ value: c.slug, label: c.name }))}
        onChange={val => {
          if (!val) { p.onCityChange(null); return }
          const c = cities.find(c => c.slug === val); if (c) p.onCityChange(c)
        }}
      />
    </div>
  )
}

/* ── Checkbox item ── */
function CheckItem({ slug, name, count, checked, color, onChange }: { slug: string; name: string; count?: number; checked: boolean; color: string; onChange: () => void }) {
  return (
    <label className="cd-fs-check">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="cd-fs-box" style={checked ? { background: color, borderColor: color } : undefined}>
        {checked && <I d={ic.check} size={10} color="#fff" sw={2.5} />}
      </span>
      <span className="cd-fs-check-label">{name}</span>
      {count !== undefined && <span className="cd-fs-check-count">({count})</span>}
    </label>
  )
}

/* ── Filter content (used in both desktop sidebar and mobile drawer) ── */
function FilterContent(p: Props) {
  const [modalSection, setModalSection] = useState<string | null>(null)

  // Which modal is open
  const modalTagGroup = p.tagGroups.find(g => g.id === modalSection) || null
  const showLTModal = modalSection === '__listing_types__'

  return (
    <>
      {/* Header */}
      <h3 className="cd-fs-title">Filter results</h3>

      {/* Active pills */}
      {p.hasAnyFilter && (
        <div className="cd-fs-active">
          <div className="cd-fs-active-header">
            <span className="cd-fs-active-label">Active Filters</span>
            <button onClick={p.onClearFilters} className="cd-fs-clear" style={{ color: p.color }}>Clear All</button>
          </div>
          <div className="cd-fs-active-pills">
            {p.locationCountry && (
              <span className="cd-fs-pill" style={{ background: `${p.color}10`, color: p.color, borderColor: `${p.color}30` }}>
                <I d={ic.mapPin} size={10} color={p.color} sw={2} />
                {p.locationCountry.name}
                {p.locationState && <> &rsaquo; {p.locationState.name}</>}
                {p.locationCity && <> &rsaquo; {p.locationCity.name}</>}
                <button onClick={() => p.onLocationCountryChange(null)} className="cd-fs-pill-x" style={{ color: p.color }}>
                  <I d={ic.x} size={9} color={p.color} sw={2.5} />
                </button>
              </span>
            )}
            {p.selectedListingType && (
              <span className="cd-fs-pill" style={{ background: `${p.color}10`, color: p.color, borderColor: `${p.color}30` }}>
                {p.listingTypes.find(lt => lt.slug === p.selectedListingType)?.name || p.selectedListingType}
                <button onClick={() => p.onListingTypeChange('')} className="cd-fs-pill-x" style={{ color: p.color }}>
                  <I d={ic.x} size={9} color={p.color} sw={2.5} />
                </button>
              </span>
            )}
            {Array.from(p.selectedTags).map(tagSlug => {
              const tag = p.tagGroups.flatMap(g => g.tags).find(t => t.slug === tagSlug)
              return tag ? (
                <span key={tagSlug} className="cd-fs-pill" style={{ background: `${p.color}10`, color: p.color, borderColor: `${p.color}30` }}>
                  {tag.name}
                  <button onClick={() => p.onToggleTag(tagSlug)} className="cd-fs-pill-x" style={{ color: p.color }}>
                    <I d={ic.x} size={9} color={p.color} sw={2.5} />
                  </button>
                </span>
              ) : null
            })}
          </div>
        </div>
      )}

      {/* Location filters */}
      <LocationSection {...p} effectiveIso={p.effectiveIso} />

      {/* Listing types — open, show first 5, "SEE FULL LIST" */}
      {p.listingTypes.length > 0 && (
        <div className="cd-fs-section">
          <h4 className="cd-fs-heading">
            Listing Types
            <I d={ic.chevronDown} size={13} color="var(--h-muted)" sw={2} />
          </h4>
          <div className="cd-fs-check-list">
            {p.listingTypes.slice(0, PREVIEW_COUNT).map(lt => (
              <CheckItem
                key={lt.slug}
                slug={lt.slug}
                name={lt.name}
                count={p.getListingTypeCount(lt.slug)}
                checked={p.selectedListingType === lt.slug}
                color={p.color}
                onChange={() => p.onListingTypeChange(p.selectedListingType === lt.slug ? '' : lt.slug)}
              />
            ))}
          </div>
          {p.listingTypes.length > PREVIEW_COUNT && (
            <button className="cd-fs-see-all" style={{ color: p.color }} onClick={() => setModalSection('__listing_types__')}>
              SEE FULL LIST
            </button>
          )}
        </div>
      )}

      {/* Tag groups — all open, show first 5, "SEE FULL LIST" */}
      {p.tagGroups.map(group => {
        const selectedInGroup = group.tags.filter(t => p.selectedTags.has(t.slug)).length
        return (
          <div key={group.id} className="cd-fs-section">
            <h4 className="cd-fs-heading">
              <span className="cd-fs-heading-left">
                <span className="cd-fs-dot" style={{ background: group.color }} />
                {group.name}
                {selectedInGroup > 0 && (
                  <span className="cd-fs-badge" style={{ background: `${p.color}15`, color: p.color }}>{selectedInGroup}</span>
                )}
              </span>
              <I d={ic.chevronDown} size={13} color="var(--h-muted)" sw={2} />
            </h4>
            <div className="cd-fs-check-list">
              {group.tags.slice(0, PREVIEW_COUNT).map(tag => {
                const count = p.hasListings ? 0 : (p.demoTagCounts.get(tag.slug) || 0)
                return (
                  <CheckItem
                    key={tag.id}
                    slug={tag.slug}
                    name={tag.name}
                    count={!p.hasListings && count > 0 ? count : undefined}
                    checked={p.selectedTags.has(tag.slug)}
                    color={p.color}
                    onChange={() => p.onToggleTag(tag.slug)}
                  />
                )
              })}
            </div>
            {group.tags.length > PREVIEW_COUNT && (
              <button className="cd-fs-see-all" style={{ color: p.color }} onClick={() => setModalSection(group.id)}>
                SEE FULL LIST
              </button>
            )}
          </div>
        )
      })}

      {/* ── Full list modals ── */}
      {showLTModal && (
        <FilterModal
          title="Listing Types"
          items={p.listingTypes.map(lt => ({ slug: lt.slug, name: lt.name, count: p.getListingTypeCount(lt.slug) }))}
          selected={new Set(p.selectedListingType ? [p.selectedListingType] : [])}
          onToggle={slug => p.onListingTypeChange(p.selectedListingType === slug ? '' : slug)}
          onClose={() => setModalSection(null)}
          color={p.color}
        />
      )}
      {modalTagGroup && (
        <FilterModal
          title={modalTagGroup.name}
          items={modalTagGroup.tags.map(t => ({ slug: t.slug, name: t.name, count: p.hasListings ? undefined : (p.demoTagCounts.get(t.slug) || 0) }))}
          selected={p.selectedTags}
          onToggle={p.onToggleTag}
          onClose={() => setModalSection(null)}
          color={p.color}
        />
      )}
    </>
  )
}

/* ── Main: filter drawer — portaled to document.body so it sits above everything ── */
export default function FilterSidebar(p: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!p.isL3 || !mounted) return null

  return createPortal(
    <>
      {/* Overlay */}
      <div className={`cd-sidebar-overlay${p.isOpen ? ' cd-sidebar-overlay--open' : ''}`} onClick={p.onClose} />

      {/* Right-side drawer */}
      <aside className={`cd-sidebar${p.isOpen ? ' cd-sidebar--open' : ''}`}>
        <div className="cd-sidebar-head">
          <span className="cd-sidebar-head-title">Filters</span>
          <button className="cd-sidebar-head-close" onClick={p.onClose} type="button" aria-label="Close filters">
            <I d={ic.x} size={18} color="#000" sw={2} />
          </button>
        </div>
        <div className="cd-sidebar-body">
          <FilterContent {...p} />
        </div>
        {p.hasAnyFilter && (
          <div style={{ padding: '12px 24px 20px', borderTop: '1px solid rgba(0,0,0,0.06)', flexShrink: 0, background: '#fff', position: 'sticky', bottom: 0 }}>
            <button
              onClick={p.onClose}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: p.color, color: '#fff', font: '700 15px/1 var(--font-inter, Inter, sans-serif)', cursor: 'pointer' }}
            >
              Show {p.totalFilteredCount} results
            </button>
          </div>
        )}
      </aside>
    </>,
    document.body
  )
}
