/**
 * InfoWebWorld - blog view / read-time / share tracking (/api/track/blog-view).
 *
 * Feeds the per-post blog stats. Page views, engagement and everything else
 * are recorded by the first-party analytics tracker (lib/analytics/client.ts);
 * the old page_views tracker that lived here was removed in Oct 2026.
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
let lastBlogTrack: { slug: string; time: number } | null = null

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
