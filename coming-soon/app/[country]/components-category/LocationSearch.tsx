'use client'
import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import {
  getLocationCountries,
  getStates,
  getCities,
  lookupLocationCountry,
  getAllStatesArray,
  getAllCitiesArray,
  preloadCSC,
  toSlug,
  type GeoCountry,
  type GeoState,
  type GeoCity,
} from '../../lib/geo-slugs'
import { I, ic } from './icons'

type LocResult = {
  type: 'country' | 'state' | 'city'
  name: string
  slug: string
  meta: string
  isoCode?: string
  stateCode?: string
  countrySlug?: string
  stateSlug?: string
}

type Props = {
  effectiveIso: string
  effectiveCountryName: string
  locationCountry: GeoCountry | null
  locationState: GeoState | null
  locationCity: GeoCity | null
  onLocationChange: (country: GeoCountry | null, state: GeoState | null, city: GeoCity | null) => void
}

export default function LocationSearch({ effectiveIso, locationCountry, locationState, locationCity, onLocationChange }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  /* ── Debounced query ── */
  const [dq, setDq] = useState('')
  useEffect(() => {
    const t = setTimeout(() => setDq(query.trim().toLowerCase()), 150)
    return () => clearTimeout(t)
  }, [query])

  /* ── Pre-built indexes (loaded async) ── */
  const [stateIndex, setStateIndex] = useState<Map<string, string>>(new Map())
  const [countryNameByIso, setCountryNameByIso] = useState<Map<string, string>>(new Map())
  const [allStates, setAllStates] = useState<{ name: string; slug: string; stateCode: string; isoCode: string; countryName: string }[]>([])
  const [allCities, setAllCities] = useState<{ name: string; stateCode: string; countryCode: string }[]>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      await preloadCSC()
      if (cancelled) return
      const states = await getAllStatesArray()
      const cities = await getAllCitiesArray()
      const idx = new Map<string, string>()
      states.forEach(s => idx.set(`${s.isoCode}:${s.stateCode}`, s.name))
      const cMap = new Map<string, string>()
      getLocationCountries().forEach(c => cMap.set(c.isoCode, c.name))
      if (!cancelled) {
        setStateIndex(idx)
        setCountryNameByIso(cMap)
        setAllStates(states)
        setAllCities(cities)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  /* ── Search ── */
  const results = useMemo((): LocResult[] => {
    if (!dq || dq.length < 2) return []
    const ql = dq
    const countries: LocResult[] = []
    const states: LocResult[] = []
    const cities: LocResult[] = []

    // Countries (250)
    getLocationCountries().forEach(c => {
      if (c.name.toLowerCase().includes(ql))
        countries.push({ type: 'country', name: c.name, slug: c.slug, meta: '', isoCode: c.isoCode })
    })
    countries.sort((a, b) => (a.name.toLowerCase().startsWith(ql) ? 0 : 1) - (b.name.toLowerCase().startsWith(ql) ? 0 : 1) || a.name.localeCompare(b.name))

    // States (~5K)
    const allSt = allStates
    const localSt: LocResult[] = []
    const otherSt: LocResult[] = []
    for (const s of allSt) {
      if (localSt.length + otherSt.length >= 30) break
      if (s.name.toLowerCase().includes(ql)) {
        const cSlug = lookupLocationCountry(toSlug(s.countryName))?.slug
        const item: LocResult = { type: 'state', name: s.name, slug: s.slug, meta: s.countryName, isoCode: s.isoCode, stateCode: s.stateCode, countrySlug: cSlug }
        if (s.isoCode === effectiveIso) localSt.push(item); else otherSt.push(item)
      }
    }
    localSt.sort((a, b) => (a.name.toLowerCase().startsWith(ql) ? 0 : 1) - (b.name.toLowerCase().startsWith(ql) ? 0 : 1) || a.name.localeCompare(b.name))
    states.push(...localSt, ...otherSt)

    // Cities (~148K)
    const localC: typeof allCities[number][] = []
    const globalC: typeof allCities[number][] = []
    for (const ct of allCities) {
      if (localC.length >= 15 && globalC.length >= 15) break
      if (ct.name.toLowerCase().includes(ql)) {
        if (ct.countryCode === effectiveIso) { if (localC.length < 15) localC.push(ct) }
        else { if (globalC.length < 15) globalC.push(ct) }
      }
    }
    const sortC = (arr: typeof allCities) => arr.sort((a, b) => (a.name.toLowerCase().startsWith(ql) ? 0 : 1) - (b.name.toLowerCase().startsWith(ql) ? 0 : 1) || a.name.localeCompare(b.name))
    sortC(localC); sortC(globalC)
    for (const ct of [...localC, ...globalC].slice(0, 15)) {
      const cName = countryNameByIso.get(ct.countryCode) || ct.countryCode
      const sName = stateIndex.get(`${ct.countryCode}:${ct.stateCode}`) || ct.stateCode
      const cSlug = lookupLocationCountry(toSlug(cName))?.slug
      cities.push({ type: 'city', name: ct.name, slug: toSlug(ct.name), meta: `${sName}, ${cName}`, isoCode: ct.countryCode, stateCode: ct.stateCode, stateSlug: toSlug(sName), countrySlug: cSlug })
    }

    // Deduplicate
    const seen = new Set<string>()
    const dedup = (arr: LocResult[]) => arr.filter(r => { const k = `${r.type}:${r.name}:${r.meta}`; if (seen.has(k)) return false; seen.add(k); return true })
    return [...dedup(countries).slice(0, 6), ...dedup(states).slice(0, 8), ...dedup(cities).slice(0, 10)]
  }, [dq, effectiveIso, stateIndex, countryNameByIso, allStates, allCities])

  /* ── Handle selection ── */
  const handleSelect = useCallback((r: LocResult) => {
    let country: GeoCountry | null = null
    let state: GeoState | null = null
    let city: GeoCity | null = null

    if (r.countrySlug) country = lookupLocationCountry(r.countrySlug)
    else if (r.isoCode) getLocationCountries().forEach(c => { if (c.isoCode === r.isoCode) country = c })

    if (r.type === 'state' && r.isoCode) state = getStates(r.isoCode).get(r.slug) || null
    if (r.type === 'city') {
      if (r.isoCode && r.stateSlug) state = getStates(r.isoCode).get(r.stateSlug) || null
      if (r.isoCode && r.stateCode) city = getCities(r.isoCode, r.stateCode).get(r.slug) || null
    }

    onLocationChange(country, state, city)
    setQuery('')
    setOpen(false)
  }, [onLocationChange])

  /* ── Close ── */
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey) }
  }, [open])

  const clearLocation = () => onLocationChange(null, null, null)

  return (
    <div className="cd-loc-search" ref={ref}>
      <div className="cd-loc-bar">
        <I d={ic.search} size={16} color="var(--h-muted)" sw={2} />
        <input
          className="cd-loc-input"
          placeholder="Search country, state, or city..."
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => { if (query.length >= 2) setOpen(true) }}
        />
        {(locationCity || locationState || locationCountry) && (
          <button type="button" className="cd-loc-clear" onClick={clearLocation} title="Clear location">
            <I d={ic.x} size={14} color="var(--h-muted)" sw={2} />
          </button>
        )}
      </div>
      {open && dq.length >= 2 && results.length === 0 && (
        <div className="cd-loc-dropdown">
          <div className="cd-loc-empty">No locations found for &ldquo;{dq}&rdquo;</div>
        </div>
      )}
      {open && results.length > 0 && (
        <div className="cd-loc-dropdown">
          {results.some(r => r.type === 'country') && (
            <>
              <div className="cd-loc-group-label">Countries</div>
              {results.filter(r => r.type === 'country').map(r => (
                <button key={`c-${r.slug}`} type="button" className="cd-loc-option" onClick={() => handleSelect(r)}>
                  <span className="cd-loc-option-name">{r.name}</span>
                </button>
              ))}
            </>
          )}
          {results.some(r => r.type === 'state') && (
            <>
              <div className="cd-loc-group-label">States</div>
              {results.filter(r => r.type === 'state').map(r => (
                <button key={`s-${r.slug}-${r.isoCode}`} type="button" className="cd-loc-option" onClick={() => handleSelect(r)}>
                  <span className="cd-loc-option-name">{r.name}</span>
                  <span className="cd-loc-option-meta">{r.meta}</span>
                </button>
              ))}
            </>
          )}
          {results.some(r => r.type === 'city') && (
            <>
              <div className="cd-loc-group-label">Cities</div>
              {results.filter(r => r.type === 'city').map(r => (
                <button key={`ct-${r.slug}-${r.stateCode}`} type="button" className="cd-loc-option" onClick={() => handleSelect(r)}>
                  <span className="cd-loc-option-name">{r.name}</span>
                  <span className="cd-loc-option-meta">{r.meta}</span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
