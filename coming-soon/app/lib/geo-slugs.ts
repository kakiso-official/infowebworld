import { Country, State, City, type ICity } from 'country-state-city'

/* ── Slug helper ── */
export function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/* ── Types ── */
export type GeoCountry = { slug: string; name: string; isoCode: string }
export type GeoState = { slug: string; name: string; stateCode: string; isoCode: string }
export type GeoCity = { slug: string; name: string }

/* ── Lazy caches ── */
let _countries: Map<string, GeoCountry> | null = null
const _stateCache = new Map<string, Map<string, GeoState>>()
const _cityCache = new Map<string, Map<string, GeoCity>>()

/* ── Countries ── */
export function getLocationCountries(): Map<string, GeoCountry> {
  if (_countries) return _countries
  _countries = new Map()
  for (const c of Country.getAllCountries()) {
    const slug = toSlug(c.name)
    _countries.set(slug, { slug, name: c.name, isoCode: c.isoCode })
  }
  return _countries
}

export function lookupLocationCountry(slug: string): GeoCountry | null {
  return getLocationCountries().get(slug) || null
}

/* ── States ── */
export function getStates(countryIso: string): Map<string, GeoState> {
  const key = countryIso.toUpperCase()
  if (_stateCache.has(key)) return _stateCache.get(key)!
  const map = new Map<string, GeoState>()
  for (const s of State.getStatesOfCountry(key)) {
    const slug = toSlug(s.name)
    map.set(slug, { slug, name: s.name, stateCode: s.isoCode, isoCode: key })
  }
  _stateCache.set(key, map)
  return map
}

export function lookupState(countryIso: string, slug: string): GeoState | null {
  return getStates(countryIso).get(slug) || null
}

/* ── Cities ── */
export function getCities(countryIso: string, stateCode: string): Map<string, GeoCity> {
  const key = `${countryIso.toUpperCase()}:${stateCode}`
  if (_cityCache.has(key)) return _cityCache.get(key)!
  const map = new Map<string, GeoCity>()
  for (const c of City.getCitiesOfState(countryIso.toUpperCase(), stateCode)) {
    const slug = toSlug(c.name)
    if (!map.has(slug)) map.set(slug, { slug, name: c.name })
  }
  _cityCache.set(key, map)
  return map
}

export function lookupCity(countryIso: string, stateCode: string, slug: string): GeoCity | null {
  return getCities(countryIso, stateCode).get(slug) || null
}

/* ── Global search helpers ── */
let _allStatesArr: { name: string; slug: string; stateCode: string; isoCode: string; countryName: string }[] | null = null
let _allCitiesArr: ICity[] | null = null

export function getAllStatesArray() {
  if (_allStatesArr) return _allStatesArr
  const countriesMap = getLocationCountries()
  const countryByIso = new Map<string, string>()
  countriesMap.forEach(c => countryByIso.set(c.isoCode, c.name))
  _allStatesArr = State.getAllStates().map(s => ({
    name: s.name,
    slug: toSlug(s.name),
    stateCode: s.isoCode,
    isoCode: s.countryCode,
    countryName: countryByIso.get(s.countryCode) || s.countryCode,
  }))
  return _allStatesArr
}

export function getAllCitiesArray(): ICity[] {
  if (_allCitiesArr) return _allCitiesArr
  _allCitiesArr = City.getAllCities()
  return _allCitiesArr
}
