import type { ParsedCategoryFilters } from './parse-segments'

/**
 * Build a category URL from parsed filters.
 * Returns path starting from /category/...
 * The country routing prefix (/in, /us, etc.) is NOT included — caller adds it.
 */
export function buildCategoryUrl(filters: Partial<ParsedCategoryFilters> & { categorySlug: string }): string {
  const parts = ['/category', filters.categorySlug]

  if (filters.locationCountry) {
    parts.push(filters.locationCountry.slug)

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
