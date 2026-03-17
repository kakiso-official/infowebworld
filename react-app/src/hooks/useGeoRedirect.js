import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

/* ISO country codes → our routes */
const countryRouteMap = {
  IN: '/en-in',
  GB: '/en-uk',
  AU: '/en-au',
  CA: '/en-ca',
}

/* EU/European country codes → /en-eu */
const euCodes = new Set([
  'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU',
  'IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES',
  'SE','NO','CH','IS','LI','MC','AD','SM','VA','ME','MK','AL','RS',
  'BA','MD','UA','BY','XK',
])

const CACHE_KEY = 'iww_geo_country'
const CACHE_EXPIRY_KEY = 'iww_geo_expiry'
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

function getCachedCountry() {
  try {
    const expiry = localStorage.getItem(CACHE_EXPIRY_KEY)
    if (expiry && Date.now() < Number(expiry)) {
      return localStorage.getItem(CACHE_KEY)
    }
  } catch {}
  return null
}

function cacheCountry(code) {
  try {
    localStorage.setItem(CACHE_KEY, code)
    localStorage.setItem(CACHE_EXPIRY_KEY, String(Date.now() + CACHE_TTL))
  } catch {}
}

function getRouteForCountry(code) {
  if (!code) return null
  const upper = code.toUpperCase()
  if (countryRouteMap[upper]) return countryRouteMap[upper]
  if (euCodes.has(upper)) return '/en-eu'
  return null // US / default — stay on /
}

export default function useGeoRedirect() {
  const navigate = useNavigate()
  const location = useLocation()
  const [detecting, setDetecting] = useState(false)

  useEffect(() => {
    // Only auto-redirect when user is on the root path
    if (location.pathname !== '/') return

    // URL param override: ?country=us, ?country=uk, ?country=in, etc.
    const params = new URLSearchParams(location.search)
    const forceCountry = params.get('country')
    if (forceCountry) {
      const upper = forceCountry.toUpperCase()
      cacheCountry(upper)
      const route = getRouteForCountry(upper)
      if (route) {
        navigate(route, { replace: true })
      }
      // If no route (e.g. US), stay on / — clear old cache so it doesn't redirect
      return
    }

    // ?stay=1 skips geo-redirect for this session
    if (params.get('stay') === '1') {
      try { sessionStorage.setItem('iww_geo_skip', '1') } catch {}
      return
    }

    // Check if user manually chose to stay
    try {
      if (sessionStorage.getItem('iww_geo_skip')) return
    } catch {}

    const cached = getCachedCountry()
    if (cached) {
      const route = getRouteForCountry(cached)
      if (route) navigate(route, { replace: true })
      return
    }

    // Fetch from free IP geolocation API
    setDetecting(true)
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        const code = data?.country_code || data?.country
        if (code) {
          cacheCountry(code)
          const route = getRouteForCountry(code)
          if (route) navigate(route, { replace: true })
        }
      })
      .catch(() => {
        // Silently fail — stay on US landing
      })
      .finally(() => setDetecting(false))
  }, [location.pathname, navigate])

  return detecting
}
