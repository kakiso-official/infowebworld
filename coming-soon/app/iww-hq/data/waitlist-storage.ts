const KEY = 'iww_waitlist'
const API = '/api'

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

/** Fetch waitlist from MySQL, fall back to localStorage */
export async function fetchAllWaitlist(): Promise<WaitlistEntry[]> {
  try {
    const res = await fetch(`${API}/waitlist`)
    if (!res.ok) throw new Error('API error')
    const rows: { id: number; email: string; source: string; created_at: string }[] = await res.json()
    return rows.map(r => ({
      id: String(r.id),
      email: r.email,
      source: (r.source || 'hero') as WaitlistEntry['source'],
      subscribedAt: r.created_at,
    }))
  } catch {
    return getAllWaitlist()
  }
}

export function getAllWaitlist(): WaitlistEntry[] {
  return read().sort((a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime())
}

export async function addToWaitlist(email: string, source: WaitlistEntry['source'] = 'hero'): Promise<'ok' | 'duplicate' | 'error'> {
  // Always call the API first — it handles dedup + sends the welcome email
  try {
    const res = await fetch(`${API}/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source }),
    })
    const data = await res.json()
    if (data.duplicate) return 'duplicate'
    if (!res.ok) return 'error'
  } catch {
    return 'error'
  }

  // Save to localStorage for client-side duplicate check on future submits
  const all = read()
  if (!all.some(w => w.email.toLowerCase() === email.toLowerCase())) {
    all.push({
      id: 'W' + String(all.length + 1).padStart(4, '0'),
      email,
      source,
      subscribedAt: new Date().toISOString(),
    })
    write(all)
  }

  return 'ok'
}

export async function deleteWaitlistEntry(id: string) {
  // Delete from DB
  try {
    await fetch(`${API}/waitlist`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
  } catch { /* ignore */ }
  // Also remove from localStorage
  write(read().filter(w => w.id !== id))
}

export async function fetchWaitlistStats(): Promise<Record<string, number>> {
  try {
    const entries = await fetchAllWaitlist()
    const bySrc = entries.reduce((a, w) => { a[w.source] = (a[w.source] || 0) + 1; return a }, {} as Record<string, number>)
    return { total: entries.length, ...bySrc }
  } catch {
    return getWaitlistStats()
  }
}

export function getWaitlistStats() {
  const all = read()
  const bySrc = all.reduce((a, w) => { a[w.source] = (a[w.source] || 0) + 1; return a }, {} as Record<string, number>)
  return { total: all.length, ...bySrc }
}
