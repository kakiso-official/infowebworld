import { NextRequest } from 'next/server'
import { queryOne, execute } from '@/lib/db'

function jp(val: unknown) {
  if (!val) return null
  if (typeof val === 'object') return val
  if (typeof val === 'string') { try { return JSON.parse(val) } catch { return null } }
  return null
}

const JSON_FIELDS = new Set([
  'buyers_guide', 'use_cases', 'comparisons',
  'long_tail_keywords', 'complementary_categories', 'extended_faq',
])

const VALID_SECTIONS = new Set([
  'ai_summary', 'rich_description', 'buyers_guide', 'use_cases',
  'comparisons', 'long_tail_keywords', 'complementary_categories', 'extended_faq',
])

/* ── GET: Fetch SEO content + category meta for one category ── */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  const { categoryId } = await params
  const cid = Number(categoryId)
  if (!cid) return Response.json({ ok: false, error: 'Invalid category ID' }, { status: 400 })

  const cat = await queryOne(
    `SELECT c.id, c.name, c.slug, c.level, c.description, c.parent_id,
            p.name as parent_name, p.slug as parent_slug,
            CASE WHEN c.level = 1 THEN c.slug
                 WHEN c.level = 2 THEN p.slug
                 WHEN c.level = 3 THEN gp.slug END as sector_slug
     FROM categories c
     LEFT JOIN categories p ON p.id = c.parent_id
     LEFT JOIN categories gp ON gp.id = p.parent_id
     WHERE c.id = ? AND c.is_active = 1`,
    [cid]
  )
  if (!cat) return Response.json({ ok: false, error: 'Category not found' }, { status: 404 })

  const seo = await queryOne(
    `SELECT ai_summary, rich_description, buyers_guide, use_cases, comparisons,
            long_tail_keywords, complementary_categories, extended_faq,
            generated_at, model_version
     FROM category_seo_content WHERE category_id = ?`,
    [cid]
  )

  const content: Record<string, unknown> = {}
  if (seo) {
    for (const key of VALID_SECTIONS) {
      const raw = seo[key]
      content[key] = JSON_FIELDS.has(key) ? jp(raw) : (raw ? String(raw) : '')
    }
    content.generated_at = seo.generated_at || null
    content.model_version = seo.model_version || null
  }

  return Response.json({
    ok: true,
    category: {
      id: cid,
      name: String(cat.name),
      slug: String(cat.slug),
      level: Number(cat.level),
      description: String(cat.description || ''),
      parentName: String(cat.parent_name || ''),
      parentSlug: String(cat.parent_slug || ''),
      sectorSlug: String(cat.sector_slug || cat.slug),
    },
    content,
  })
}

/* ── PUT: Save individual or multiple sections ── */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  const { categoryId } = await params
  const cid = Number(categoryId)
  if (!cid) return Response.json({ ok: false, error: 'Invalid category ID' }, { status: 400 })

  const body = await req.json()

  // Single section save: { section, value }
  // Batch save: { sections: { key: value, ... } }
  const updates: Record<string, unknown> = {}

  if (body.section && VALID_SECTIONS.has(body.section)) {
    updates[body.section] = body.value
  } else if (body.sections && typeof body.sections === 'object') {
    for (const [key, val] of Object.entries(body.sections)) {
      if (VALID_SECTIONS.has(key)) updates[key] = val
    }
  } else {
    return Response.json({ ok: false, error: 'Provide section+value or sections object' }, { status: 400 })
  }

  if (Object.keys(updates).length === 0) {
    return Response.json({ ok: false, error: 'No valid sections to update' }, { status: 400 })
  }

  // Check if record exists
  const existing = await queryOne('SELECT id FROM category_seo_content WHERE category_id = ?', [cid])

  if (existing) {
    const sets: string[] = []
    const vals: unknown[] = []
    for (const [key, val] of Object.entries(updates)) {
      sets.push(`${key} = ?`)
      vals.push(JSON_FIELDS.has(key) && typeof val === 'object' ? JSON.stringify(val) : val)
    }
    sets.push('updated_at = NOW()')
    vals.push(cid)
    await execute(`UPDATE category_seo_content SET ${sets.join(', ')} WHERE category_id = ?`, vals)
  } else {
    const cols = ['category_id']
    const placeholders = ['?']
    const vals: unknown[] = [cid]
    for (const [key, val] of Object.entries(updates)) {
      cols.push(key)
      placeholders.push('?')
      vals.push(JSON_FIELDS.has(key) && typeof val === 'object' ? JSON.stringify(val) : val)
    }
    cols.push('created_at', 'updated_at')
    placeholders.push('NOW()', 'NOW()')
    await execute(`INSERT INTO category_seo_content (${cols.join(', ')}) VALUES (${placeholders.join(', ')})`, vals)
  }

  return Response.json({ ok: true, updated: Object.keys(updates) })
}
