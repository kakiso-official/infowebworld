/**
 * Fire-and-forget client tracker for outbound "Visit website" clicks.
 *
 * Uses `navigator.sendBeacon` when available so the request survives the
 * page navigating away (the click that triggered it is also opening
 * another tab/window). Falls back to fetch+keepalive otherwise.
 *
 * Wired into every public surface that renders a listing's outbound URL:
 *   - ListingCard.tsx           campaign: 'category-card'
 *   - ListingDetailPage.tsx     campaign: 'listing' (and 'integrations')
 *   - CompanyDetailPage.tsx     campaign: 'profile'
 *   - ComparePage.tsx           campaign: 'compare'
 *
 * The campaign string is purely for our own attribution — the live UTM
 * tag on the URL itself (utm_campaign) is set independently by
 * `withInfoWebWorldUtm()` so the listing owner sees identical
 * campaign labels in their analytics.
 *
 * Server-side dedup keeps repeated clicks within 30 minutes from the
 * same visitor + same listing counted as one — no need to dedup here.
 */
export function trackWebsiteClick(slug: string, campaign: string = 'listing'): void {
  if (typeof window === 'undefined') return
  if (!slug) return
  try {
    const body = JSON.stringify({ slug, campaign })
    const url = '/api/track/website-click'
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' })
      navigator.sendBeacon(url, blob)
      return
    }
    fetch(url, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    }).catch(() => {})
  } catch {
    /* swallow — tracking failure must never break the visitor's click */
  }
}
