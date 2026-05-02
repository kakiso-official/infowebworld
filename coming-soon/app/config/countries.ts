/* ── Country routing removed — single global URL space ──
   This file is kept as a compat shim so existing call sites that import
   countryHref() / etc. keep compiling without per-file edits. The functions
   ignore any country argument and return bare paths. */

/** Stub type — kept so `country: string` props don't immediately break */
export type CountryCode = string

/** Empty list — generateStaticParams() callers will produce zero pre-rendered
 *  country variants. Routes are now dynamic with a single URL space. */
export const VALID_COUNTRIES: readonly string[] = []
export const REAL_COUNTRIES: readonly string[] = []
export const DEFAULT_COUNTRY = ''
export const GLOBAL_COUNTRY = ''
export const GLOBAL_COOKIE = ''
export const COOKIE_NAME = ''
export const COOKIE_MAX_AGE = 0

export const COUNTRY_LABELS: Record<string, string> = {}
export const COUNTRY_FLAGS: Record<string, string> = {}
export const COUNTRY_FLAG_ISO: Record<string, string> = {}
export const ROUTE_TO_GEO_SLUG: Record<string, string> = {}
export const ROUTE_TO_ISO: Record<string, string> = {}

export function geoToCountry(_iso: string | null | undefined): null {
  return null
}

export function isValidCountry(_s: string): _s is CountryCode {
  return false
}

/** All paths are now bare. Country argument ignored. */
export function countryHref(_country: string | null | undefined, path: string = ''): string {
  if (!path) return '/'
  return path.startsWith('/') ? path : `/${path}`
}
