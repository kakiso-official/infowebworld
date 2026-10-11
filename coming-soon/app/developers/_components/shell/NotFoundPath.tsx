'use client'

import { usePathname } from 'next/navigation'

/* The requested URL inside the 404 terminal card (spec 3.4). A client
   island so app/developers/not-found.tsx itself stays static: the path is
   the only per-request part. /developers URLs are never rewritten, so the
   server and browser pathnames always agree (no hydration mismatch). */
export default function NotFoundPath({ origin }: { origin: string }) {
  const pathname = usePathname() || '/developers'
  return <>{`${origin}${pathname}`}</>
}
