import { query } from '@/lib/db'
import { unstable_cache } from 'next/cache'

/* ════════════════════════════════════════════════════════════════════════
   Data for the homepage "Businesses Near You, Businesses Around the World"
   section (CountriesSection.tsx). Server-only module - never import this
   from a Client Component.
   ════════════════════════════════════════════════════════════════════════ */

export type CountryCount = { name: string; code: string; listings: number | null }

/* A handful of countries are stored in the `countries` table with a
   shorthand name rather than the full country name (see database/seed.sql).
   This site's SEO rules require full country names everywhere (never
   abbreviations) - see MEMORY seo_country_chip_serp_title. Every other
   stored name is already a full name and passes through unchanged. */
const FULL_NAME_OVERRIDES: Record<string, string> = {
  UAE: 'United Arab Emirates',
}

function toDisplayName(storedName: string): string {
  return FULL_NAME_OVERRIDES[storedName] ?? storedName
}

/* Static fallback - the 12 biggest real markets we have listings in, used
   only when the live DB query fails. listings is null throughout so the
   UI never prints an invented number. */
const FALLBACK_COUNTRIES: CountryCount[] = [
  { name: 'United States', code: 'US', listings: null },
  { name: 'United Kingdom', code: 'GB', listings: null },
  { name: 'India', code: 'IN', listings: null },
  { name: 'Canada', code: 'CA', listings: null },
  { name: 'Australia', code: 'AU', listings: null },
  { name: 'Germany', code: 'DE', listings: null },
  { name: 'France', code: 'FR', listings: null },
  { name: 'Netherlands', code: 'NL', listings: null },
  { name: 'Poland', code: 'PL', listings: null },
  { name: 'Ukraine', code: 'UA', listings: null },
  { name: 'Singapore', code: 'SG', listings: null },
  { name: 'United Arab Emirates', code: 'AE', listings: null },
]

async function fetchCountryListingCounts(): Promise<CountryCount[]> {
  try {
    const rows = await query<{ name: string; code: string; n: number | string }>(
      `SELECT co.name, co.code, COUNT(s.id) AS n
         FROM countries co
         JOIN submissions s ON s.country_id = co.id AND s.status IN ('active', 'paid')
        WHERE co.code <> 'XX' AND co.name <> 'Other'
        GROUP BY co.id, co.name, co.code
       HAVING n > 0
        ORDER BY n DESC, co.name`
    )
    if (!rows.length) return FALLBACK_COUNTRIES
    return rows.map(r => ({
      name: toDisplayName(r.name),
      code: r.code,
      listings: Number(r.n),
    }))
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (!/Unknown column|Table.*doesn't exist/.test(msg)) {
      console.warn('[home] country listing counts fetch failed:', err)
    }
    return FALLBACK_COUNTRIES
  }
}

/* Data-cached 10 minutes, same pattern as the other homepage fetchers in
   app/page.tsx. unstable_cache serialises the result to JSON, which is fine
   here - every field is already a plain string/number. */
export const getCountryListingCounts = unstable_cache(
  fetchCountryListingCounts,
  ['home-countries-v1'],
  { revalidate: 600 }
)

/* Same counts limited to one L1 sector (the AI tools directory's
   "Explore SI & AI Tools Around the World"). A listing belongs to the
   sector when the sector is its category or any of its 4 ancestors, so
   listings filed at L4/L5 count too. Falls back to the same count-less
   static list; all 12 of those markets hold listings in every sector. */
async function fetchSectorCountryListingCounts(sectorSlug: string): Promise<CountryCount[]> {
  try {
    const rows = await query<{ name: string; code: string; n: number | string }>(
      `SELECT co.name, co.code, COUNT(s.id) AS n
         FROM submissions s
         JOIN countries co           ON co.id     = s.country_id
         LEFT JOIN categories c      ON c.id      = s.category_id
         LEFT JOIN categories cp     ON cp.id     = c.parent_id
         LEFT JOIN categories cgp    ON cgp.id    = cp.parent_id
         LEFT JOIN categories cggp   ON cggp.id   = cgp.parent_id
         LEFT JOIN categories cgggp  ON cgggp.id  = cggp.parent_id
        WHERE s.status IN ('active', 'paid')
          AND co.code <> 'XX' AND co.name <> 'Other'
          AND (c.slug = ? OR cp.slug = ? OR cgp.slug = ? OR cggp.slug = ? OR cgggp.slug = ?)
        GROUP BY co.id, co.name, co.code
        ORDER BY n DESC, co.name`,
      [sectorSlug, sectorSlug, sectorSlug, sectorSlug, sectorSlug]
    )
    if (!rows.length) return FALLBACK_COUNTRIES
    return rows.map(r => ({
      name: toDisplayName(r.name),
      code: r.code,
      listings: Number(r.n),
    }))
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (!/Unknown column|Table.*doesn't exist/.test(msg)) {
      console.warn(`[countries] ${sectorSlug} listing counts fetch failed:`, err)
    }
    return FALLBACK_COUNTRIES
  }
}

export const getSectorCountryListingCounts = unstable_cache(
  fetchSectorCountryListingCounts,
  ['sector-countries-v1'],
  { revalidate: 600 }
)
