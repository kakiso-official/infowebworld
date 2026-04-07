/* ── Country routing configuration ── */

export const VALID_COUNTRIES = ['in', 'us', 'uk', 'ca', 'au', 'eu'] as const
export type CountryCode = (typeof VALID_COUNTRIES)[number]

export const DEFAULT_COUNTRY: CountryCode = 'in'
/** US uses root URLs (no /us/ prefix) — all other countries get /{code}/ prefix */
export const ROOT_COUNTRY: CountryCode = 'us'
export const COOKIE_NAME = 'iww-country'
export const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 1 year

export const COUNTRY_LABELS: Record<CountryCode, string> = {
  in: 'India',
  us: 'United States',
  uk: 'United Kingdom',
  ca: 'Canada',
  au: 'Australia',
  eu: 'Europe',
}

export const COUNTRY_FLAGS: Record<CountryCode, string> = {
  in: '\u{1F1EE}\u{1F1F3}',
  us: '\u{1F1FA}\u{1F1F8}',
  uk: '\u{1F1EC}\u{1F1E7}',
  ca: '\u{1F1E8}\u{1F1E6}',
  au: '\u{1F1E6}\u{1F1FA}',
  eu: '\u{1F1EA}\u{1F1FA}',
}

/* Map Vercel's x-vercel-ip-country (ISO 3166-1 alpha-2) to our slugs */
const EU_CODES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'NO', 'CH', 'IS',
])

export function geoToCountry(isoCode: string | null | undefined): CountryCode {
  if (!isoCode) return DEFAULT_COUNTRY
  const code = isoCode.toUpperCase()
  if (code === 'IN') return 'in'
  if (code === 'US') return 'us'
  if (code === 'UK') return 'uk'
  if (code === 'CA') return 'ca'
  if (code === 'AU') return 'au'
  if (EU_CODES.has(code)) return 'eu'
  return DEFAULT_COUNTRY
}

export function isValidCountry(s: string): s is CountryCode {
  return (VALID_COUNTRIES as readonly string[]).includes(s)
}

/** Countries that appear in the URL as a prefix (excludes ROOT_COUNTRY) */
export const PREFIXED_COUNTRIES = VALID_COUNTRIES.filter(c => c !== ROOT_COUNTRY)

/**
 * Map route country code → geo-slugs country slug (used by country-state-city).
 * EU is not a single country so it has no geo slug.
 */
export const ROUTE_TO_GEO_SLUG: Partial<Record<CountryCode, string>> = {
  in: 'india',
  us: 'united-states',
  uk: 'united-kingdom',
  ca: 'canada',
  au: 'australia',
}

/** Map route country code → ISO 3166-1 alpha-2 code (for country-state-city lookups) */
export const ROUTE_TO_ISO: Partial<Record<CountryCode, string>> = {
  in: 'IN',
  us: 'US',
  uk: 'UK',
  ca: 'CA',
  au: 'AU',
}
