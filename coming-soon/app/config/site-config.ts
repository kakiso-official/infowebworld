/**
 * Site Config — single source of truth for all editable numbers.
 * Admin edits these via /iww-hq/settings → stored in localStorage.
 * All landing page components read from here.
 */

const KEY = 'iww_site_config'

export type SiteConfig = {
  /* Pioneer tier */
  pioneerJoined: number
  pioneerTotal: number
  totalSpots: number

  /* Stats section */
  statWaitlist: string
  statListings: string
  statIndustries: string
  statCountries: string
  statLanguages: string

  /* Launch */
  launchDate: string

  /* Pricing */
  foundingPrice: number
  earlyAdopterPrice: number
  standardPrice: number
}

const defaults: SiteConfig = {
  pioneerJoined: 15,
  pioneerTotal: 200,
  totalSpots: 5000,

  statWaitlist: '10,000+',
  statListings: '500+',
  statIndustries: '80+',
  statCountries: '12',
  statLanguages: '8',

  launchDate: '2026-04-25T00:00:00',

  foundingPrice: 240,
  earlyAdopterPrice: 99,
  standardPrice: 240,
}

export function getConfig(): SiteConfig {
  if (typeof window === 'undefined') return defaults
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaults
    return { ...defaults, ...JSON.parse(raw) }
  } catch { return defaults }
}

export function saveConfig(config: SiteConfig) {
  localStorage.setItem(KEY, JSON.stringify(config))
}

export function getDefaults(): SiteConfig {
  return { ...defaults }
}
