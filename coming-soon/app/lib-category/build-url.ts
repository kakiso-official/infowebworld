import type { ParsedCategoryFilters } from './parse-segments'

/**
 * Build a category URL with filters as query parameters.
 * Base path: /{sectorSlug}/{categorySlug}
 * Filters:   ?country=X&state=Y&city=Z&type=X&tags=X,Y
 *
 * Query-param URLs are naturally non-crawlable and feel like "filters applied".
 */
export function buildCategoryUrl(
  filters: Partial<ParsedCategoryFilters> & { categorySlug: string },
  _routeCountryGeoSlug?: string,
  sectorSlug?: string,
): string {
  // Base path — just sector + category slug, no filter segments
  const basePath = sectorSlug
    ? `/${sectorSlug}/${filters.categorySlug}`
    : `/${filters.categorySlug}`

  // Build query params for active filters
  const params = new URLSearchParams()

  if (filters.locationCountry?.slug) {
    params.set('country', filters.locationCountry.slug)
  }
  if (filters.state?.slug) {
    params.set('state', filters.state.slug)
  }
  if (filters.city?.slug) {
    params.set('city', filters.city.slug)
  }
  if (filters.listingType) {
    params.set('type', filters.listingType)
  }
  if (filters.tags && filters.tags.length > 0) {
    params.set('tags', filters.tags.join(','))
  }

  const qs = params.toString()
  return qs ? `${basePath}?${qs}` : basePath
}
