import { NextRequest } from 'next/server'
import { query, execute } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

interface ListedJob {
  id: number
  slug: string
  company_name: string | null
  website: string
  category_l1: string
  category_slug: string | null
  status: string
  total_sessions: number
  total_cost_usd: number
  last_session_id: number | null
  queued_at: string
  applied_at: string | null
  has_screenshot_home: boolean
  has_screenshot_secondary: boolean
}

/**
 * GET /api/admin/scrape/jobs
 *   ?l1=<category>       filter by category_l1
 *   ?status=<status>     filter by status
 *   ?q=<search>          search slug + company_name + website
 *   ?limit=100&offset=0  pagination
 *
 * Returns the queue list for the Scraper admin UI.
 */
export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  try {
    const url = new URL(request.url)
    const l1     = url.searchParams.get('l1')
    const status = url.searchParams.get('status')
    const q      = url.searchParams.get('q')?.trim()
    const limit  = Math.min(500, Math.max(1, Number(url.searchParams.get('limit')  ?? 200)))
    const offset = Math.max(0,             Number(url.searchParams.get('offset')  ?? 0))

    const where: string[] = []
    const params: unknown[] = []
    if (l1)     { where.push('category_l1 = ?'); params.push(l1) }
    if (status) { where.push('status = ?');      params.push(status) }
    if (q) {
      where.push('(slug LIKE ? OR company_name LIKE ? OR website LIKE ?)')
      const wild = `%${q}%`
      params.push(wild, wild, wild)
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

    const rows = await query<ListedJob & { current_screenshot_home_url: string | null; current_screenshot_secondary_url: string | null }>(`
      SELECT id, slug, company_name, website, category_l1, category_slug, status,
             total_sessions, total_cost_usd, last_session_id, queued_at, applied_at,
             current_screenshot_home_url, current_screenshot_secondary_url
        FROM scrape_jobs
        ${whereSql}
        ORDER BY
          FIELD(status, 'running','review','queued','failed','applied','skipped'),
          queued_at DESC
        LIMIT ${limit} OFFSET ${offset}
    `, params)

    const jobs: ListedJob[] = rows.map(r => ({
      id: r.id,
      slug: r.slug,
      company_name: r.company_name,
      website: r.website,
      category_l1: r.category_l1,
      category_slug: r.category_slug,
      status: r.status,
      total_sessions: r.total_sessions,
      total_cost_usd: Number(r.total_cost_usd ?? 0),
      last_session_id: r.last_session_id,
      queued_at: String(r.queued_at),
      applied_at: r.applied_at ? String(r.applied_at) : null,
      has_screenshot_home: !!r.current_screenshot_home_url,
      has_screenshot_secondary: !!r.current_screenshot_secondary_url,
    }))

    return Response.json({ ok: true, jobs })
  } catch (err) {
    console.error('GET /scrape/jobs:', err)
    return Response.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}

interface AddCompanyInput {
  slug?: string
  company_name?: string
  website: string
  category_l1: string
  category_slug?: string
}

/**
 * POST /api/admin/scrape/jobs
 * Body: { companies: AddCompanyInput[] }
 *
 * Bulk-add new candidates straight into scrape_jobs as 'queued'. Auto-slugs
 * from website if slug is omitted. Dedupes on slug — existing rows are
 * skipped (returned in the `duplicates` list, not an error).
 */
export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  try {
    const body = await request.json() as { companies?: AddCompanyInput[] }
    const list = Array.isArray(body.companies) ? body.companies : []
    if (!list.length) {
      return Response.json({ ok: false, error: 'companies array is empty' }, { status: 400 })
    }

    const inserted: string[] = []
    const duplicates: string[] = []
    const errors: { website: string; error: string }[] = []

    for (const raw of list) {
      try {
        const website = String(raw.website || '').trim()
        const l1 = String(raw.category_l1 || '').trim()
        if (!website || !l1) {
          errors.push({ website, error: 'website and category_l1 required' })
          continue
        }
        const slug = (raw.slug || slugFromUrl(website)).trim()
        const name = (raw.company_name || '').trim() || null
        const catSlug = (raw.category_slug || '').trim() || null

        const result = await execute(
          `INSERT INTO scrape_jobs (slug, company_name, website, category_l1, category_slug, status)
           VALUES (?, ?, ?, ?, ?, 'queued')
           ON DUPLICATE KEY UPDATE id = id`,
          [slug, name, website, l1, catSlug]
        )
        if (result.affectedRows === 1) inserted.push(slug)
        else duplicates.push(slug)
      } catch (err) {
        errors.push({ website: raw.website, error: err instanceof Error ? err.message : String(err) })
      }
    }

    return Response.json({ ok: true, inserted, duplicates, errors })
  } catch (err) {
    console.error('POST /scrape/jobs:', err)
    return Response.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}

function slugFromUrl(url: string): string {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`)
    let host = u.hostname.replace(/^www\./, '').replace(/\.[^.]+$/, '')
    return host.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'untitled'
  } catch {
    return 'untitled-' + Math.random().toString(36).slice(2, 7)
  }
}
