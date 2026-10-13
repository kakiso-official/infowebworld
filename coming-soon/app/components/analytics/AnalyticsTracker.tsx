'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useReportWebVitals } from 'next/web-vitals'
import { reportVital, routeChanged } from '@/lib/analytics/client'

/* First-party analytics: tells the tracker (lib/analytics/client.ts) about
   every App Router navigation and hands it the Core Web Vitals.

   Rendered once in app/layout.tsx inside <Suspense fallback={null}>:
   useSearchParams() makes this subtree client-only on prerendered pages,
   and the boundary keeps that from affecting anything else. It renders
   nothing, so there is no markup to mismatch and no layout shift. Not
   inside DeferredClient on purpose - the landing pageview must not wait
   for the visitor's first interaction.

   The effect runs after hydration, before useReportWebVitals registers its
   observers (effects run in order), so the hard-load pageview exists before
   the first vital is reported. reportVital is a module function: a stable
   reference, so the vitals observers are registered exactly once. */
export default function AnalyticsTracker() {
  const pathname = usePathname()
  const search = useSearchParams().toString()

  useEffect(() => {
    routeChanged(pathname, search)
  }, [pathname, search])

  useReportWebVitals(reportVital)

  return null
}
