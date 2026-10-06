/* ═══════════════════════════════════════════════════════════════════════
   Public URL paths for the six L1 sectors and everything under them.

   Each sector lives at its "[sector] directory" URL (Oct 2026 SEO specs),
   and that path is also the prefix of every category page in the sector:

     sector slug (DB)        landing                          category page
     ai-ml                   /ai-si-directory                 /ai-si-directory/{slug}
     software-saas           /saas-directory                  /saas-directory/{slug}
     ...

   The sector slug stays the internal identity (DB, taxonomy, API params,
   palette classes); only URLs change. The old /{sectorSlug} and
   /{sectorSlug}/... URLs 308 to these in next.config.ts - keep that list
   in sync with LANDING_PATHS.

   Build every link to a sector landing, category page or view-all index
   through these helpers so no internal link points at a redirect.
   ═══════════════════════════════════════════════════════════════════════ */

const LANDING_PATHS: Record<string, string> = {
  'ai-ml': '/ai-si-directory',
  'software-saas': '/saas-directory',
  'it-services-agencies': '/it-directory',
  'startups-innovation': '/startup-directory',
  'local-businesses': '/local-businesses-directory',
  'professional-services': '/professional-service-directory',
}

/* First URL segment → sector slug, e.g. 'ai-si-directory' → 'ai-ml'. */
const SECTOR_BY_URL_SEGMENT = new Map(
  Object.entries(LANDING_PATHS).map(([sector, path]) => [path.slice(1), sector])
)

/** The URL segments that open a sector's pages ('ai-si-directory', ...). */
export const SECTOR_URL_SEGMENTS: ReadonlySet<string> = new Set(SECTOR_BY_URL_SEGMENT.keys())

/** Path of an L1 sector's landing page, e.g. '/saas-directory' for
 *  'software-saas'. Also the prefix of every category URL in the sector. */
export function sectorLandingPath(sectorSlug: string): string {
  return LANDING_PATHS[sectorSlug] ?? `/${sectorSlug}`
}

/** Path of a category (L2-L5) page, e.g. '/saas-directory/crm-platforms'.
 *  Without a sector it falls back to the bare slug, which the catch-all
 *  route redirects to the canonical URL. */
export function sectorCategoryPath(sectorSlug: string | null | undefined, categorySlug: string): string {
  return sectorSlug ? `${sectorLandingPath(sectorSlug)}/${categorySlug}` : `/${categorySlug}`
}

/** A sector's "view all sub-categories" index, e.g.
 *  '/saas-directory/view-all-sub-categories-software-saas'. */
export function sectorViewAllPath(sectorSlug: string): string {
  return `${sectorLandingPath(sectorSlug)}/view-all-sub-categories-${sectorSlug}`
}

/** Path of any category in the taxonomy: L1 rows are sector landings, every
 *  deeper level lives under its sector's landing path. */
export function categoryPath(c: { level: number; slug: string; sectorSlug?: string | null }): string {
  if (c.level === 1) return sectorLandingPath(c.slug)
  return sectorCategoryPath(c.sectorSlug, c.slug)
}

/** The sector a URL's first segment opens: 'ai-si-directory' → 'ai-ml'.
 *  null for anything else, including the old /{sectorSlug} prefixes. */
export function sectorFromUrlSegment(segment: string | null | undefined): string | null {
  return (segment && SECTOR_BY_URL_SEGMENT.get(segment)) || null
}

/* An internal URL whose first segment is an old /{sectorSlug} prefix:
   /software-saas, /software-saas/crm-platforms?x#y, and the same with the
   site origin in front. */
const LEGACY_SECTOR_URL_RE = /^((?:https?:\/\/(?:www\.)?infowebworld\.com)?)\/([a-z-]+)(?=$|[/?#])/

/** Moves a URL under an old /{sectorSlug} prefix to the current one
 *  ('/ai-ml/ai-agents' → '/ai-si-directory/ai-agents'); any other URL is
 *  returned unchanged. */
export function currentSectorUrl(url: string): string {
  return url.replace(LEGACY_SECTOR_URL_RE, (match, origin: string, segment: string) => {
    const path = LANDING_PATHS[segment]
    return path ? origin + path : match
  })
}

/** Points every link in rendered HTML (blog bodies written before the
 *  move) at the current sector URLs, so none goes through a 308. */
export function rewriteLegacySectorLinks(html: string): string {
  return html.replace(/href="([^"]*)"/g, (_, url: string) => `href="${currentSectorUrl(url)}"`)
}
