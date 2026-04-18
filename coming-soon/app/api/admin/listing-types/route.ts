import { NextRequest } from 'next/server'
import { query, execute } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('category_id')

    let sql = `SELECT lt.*, c.name AS category_name
               FROM listing_types lt
               LEFT JOIN categories c ON c.id = lt.category_id`
    const params: (string | number)[] = []

    if (categoryId) {
      sql += ' WHERE lt.category_id = ?'
      params.push(Number(categoryId))
    }

    sql += ' ORDER BY lt.category_id, lt.sort_order'

    const rows = await query(sql, params)

    return Response.json({ ok: true, data: rows })
  } catch (err) {
    console.error('Admin listing-types GET error:', err)
    return Response.json(
      { ok: false, error: 'Internal server error.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request)
  if (guard instanceof Response) return guard
  try {
    const body = await request.json()
    const { id, category_id, name, slug, sort_order } = body

    if (id) {
      await execute(
        `UPDATE listing_types SET
           category_id = ?, name = ?, slug = ?, sort_order = ?
         WHERE id = ?`,
        [category_id, name, slug, sort_order ?? 0, id]
      )

      return Response.json({ ok: true, id })
    } else {
      const result = await execute(
        `INSERT INTO listing_types (category_id, name, slug, sort_order, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [category_id, name, slug, sort_order ?? 0]
      )

      return Response.json({ ok: true, id: result.insertId })
    }
  } catch (err) {
    console.error('Admin listing-types POST error:', err)
    return Response.json(
      { ok: false, error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
