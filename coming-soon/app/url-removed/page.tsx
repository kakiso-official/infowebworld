import { notFound } from 'next/navigation'

/* ── Landing route for the removed country URL space ──
   The site used to serve /{country}/* URLs (/in, /us, /uk/blog, …). Those are
   gone. proxy/middleware.ts rewrites every country-prefixed path here (see
   COUNTRY_PREFIX_RE) so the visitor keeps their original URL (e.g. /in) but
   gets the real branded 404 — app/not-found.tsx (RootNotFound), with navbar,
   footer and styles — carrying a TRUE 404 status.

   Why this exists instead of letting the /[...segments] catch-all 404:
   that catch-all is `export const dynamic = 'force-dynamic'`, so its shell
   STREAMS with a 200 before notFound() throws — a soft-404 (HTTP 200) that
   Google indexes as a live page. This route has NO dynamic config and pulls NO
   dynamic data, so it renders non-streamed; per Next's docs a non-streamed
   notFound() returns a real 404 (a streamed one returns 200).

   KEEP IT NON-STREAMED: do not add `force-dynamic`, `cookies()`, `headers()`,
   or any uncached fetch here, or the 404 silently degrades back to a 200. */
export default function CountryUrlRemoved() {
  notFound()
}
