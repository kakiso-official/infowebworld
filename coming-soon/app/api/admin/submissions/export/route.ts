import { NextRequest } from 'next/server'
import { query } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

/**
 * GET /api/admin/submissions/export
 *
 * Streams a CSV (UTF-8 BOM → opens natively in Excel/Sheets) of directory
 * listings, one row per submission, with the columns the team needs for
 * outreach + tracking (name, slug, profile URL, sector, category, website,
 * email, phone, location, plan, verified/claimed flags, review stats, socials).
 *
 * Query params (all optional):
 *   mode   = all (default = company + product) | company | product | local-business
 *   status = live (default = active+paid) | active | paid | all
 *
 * Local-business listings are company-mode rows in the `local-businesses`
 * sector, so `mode=company` includes them (the Sector column lets you split
 * them in the sheet); `mode=local-business` narrows to that sector only.
 *
 * Admin-only. No placeholders are concatenated from raw input — mode/status
 * map to a fixed whitelist of clauses, so there is no injection surface.
 */
export const dynamic = 'force-dynamic'

const DOMAIN = 'https://www.infowebworld.com'

const SECTOR_NAMES: Record<string, string> = {
  'ai-ml': 'AI & ML',
  'software-saas': 'Software & SaaS',
  'it-services-agencies': 'IT Services & Agencies',
  'startups-innovation': 'Startups & Innovation',
  'local-businesses': 'Local Businesses',
  'professional-services': 'Professional Services',
}

/** RFC-4180 cell: quote when the value holds a comma/quote/newline or edge
 *  whitespace; DATETIME values (mysql2 returns Date objects) become
 *  "YYYY-MM-DD HH:MM:SS". Empty for null/undefined. */
function csvCell(v: unknown): string {
  if (v === null || v === undefined) return ''
  let s: string
  if (v instanceof Date) {
    s = isNaN(v.getTime()) ? '' : v.toISOString().slice(0, 19).replace('T', ' ')
  } else {
    s = String(v)
  }
  if (s === '') return ''
  if (/[",\r\n]/.test(s) || s !== s.trim()) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  const sp = request.nextUrl.searchParams
  const mode = (sp.get('mode') || 'all').toLowerCase()
  const statusParam = (sp.get('status') || 'live').toLowerCase()
  const isLocalOnly = mode === 'local-business' || mode === 'local'

  // ── Status clause (fixed whitelist) ──
  let statusWhere = "s.status IN ('active','paid')"
  if (statusParam === 'active') statusWhere = "s.status = 'active'"
  else if (statusParam === 'paid') statusWhere = "s.status = 'paid'"
  else if (statusParam === 'all') statusWhere = '1=1'

  // ── Mode clause (fixed whitelist) ──
  let modeWhere = ''
  if (mode === 'company' || isLocalOnly) modeWhere = "AND COALESCE(s.listing_mode,'product') = 'company'"
  else if (mode === 'product') modeWhere = "AND COALESCE(s.listing_mode,'product') = 'product'"
  // mode=all → no mode clause

  let rows: Record<string, unknown>[]
  try {
    rows = await query<Record<string, unknown>>(
      `SELECT s.id, s.slug, s.company_name, s.tagline, s.website, s.email,
              s.phone_code, s.phone, s.city, s.hq_location, s.founded_year, s.team_size,
              s.status, COALESCE(s.listing_mode,'product') AS listing_mode,
              s.verified, s.user_id, s.linkedin, s.twitter, s.facebook,
              s.created_at, s.approved_at,
              co.name AS country_name,
              c.name AS category_name,
              CASE WHEN c.level = 1 THEN c.slug
                   WHEN c.level = 2 THEN p.slug
                   WHEN c.level = 3 THEN gp.slug
                   WHEN c.level = 4 THEN ggp.slug
                   WHEN c.level = 5 THEN gggp.slug END AS sector_slug,
              pl.name AS plan_name, pl.slug AS plan_slug,
              (SELECT COUNT(*) FROM reviews r WHERE r.listing_id = s.id AND r.status = 'approved') AS review_count,
              (SELECT AVG(r.rating) FROM reviews r WHERE r.listing_id = s.id AND r.status = 'approved') AS review_avg
         FROM submissions s
         LEFT JOIN categories c    ON c.id    = s.category_id
         LEFT JOIN categories p    ON p.id    = c.parent_id
         LEFT JOIN categories gp   ON gp.id   = p.parent_id
         LEFT JOIN categories ggp  ON ggp.id  = gp.parent_id
         LEFT JOIN categories gggp ON gggp.id = ggp.parent_id
         LEFT JOIN countries co ON co.id = s.country_id
         LEFT JOIN plans pl     ON pl.id = s.plan_id
        WHERE ${statusWhere} ${modeWhere}
        ORDER BY s.company_name ASC, s.id ASC`
    )
  } catch (err) {
    console.error('GET /api/admin/submissions/export error:', err)
    return Response.json(
      { ok: false, error: 'Export query failed: ' + (err instanceof Error ? err.message : String(err)) },
      { status: 500 }
    )
  }

  if (isLocalOnly) rows = rows.filter(r => r.sector_slug === 'local-businesses')

  const headers = [
    'ID', 'Company', 'Slug', 'Profile URL', 'Sector', 'Category', 'Mode', 'Status',
    'Tagline', 'Website', 'Email', 'Phone', 'City', 'Country', 'HQ Location', 'Founded',
    'Team Size', 'Plan', 'Verified', 'Claimed', 'Reviews', 'Avg Rating',
    'LinkedIn', 'Twitter', 'Facebook', 'Created', 'Approved',
  ]

  const lines = [headers.join(',')]
  for (const r of rows) {
    const phone = [r.phone_code, r.phone].filter(Boolean).join(' ').trim()
    const sector = SECTOR_NAMES[String(r.sector_slug ?? '')] || r.sector_slug || ''
    const profileUrl = r.slug ? `${DOMAIN}/profile/${r.slug}` : ''
    const avg = r.review_avg != null ? Number(r.review_avg).toFixed(1) : ''
    lines.push([
      r.id, r.company_name, r.slug, profileUrl, sector, r.category_name, r.listing_mode, r.status,
      r.tagline, r.website, r.email, phone, r.city, r.country_name, r.hq_location, r.founded_year,
      r.team_size, r.plan_name || r.plan_slug, r.verified ? 'Yes' : 'No', r.user_id ? 'Yes' : 'No',
      r.review_count ?? 0, avg, r.linkedin, r.twitter, r.facebook, r.created_at, r.approved_at,
    ].map(csvCell).join(','))
  }

  const csv = '﻿' + lines.join('\r\n') // BOM so Excel renders accented names correctly
  const date = new Date().toISOString().slice(0, 10)
  const label = mode === 'product' ? 'products'
    : mode === 'all' ? 'listings'
    : isLocalOnly ? 'local-businesses'
    : 'companies'
  const filename = `infowebworld-live-${label}-${date}.csv`

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'X-Export-Count': String(rows.length),
      'Cache-Control': 'no-store',
    },
  })
}
