const KEY = 'iww_page_views'

export type PageView = {
  page: string
  referrer: string
  timestamp: string
  sessionId: string
}

function getSessionId(): string {
  let id = sessionStorage.getItem('iww_sid')
  if (!id) { id = crypto.randomUUID(); sessionStorage.setItem('iww_sid', id) }
  return id
}

function read(): PageView[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

function write(data: PageView[]) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function trackPageView(page: string) {
  if (typeof window === 'undefined') return
  const all = read()
  all.push({
    page,
    referrer: document.referrer || 'direct',
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
  })
  // Keep last 10000 entries max
  if (all.length > 10000) all.splice(0, all.length - 10000)
  write(all)

  // Also save to MySQL database
  fetch('/infowebworld/api.php?action=track_pageview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page, sessionId: getSessionId(), referrer: document.referrer || 'direct' }),
  }).catch(() => {})
}

function getToday(): string { return new Date().toISOString().slice(0, 10) }
function getDayLabel(daysAgo: number): string {
  return new Date(Date.now() - daysAgo * 864e5).toLocaleDateString('en', { weekday: 'short' })
}
function getDateStr(daysAgo: number): string {
  return new Date(Date.now() - daysAgo * 864e5).toISOString().slice(0, 10)
}

export function getDashboardData() {
  const all = read()

  // Total views
  const totalViews = all.length

  // Today's views
  const today = getToday()
  const todayViews = all.filter(v => v.timestamp.startsWith(today)).length

  // Unique sessions today
  const todayUnique = new Set(all.filter(v => v.timestamp.startsWith(today)).map(v => v.sessionId)).size

  // Last 7 days chart
  const dailyViews: number[] = []
  const dayLabels: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = getDateStr(i)
    dailyViews.push(all.filter(v => v.timestamp.startsWith(d)).length)
    dayLabels.push(getDayLabel(i))
  }

  // Top pages
  const pageCounts: Record<string, number> = {}
  all.forEach(v => { pageCounts[v.page] = (pageCounts[v.page] || 0) + 1 })
  const topPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)

  // Top referrers
  const refCounts: Record<string, number> = {}
  all.forEach(v => {
    let ref = 'Direct'
    try {
      if (v.referrer && v.referrer !== 'direct') {
        ref = new URL(v.referrer).hostname.replace('www.', '')
      }
    } catch { ref = v.referrer || 'Direct' }
    refCounts[ref] = (refCounts[ref] || 0) + 1
  })
  const topReferrers = Object.entries(refCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)

  // Unique visitors (by sessionId)
  const totalUnique = new Set(all.map(v => v.sessionId)).size

  return { totalViews, todayViews, todayUnique, totalUnique, dailyViews, dayLabels, topPages, topReferrers }
}
