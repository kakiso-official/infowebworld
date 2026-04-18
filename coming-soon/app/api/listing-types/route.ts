import { NextRequest } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('category_id')

    let sql = `SELECT id, category_id AS categoryId, name, slug
               FROM listing_types
               WHERE 1=1`
    const params: (string | number)[] = []

    if (categoryId) {
      sql += ' AND category_id = ?'
      params.push(Number(categoryId))
    }

    sql += ' ORDER BY sort_order'

    const rows = await query(sql, params)

    return Response.json(
      { ok: true, data: rows },
      { headers: { 'Cache-Control': 'public, max-age=300, s-maxage=86400, stale-while-revalidate=86400' } }
    )
  } catch (err) {
    console.error('GET /api/listing-types error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
