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
  /** Apply all filters at once (location + listing type + tags) */
  onApplyFilters: (filters: {
    locationCountry: GeoCountry | null
    locationState: GeoState | null
    locationCity: GeoCity | null
    listingType: string
    tags: Set<string>
  }) => void
  /** ISO code of the effective country (route fallback when locationCountry is null) */
  effectiveIso: string
}

/* ── Location dropdowns (uses draft state from parent) ── */
function LocationSection({ draftCountry, draftState, draftCity, effectiveIso, color, onDraftCountry, onDraftState, onDraftCity }: {
  draftCountry: GeoCountry | null; draftState: GeoState | null; draftCity: GeoCity | null
  effectiveIso: string; color: string
  onDraftCountry: (v: GeoCountry | null) => void; onDraftState: (v: GeoState | null) => void; onDraftCity: (v: GeoCity | null) => void
}) {
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
  const draftIso = draftCountry?.isoCode || effectiveIso
  const states = useMemo(() => {
    if (!draftIso) return []
    const arr: GeoState[] = []
    getStates(draftIso).forEach(s => arr.push(s))
    arr.sort((a, b) => a.name.localeCompare(b.name))
    return arr
  }, [draftIso])
  const cities = useMemo(() => {
    if (!draftIso || !draftState) return []
    const arr: GeoCity[] = []
    getCities(draftIso, draftState.stateCode).forEach(c => arr.push(c))
    arr.sort((a, b) => a.name.localeCompare(b.name))
    return arr
  }, [draftIso, draftState])

  return (
    <div className="cd-fs-section">
      <h4 className="cd-fs-heading">
        <I d={ic.mapPin} size={14} color={color} sw={2} />
        Location
      </h4>
      <CustomSelect
        value={draftCountry?.slug || ''}
        placeholder="All Countries"
        color={color}
        options={countries.map(c => ({ value: c.slug, label: c.name }))}
        onChange={val => {
          if (!val) { onDraftCountry(null); onDraftState(null); onDraftCity(null); return }
          const c = countries.find(c => c.slug === val); if (c) { onDraftCountry(c); onDraftState(null); onDraftCity(null) }
        }}
      />
      <CustomSelect
        value={draftState?.slug || ''}
        placeholder={draftIso ? 'All States' : 'Select country first'}
        disabled={!draftIso}
        color={color}
        options={states.map(s => ({ value: s.slug, label: s.name }))}
        onChange={val => {
          if (!val) { onDraftState(null); onDraftCity(null); return }
          const s = states.find(s => s.slug === val); if (s) { onDraftState(s); onDraftCity(null) }
        }}
      />
      <CustomSelect
        value={draftCity?.slug || ''}
        placeholder={draftState ? 'All Cities' : 'Select state first'}
        disabled={!draftState}
        color={color}
        options={cities.map(c => ({ value: c.slug, label: c.name }))}
        onChange={val => {
          if (!val) { onDraftCity(null); return }
          const c = cities.find(c => c.slug === val); if (c) onDraftCity(c)
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

/* ── Filter content — uses local draft state, applies on "Show Results" click ── */
function FilterContent(p: Props) {
  const [modalSection, setModalSection] = useState<string | null>(null)

  /* ── Draft state — mirrors parent props initially, changes stay local until apply ── */
  const [dCountry, setDCountry] = useState<GeoCountry | null>(p.locationCountry)
  const [dState, setDState] = useState<GeoState | null>(p.locationState)
  const [dCity, setDCity] = useState<GeoCity | null>(p.locationCity)
  const [dLT, setDLT] = useState(p.selectedListingType)
  const [dTags, setDTags] = useState<Set<string>>(new Set(p.selectedTags))

  /* Sync draft when parent props change (e.g. URL navigation, clear from outside) */
  useEffect(() => { setDCountry(p.locationCountry) }, [p.locationCountry])
  useEffect(() => { setDState(p.locationState) }, [p.locationState])
  useEffect(() => { setDCity(p.locationCity) }, [p.locationCity])
  useEffect(() => { setDLT(p.selectedListingType) }, [p.selectedListingType])
  useEffect(() => { setDTags(new Set(p.selectedTags)) }, [p.selectedTags])

  const toggleDraftTag = (slug: string) => {
    setDTags(prev => { const n = new Set(prev); if (n.has(slug)) n.delete(slug); else n.add(slug); return n })
  }

  /* Check if draft differs from current applied state */
  const draftChanged = dCountry?.slug !== (p.locationCountry?.slug || undefined)
    || dState?.slug !== (p.locationState?.slug || undefined)
    || dCity?.slug !== (p.locationCity?.slug || undefined)
    || dLT !== p.selectedListingType
    || dTags.size !== p.selectedTags.size
    || [...dTags].some(t => !p.selectedTags.has(t))

  const hasDraftFilter = !!dCountry || !!dState || !!dCity || !!dLT || dTags.size > 0

  const applyFilters = () => {
    p.onApplyFilters({ locationCountry: dCountry, locationState: dState, locationCity: dCity, listingType: dLT, tags: dTags })
    p.onClose()
  }

  const clearAll = () => {
    setDCountry(null); setDState(null); setDCity(null); setDLT(''); setDTags(new Set())
  }

  const modalTagGroup = p.tagGroups.find(g => g.id === modalSection) || null
  const showLTModal = modalSection === '__listing_types__'

  return (
    <>

      {/* Active draft pills */}
      {hasDraftFilter && (
        <div className="cd-fs-active">
          <div className="cd-fs-active-header">
            <span className="cd-fs-active-label">Filters</span>
            <button onClick={clearAll} className="cd-fs-clear" style={{ color: p.color }}>Clear All</button>
          </div>
          <div className="cd-fs-active-pills">
            {dCountry && (
              <span className="cd-fs-pill" style={{ background: `${p.color}10`, color: p.color, borderColor: `${p.color}30` }}>
                <I d={ic.mapPin} size={10} color={p.color} sw={2} />
                {dCountry.name}
                {dState && <> &rsaquo; {dState.name}</>}
                {dCity && <> &rsaquo; {dCity.name}</>}
                <button onClick={() => { setDCountry(null); setDState(null); setDCity(null) }} className="cd-fs-pill-x" style={{ color: p.color }}>
                  <I d={ic.x} size={9} color={p.color} sw={2.5} />
                </button>
              </span>
            )}
            {dLT && (
              <span className="cd-fs-pill" style={{ background: `${p.color}10`, color: p.color, borderColor: `${p.color}30` }}>
                {p.listingTypes.find(lt => lt.slug === dLT)?.name || dLT}
                <button onClick={() => setDLT('')} className="cd-fs-pill-x" style={{ color: p.color }}>
                  <I d={ic.x} size={9} color={p.color} sw={2.5} />
                </button>
              </span>
            )}
            {Array.from(dTags).map(tagSlug => {
              const tag = p.tagGroups.flatMap(g => g.tags).find(t => t.slug === tagSlug)
              return tag ? (
                <span key={tagSlug} className="cd-fs-pill" style={{ background: `${p.color}10`, color: p.color, borderColor: `${p.color}30` }}>
                  {tag.name}
                  <button onClick={() => toggleDraftTag(tagSlug)} className="cd-fs-pill-x" style={{ color: p.color }}>
                    <I d={ic.x} size={9} color={p.color} sw={2.5} />
                  </button>
                </span>
              ) : null
            })}
          </div>
        </div>
      )}

      {/* Location filters */}
      <LocationSection
        draftCountry={dCountry} draftState={dState} draftCity={dCity}
        effectiveIso={dCountry?.isoCode || p.effectiveIso}
        color={p.color}
        onDraftCountry={setDCountry} onDraftState={setDState} onDraftCity={setDCity}
      />

      {/* Listing types — grouped by L4 (part before ":"), L5 as items */}
      {p.listingTypes.length > 0 && (() => {
        // Group listing types: "L4: L5" → { l4Name → [{ slug, l5Name }] }
        const groups: { l4: string; items: { slug: string; name: string }[] }[] = []
        const groupMap = new Map<string, { slug: string; name: string }[]>()
        for (const lt of p.listingTypes) {
          const colonIdx = lt.name.indexOf(':')
          const l4 = colonIdx > 0 ? lt.name.slice(0, colonIdx).trim() : 'Other'
          const l5 = colonIdx > 0 ? lt.name.slice(colonIdx + 1).trim() : lt.name
          if (!groupMap.has(l4)) { groupMap.set(l4, []); groups.push({ l4, items: groupMap.get(l4)! }) }
          groupMap.get(l4)!.push({ slug: lt.slug, name: l5 })
        }
        const GROUPS_PREVIEW = 3 // show first 3 L4 groups
        const previewGroups = groups.slice(0, GROUPS_PREVIEW)
        return (
          <div className="cd-fs-section">
            <h4 className="cd-fs-heading">
              Specializations
              <I d={ic.chevronDown} size={13} color="var(--h-muted)" sw={2} />
            </h4>
            {previewGroups.map(g => (
              <div key={g.l4} className="cd-fs-lt-group">
                <div className="cd-fs-lt-l4">{g.l4}</div>
                <div className="cd-fs-check-list">
                  {g.items.slice(0, PREVIEW_COUNT).map(item => (
                    <CheckItem
                      key={item.slug}
                      slug={item.slug}
                      name={item.name}
                      count={p.getListingTypeCount(item.slug)}
                      checked={dLT === item.slug}
                      color={p.color}
                      onChange={() => setDLT(dLT === item.slug ? '' : item.slug)}
                    />
                  ))}
                </div>
              </div>
            ))}
            {groups.length > GROUPS_PREVIEW && (
              <button className="cd-fs-see-all" style={{ color: p.color }} onClick={() => setModalSection('__listing_types__')}>
                SEE FULL LIST ({groups.length} types)
              </button>
            )}
          </div>
        )
      })()}

      {/* Tag groups — skip Location tag group (handled by dropdowns above) */}
      {p.tagGroups.filter(g => g.slug !== 'location').map(group => {
        const selectedInGroup = group.tags.filter(t => dTags.has(t.slug)).length
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
                    checked={dTags.has(tag.slug)}
                    color={p.color}
                    onChange={() => toggleDraftTag(tag.slug)}
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
          title="Specializations"
          items={p.listingTypes.map(lt => {
            const ci = lt.name.indexOf(':')
            return { slug: lt.slug, name: ci > 0 ? lt.name.slice(ci + 1).trim() : lt.name, group: ci > 0 ? lt.name.slice(0, ci).trim() : undefined, count: p.getListingTypeCount(lt.slug) }
          })}
          selected={new Set(dLT ? [dLT] : [])}
          onToggle={slug => setDLT(dLT === slug ? '' : slug)}
          onClose={() => setModalSection(null)}
          color={p.color}
        />
      )}
      {modalTagGroup && (
        <FilterModal
          title={modalTagGroup.name}
          items={modalTagGroup.tags.map(t => ({ slug: t.slug, name: t.name, count: p.hasListings ? undefined : (p.demoTagCounts.get(t.slug) || 0) }))}
          selected={dTags}
          onToggle={toggleDraftTag}
          onClose={() => setModalSection(null)}
          color={p.color}
        />
      )}

      {/* ── Sticky "Show Results" button ── */}
      <div className="cd-fs-sticky-foot">
        <button
          onClick={applyFilters}
          className="cd-fs-apply-btn"
          style={{ background: draftChanged ? p.color : 'rgba(0,0,0,0.08)', color: draftChanged ? '#fff' : 'rgba(0,0,0,0.4)' }}
        >
          {draftChanged ? 'Show Results' : 'No changes'}
        </button>
      </div>
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
          <div>
            <span className="cd-sidebar-head-title">Filter Results</span>
            <span style={{ display: 'block', fontSize: '.72rem', fontWeight: 500, color: 'rgba(0,0,0,.4)', marginTop: 4, fontFamily: 'var(--font-inter)' }}>
              Narrow down by location, type & tags
            </span>
          </div>
          <button className="cd-sidebar-head-close" onClick={p.onClose} type="button" aria-label="Close filters">
            <I d={ic.x} size={16} color="currentColor" sw={2} />
          </button>
        </div>
        <div className="cd-sidebar-body">
          <FilterContent {...p} />
        </div>
      </aside>
    </>,
    document.body
  )
}
