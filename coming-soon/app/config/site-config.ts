/**
 * Site Config — fetches from MySQL via api.php.
 * Admin edits via /iww-hq/settings → saved to DB.
 * All landing page components read from here.
 */

const API = '/api'

export type SiteConfig = {
  pioneerJoined: number
  pioneerTotal: number
  totalSpots: number
  statWaitlist: string
  statListings: string
  statIndustries: string
  statCountries: string
  statLanguages: string
  launchDate: string
  foundingPrice: number
  earlyAdopterPrice: number
  standardPrice: number
  lifetimeSlotsTotal: number
  lifetimeSlotsClaimed: number
  yearlySlotsTotal: number
  yearlySlotsClaimed: number
  useRealData: boolean
}

export const defaults: SiteConfig = {
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
  lifetimeSlotsTotal: 199,
  lifetimeSlotsClaimed: 0,
  yearlySlotsTotal: 999,
  yearlySlotsClaimed: 0,
  useRealData: false,
}

/* ── In-memory cache ── */
let _cache: SiteConfig | null = null
let _cacheTime = 0
const CACHE_TTL = 120_000 // 2 minutes

/** Fetch config from DB, with in-memory + defaults fallback */
export async function fetchConfig(): Promise<SiteConfig> {
  if (_cache && Date.now() - _cacheTime < CACHE_TTL) return _cache

  try {
    const res = await fetch(`${API}/settings`, { cache: 'no-store' })
    if (!res.ok) throw new Error('fail')
    const json = await res.json()
    const data = json.data ?? json
    const cfg: SiteConfig = {
      pioneerJoined: Number(data.pioneerJoined ?? defaults.pioneerJoined),
      pioneerTotal: Number(data.pioneerTotal ?? defaults.pioneerTotal),
      totalSpots: Number(data.totalSpots ?? defaults.totalSpots),
      statWaitlist: String(data.statWaitlist ?? defaults.statWaitlist),
      statListings: String(data.statListings ?? defaults.statListings),
      statIndustries: String(data.statIndustries ?? defaults.statIndustries),
      statCountries: String(data.statCountries ?? defaults.statCountries),
      statLanguages: String(data.statLanguages ?? defaults.statLanguages),
      launchDate: String(data.launchDate ?? defaults.launchDate),
      foundingPrice: Number(data.foundingPrice ?? defaults.foundingPrice),
      earlyAdopterPrice: Number(data.earlyAdopterPrice ?? defaults.earlyAdopterPrice),
      standardPrice: Number(data.standardPrice ?? defaults.standardPrice),
      lifetimeSlotsTotal: Number(data.lifetimeSlotsTotal ?? defaults.lifetimeSlotsTotal),
      lifetimeSlotsClaimed: Number(data.lifetimeSlotsClaimed ?? defaults.lifetimeSlotsClaimed),
      yearlySlotsTotal: Number(data.yearlySlotsTotal ?? defaults.yearlySlotsTotal),
      yearlySlotsClaimed: Number(data.yearlySlotsClaimed ?? defaults.yearlySlotsClaimed),
      useRealData: data.useRealData === 'true' || data.useRealData === true,
    }
    _cache = cfg
    _cacheTime = Date.now()
    return cfg
  } catch {
    return _cache ?? defaults
  }
}

/** Save config to DB via API */
export async function saveConfigToAPI(config: SiteConfig): Promise<boolean> {
  try {
    const res = await fetch(`${API}/admin/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pioneerJoined: String(config.pioneerJoined),
        pioneerTotal: String(config.pioneerTotal),
        totalSpots: String(config.totalSpots),
        statWaitlist: config.statWaitlist,
        statListings: config.statListings,
        statIndustries: config.statIndustries,
        statCountries: config.statCountries,
        statLanguages: config.statLanguages,
        launchDate: config.launchDate,
        foundingPrice: String(config.foundingPrice),
        earlyAdopterPrice: String(config.earlyAdopterPrice),
        standardPrice: String(config.standardPrice),
        lifetimeSlotsTotal: String(config.lifetimeSlotsTotal),
        lifetimeSlotsClaimed: String(config.lifetimeSlotsClaimed),
        yearlySlotsTotal: String(config.yearlySlotsTotal),
        yearlySlotsClaimed: String(config.yearlySlotsClaimed),
        useRealData: String(config.useRealData),
      }),
    })
    if (res.ok) { _cache = config; _cacheTime = Date.now() }
    return res.ok
  } catch { return false }
}

/** Fetch live counts from DB (waitlist, submissions, paid) */
export async function fetchLiveStats(): Promise<{ waitlistCount: number; submissionCount: number; paidCount: number }> {
  try {
    const res = await fetch(`${API}/stats/live`, { cache: 'no-store' })
    if (!res.ok) throw new Error('fail')
    const json = await res.json()
    return json.data ?? json
  } catch {
    return { waitlistCount: 0, submissionCount: 0, paidCount: 0 }
  }
}

// Sync compat — used during SSR/build only
export function getConfig(): SiteConfig { return defaults }
export function getDefaults(): SiteConfig { return { ...defaults } }
export function saveConfig(_c: SiteConfig) {}
