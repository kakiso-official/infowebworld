import { NextRequest } from 'next/server'
import { execute, query, queryOne } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

/**
 * POST /api/admin/scrape/jobs/[id]/apply
 *
 * Body (all optional):
 *   { sessionId?: number,            // defaults to job.last_session_id
 *     fields?: string[] }            // subset of APPLIABLE_FIELDS
 *
 * Behaviour:
 *   - Resolves the session whose extracted JSON gets written through.
 *   - If a submissions row already exists for this slug: UPDATE.
 *   - If NOT: INSERT a new submissions row (status='active', payment='completed',
 *     listing_mode='product', plan=free) so the listing goes live the moment
 *     you click Apply.
 *
 * Failures:
 *   - 422 if the session has no extracted data (failed mid-pipeline). Tell
 *     the user to "Scrape now" again — cache will skip the work that
 *     already succeeded.
 *   - 404 if we can't resolve a categories row for the L1/L3 slugs.
 *   - 400 if no plans row exists.
 */

const APPLIABLE_FIELDS = [
  'tagline', 'description', 'founded_year', 'team_size',
  'header_tags', 'industries_served', 'use_cases', 'target_company_sizes',
  'key_features', 'features', 'pricing_model', 'pricing_tiers',
  'integrations', 'support_channels', 'training_options', 'languages',
  'compliance', 'faqs', 'pros', 'cons',
  'starting_price', 'starting_price_period',
  'has_free_trial', 'has_free_version', 'has_ios_app', 'has_android_app',
  'logo_url', 'linkedin', 'twitter',
] as const
type ApplyField = typeof APPLIABLE_FIELDS[number]
const FIELD_SET = new Set<string>(APPLIABLE_FIELDS)

const JSON_FIELDS = new Set<string>([
  'header_tags', 'industries_served', 'use_cases', 'target_company_sizes',
  'key_features', 'features', 'pricing_tiers', 'integrations',
  'support_channels', 'training_options', 'languages', 'compliance',
  'faqs', 'pros', 'cons',
])

/* These columns are NOT NULL DEFAULT 0 in submissions. The scraper
   returns `null` when the page didn't confirm true/false — we must coerce
   to a TINYINT 0/1 or skip; sending NULL crashes the INSERT. We skip
   when value is null so the DB default (0) is used on insert and the
   existing value is preserved on update. */
