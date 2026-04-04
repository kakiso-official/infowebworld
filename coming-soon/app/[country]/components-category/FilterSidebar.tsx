'use client'
import { useState, useMemo } from 'react'
import { I, ic } from './icons'
import type { TagGroup } from '../../iww-hq/data/tag-storage'
import FilterModal from './FilterModal'
import {
  getLocationCountries,
  getStates,
  getCities,
  type GeoCountry,
  type GeoState,
  type GeoCity,
} from '../../lib/geo-slugs'

const PREVIEW_COUNT = 5

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
  const countries = useMemo(() => {
    const arr: GeoCountry[] = []
    getLocationCountries().forEach(c => arr.push(c))
    arr.sort((a, b) => a.name.localeCompare(b.name))
    return arr
  }, [])
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
      <div className="cd-fs-select-wrap">
        <select className="cd-fs-select" value={p.locationCountry?.slug || ''} onChange={e => {
          if (!e.target.value) { p.onLocationCountryChange(null); return }
          const c = countries.find(c => c.slug === e.target.value); if (c) p.onLocationCountryChange(c)
        }}>
          <option value="">All Countries</option>
          {countries.map(c => <option key={c.isoCode} value={c.slug}>{c.name}</option>)}
        </select>
      </div>
      <div className="cd-fs-select-wrap">
        <select className="cd-fs-select" value={p.locationState?.slug || ''} disabled={!p.effectiveIso} onChange={e => {
          if (!e.target.value) { p.onStateChange(null); return }
          const s = states.find(s => s.slug === e.target.value); if (s) p.onStateChange(s)
        }}>
          <option value="">{p.effectiveIso ? 'All States' : 'Select country first'}</option>
          {states.map(s => <option key={s.stateCode} value={s.slug}>{s.name}</option>)}
        </select>
      </div>
      <div className="cd-fs-select-wrap">
        <select className="cd-fs-select" value={p.locationCity?.slug || ''} disabled={!p.locationState} onChange={e => {
          if (!e.target.value) { p.onCityChange(null); return }
          const c = cities.find(c => c.slug === e.target.value); if (c) p.onCityChange(c)
        }}>
          <option value="">{p.locationState ? 'All Cities' : 'Select state first'}</option>
          {cities.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </div>
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

/* ── Main: desktop sidebar + mobile drawer ── */
export default function FilterSidebar(p: Props) {
  if (!p.isL3) return null

  return (
    <>
      {/* Desktop */}
      <aside className="cd-sidebar cd-fs-sidebar">
        <FilterContent {...p} />
      </aside>

      {/* Mobile drawer */}
      {p.isOpen && (
        <div className="cd-drawer-overlay" onClick={p.onClose}>
          <div className="cd-drawer" onClick={e => e.stopPropagation()}>
            <div className="cd-drawer-header">
              <h3 className="cd-drawer-title">
                <I d={ic.filter} size={16} color={p.color} sw={2} /> Filters
              </h3>
              <button className="cd-drawer-close" onClick={p.onClose}>
                <I d={ic.x} size={18} color="var(--h-heading)" sw={2} />
              </button>
            </div>
            <div className="cd-drawer-body">
              <FilterContent {...p} />
            </div>
            <div className="cd-drawer-footer">
              <button className="cd-drawer-apply" style={{ background: p.color }} onClick={p.onClose}>
                Show {p.totalFilteredCount} results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
