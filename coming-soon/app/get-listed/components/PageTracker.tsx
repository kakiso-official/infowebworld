'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '../../iww-hq/data/visitor-tracking'

export default function PageTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith('/iww-hq')) return
    trackPageView(pathname)
  }, [pathname])

  return null
}
