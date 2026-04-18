import { NextRequest } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const rows = await query(`
      SELECT c.*, p.name as parent_name, p.slug as parent_slug,
             CASE WHEN c.level = 1 THEN c.slug WHEN c.level = 2 THEN p.slug WHEN c.level = 3 THEN gp.slug END as sector_slug,
             (SELECT COUNT(*) FROM submissions s WHERE s.category_id = c.id AND s.status IN ('active','paid')) as listing_count
      FROM categories c
      LEFT JOIN categories p ON p.id = c.parent_id
      LEFT JOIN categories gp ON gp.id = p.parent_id
      WHERE c.is_launched = 1 AND c.is_active = 1 AND c.is_navigation = 1
      ORDER BY c.sort_order
    `)

    return Response.json(
      { ok: true, data: rows },
      { headers: { 'Cache-Control': 'public, max-age=300, s-maxage=86400, stale-while-revalidate=86400' } }
    )
  } catch (err) {
    console.error('GET /api/categories error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
