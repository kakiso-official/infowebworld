/**
 * InfoWebWorld — Visitor Tracking V3
 *
 * - Persistent visitor ID via HttpOnly cookie (set by server, 1 year)
 * - 30-min server-side dedup (same visitor + same page = no new row)
 * - 5s client-side throttle (prevents double-fires from React re-renders)
 * - UTM params extracted from URL
 * - Bot filtering, device/country detection all server-side
 */

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let id = sessionStorage.getItem('iww_sid')
  if (!id) { id = crypto.randomUUID(); sessionStorage.setItem('iww_sid', id) }
  return id
}

/** Extract UTM parameters from current URL */
function getUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const utm: Record<string, string> = {}
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) {
    const val = params.get(key)
    if (val) utm[key] = val
  }
  return utm
}

// --- Client-side throttle: prevent duplicate fires within 5 seconds ---
let lastPageTrack: { page: string; time: number } | null = null
let lastBlogTrack: { slug: string; time: number } | null = null

export function trackPageView(page: string) {
  if (typeof window === 'undefined') return

  // Skip if same page tracked within 5 seconds (React re-renders, fast nav)
  const now = Date.now()
  if (lastPageTrack && lastPageTrack.page === page && now - lastPageTrack.time < 5000) return
  lastPageTrack = { page, time: now }

  const utm = getUtmParams()

  fetch('/api/track/pageview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      page,
      sessionId: getSessionId(),
      referrer: document.referrer || '',
      ...utm,
    }),
  }).catch(() => {})
}

export function trackBlogView(slug: string, readSeconds?: number, share?: boolean) {
  if (typeof window === 'undefined') return

  // Skip initial view if same slug tracked within 5 seconds
  // But ALWAYS allow readSeconds updates (unmount tracking) and shares
  if (!readSeconds && !share) {
    const now = Date.now()
    if (lastBlogTrack && lastBlogTrack.slug === slug && now - lastBlogTrack.time < 5000) return
    lastBlogTrack = { slug, time: now }
  }

  const utm = getUtmParams()

  fetch('/api/track/blog-view', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug,
      sessionId: getSessionId(),
      referrer: document.referrer || '',
      readSeconds: readSeconds || 0,
      share: share || false,
      ...utm,
    }),
  }).catch(() => {})
}
