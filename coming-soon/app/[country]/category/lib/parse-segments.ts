import {
  lookupLocationCountry,
  lookupState,
  lookupCity,
  type GeoCountry,
  type GeoState,
  type GeoCity,
} from '../../../lib/geo-slugs'

/* ── Parsed result ── */
export type ParsedCategoryFilters = {
  categorySlug: string
  locationCountry: GeoCountry | null
  state: GeoState | null
  city: GeoCity | null
  listingType: string | null
  tags: string[]
}

/**
 * Parse URL segments into structured filter object.
 *
 * segments[0] = category slug (required)
 * Remaining segments are parsed left-to-right:
 *   1. Try as location country
 *   2. If country matched, try next as state of that country
 *   3. If state matched, try next as city of that state
 *   4. Try next as listing type slug (checked against known slugs)
 *   5. All remaining = tag slugs
 *
 * @param segments - URL path segments after /category/
 * @param knownListingTypeSlugs - Set of valid listing type slugs (for disambiguation)
 * @param knownTagSlugs - Set of valid tag slugs
 */
export function parseSegments(
  segments: string[],
  knownListingTypeSlugs: Set<string> = new Set(),
  knownTagSlugs: Set<string> = new Set(),
): ParsedCategoryFilters {
  const result: ParsedCategoryFilters = {
    categorySlug: segments[0] || '',
    locationCountry: null,
    state: null,
    city: null,
    listingType: null,
    tags: [],
  }

  let i = 1 // start after category slug

  // 1. Location country
  if (i < segments.length) {
    const country = lookupLocationCountry(segments[i])
    if (country) {
      result.locationCountry = country
      i++

      // 2. State
      if (i < segments.length) {
        const state = lookupState(country.isoCode, segments[i])
        if (state) {
          result.state = state
          i++

          // 3. City
          if (i < segments.length) {
            const city = lookupCity(country.isoCode, state.stateCode, segments[i])
            if (city) {
              result.city = city
              i++
            }
          }
        }
      }
    }
  }

  // 4. Listing type (first non-location segment that matches a known listing type)
  if (i < segments.length && knownListingTypeSlugs.has(segments[i])) {
    result.listingType = segments[i]
    i++
  }

  // 5. Remaining segments = tag slugs
  while (i < segments.length) {
    const seg = segments[i]
    if (knownTagSlugs.has(seg)) {
      result.tags.push(seg)
    }
    // Skip unknown segments gracefully
    i++
  }

  return result
}
