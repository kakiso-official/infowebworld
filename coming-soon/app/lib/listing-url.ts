/**
 * Public-listing URL builder.
 *
 * Single source of truth for the /profile/<slug> vs /company/<slug>
 * split. Companies live at /profile/<slug> (one-per-user, agency / firm /
 * studio identity). Products live at /company/<slug> (per-product
 * detail page, many per company).
 *
 * The split is intentional: legacy product slugs are already deployed
 * under /company/, and changing them would invalidate every external
 * link to existing listings. Companies got the new namespace.
 *
 * Use this anywhere you need to render a link to a public listing
 * surface. Branch on `listing_mode`, never hardcode the prefix.
 */
export function publicListingUrl(
  slug: string | null | undefined,
  mode: 'product' | 'company' | string | null | undefined,
): string {
  const s = (slug || '').trim()
  if (!s) return ''
  return mode === 'company' ? `/profile/${s}` : `/company/${s}`
}