const BOOLEAN_FIELDS = new Set<string>([
  'has_ios_app', 'has_android_app',
  'has_free_trial', 'has_free_version',
])

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard

  try {
    const { id } = await params
    const jobId = Number(id)
    if (!Number.isFinite(jobId)) {
      return Response.json({ ok: false, error: 'Invalid job id' }, { status: 400 })
    }
    const body = await request.json().catch(() => ({})) as { sessionId?: number; fields?: string[] }

    const job = await queryOne<{
      id: number; slug: string; company_name: string | null; website: string
      category_l1: string; category_slug: string | null; last_session_id: number | null
    }>(`SELECT id, slug, company_name, website, category_l1, category_slug, last_session_id
          FROM scrape_jobs WHERE id = ?`, [jobId])
    if (!job) return Response.json({ ok: false, error: 'Job not found' }, { status: 404 })

    const targetSessionId = body.sessionId ?? job.last_session_id
    if (!targetSessionId) {
      return Response.json({ ok: false, error: 'No session to apply. Run Scrape first.' }, { status: 400 })
    }

    const sess = await queryOne<{
      id: number; scrape_job_id: number; status: string
      extracted_json: string | null
      screenshot_home_url: string | null
      screenshot_secondary_url: string | null
    }>(`SELECT id, scrape_job_id, status, extracted_json,
               screenshot_home_url, screenshot_secondary_url
          FROM scrape_sessions WHERE id = ?`, [targetSessionId])
    if (!sess || sess.scrape_job_id !== jobId) {
      return Response.json({ ok: false, error: 'Session not found for this job' }, { status: 404 })
    }
    if (!sess.extracted_json) {
      return Response.json({
        ok: false,
        error: 'Session has no extracted data yet — click "Scrape now" to retry. Cached steps make retries cheap.',
      }, { status: 422 })
    }

    let extracted: Record<string, unknown>
    try { extracted = JSON.parse(sess.extracted_json) } catch {
      return Response.json({ ok: false, error: 'Session JSON corrupt' }, { status: 422 })
    }

    /* ─── Build the column → value map ─────────────────────────────────
       Only fields in APPLIABLE_FIELDS are eligible. If body.fields is
       supplied, intersect — used for per-field accept/reject flows.       */
    const requested: ApplyField[] = Array.isArray(body.fields) && body.fields.length
      ? (body.fields.filter(f => FIELD_SET.has(f)) as ApplyField[])
      : Array.from(APPLIABLE_FIELDS)

    const sets: Record<string, unknown> = {}
    for (const field of requested) {
      // Map field names: extracted uses `linkedin_url`/`twitter_url`, submissions uses `linkedin`/`twitter`.
      const sourceKey = field === 'linkedin' ? 'linkedin_url' : field === 'twitter' ? 'twitter_url' : field
      const value = extracted[sourceKey]
      // Skip undefined AND null — undefined means "field missing", null means
      // "scraper couldn't confirm". In both cases we want DB defaults / prior
      // values to win, not overwrite with NULL.
      if (value === undefined || value === null) continue
      if (JSON_FIELDS.has(field)) {
        sets[field] = JSON.stringify(value)
      } else if (BOOLEAN_FIELDS.has(field)) {
        // TINYINT(1) — explicit 0/1 to avoid mysql2 driver quirks
        sets[field] = value ? 1 : 0
      } else {
        sets[field] = value as string | number | boolean
      }
    }

    /* Screenshots flow to submissions.screenshots (JSON array), matching
       the existing capture-screenshots.mjs convention. */
    const shotUrls = [sess.screenshot_home_url, sess.screenshot_secondary_url].filter(Boolean) as string[]
    if (shotUrls.length) {
      sets.screenshots = JSON.stringify(shotUrls)
    }

    /* ─── Either UPDATE an existing submission, or INSERT a new one ───── */
    const existing = await queryOne<{ id: number }>(`SELECT id FROM submissions WHERE slug = ?`, [job.slug])
    let action: 'inserted' | 'updated'

    if (existing) {
      action = 'updated'
      const setClauses = Object.keys(sets).map(k => `${k} = ?`)
      if (!setClauses.length) {
        return Response.json({ ok: false, error: 'Nothing to apply' }, { status: 400 })
      }
      setClauses.push(`updated_at = NOW()`)
      const vals = [...Object.values(sets), job.slug]
      await execute(`UPDATE submissions SET ${setClauses.join(', ')} WHERE slug = ?`, vals)
    } else {
      action = 'inserted'
      const newId = await insertNewSubmission(job, extracted, sets)
      if (!newId) {
        return Response.json({ ok: false, error: 'Failed to create submission — see server log' }, { status: 500 })
      }
    }

    /* Mark session + job applied. */
    await execute(`UPDATE scrape_sessions SET status='success', applied_at = NOW(), applied_by = ? WHERE id = ?`,
      [String(guard.adminId ?? 'admin'), targetSessionId])
    await execute(`UPDATE scrape_jobs SET status='applied', applied_at = NOW() WHERE id = ?`, [jobId])

    return Response.json({
      ok: true,
      action,
      appliedFields: Object.keys(sets).length,
      screenshots: shotUrls.length,
    })
  } catch (err) {
    console.error('POST /scrape/jobs/[id]/apply:', err)
    return Response.json({
      ok: false,
      error: err instanceof Error ? err.message : 'Internal server error',
    }, { status: 500 })
  }
}

/* ─────────────────────────────────────────────────────────────────────
   Create a brand-new submissions row from extracted JSON + sensible
   defaults. Returns the new submission id, or null on failure.
   ───────────────────────────────────────────────────────────────────── */
