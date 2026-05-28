'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import {
  getLocationCountries, getStates, getCities, preloadCSC,
  getAllStatesArray, getAllCitiesArray, lookupLocationCountry, toSlug,
  type GeoCountry, type GeoState, type GeoCity,
} from '../lib/geo-slugs'

export type FilterOption = { value: string; label: string }

/* ════════════════════════════════════════════════════════════════════════
   Dynamic filter bar — driven by an array of `FilterField` so the bar
   reflects whatever filters actually exist for this category (Location,
   Specializations, each tag group, Sort).

   Single-select fields close the popover on click. Multi-select fields
   stay open so you can pick several; the button label shows the selected
   count. All fields support search.
   ════════════════════════════════════════════════════════════════════════ */

export type FilterField = {
  key: string
  label: string
  options: FilterOption[]
  /** For single-select: the selected value. For multi-select: array of values. */
  value: string | string[]
  onChange: (next: string | string[]) => void
  multi?: boolean
  searchable?: boolean
  icon?: React.ReactNode
}

type DropdownProps = Omit<FilterField, 'key'>

function Dropdown({ label, value, options, onChange, multi = false, searchable = true, icon }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedSet = useMemo(
    () => new Set(Array.isArray(value) ? value : value ? [value] : []),
    [value],
  )
  const selectedCount = selectedSet.size

  const filtered = useMemo(() => {
    if (!search.trim()) return options
    const q = search.trim().toLowerCase()
    return options.filter(o => o.label.toLowerCase().includes(q))
  }, [options, search])

  useEffect(() => {
    if (open) {
      setSearch('')
      setActiveIdx(0)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  /* Selection handler — branches single vs multi. Single closes on pick,
     multi stays open so the user can toggle several. */
  const pick = (v: string) => {
    if (multi) {
      const next = new Set(selectedSet)
      if (next.has(v)) next.delete(v); else next.add(v)
      onChange(Array.from(next))
    } else {
      onChange(v)
      setOpen(false)
    }
  }

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') { setOpen(false); return }
    if (filtered.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const hit = filtered[activeIdx]
      if (hit) pick(hit.value)
    }
  }

  /* Button label — single shows selected option name, multi shows count. */
  let displayLabel: string = label
  if (selectedCount > 0) {
    if (multi) {
      displayLabel = selectedCount === 1
        ? options.find(o => o.value === Array.from(selectedSet)[0])?.label || label
        : `${label} (${selectedCount})`
    } else {
      displayLabel = options.find(o => o.value === Array.from(selectedSet)[0])?.label || label
    }
  }
  const isActive = selectedCount > 0

  const clearAll = () => onChange(multi ? [] : '')

  return (
    <div className={'cd-fb-field' + (isActive ? ' cd-fb-field--active' : '')} ref={wrapRef}>
      <button
        type="button"
        className="cd-fb-field-btn"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {icon && <span className="cd-fb-field-ico" aria-hidden="true">{icon}</span>}
        <span className="cd-fb-field-label">{displayLabel}</span>
        {isActive && (
          <span
            className="cd-fb-field-clear"
            role="button"
            tabIndex={0}
            aria-label={`Clear ${label}`}
            onClick={e => { e.stopPropagation(); clearAll() }}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clearAll() } }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
        )}
        <FontAwesomeIcon icon={faChevronDown} className={'cd-fb-field-chev' + (open ? ' cd-fb-field-chev--open' : '')} />
      </button>

      {open && (
        <div className="cd-fb-pop" role="listbox" aria-multiselectable={multi}>
          {searchable && (
            <div className="cd-fb-pop-search">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="cd-fb-pop-search-ico" />
              <input
                ref={inputRef}
                type="text"
                className="cd-fb-pop-input"
                value={search}
                onChange={e => { setSearch(e.target.value); setActiveIdx(0) }}
                onKeyDown={onKey}
                placeholder={`Search ${label.toLowerCase()}…`}
                spellCheck={false}
                autoComplete="off"
              />
            </div>
          )}
          <ul className="cd-fb-pop-list">
            {filtered.length === 0 && (
              <li className="cd-fb-pop-empty">No matches</li>
            )}
            {filtered.map((o, i) => {
              const checked = selectedSet.has(o.value)
              return (
                <li
                  key={o.value}
                  className={
                    'cd-fb-pop-opt' +
                    (i === activeIdx ? ' cd-fb-pop-opt--active' : '') +
                    (checked ? ' cd-fb-pop-opt--selected' : '')
                  }
                  role="option"
                  aria-selected={checked}
                  onMouseEnter={() => setActiveIdx(i)}
                  onClick={() => pick(o.value)}
                >
                  {multi && (
                    <span className={'cd-fb-pop-check' + (checked ? ' cd-fb-pop-check--on' : '')} aria-hidden="true">
                      {checked && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                  )}
                  <span className="cd-fb-pop-opt-label">{o.label}</span>
                  {!multi && checked && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   LocationFilterDropdown — unified location search.

   ONE search input. Type anything: country, state, or city. Results are
   grouped (Countries / States / Cities) with parent context shown as meta
   (e.g. "Mumbai" — "Maharashtra, India"). Picking any result auto-resolves
   the full hierarchy and calls onChange(country, state, city).

   • Country → onChange(country, null, null)
   • State   → onChange(country, state, null)
   • City    → onChange(country, state, city)
   ════════════════════════════════════════════════════════════════════════ */
type LocationProps = {
  country: GeoCountry | null
  state: GeoState | null
  city: GeoCity | null
  onChange: (c: GeoCountry | null, s: GeoState | null, ci: GeoCity | null) => void
}

type StateRow = { name: string; slug: string; stateCode: string; isoCode: string; countryName: string }
type CityRow = { name: string; stateCode: string; countryCode: string }

type LocHit =
  | { type: 'country'; country: GeoCountry }
  | { type: 'state'; state: StateRow }
  | { type: 'city'; city: CityRow; stateName: string; countryName: string }

function LocationFilterDropdown({ country, state, city, onChange }: LocationProps) {
  const [open, setOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const [query, setQuery] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const wrapRef = useRef<HTMLDivElement>(null)

  const [allStates, setAllStates] = useState<StateRow[]>([])
  const [allCities, setAllCities] = useState<CityRow[]>([])
  const [countryByIso, setCountryByIso] = useState<Map<string, GeoCountry>>(new Map())
  const [stateNameByKey, setStateNameByKey] = useState<Map<string, string>>(new Map())

  /* Load all the indexes on first open. */
  useEffect(() => {
    if (!open || ready) return
    let cancelled = false
    ;(async () => {
      await preloadCSC()
      if (cancelled) return
      const [states, cities] = await Promise.all([getAllStatesArray(), getAllCitiesArray()])
      if (cancelled) return
      const cIso = new Map<string, GeoCountry>()
      for (const c of getLocationCountries().values()) cIso.set(c.isoCode, c)
      const sKey = new Map<string, string>()
      for (const s of states) sKey.set(`${s.isoCode}:${s.stateCode}`, s.name)
      setAllStates(states)
      setAllCities(cities)
      setCountryByIso(cIso)
      setStateNameByKey(sKey)
      setReady(true)
    })()
    return () => { cancelled = true }
  }, [open, ready])

  /* Outside-click closes. */
  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  /* Debounce the search so we don't scan 148K cities on every keystroke. */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(query.trim().toLowerCase()), 160)
    return () => clearTimeout(t)
  }, [query])

  /* Unified search — yields up to 6 countries, 8 states, 12 cities matching
     the query. Each is annotated with parent context for display. */
  const hits: LocHit[] = useMemo(() => {
    const q = debouncedQ
    if (!ready) return []
    const out: LocHit[] = []
    if (q.length === 0) {
      /* Empty query → show alphabetical first 20 countries as default. */
      const sortedC = Array.from(getLocationCountries().values()).sort((a, b) => a.name.localeCompare(b.name))
      for (const c of sortedC.slice(0, 20)) out.push({ type: 'country', country: c })
      return out
    }
    const countries: LocHit[] = []
    for (const c of getLocationCountries().values()) {
      if (c.name.toLowerCase().includes(q)) countries.push({ type: 'country', country: c })
      if (countries.length >= 6) break
    }
    const states: LocHit[] = []
    for (const s of allStates) {
      if (s.name.toLowerCase().includes(q)) states.push({ type: 'state', state: s })
      if (states.length >= 8) break
    }
    const cities: LocHit[] = []
    for (const c of allCities) {
      if (c.name.toLowerCase().includes(q)) {
        const stateName = stateNameByKey.get(`${c.countryCode}:${c.stateCode}`) || c.stateCode
        const countryName = countryByIso.get(c.countryCode)?.name || c.countryCode
        cities.push({ type: 'city', city: c, stateName, countryName })
      }
      if (cities.length >= 12) break
    }
    /* Prefix matches first within each group. */
    const rank = <T extends { type: string }>(arr: T[], get: (x: T) => string) =>
      arr.sort((a, b) => {
        const an = get(a).toLowerCase(); const bn = get(b).toLowerCase()
        const ap = an.startsWith(q) ? 0 : 1; const bp = bn.startsWith(q) ? 0 : 1
        return ap - bp || an.localeCompare(bn)
      })
    rank(countries, h => (h as Extract<LocHit, { type: 'country' }>).country.name)
    rank(states, h => (h as Extract<LocHit, { type: 'state' }>).state.name)
    rank(cities, h => (h as Extract<LocHit, { type: 'city' }>).city.name)
    out.push(...countries, ...states, ...cities)
    return out
  }, [debouncedQ, ready, allStates, allCities, countryByIso, stateNameByKey])

  /* Pick a result — resolve full hierarchy + close popover. */
  const handlePick = (hit: LocHit) => {
    if (hit.type === 'country') {
      onChange(hit.country, null, null)
    } else if (hit.type === 'state') {
      const c = countryByIso.get(hit.state.isoCode) || null
      if (!c) return
      const s: GeoState = { slug: hit.state.slug, name: hit.state.name, stateCode: hit.state.stateCode, isoCode: hit.state.isoCode }
      onChange(c, s, null)
    } else {
      const c = countryByIso.get(hit.city.countryCode) || null
      if (!c) return
      const stateName = hit.stateName
      const stateRow = allStates.find(r => r.isoCode === hit.city.countryCode && r.stateCode === hit.city.stateCode)
      const s: GeoState = stateRow
        ? { slug: stateRow.slug, name: stateRow.name, stateCode: stateRow.stateCode, isoCode: stateRow.isoCode }
        : { slug: toSlug(stateName), name: stateName, stateCode: hit.city.stateCode, isoCode: hit.city.countryCode }
      const ci: GeoCity = { slug: toSlug(hit.city.name), name: hit.city.name }
      onChange(c, s, ci)
    }
    setQuery('')
    setOpen(false)
  }

  /* Button label — most specific selection wins. */
  const labelParts = [city?.name, state?.name, country?.name].filter(Boolean)
  const buttonLabel = labelParts.join(', ') || 'Search Locations'
  const isActive = !!(country || state || city)

  const clearAll = () => { onChange(null, null, null); setQuery('') }

  const groupedCountries = hits.filter(h => h.type === 'country') as Extract<LocHit, { type: 'country' }>[]
  const groupedStates = hits.filter(h => h.type === 'state') as Extract<LocHit, { type: 'state' }>[]
  const groupedCities = hits.filter(h => h.type === 'city') as Extract<LocHit, { type: 'city' }>[]

  return (
    <div className={'cd-fb-field cd-fb-field--location' + (isActive ? ' cd-fb-field--active' : '')} ref={wrapRef}>
      <button
        type="button"
        className="cd-fb-field-btn"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="cd-fb-field-ico" aria-hidden="true"><FontAwesomeIcon icon={faMagnifyingGlass} /></span>
        <span className="cd-fb-field-label">{buttonLabel}</span>
        {isActive && (
          <span
            className="cd-fb-field-clear"
            role="button"
            tabIndex={0}
            aria-label="Clear location"
            onClick={e => { e.stopPropagation(); clearAll() }}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clearAll() } }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
        )}
        <FontAwesomeIcon icon={faChevronDown} className={'cd-fb-field-chev' + (open ? ' cd-fb-field-chev--open' : '')} />
      </button>

      {open && (
        <div className="cd-fb-pop cd-fb-pop--location" role="dialog" aria-label="Choose location">
          <div className="cd-fb-pop-search">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="cd-fb-pop-search-ico" />
            <input
              type="text"
              className="cd-fb-pop-input"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Type a city, state, or country…"
              spellCheck={false}
              autoComplete="off"
              autoFocus
            />
          </div>

          {!ready ? (
            <div className="cd-fb-pop-empty">Loading locations…</div>
          ) : hits.length === 0 ? (
            <div className="cd-fb-pop-empty">
              {debouncedQ ? `No matches for "${debouncedQ}"` : 'Type to search'}
            </div>
          ) : (
            <ul className="cd-fb-pop-list cd-fb-loc-list">
              {groupedCountries.length > 0 && (
                <li className="cd-fb-loc-group">Countries</li>
              )}
              {groupedCountries.map(h => (
                <li
                  key={`c-${h.country.isoCode}`}
                  className={'cd-fb-pop-opt' + (country?.isoCode === h.country.isoCode ? ' cd-fb-pop-opt--selected' : '')}
                  onClick={() => handlePick(h)}
                >
                  <span className="cd-fb-pop-opt-label">{h.country.name}</span>
                </li>
              ))}
              {groupedStates.length > 0 && (
                <li className="cd-fb-loc-group">States / Regions</li>
              )}
              {groupedStates.map(h => (
                <li
                  key={`s-${h.state.isoCode}-${h.state.stateCode}`}
                  className="cd-fb-pop-opt"
                  onClick={() => handlePick(h)}
                >
                  <span className="cd-fb-pop-opt-label">{h.state.name}</span>
                  <span className="cd-fb-loc-meta">{h.state.countryName}</span>
                </li>
              ))}
              {groupedCities.length > 0 && (
                <li className="cd-fb-loc-group">Cities</li>
              )}
              {groupedCities.map((h, i) => (
                <li
                  key={`ci-${h.city.countryCode}-${h.city.stateCode}-${h.city.name}-${i}`}
                  className="cd-fb-pop-opt"
                  onClick={() => handlePick(h)}
                >
                  <span className="cd-fb-pop-opt-label">{h.city.name}</span>
                  <span className="cd-fb-loc-meta">{h.stateName}, {h.countryName}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export type CategoryFilterBarProps = {
  fields: FilterField[]
  /** Cascading Country/State/City dropdown rendered as the first field. */
  location?: LocationProps
}

export default function CategoryFilterBar({ fields, location }: CategoryFilterBarProps) {
  if ((!fields || fields.length === 0) && !location) return null
  return (
    <div
      className="cd-fb"
      role="search"
      aria-label="Category filters"
    >
      {location && <LocationFilterDropdown {...location} />}
      {fields.map(f => {
        const { key, ...rest } = f
        return <Dropdown key={key} {...rest} />
      })}
    </div>
  )
}
