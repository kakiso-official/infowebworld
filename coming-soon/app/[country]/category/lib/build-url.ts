import type { ParsedCategoryFilters } from './parse-segments'

/**
 * Build a category URL from parsed filters.
 * Returns path starting from /category/...
 * The country routing prefix (/in, /us, etc.) is NOT included — caller adds it.
 *
 * @param filters - The filter state to encode
 * @param routeCountryGeoSlug - The geo slug of the route's country prefix (e.g. 'india' for /in).
 *   When the selected location country matches this, the country segment is omitted from the URL
 *   since it's already implied by the route prefix.
 */
export function buildCategoryUrl(
  filters: Partial<ParsedCategoryFilters> & { categorySlug: string },
  routeCountryGeoSlug?: string,
): string {
  const parts = ['/category', filters.categorySlug]

  if (filters.locationCountry) {
    // Skip the country segment if it matches the route country prefix
    const sameAsRoute = routeCountryGeoSlug && filters.locationCountry.slug === routeCountryGeoSlug

    if (!sameAsRoute) {
      parts.push(filters.locationCountry.slug)
    }

    if (filters.state) {
      parts.push(filters.state.slug)

      if (filters.city) {
        parts.push(filters.city.slug)
      }
    }
  }

  if (filters.listingType) {
    parts.push(filters.listingType)
  }

  for (const tag of filters.tags || []) {
    parts.push(tag)
  }

  return parts.join('/')
}