async function insertNewSubmission(
  job: { id: number; slug: string; company_name: string | null; website: string; category_l1: string; category_slug: string | null },
  extracted: Record<string, unknown>,
  appliableSets: Record<string, unknown>,
): Promise<number | null> {
  /* 1. Resolve category_id — prefer L3+ slug, fall back to L1. */
  const categoryId = await resolveCategoryId(job.category_slug, job.category_l1)
  if (!categoryId) {
    throw new Error(`No categories row found for slug='${job.category_slug ?? '(null)'}' or L1='${job.category_l1}'. Fix the taxonomy mapping before applying.`)
  }

  /* 2. Resolve plan_id — cheapest active plan (free tier). */
  const plan = await queryOne<{ id: number }>(`SELECT id FROM plans WHERE is_active = 1 ORDER BY price ASC LIMIT 1`)
  if (!plan) {
    throw new Error(`No active plans in the plans table — seed at least one.`)
  }

  /* 3. Country lookup — from extracted hq_country_code, US as fallback. */
  const countryCode = String(extracted.hq_country_code ?? '').toUpperCase().slice(0, 2)
  let countryId: number | null = null
  if (countryCode.length === 2) {
    const country = await queryOne<{ id: number }>(`SELECT id FROM countries WHERE code = ? LIMIT 1`, [countryCode])
    countryId = country?.id ?? null
  }
  if (countryId == null) {
    const fallback = await queryOne<{ id: number }>(`SELECT id FROM countries WHERE code = 'US' LIMIT 1`)
    countryId = fallback?.id ?? null
  }

  /* 4. Stitch the defaults + appliable extraction. */
  const companyName = job.company_name ?? deriveName(job.website)
  const city = (extracted.hq_city as string) || null
  const hqLocation = city && countryCode ? `${city}, ${countryCode}` : (city ?? null)
  const contactName = companyName
  const email = `contact@${extractDomain(job.website)}`

  const cols: string[] = []
  const placeholders: string[] = []
  const vals: unknown[] = []
  function add(col: string, expr: string, value?: unknown) {
    cols.push(col); placeholders.push(expr)
    if (value !== undefined) vals.push(value)
  }

  add('uuid', 'UUID()')
  add('company_name', '?', companyName)
  add('slug', '?', job.slug)
  add('contact_name', '?', contactName)
  add('email', '?', email)
  add('phone_code', '?', null)
  add('phone', '?', null)
  add('website', '?', job.website)
  add('category_id', '?', categoryId)
  add('country_id', '?', countryId)
  add('city', '?', city)
  add('hq_location', '?', hqLocation)
  add('listing_mode', '?', 'product')
  add('status', '?', 'active')
  add('payment_status', '?', 'completed')
  add('plan_id', '?', plan.id)
  add('activated_at', 'NOW()')
  add('approved_at', 'NOW()')
  add('created_at', 'NOW()')
  add('updated_at', 'NOW()')

  /* Layer the appliable extracted fields on top (tagline, description,
     pricing_tiers, faqs, etc.). Skip if already added (collision-safe). */
  for (const [k, v] of Object.entries(appliableSets)) {
    if (cols.includes(k)) continue
    add(k, '?', v)
  }

  const result = await execute(
    `INSERT INTO submissions (${cols.join(', ')}) VALUES (${placeholders.join(', ')})`,
    vals,
  )
  return result.insertId
}

async function resolveCategoryId(categorySlug: string | null, l1Slug: string): Promise<number | null> {
  if (categorySlug) {
    const row = await queryOne<{ id: number }>(
      `SELECT id FROM categories WHERE slug = ? ORDER BY level DESC LIMIT 1`,
      [categorySlug]
    )
    if (row?.id) return row.id
  }
  if (l1Slug) {
    const row = await queryOne<{ id: number }>(
      `SELECT id FROM categories WHERE slug = ? AND level = 1 LIMIT 1`,
      [l1Slug]
    )
    if (row?.id) return row.id
    // last resort — any row matching the L1 slug at any level
    const any = await queryOne<{ id: number }>(
      `SELECT id FROM categories WHERE slug = ? LIMIT 1`,
      [l1Slug]
    )
    if (any?.id) return any.id
  }
  return null
}

function deriveName(website: string): string {
  try {
    const u = new URL(website.startsWith('http') ? website : `https://${website}`)
    return u.hostname.replace(/^www\./, '').split('.')[0]
      .split(/[-_]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
  } catch {
    return 'Unnamed'
  }
}

function extractDomain(website: string): string {
  try {
    const u = new URL(website.startsWith('http') ? website : `https://${website}`)
    return u.hostname.replace(/^www\./, '')
  } catch {
    return 'example.com'
  }
}
