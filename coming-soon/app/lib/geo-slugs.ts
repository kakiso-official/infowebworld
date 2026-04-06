/* ── Lazy-loaded geo data — country-state-city (17MB) only loads when functions are called ── */

/* ── Slug helper ── */
export function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/* ── Types ── */
export type GeoCountry = { slug: string; name: string; isoCode: string }
export type GeoState = { slug: string; name: string; stateCode: string; isoCode: string }
export type GeoCity = { slug: string; name: string }

/* ── Lazy module reference ── */
let _csc: typeof import('country-state-city') | null = null
async function loadCSC() {
  if (!_csc) _csc = await import('country-state-city')
  return _csc
}

/* Synchronous cache — populated after first async call */
let _countries: Map<string, GeoCountry> | null = null
const _stateCache = new Map<string, Map<string, GeoState>>()
const _cityCache = new Map<string, Map<string, GeoCity>>()

/* ── Countries ── */
export function getLocationCountries(): Map<string, GeoCountry> {
  if (_countries) return _countries
  /* If CSC hasn't been loaded yet, return empty — caller should use async version */
  if (!_csc) return new Map()
  _countries = new Map()
  for (const c of _csc.Country.getAllCountries()) {
    const slug = toSlug(c.name)
    _countries.set(slug, { slug, name: c.name, isoCode: c.isoCode })
  }
  return _countries
}

/** Async version — ensures CSC is loaded before building map */
export async function getLocationCountriesAsync(): Promise<Map<string, GeoCountry>> {
  if (_countries) return _countries
  await loadCSC()
  return getLocationCountries()
}

export function lookupLocationCountry(slug: string): GeoCountry | null {
  return getLocationCountries().get(slug) || null
}

/** Async lookup — safe to call before CSC is loaded */
export async function lookupLocationCountryAsync(slug: string): Promise<GeoCountry | null> {
  const map = await getLocationCountriesAsync()
  return map.get(slug) || null
}

/* ── States ── */
export function getStates(countryIso: string): Map<string, GeoState> {
  const key = countryIso.toUpperCase()
  if (_stateCache.has(key)) return _stateCache.get(key)!
  if (!_csc) return new Map()
  const map = new Map<string, GeoState>()
  for (const s of _csc.State.getStatesOfCountry(key)) {
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
  if (!_csc) return new Map()
  const map = new Map<string, GeoCity>()
  for (const c of _csc.City.getCitiesOfState(countryIso.toUpperCase(), stateCode)) {
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
type StateEntry = { name: string; slug: string; stateCode: string; isoCode: string; countryName: string }
let _allStatesArr: StateEntry[] | null = null
let _allCitiesArr: { name: string; stateCode: string; countryCode: string }[] | null = null

export async function getAllStatesArray(): Promise<StateEntry[]> {
  if (_allStatesArr) return _allStatesArr
  const csc = await loadCSC()
  const countriesMap = await getLocationCountriesAsync()
  const countryByIso = new Map<string, string>()
  countriesMap.forEach(c => countryByIso.set(c.isoCode, c.name))
  _allStatesArr = csc.State.getAllStates().map(s => ({
    name: s.name,
    slug: toSlug(s.name),
    stateCode: s.isoCode,
    isoCode: s.countryCode,
    countryName: countryByIso.get(s.countryCode) || s.countryCode,
  }))
  return _allStatesArr
}

export async function getAllCitiesArray(): Promise<{ name: string; stateCode: string; countryCode: string }[]> {
  if (_allCitiesArr) return _allCitiesArr
  const csc = await loadCSC()
  _allCitiesArr = csc.City.getAllCities().map(c => ({ name: c.name, stateCode: c.stateCode, countryCode: c.countryCode }))
  return _allCitiesArr
}

/** Pre-load CSC module — call this when user is about to interact with location features */
export async function preloadCSC(): Promise<void> {
  await loadCSC()
  getLocationCountries()
}
