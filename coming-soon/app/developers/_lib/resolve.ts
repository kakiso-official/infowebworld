import 'server-only'
import { isDevDataError } from '@/lib/developers/store'
import { normalizeSlugParam } from '@/lib/developers/paths'

/* ═══════════════════════════════════════════════════════════════════════
   How a /developers page decides what to do with its URL BEFORE anything
   renders (spec 2.3, 3.0 "404 discipline"), so notFound() and
   permanentRedirect() always run while the status can still be set:

     ok           render it
     redirect     308 to the canonical URL (uppercase slug, /page/1)
     not-found    a real 404
     unavailable  the snapshot could not be loaded (DevDataError): a
                  "refreshing" notice with noindex, never a 404 for a
                  real URL

   generateMetadata and the page call the same resolver; the store is
   memoised, so the second call is a few Map reads.
   ═══════════════════════════════════════════════════════════════════════ */

export type Resolved<T> =
  | { kind: 'ok'; value: T }
  | { kind: 'redirect'; path: string }
  | { kind: 'not-found' }
  | { kind: 'unavailable' }

/** Runs a resolver; a DevDataError (snapshot missing or broken) becomes
 *  'unavailable', anything else is rethrown. */
export async function resolveSafely<T>(resolve: () => Promise<Resolved<T>>): Promise<Resolved<T>> {
  try {
    return await resolve()
  } catch (err) {
    if (isDevDataError(err)) return { kind: 'unavailable' }
    throw err
  }
}

/** The canonical form of a slug param ('Vercel' -> 'vercel', 'Next.js' ->
 *  'next-js', 'C%2B%2B' -> 'cpp'). Compare it with the raw param: when they
 *  differ, the page 308s to the canonical URL if that resolves, else 404s. */
export function canonicalSlug(raw: string): string {
  return normalizeSlugParam(raw)
}
