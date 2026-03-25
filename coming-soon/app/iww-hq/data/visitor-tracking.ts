/**
 * InfoWebWorld — Visitor Tracking V2
 *
 * - No localStorage (all data in MySQL)
 * - Sends UTM params from URL to API
 * - Bot filtering, device detection, country detection all happen server-side
 * - Session ID generated client-side for session continuity only
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

export function trackPageView(page: string) {
  if (typeof window === 'undefined') return

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
