/* ═══════════════════════════════════════════════════════════════════════
   Public URL paths for the L1 sector landing pages.

   Every sector landing lives at /{sectorSlug} EXCEPT AI & ML: its landing
   moved to /ai-si-directory (Oct 2026 SEO spec). Only the landing moved -
   the AI category tree keeps its /ai-ml/{category} URLs, and /ai-ml itself
   308-redirects to the new path (next.config.ts).

   Build every link to a sector landing through sectorLandingPath() so no
   internal link points at a redirect.
   ═══════════════════════════════════════════════════════════════════════ */

const LANDING_PATH_OVERRIDES: Record<string, string> = {
  'ai-ml': '/ai-si-directory',
}

/** Path of an L1 sector's landing page, e.g. '/software-saas' or
 *  '/ai-si-directory' for 'ai-ml'. */
export function sectorLandingPath(sectorSlug: string): string {
  return LANDING_PATH_OVERRIDES[sectorSlug] ?? `/${sectorSlug}`
}

/** Path of any category in the taxonomy: L1 rows are sector landings, every
 *  deeper level lives under its sector (/{sector}/{slug}); a hit without a
 *  resolved sector falls back to the bare slug, which the catch-all route
 *  redirects to its canonical URL. */
export function categoryPath(c: { level: number; slug: string; sectorSlug?: string | null }): string {
  if (c.level === 1) return sectorLandingPath(c.slug)
  return c.sectorSlug ? `/${c.sectorSlug}/${c.slug}` : `/${c.slug}`
}
