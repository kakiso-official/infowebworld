/* Per-post analytics stored in localStorage */
const KEY = 'iww_blog_analytics'

export type PostAnalytics = {
  views: number
  uniqueViews: number
  avgReadSec: number
  shares: number
  lastViewed: string
  dailyViews: Record<string, number> // '2026-03-23' → count
}

function readAll(): Record<string, PostAnalytics> {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}

function writeAll(data: Record<string, PostAnalytics>) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10)
}

export function getAnalytics(postId: string): PostAnalytics {
  const all = readAll()
  return all[postId] || { views: 0, uniqueViews: 0, avgReadSec: 0, shares: 0, lastViewed: '', dailyViews: {} }
}

export function getAllAnalytics(): Record<string, PostAnalytics> {
  return readAll()
}

export function trackView(postId: string) {
  const all = readAll()
  const a = all[postId] || { views: 0, uniqueViews: 0, avgReadSec: 0, shares: 0, lastViewed: '', dailyViews: {} }
  const today = getToday()
  a.views += 1
  a.lastViewed = new Date().toISOString()
  a.dailyViews[today] = (a.dailyViews[today] || 0) + 1

  /* Track unique via sessionStorage */
  const uKey = `iww_viewed_${postId}`
  if (!sessionStorage.getItem(uKey)) {
    sessionStorage.setItem(uKey, '1')
    a.uniqueViews += 1
  }

  all[postId] = a
  writeAll(all)
}

export function trackReadTime(postId: string, seconds: number) {
  const all = readAll()
  const a = all[postId]
  if (!a) return
  /* Running average */
  const totalReads = a.uniqueViews || 1
  a.avgReadSec = Math.round(((a.avgReadSec * (totalReads - 1)) + seconds) / totalReads)
  all[postId] = a
  writeAll(all)
}

export function trackShare(postId: string) {
  const all = readAll()
  const a = all[postId]
  if (!a) return
  a.shares += 1
  all[postId] = a
  writeAll(all)
}

export function getTotalViews(): number {
  return Object.values(readAll()).reduce((s, a) => s + a.views, 0)
}

export function getLast7DaysViews(): number[] {
  const all = readAll()
  const days: number[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10)
    const total = Object.values(all).reduce((s, a) => s + (a.dailyViews[d] || 0), 0)
    days.push(total)
  }
  return days
}
