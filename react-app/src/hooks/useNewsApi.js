import { useState, useEffect } from 'react'

/*
  GNews.io free API — 100 requests/day
  Get your free key at: https://gnews.io/
  Set it in react-app/.env as VITE_GNEWS_API_KEY=your_key_here
*/

const API_KEY = import.meta.env.VITE_GNEWS_API_KEY || ''
const BASE_URL = 'https://gnews.io/api/v4'

/* Map our country codes → GNews country codes */
const gnewsCountryMap = {
  us: 'us',
  in: 'in',
  uk: 'gb',
  au: 'au',
  ca: 'ca',
  eu: 'gb', // GNews doesn't have 'eu' — use GB as proxy for English EU news
}

/* Map GNews categories to our internal categories */
const categoryMap = {
  general: 'business',
  business: 'business',
  technology: 'technology',
  entertainment: 'marketing',
  health: 'healthcare',
  science: 'technology',
  sports: 'business',
  world: 'business',
  nation: 'business',
}

/* Color palette for cards based on category */
const categoryColors = {
  business: 'var(--emerald)',
  technology: 'var(--accent)',
  healthcare: 'var(--emerald)',
  marketing: 'var(--rose)',
  finance: 'var(--plum)',
  education: 'var(--teal)',
  realestate: 'var(--azure)',
  food: 'var(--coral)',
  legal: 'var(--plum)',
}

const tagClassMap = {
  business: 'nws-tag--emerald',
  technology: 'nws-tag--coral',
  healthcare: 'nws-tag--emerald',
  marketing: 'nws-tag--rose',
  finance: 'nws-tag--plum',
  education: 'nws-tag--azure',
}

/* Avatar background gradients (rotated per article) */
const avatarBgs = [
  'var(--accent-gradient)',
  'linear-gradient(135deg,var(--emerald),var(--teal))',
  'linear-gradient(135deg,var(--amber),var(--coral))',
  'linear-gradient(135deg,var(--azure),var(--accent))',
  'linear-gradient(135deg,var(--plum),var(--rose))',
  'linear-gradient(135deg,var(--coral),var(--amber))',
]

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(isoString) {
  try {
    const d = new Date(isoString)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return ''
  }
}

function estimateReadTime(text) {
  if (!text) return '3 min read'
  const words = text.split(/\s+/).length
  const mins = Math.max(2, Math.ceil(words / 200))
  return `${mins} min read`
}

/* Transform GNews article → our article format */
function transformArticle(raw, index, apiCategory) {
  const internalCat = categoryMap[apiCategory] || 'business'
  const sourceName = raw.source?.name || 'News Source'
  return {
    id: `api-${index}-${Date.now()}`,
    tag: internalCat.charAt(0).toUpperCase() + internalCat.slice(1),
    tagClass: tagClassMap[internalCat] || 'nws-tag--emerald',
    title: raw.title || 'Untitled',
    excerpt: raw.description || raw.content?.slice(0, 200) || '',
    body: raw.content || raw.description || '',
    author: sourceName,
    initials: getInitials(sourceName),
    avatarBg: avatarBgs[index % avatarBgs.length],
    authorRole: 'News Source',
    date: formatDate(raw.publishedAt),
    readTime: estimateReadTime(raw.content || raw.description),
    category: internalCat,
    color: categoryColors[internalCat] || 'var(--accent)',
    trending: index < 3,
    image: raw.image || null,
    externalUrl: raw.url || null,
    isApi: true,
  }
}

const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

function getCacheKey(countryCode, category) {
  return `iww_news_${countryCode}_${category}`
}

function getFromCache(key) {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) {
      sessionStorage.removeItem(key)
      return null
    }
    return data
  } catch {
    return null
  }
}

function setToCache(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }))
  } catch {}
}

export default function useNewsApi(countryCode = 'us', category = 'general') {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!API_KEY) {
      setError('no-key')
      return
    }

    const gnewsCountry = gnewsCountryMap[countryCode] || 'us'
    const cacheKey = getCacheKey(gnewsCountry, category)

    // Check cache first
    const cached = getFromCache(cacheKey)
    if (cached) {
      setArticles(cached)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const url = `${BASE_URL}/top-headlines?category=${category}&lang=en&country=${gnewsCountry}&max=100&apikey=${API_KEY}`

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        return res.json()
      })
      .then(data => {
        const transformed = (data.articles || []).map((a, i) => transformArticle(a, i, category))
        setArticles(transformed)
        setToCache(cacheKey, transformed)
      })
      .catch(err => {
        console.warn('News API fetch failed:', err.message)
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [countryCode, category])

  return { articles, loading, error }
}
