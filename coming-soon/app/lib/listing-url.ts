/**
 * Public-listing URL builder.
 *
 * Single source of truth for the /profile/<slug> vs /listing/<slug>
 * split. Companies-as-entities live at /profile/<slug> (one-per-user,
 * agency / firm / studio identity). Products live at /listing/<slug>
 * (per-product detail page, many per parent company).
 *
 * Legacy: until May 2026 products were canonically /company/<slug>;
 * we swapped to /listing/<slug> so the URL matches what the page
 * actually is (a product listing, not the company). /company/<slug>
 * still resolves via 308 permanent redirect to /listing/<slug>.
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
  return mode === 'company' ? `/profile/${s}` : `/listing/${s}`
}
