import { queryOne, execute } from '@/lib/db'

/**
 * Reciprocal badge-backlink tracking.
 *
 * A listing earns "Partner" status when it displays the InfoWebWorld badge
 * (a link back to infowebworld.com) on its own website. We confirm it by
 * fetching the homepage and looking for the link. This is the link WE get
 * FROM them — it does not touch the dofollow/nofollow policy on links we
 * give THEM (that stays plan-based; see lib/user-plan-types.ts).
 */

export type BacklinkStatus = 'none' | 'pending' | 'verified' | 'lost'

/** Any href that points at infowebworld.com (www / non-www / any path). */
const BACKLINK_RE = /href\s*=\s*["'][^"']*\binfowebworld\.com\b[^"']*["']/i

/** Normalise a stored website value to an absolute origin we can fetch. */
export function siteOrigin(website?: string | null): string | null {
  if (!website) return null
  const raw = website.trim()
  if (!raw) return null
  try {
    const u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`)
    return u.origin
  } catch {
    return null
  }
}

/** Bare hostname (no scheme, no www) — used to match a Referer/Origin. */
export function bareHost(url?: string | null): string | null {
  const origin = siteOrigin(url)
  if (!origin) return null
  try {
    return new URL(origin).hostname.replace(/^www\./i, '').toLowerCase()
  } catch {
    return null
  }
}

/**
 * Fetch the company homepage and look for a link back to infowebworld.com.
 * Plain fetch (no JS execution) — works for the recommended <a><img> badge
 * snippet, which renders the link in the static HTML. Returns the matched
 * href when found. Never throws.
 */
async function scanPage(url: string): Promise<{ found: boolean; url: string | null }> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'InfoWebWorldBadgeBot/1.0 (+https://www.infowebworld.com)',
        Accept: 'text/html',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(9000),
    })
    if (!res.ok) return { found: false, url: null }
    const html = (await res.text()).slice(0, 2_000_000)
    const m = html.match(BACKLINK_RE)
    if (!m) return { found: false, url: null }
    const href = m[0].match(/["']([^"']+)["']/)
    return { found: true, url: href ? href[1] : url }
  } catch {
    return { found: false, url: null }
  }
}

export async function crawlForBacklink(
  website?: string | null,
): Promise<{ found: boolean; url: string | null }> {
  const origin = siteOrigin(website)
  if (!origin) return { found: false, url: null }
  const raw = (website || '').trim()
  const exact = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  // Try the exact saved URL first (may be a deep page), then the homepage.
  const candidates = exact === origin ? [origin] : [exact, origin]
  for (const url of candidates) {
    const r = await scanPage(url)
    if (r.found) return r
  }
  return { found: false, url: null }
}

export interface BacklinkRow {
  id: number
  slug: string
  website: string | null
  user_id: number | null
  backlink_status: BacklinkStatus
  backlink_url: string | null
  backlink_verified_at: string | null
  backlink_checked_at: string | null
  backlink_fail_count: number
}

/** Load the minimal backlink state for a listing by slug. */
export async function getBacklinkBySlug(slug: string): Promise<BacklinkRow | null> {
  return queryOne<BacklinkRow>(
    `SELECT id, slug, website, user_id,
            backlink_status, backlink_url, backlink_verified_at,
            backlink_checked_at, backlink_fail_count
       FROM submissions WHERE slug = ? LIMIT 1`,
    [slug],
  )
}

/**
 * Run a verification check for a listing and persist the result.
 *   found  -> status 'verified'
 *   absent -> if it was verified, drop to 'lost' (a future cron applies the
 *             grace period); otherwise hold at 'pending' so the owner retries.
 */
export async function runBacklinkCheck(
  row: BacklinkRow,
  method: 'crawl' | 'script' = 'crawl',
): Promise<BacklinkRow> {
  const { found, url } = await crawlForBacklink(row.website)

  if (found) {
    await execute(
      `UPDATE submissions
          SET backlink_status='verified', backlink_method=?, backlink_url=?,
              backlink_verified_at=NOW(), backlink_checked_at=NOW(), backlink_fail_count=0
        WHERE id=?`,
      [method, url, row.id],
    )
    return { ...row, backlink_status: 'verified', backlink_url: url, backlink_fail_count: 0 }
  }

  const nextStatus: BacklinkStatus = row.backlink_status === 'verified' ? 'lost' : 'pending'
  await execute(
    `UPDATE submissions
        SET backlink_status=?, backlink_checked_at=NOW(), backlink_fail_count=backlink_fail_count+1
      WHERE id=?`,
    [nextStatus, row.id],
  )
  return { ...row, backlink_status: nextStatus, backlink_fail_count: row.backlink_fail_count + 1 }
}
