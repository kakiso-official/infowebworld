const KEY = 'iww_waitlist'

export type WaitlistEntry = {
  id: string
  email: string
  source: 'hero' | 'footer' | 'cta'
  subscribedAt: string
}

function read(): WaitlistEntry[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

function write(data: WaitlistEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function getAllWaitlist(): WaitlistEntry[] {
  return read().sort((a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime())
}

export function addToWaitlist(email: string, source: WaitlistEntry['source'] = 'hero'): boolean {
  const all = read()
  if (all.some(w => w.email.toLowerCase() === email.toLowerCase())) return false
  all.push({
    id: 'W' + String(all.length + 1).padStart(4, '0'),
    email,
    source,
    subscribedAt: new Date().toISOString(),
  })
  write(all)

  // Also save to MySQL database
  fetch('/infowebworld/api.php?action=waitlist_join', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, source }),
  }).catch(() => {})

  return true
}

export function deleteWaitlistEntry(id: string) {
  write(read().filter(w => w.id !== id))
}

export function getWaitlistStats() {
  const all = read()
  const bySrc = all.reduce((a, w) => { a[w.source] = (a[w.source] || 0) + 1; return a }, {} as Record<string, number>)
  return { total: all.length, ...bySrc }
}
