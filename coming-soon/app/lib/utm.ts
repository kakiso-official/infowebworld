/**
 * Tag an outbound URL with InfoWebWorld referral UTM params so the listing
 * owner's own analytics (GA, Plausible, …) independently attributes traffic
 * back to us. Preserves any existing query string the company already has
 * on their URL; falls back to the raw URL if it can't be parsed.
 *
 * Single source of truth — every public "Visit website" link should pass
 * through here so attribution stays consistent across:
 *   - /company/[slug] (product page) and /profile/[slug] (company page)
 *   - L1/L2/L3 category listing cards (ListingCard.tsx)
 *   - Integrations cross-links on the listing page
 *   - /compare side-by-side cards
 */
export function withInfoWebWorldUtm(
  url: string,
  slug?: string,
  campaign: string = 'listing',
): string {
  if (!url) return url
  try {
    const u = new URL(/^https?:\/\//.test(url) ? url : `https://${url}`)
    if (!u.searchParams.has('utm_source'))   u.searchParams.set('utm_source', 'infowebworld')
    if (!u.searchParams.has('utm_medium'))   u.searchParams.set('utm_medium', 'referral')
    if (!u.searchParams.has('utm_campaign')) u.searchParams.set('utm_campaign', campaign)
    if (slug && !u.searchParams.has('utm_content')) u.searchParams.set('utm_content', slug)
    return u.toString()
  } catch {
    return url
  }
}
