/* ── Country routing configuration ── */

export const VALID_COUNTRIES = ['in', 'uk', 'ca', 'au', 'eu'] as const
export type CountryCode = (typeof VALID_COUNTRIES)[number]

export const DEFAULT_COUNTRY: CountryCode = 'in'
export const COOKIE_NAME = 'iww-country'
export const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 1 year

export const COUNTRY_LABELS: Record<CountryCode, string> = {
  in: 'India',
  uk: 'United Kingdom',
  ca: 'Canada',
  au: 'Australia',
  eu: 'Europe',
}

export const COUNTRY_FLAGS: Record<CountryCode, string> = {
  in: '\u{1F1EE}\u{1F1F3}',
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
  if (code === 'GB') return 'uk'
  if (code === 'CA') return 'ca'
  if (code === 'AU') return 'au'
  if (EU_CODES.has(code)) return 'eu'
  return DEFAULT_COUNTRY
}

export function isValidCountry(s: string): s is CountryCode {
  return (VALID_COUNTRIES as readonly string[]).includes(s)
}
