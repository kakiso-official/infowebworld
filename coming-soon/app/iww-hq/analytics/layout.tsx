'use client'
import { Suspense, type ReactNode } from 'react'
/* FA's own CSS (sizes the SVG icons before hydration - no giant-icon flash). */
import '@fortawesome/fontawesome-svg-core/styles.css'
/* Analytics design system (.an-*) - route-scoped to /iww-hq/analytics. */
import '../../styles/analytics.css'
import { ControlBar, SubNav } from './_ui/Controls'
import { Skeleton } from './_ui/States'
import { useAnalyticsRoute } from './_lib/state'

/* ════════════════════════════════════════════════════════════════════════
   Analytics section chrome: section tabs + sticky control bar (range,
   comparison, filters, refresh, live count) above every analytics page.
   Auth + the admin shell come from app/iww-hq/layout.tsx.

   Both the chrome and the page sit under <Suspense> because they read
   useSearchParams (the URL is the analytics state).
   ════════════════════════════════════════════════════════════════════════ */

function Chrome() {
  const route = useAnalyticsRoute()
  return (
    <>
      <SubNav />
      <ControlBar route={route} />
    </>
  )
}

export default function AnalyticsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="an-root">
      <Suspense fallback={<div className="an-subnav" aria-hidden="true" />}>
        <Chrome />
      </Suspense>
      <Suspense fallback={<Skeleton variant="kpis" rows={4} />}>
        <div className="an-page">{children}</div>
      </Suspense>
    </div>
  )
}
