import { redirect } from 'next/navigation'

/* Back-compat: /all?q=… was the previous search target (and the old
   SearchAction urlTemplate). The dedicated search page now lives at /search,
   so permanently funnel /all → /search, preserving q + sector. */
export const dynamic = 'force-dynamic'

type SP = { [key: string]: string | string[] | undefined }

function strParam(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v || '').trim()
}

export default async function AllRedirect({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams
  const params = new URLSearchParams()
  const q = strParam(sp.q)
  const sector = strParam(sp.sector)
  if (q) params.set('q', q)
  if (sector) params.set('sector', sector)
  const qs = params.toString()
  redirect(qs ? `/search?${qs}` : '/search')
}
